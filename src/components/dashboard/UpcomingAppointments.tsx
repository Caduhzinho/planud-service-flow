
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Calendar, Clock, User } from 'lucide-react';

export const UpcomingAppointments = () => {
  const appointments = [
    {
      id: 1,
      client: 'Maria Silva',
      service: 'Consultoria Financeira',
      date: '2024-06-29',
      time: '09:00',
      status: 'confirmado',
      value: 'R$ 350'
    },
    {
      id: 2,
      client: 'João Santos',
      service: 'Auditoria Contábil',
      date: '2024-06-29',
      time: '14:30',
      status: 'agendado',
      value: 'R$ 500'
    },
    {
      id: 3,
      client: 'Ana Costa',
      service: 'Consultoria Tributária',
      date: '2024-06-30',
      time: '10:00',
      status: 'confirmado',
      value: 'R$ 280'
    },
    {
      id: 4,
      client: 'Pedro Lima',
      service: 'Planejamento Fiscal',
      date: '2024-06-30',
      time: '16:00',
      status: 'agendado',
      value: 'R$ 420'
    }
  ];

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

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div
            key={appointment.id}
            className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                <User className="h-6 w-6 text-indigo-600" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">{appointment.client}</p>
                <p className="text-sm text-gray-600 mb-1">{appointment.service}</p>
                <div className="flex items-center space-x-3 text-xs text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Calendar className="h-3 w-3" />
                    <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Clock className="h-3 w-3" />
                    <span>{appointment.time}</span>
                  </div>
                </div>
              </div>
            </div>
            <div className="text-right">
              <p className="font-semibold text-gray-900 mb-2">{appointment.value}</p>
              <Badge className={`${getStatusColor(appointment.status)} border-0`}>
                {appointment.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
};
