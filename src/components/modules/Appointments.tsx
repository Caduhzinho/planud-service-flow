
import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, Calendar, Clock, User, Phone } from 'lucide-react';

export const Appointments = () => {
  const [view, setView] = useState<'list' | 'calendar'>('list');

  const appointments = [
    {
      id: 1,
      client: 'Maria Silva',
      phone: '(11) 99999-9999',
      service: 'Consultoria Financeira',
      date: '2024-06-29',
      time: '09:00',
      status: 'confirmado',
      value: 350
    },
    {
      id: 2,
      client: 'João Santos',
      phone: '(11) 88888-8888',
      service: 'Auditoria Contábil',
      date: '2024-06-29',
      time: '14:30',
      status: 'agendado',
      value: 500
    },
    {
      id: 3,
      client: 'Ana Costa',
      phone: '(11) 77777-7777',
      service: 'Consultoria Tributária',
      date: '2024-06-30',
      time: '10:00',
      status: 'confirmado',
      value: 280
    },
    {
      id: 4,
      client: 'Pedro Lima',
      phone: '(11) 66666-6666',
      service: 'Planejamento Fiscal',
      date: '2024-07-01',
      time: '16:00',
      status: 'cancelado',
      value: 420
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmado':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'agendado':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'cancelado':
        return 'bg-red-100 text-red-700 border-red-200';
      case 'concluído':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Agendamentos
          </h1>
          <p className="text-gray-600">
            Gerencie todos os seus agendamentos
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-5 rounded-xl font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Novo Agendamento
        </Button>
      </div>

      {/* View Toggle */}
      <div className="flex space-x-2">
        <Button
          variant={view === 'list' ? 'default' : 'outline'}
          onClick={() => setView('list')}
          className="h-10 px-4 rounded-xl font-medium"
        >
          Lista
        </Button>
        <Button
          variant={view === 'calendar' ? 'default' : 'outline'}
          onClick={() => setView('calendar')}
          className="h-10 px-4 rounded-xl font-medium"
        >
          Calendário
        </Button>
      </div>

      {/* Appointments List */}
      <div className="grid gap-6">
        {appointments.map((appointment) => (
          <Card key={appointment.id} className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <div className="w-12 h-12 bg-indigo-100 rounded-xl flex items-center justify-center">
                  <User className="h-6 w-6 text-indigo-600" />
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">
                    {appointment.client}
                  </h3>
                  <p className="text-gray-600 mb-2">{appointment.service}</p>
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="h-4 w-4" />
                      <span>{new Date(appointment.date).toLocaleDateString('pt-BR')}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Clock className="h-4 w-4" />
                      <span>{appointment.time}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Phone className="h-4 w-4" />
                      <span>{appointment.phone}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-gray-900 mb-3">
                  R$ {appointment.value.toLocaleString('pt-BR')}
                </p>
                <Badge className={`${getStatusColor(appointment.status)} border font-medium`}>
                  {appointment.status.toUpperCase()}
                </Badge>
              </div>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
