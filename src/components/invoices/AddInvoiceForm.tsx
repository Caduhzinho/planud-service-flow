import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';
import { useRateLimit } from '@/components/security/RateLimitProvider';

interface Client {
  id: string;
  nome: string;
  telefone: string;
}

interface Appointment {
  id: string;
  servico: string;
  valor: number;
  data_hora: string;
  clientes: {
    nome: string;
  };
}

interface AddInvoiceFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddInvoiceForm = ({ open, onOpenChange }: AddInvoiceFormProps) => {
  const [clients, setClients] = useState<Client[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedClient, setSelectedClient] = useState('');
  const [selectedAppointment, setSelectedAppointment] = useState('');
  const [valor, setValor] = useState('');
  const [descricao, setDescricao] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('pix');
  const [status, setStatus] = useState('gerado');
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useAuth();
  const { toast } = useToast();
  const { checkRateLimit } = useRateLimit();

  useEffect(() => {
    if (open && userData?.empresa_id) {
      fetchClients();
      fetchAppointments();
    }
  }, [open, userData?.empresa_id]);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, telefone')
        .eq('empresa_id', userData?.empresa_id)
        .order('nome');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao carregar clientes:', error);
    }
  };

  const fetchAppointments = async () => {
    try {
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          id,
          servico,
          valor,
          data_hora,
          clientes (
            nome
          )
        `)
        .eq('empresa_id', userData?.empresa_id)
        .eq('status', 'Concluído')
        .order('data_hora', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      console.error('Erro ao carregar agendamentos:', error);
    }
  };

  const handleAppointmentSelect = (appointmentId: string) => {
    setSelectedAppointment(appointmentId);
    const appointment = appointments.find(a => a.id === appointmentId);
    if (appointment) {
      setValor(appointment.valor.toString());
      setDescricao(appointment.servico);
      const client = clients.find(c => c.nome === appointment.clientes.nome);
      if (client) {
        setSelectedClient(client.id);
      }
    }
  };

  const generateInvoiceNumber = async () => {
    try {
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select('codigo_nf')
        .eq('empresa_id', userData?.empresa_id)
        .order('criada_em', { ascending: false })
        .limit(1);

      if (error) throw error;

      let nextNumber = 1;
      if (data && data.length > 0 && data[0].codigo_nf) {
        const lastNumber = parseInt(data[0].codigo_nf.replace(/\D/g, ''));
        nextNumber = lastNumber + 1;
      }

      return `NF${nextNumber.toString().padStart(6, '0')}`;
    } catch (error) {
      console.error('Erro ao gerar número da nota:', error);
      return `NF${Date.now().toString().slice(-6)}`;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit('create')) {
      return;
    }

    // Validação de campos obrigatórios
    if (!selectedClient) {
      toast({
        title: "Erro",
        description: "Selecione um cliente",
        variant: "destructive",
      });
      return;
    }

    if (!descricao.trim()) {
      toast({
        title: "Erro",
        description: "Preencha a descrição do serviço",
        variant: "destructive",
      });
      return;
    }

    const valorNumerico = parseFloat(valor);
    if (!valor || isNaN(valorNumerico) || valorNumerico <= 0) {
      toast({
        title: "Erro",
        description: "Informe um valor válido maior que zero",
        variant: "destructive",
      });
      return;
    }

    // Verificar se a empresa tem CNPJ cadastrado
    if (!userData?.empresa?.cnpj) {
      toast({
        title: "Erro",
        description: "Cadastre o CNPJ da sua empresa nas configurações antes de gerar notas fiscais",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const codigoNf = await generateInvoiceNumber();
      
      const { data: notaFiscal, error } = await supabase
        .from('notas_fiscais')
        .insert({
          empresa_id: userData?.empresa_id,
          cliente_id: selectedClient,
          agendamento_id: selectedAppointment || null,
          valor: valorNumerico,
          descricao: descricao.trim(),
          forma_pagamento: formaPagamento,
          status,
          codigo_nf: codigoNf,
          data_emissao: new Date().toISOString()
        })
        .select()
        .single();

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: `Nota fiscal ${codigoNf} criada com sucesso`,
      });

      // Reset form
      setSelectedClient('');
      setSelectedAppointment('');
      setValor('');
      setDescricao('');
      setFormaPagamento('pix');
      setStatus('gerado');
      onOpenChange(false);
      
      // Refresh the parent component without full page reload
      window.dispatchEvent(new CustomEvent('invoiceCreated', { detail: notaFiscal }));
      
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar nota fiscal. Tente novamente.",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Nota Fiscal</DialogTitle>
          <DialogDescription>
            Crie uma nova nota fiscal de serviço para seu cliente
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment">Agendamento (opcional)</Label>
              <Select value={selectedAppointment} onValueChange={handleAppointmentSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agendamento concluído" />
                </SelectTrigger>
                <SelectContent>
                  {appointments.map((appointment) => (
                    <SelectItem key={appointment.id} value={appointment.id}>
                      {appointment.servico} - {appointment.clientes.nome} - R$ {appointment.valor.toFixed(2)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="client">Cliente *</Label>
              <Select value={selectedClient} onValueChange={setSelectedClient} required>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um cliente" />
                </SelectTrigger>
                <SelectContent>
                  {clients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome} - {client.telefone}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição do Serviço *</Label>
              <Textarea
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva o serviço prestado"
                required
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="valor">Valor *</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                min="0"
                value={valor}
                onChange={(e) => setValor(e.target.value)}
                placeholder="0,00"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="pagamento">Forma de Pagamento</Label>
                <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="pix">PIX</SelectItem>
                    <SelectItem value="dinheiro">Dinheiro</SelectItem>
                    <SelectItem value="cartao">Cartão</SelectItem>
                    <SelectItem value="boleto">Boleto</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select value={status} onValueChange={setStatus}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="gerado">Gerada</SelectItem>
                    <SelectItem value="pendente">Pendente</SelectItem>
                    <SelectItem value="cancelado">Cancelada</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Criando...' : 'Criar Nota Fiscal'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
