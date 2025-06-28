
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Calendar, DollarSign, FileText, Users } from 'lucide-react';

export const QuickActions = () => {
  const actions = [
    {
      title: 'Novo Agendamento',
      description: 'Criar agendamento',
      icon: Calendar,
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Adicionar Cliente',
      description: 'Cadastrar cliente',
      icon: Users,
      color: 'bg-green-50 text-green-600'
    },
    {
      title: 'Registrar Receita',
      description: 'Lançar entrada',
      icon: DollarSign,
      color: 'bg-purple-50 text-purple-600'
    },
    {
      title: 'Emitir Nota',
      description: 'Nova NFS-e',
      icon: FileText,
      color: 'bg-orange-50 text-orange-600'
    }
  ];

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Ações Rápidas
        </h3>
        <p className="text-gray-600">
          Acesso rápido às principais funções
        </p>
      </div>

      <div className="space-y-3">
        {actions.map((action, index) => (
          <Button
            key={index}
            variant="ghost"
            className="w-full h-auto p-4 justify-start hover:bg-gray-50 rounded-xl"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center mr-4 ${action.color}`}>
              <action.icon className="h-5 w-5" />
            </div>
            <div className="text-left">
              <p className="font-medium text-gray-900">{action.title}</p>
              <p className="text-sm text-gray-600">{action.description}</p>
            </div>
            <Plus className="h-4 w-4 ml-auto text-gray-400" />
          </Button>
        ))}
      </div>
    </Card>
  );
};
