
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Calendar, Clock, User } from 'lucide-react';
import { useUpcomingAppointments } from '@/hooks/useUpcomingAppointments';

export const UpcomingAppointments = () => {
  const { appointments, isLoading, error } = useUpcomingAppointments();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-700';
      case 'agendado':
        return 'bg-blue-100 text-blue-700';
      case 'cancelado':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Próximos Agendamentos
        </h3>
        <p className="text-gray-600">
          Seus compromissos dos próximos dias
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <LoadingSpinner size="lg" />
        </div>
      ) : error ? (
        <div className="text-center py-8">
          <p className="text-red-600">{error}</p>
        </div>
      ) : appointments.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-gray-500">Nenhum agendamento próximo encontrado</p>
        </div>
      ) : (
        <div className="space-y-4">
          {appointments.map((appointment) => {
            const appointmentDate = new Date(appointment.data_hora);
            return (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                    <User className="h-6 w-6 text-indigo-600" />
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">{appointment.client_name}</p>
                    <p className="text-sm text-gray-600 mb-1">{appointment.servico}</p>
                    <div className="flex items-center space-x-3 text-xs text-gray-500">
                      <div className="flex items-center space-x-1">
                        <Calendar className="h-3 w-3" />
                        <span>{appointmentDate.toLocaleDateString('pt-BR')}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Clock className="h-3 w-3" />
                        <span>{appointmentDate.toLocaleTimeString('pt-BR', { 
                          hour: '2-digit', 
                          minute: '2-digit' 
                        })}</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900 mb-2">
                    {new Intl.NumberFormat('pt-BR', { 
                      style: 'currency', 
                      currency: 'BRL' 
                    }).format(appointment.valor)}
                  </p>
                  <Badge className={`${getStatusColor(appointment.status)} border-0`}>
                    {appointment.status}
                  </Badge>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
};
