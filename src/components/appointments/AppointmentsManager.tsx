import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Plus, Calendar, Clock, User, DollarSign, Filter, Search } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { AddAppointmentForm } from './AddAppointmentForm';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface Appointment {
  id: string;
  data_hora: string;
  servico: string;
  valor: number;
  status: string;
  observacao: string | null;
  clientes: {
    nome: string;
    telefone: string;
  };
}

const statusConfig = {
  'Agendado': { color: 'bg-yellow-100 text-yellow-700 border-yellow-200', label: 'Agendado' },
  'Confirmado': { color: 'bg-green-100 text-green-700 border-green-200', label: 'Confirmado' },
  'Cancelado': { color: 'bg-red-100 text-red-700 border-red-200', label: 'Cancelado' },
  'Concluído': { color: 'bg-gray-100 text-gray-700 border-gray-200', label: 'Concluído' }
};

export const AppointmentsManager = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [filteredAppointments, setFilteredAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [dateFilter, setDateFilter] = useState('upcoming');
  const [userEmpresaId, setUserEmpresaId] = useState<string | null>(null);

  const fetchUserData = async () => {
    if (!user?.id) return;

    try {
      console.log('Buscando dados do usuário:', user.id);
      
      // Buscar empresa_id diretamente do metadata do usuário ou da tabela usuarios
      const empresaId = user.user_metadata?.empresa_id;
      
      if (empresaId) {
        setUserEmpresaId(empresaId);
        return empresaId;
      }

      // Fallback: buscar da tabela usuarios sem join
      const { data: userData, error: userError } = await supabase
        .from('usuarios')
        .select('empresa_id')
        .eq('id', user.id)
        .single();

      if (userError) {
        console.error('Erro ao buscar dados do usuário:', userError);
        throw userError;
      }

      if (userData?.empresa_id) {
        setUserEmpresaId(userData.empresa_id);
        return userData.empresa_id;
      }

      throw new Error('Empresa não encontrada para este usuário');
    } catch (error) {
      console.error('Erro ao buscar dados do usuário:', error);
      throw error;
    }
  };

  const fetchAppointments = async () => {
    console.log('Iniciando busca de agendamentos...');
    
    setLoading(true);
    setError(null);

    try {
      // Garantir que temos o empresa_id
      let empresaId = userEmpresaId;
      if (!empresaId) {
        empresaId = await fetchUserData();
      }

      if (!empresaId) {
        throw new Error('Empresa não identificada');
      }

      console.log('Buscando agendamentos para empresa_id:', empresaId);
      
      const { data, error } = await supabase
        .from('agendamentos')
        .select(`
          id,
          data_hora,
          servico,
          valor,
          status,
          observacao,
          clientes (
            nome,
            telefone
          )
        `)
        .eq('empresa_id', empresaId)
        .order('data_hora', { ascending: true });

      console.log('Resposta da consulta:', { data, error });

      if (error) {
        console.error('Erro na consulta:', error);
        throw error;
      }
      
      setAppointments(data || []);
      console.log('Agendamentos carregados:', data?.length || 0);
    } catch (error: any) {
      console.error('Erro ao buscar agendamentos:', error);
      setError(error.message || 'Erro ao carregar agendamentos. Tente novamente.');
      toast.error('Erro ao carregar agendamentos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.id) {
      fetchAppointments();
    } else {
      setLoading(false);
      setError('Usuário não autenticado');
    }
  }, [user?.id]);

  useEffect(() => {
    let filtered = appointments;

    // Filtro por data
    const now = new Date();
    if (dateFilter === 'upcoming') {
      filtered = filtered.filter(app => new Date(app.data_hora) >= now);
    } else if (dateFilter === 'past') {
      filtered = filtered.filter(app => new Date(app.data_hora) < now);
    } else if (dateFilter === 'today') {
      const today = new Date();
      today.setHours(0, 0, 0, 0);
      const tomorrow = new Date(today);
      tomorrow.setDate(tomorrow.getDate() + 1);
      
      filtered = filtered.filter(app => {
        const appDate = new Date(app.data_hora);
        return appDate >= today && appDate < tomorrow;
      });
    }

    // Filtro por status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(app => app.status === statusFilter);
    }

    // Filtro por busca
    if (searchTerm.trim()) {
      filtered = filtered.filter(app =>
        app.clientes.nome.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.servico.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.clientes.telefone.includes(searchTerm)
      );
    }

    setFilteredAppointments(filtered);
  }, [appointments, searchTerm, statusFilter, dateFilter]);

  const handleStatusChange = async (appointmentId: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('agendamentos')
        .update({ status: newStatus })
        .eq('id', appointmentId);

      if (error) throw error;

      toast.success('Status atualizado com sucesso!');
      fetchAppointments();
    } catch (error) {
      console.error('Erro ao atualizar status:', error);
      toast.error('Erro ao atualizar status');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg text-gray-600">Carregando agendamentos...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 space-y-4">
        <div className="text-lg text-red-600">{error}</div>
        <Button onClick={fetchAppointments} variant="outline">
          Tentar Novamente
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agendamentos
          </h1>
          <p className="text-gray-600">
            Gerencie todos os seus agendamentos ({appointments.length} total)
          </p>
        </div>
        <Button 
          onClick={() => setShowAddForm(true)}
          className="bg-indigo-600 hover:bg-indigo-700 h-11 px-5 rounded-xl font-medium"
        >
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* Filtros */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar por cliente, serviço ou telefone..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </div>
        <div className="flex gap-2">
          <Select value={dateFilter} onValueChange={setDateFilter}>
            <SelectTrigger className="w-40">
              <Filter className="h-4 w-4 mr-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos os períodos</SelectItem>
              <SelectItem value="today">Hoje</SelectItem>
              <SelectItem value="upcoming">Próximos</SelectItem>
              <SelectItem value="past">Passados</SelectItem>
            </SelectContent>
          </Select>
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-36">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos status</SelectItem>
              <SelectItem value="Agendado">Agendado</SelectItem>
              <SelectItem value="Confirmado">Confirmado</SelectItem>
              <SelectItem value="Cancelado">Cancelado</SelectItem>
              <SelectItem value="Concluído">Concluído</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Lista de Agendamentos */}
      {filteredAppointments.length === 0 ? (
        <Card className="p-8 text-center">
          <div className="text-gray-500">
            {searchTerm || statusFilter !== 'all' || dateFilter !== 'upcoming' 
              ? 'Nenhum agendamento encontrado com os filtros aplicados.' 
              : 'Nenhum agendamento cadastrado ainda.'}
          </div>
          {!searchTerm && statusFilter === 'all' && dateFilter === 'upcoming' && (
            <Button 
              onClick={() => setShowAddForm(true)}
              variant="outline" 
              className="mt-4"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar Primeiro Agendamento
            </Button>
          )}
        </Card>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredAppointments.map((appointment) => {
            const appointmentDate = new Date(appointment.data_hora);
            const statusStyle = statusConfig[appointment.status as keyof typeof statusConfig];
            
            return (
              <Card key={appointment.id} className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                      <Calendar className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900">
                        {appointment.servico}
                      </h3>
                      <div className="flex items-center space-x-2 text-sm text-gray-600">
                        <User className="h-3 w-3" />
                        <span>{appointment.clientes.nome}</span>
                      </div>
                    </div>
                  </div>
                  <Badge className={`${statusStyle.color} border font-medium text-xs`}>
                    {statusStyle.label}
                  </Badge>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Calendar className="h-3 w-3" />
                      <span>{format(appointmentDate, "dd 'de' MMM", { locale: ptBR })}</span>
                    </div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <Clock className="h-3 w-3" />
                      <span>{format(appointmentDate, 'HH:mm')}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600">Valor:</span>
                    <div className="flex items-center space-x-1 font-semibold text-gray-900">
                      <DollarSign className="h-3 w-3" />
                      <span>R$ {appointment.valor.toFixed(2)}</span>
                    </div>
                  </div>
                  {appointment.observacao && (
                    <div className="text-sm text-gray-600 p-2 bg-gray-50 rounded-lg">
                      <span className="font-medium">Obs:</span> {appointment.observacao}
                    </div>
                  )}
                </div>

                <div className="flex gap-2">
                  {appointment.status === 'Agendado' && (
                    <Button 
                      size="sm" 
                      className="flex-1 h-9 rounded-lg bg-green-600 hover:bg-green-700"
                      onClick={() => handleStatusChange(appointment.id, 'Confirmado')}
                    >
                      Confirmar
                    </Button>
                  )}
                  {appointment.status === 'Confirmado' && (
                    <Button 
                      size="sm" 
                      className="flex-1 h-9 rounded-lg bg-gray-600 hover:bg-gray-700"
                      onClick={() => handleStatusChange(appointment.id, 'Concluído')}
                    >
                      Concluir
                    </Button>
                  )}
                  {appointment.status !== 'Cancelado' && appointment.status !== 'Concluído' && (
                    <Button 
                      size="sm" 
                      variant="outline" 
                      className="h-9 px-3 rounded-lg text-red-600 hover:bg-red-50"
                      onClick={() => handleStatusChange(appointment.id, 'Cancelado')}
                    >
                      Cancelar
                    </Button>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      <AddAppointmentForm
        open={showAddForm}
        onOpenChange={setShowAddForm}
        onAppointmentAdded={fetchAppointments}
      />
    </div>
  );
};
