
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Plus, Calendar, Phone, FileText } from 'lucide-react';

export const Clients = () => {
  const clients = [
    {
      id: 1,
      name: 'Maria Silva',
      email: 'maria@email.com',
      phone: '(11) 99999-9999',
      totalSpent: 1500,
      frequency: 'Frequente',
      lastService: '2024-06-20',
      tags: ['VIP', 'Pontual']
    },
    {
      id: 2,
      name: 'João Santos',
      email: 'joao@email.com',
      phone: '(11) 88888-8888',
      totalSpent: 850,
      frequency: 'Regular',
      lastService: '2024-06-15',
      tags: ['Empresarial']
    },
    {
      id: 3,
      name: 'Ana Costa',
      email: 'ana@email.com',
      phone: '(11) 77777-7777',
      totalSpent: 2300,
      frequency: 'Frequente',
      lastService: '2024-06-25',
      tags: ['VIP', 'Fidelizado']
    },
    {
      id: 4,
      name: 'Pedro Lima',
      email: 'pedro@email.com',
      phone: '(11) 66666-6666',
      totalSpent: 420,
      frequency: 'Novo',
      lastService: '2024-06-28',
      tags: ['Novo Cliente']
    }
  ];

  const getFrequencyColor = (frequency: string) => {
    switch (frequency) {
      case 'Frequente':
        return 'bg-green-100 text-green-700 border-green-200';
      case 'Regular':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Novo':
        return 'bg-purple-100 text-purple-700 border-purple-200';
      case 'Inativo':
        return 'bg-gray-100 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Clientes
          </h1>
          <p className="text-gray-600">
            Gerencie seu portfólio de clientes
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700 h-11 px-5 rounded-xl font-medium">
          <Plus className="h-4 w-4 mr-2" />
          Novo Cliente
        </Button>
      </div>

      {/* Clients Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {clients.map((client) => (
          <Card key={client.id} className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center space-x-3">
                <Avatar className="h-12 w-12">
                  <AvatarFallback className="bg-indigo-100 text-indigo-600 font-semibold">
                    {getInitials(client.name)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {client.name}
                  </h3>
                  <p className="text-sm text-gray-600">{client.email}</p>
                </div>
              </div>
              <Badge className={`${getFrequencyColor(client.frequency)} border font-medium text-xs`}>
                {client.frequency}
              </Badge>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Gasto Total:</span>
                <span className="font-semibold text-gray-900">
                  R$ {client.totalSpent.toLocaleString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Último Serviço:</span>
                <span className="font-medium text-gray-700">
                  {new Date(client.lastService).toLocaleDateString('pt-BR')}
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-600">Telefone:</span>
                <span className="font-medium text-gray-700">{client.phone}</span>
              </div>
            </div>

            {/* Tags */}
            <div className="flex flex-wrap gap-2 mb-6">
              {client.tags.map((tag, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {tag}
                </Badge>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button size="sm" className="flex-1 h-9 rounded-lg font-medium">
                <Calendar className="h-4 w-4 mr-1" />
                Agendar
              </Button>
              <Button size="sm" variant="outline" className="h-9 px-3 rounded-lg">
                <Phone className="h-4 w-4" />
              </Button>
              <Button size="sm" variant="outline" className="h-9 px-3 rounded-lg">
                <FileText className="h-4 w-4" />
              </Button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
};
