
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Users, Calendar, DollarSign, FileText } from 'lucide-react';
import { useDashboardStats } from '@/hooks/useDashboardStats';

export const DashboardStats = () => {
  const { clientesAtivos, agendamentosHoje, notasEmitidas, receitaMensal, isLoading, error } = useDashboardStats();

  if (isLoading) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, index) => (
          <Card key={index} className="p-6 rounded-2xl border-0 shadow-md">
            <LoadingSpinner size="sm" />
          </Card>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="p-6 rounded-2xl border-0 shadow-md col-span-full">
          <p className="text-red-600">{error}</p>
        </Card>
      </div>
    );
  }

  const stats = [
    {
      title: 'Clientes Ativos',
      value: clientesAtivos.toString(),
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Agendamentos Hoje',
      value: agendamentosHoje.toString(),
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Receita (Mês)',
      value: new Intl.NumberFormat('pt-BR', { 
        style: 'currency', 
        currency: 'BRL' 
      }).format(receitaMensal),
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Notas Emitidas',
      value: notasEmitidas.toString(),
      icon: FileText,
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="p-6 rounded-2xl border-0 shadow-md hover:shadow-lg transition-all duration-300">
          <div className="flex items-center justify-between mb-4">
            <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${getColorClasses(stat.color)}`}>
              <stat.icon className="h-6 w-6" />
            </div>
          </div>
          <div>
            <p className="text-2xl font-bold text-gray-900 mb-1">
              {stat.value}
            </p>
            <p className="text-gray-600 text-sm">
              {stat.title}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
};
