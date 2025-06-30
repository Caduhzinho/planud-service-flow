
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

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
  const [formaPagamento, setFormaPagamento] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useAuth();
  const { toast } = useToast();

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
      const client = clients.find(c => c.nome === appointment.clientes.nome);
      if (client) {
        setSelectedClient(client.id);
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedClient || !valor) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('notas_fiscais')
        .insert({
          empresa_id: userData?.empresa_id,
          cliente_id: selectedClient,
          agendamento_id: selectedAppointment || null,
          valor: parseFloat(valor),
          forma_pagamento: formaPagamento || null,
          status: 'gerado'
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Nota fiscal criada com sucesso",
      });

      // Reset form
      setSelectedClient('');
      setSelectedAppointment('');
      setValor('');
      setFormaPagamento('');
      onOpenChange(false);
      
      // Refresh the parent component
      window.location.reload();
    } catch (error) {
      console.error('Erro ao criar nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao criar nota fiscal",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Nova Nota Fiscal</DialogTitle>
          <DialogDescription>
            Crie uma nova nota fiscal para seu cliente
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="space-y-2">
              <Label htmlFor="appointment">Agendamento (opcional)</Label>
              <Select value={selectedAppointment} onValueChange={handleAppointmentSelect}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione um agendamento" />
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

            <div className="space-y-2">
              <Label htmlFor="pagamento">Forma de Pagamento</Label>
              <Select value={formaPagamento} onValueChange={setFormaPagamento}>
                <SelectTrigger>
                  <SelectValue placeholder="Selecione a forma de pagamento" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pix">PIX</SelectItem>
                  <SelectItem value="boleto">Boleto</SelectItem>
                  <SelectItem value="cartao">Cartão</SelectItem>
                  <SelectItem value="manual">Manual</SelectItem>
                </SelectContent>
              </Select>
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
