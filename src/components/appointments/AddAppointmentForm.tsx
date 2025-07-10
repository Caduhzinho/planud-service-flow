import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';
import { useRateLimit } from '@/components/security/RateLimitProvider';

interface Client {
  id: string;
  nome: string;
  telefone: string;
}

interface AddAppointmentFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAppointmentAdded: () => void;
}

export const AddAppointmentForm = ({ open, onOpenChange, onAppointmentAdded }: AddAppointmentFormProps) => {
  const { userData } = useAuth();
  const [loading, setLoading] = useState(false);
  const [clients, setClients] = useState<Client[]>([]);
  const { checkRateLimit } = useRateLimit();
  const [formData, setFormData] = useState({
    cliente_id: '',
    data: '',
    hora: '',
    servico: '',
    valor: '',
    status: 'Agendado',
    observacao: ''
  });

  const fetchClients = async () => {
    if (!userData?.empresa_id) return;

    try {
      const { data, error } = await supabase
        .from('clientes')
        .select('id, nome, telefone')
        .eq('empresa_id', userData.empresa_id)
        .order('nome');

      if (error) throw error;
      setClients(data || []);
    } catch (error) {
      console.error('Erro ao buscar clientes:', error);
    }
  };

  useEffect(() => {
    if (open) {
      fetchClients();
    }
  }, [open, userData?.empresa_id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!checkRateLimit('create')) {
      return;
    }

    if (!formData.cliente_id || !formData.data || !formData.hora || !formData.servico || !formData.valor) {
      toast.error('Todos os campos obrigatórios devem ser preenchidos');
      return;
    }

    if (!userData?.empresa_id) {
      toast.error('Erro: empresa não identificada');
      return;
    }

    // Combinar data e hora
    const dataHora = new Date(`${formData.data}T${formData.hora}:00`);
    
    // Verificar se não é no passado
    if (dataHora < new Date()) {
      toast.error('Não é possível agendar para data/hora no passado');
      return;
    }

    setLoading(true);

    try {
      // Verificar conflitos de horário
      const { data: conflitos } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('empresa_id', userData.empresa_id)
        .eq('data_hora', dataHora.toISOString())
        .neq('status', 'Cancelado');

      if (conflitos && conflitos.length > 0) {
        const proceed = confirm('Já existe um agendamento neste horário. Deseja continuar mesmo assim?');
        if (!proceed) {
          setLoading(false);
          return;
        }
      }

      const { error } = await supabase
        .from('agendamentos')
        .insert({
          cliente_id: formData.cliente_id,
          data_hora: dataHora.toISOString(),
          servico: formData.servico.trim(),
          valor: parseFloat(formData.valor),
          status: formData.status,
          observacao: formData.observacao.trim() || null,
          empresa_id: userData.empresa_id
        });

      if (error) throw error;

      toast.success('Agendamento criado com sucesso!');
      setFormData({
        cliente_id: '',
        data: '',
        hora: '',
        servico: '',
        valor: '',
        status: 'Agendado',
        observacao: ''
      });
      onAppointmentAdded();
      onOpenChange(false);
    } catch (error: any) {
      console.error('Erro ao criar agendamento:', error);
      toast.error('Erro ao criar agendamento');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Novo Agendamento</DialogTitle>
          <DialogDescription>
            Crie um novo agendamento para um cliente existente.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="cliente">Cliente *</Label>
              <Select value={formData.cliente_id} onValueChange={(value) => setFormData(prev => ({ ...prev, cliente_id: value }))}>
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
              {clients.length === 0 && (
                <p className="text-sm text-gray-500">Nenhum cliente cadastrado. Cadastre um cliente primeiro.</p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="data">Data *</Label>
                <Input
                  id="data"
                  type="date"
                  value={formData.data}
                  onChange={(e) => setFormData(prev => ({ ...prev, data: e.target.value }))}
                  min={new Date().toISOString().split('T')[0]}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hora">Hora *</Label>
                <Input
                  id="hora"
                  type="time"
                  value={formData.hora}
                  onChange={(e) => setFormData(prev => ({ ...prev, hora: e.target.value }))}
                  required
                />
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="servico">Serviço *</Label>
              <Input
                id="servico"
                value={formData.servico}
                onChange={(e) => setFormData(prev => ({ ...prev, servico: e.target.value }))}
                placeholder="Ex: Corte de cabelo, Manicure, Consulta..."
                required
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="valor">Valor (R$) *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.valor}
                  onChange={(e) => setFormData(prev => ({ ...prev, valor: e.target.value }))}
                  placeholder="0,00"
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Agendado">Agendado</SelectItem>
                    <SelectItem value="Confirmado">Confirmado</SelectItem>
                    <SelectItem value="Cancelado">Cancelado</SelectItem>
                    <SelectItem value="Concluído">Concluído</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="observacao">Observações</Label>
              <Textarea
                id="observacao"
                value={formData.observacao}
                onChange={(e) => setFormData(prev => ({ ...prev, observacao: e.target.value }))}
                placeholder="Observações sobre o agendamento..."
                rows={3}
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || clients.length === 0}>
              {loading ? 'Salvando...' : 'Criar Agendamento'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
