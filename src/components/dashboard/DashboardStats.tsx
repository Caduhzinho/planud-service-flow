
import { Card } from '@/components/ui/card';
import { Users, Calendar, DollarSign, FileText } from 'lucide-react';

export const DashboardStats = () => {
  const stats = [
    {
      title: 'Clientes Ativos',
      value: '47',
      change: '+12%',
      icon: Users,
      color: 'blue'
    },
    {
      title: 'Agendamentos',
      value: '23',
      change: '+8%',
      icon: Calendar,
      color: 'green'
    },
    {
      title: 'Receita (Mês)',
      value: 'R$ 12.450',
      change: '+23%',
      icon: DollarSign,
      color: 'purple'
    },
    {
      title: 'Notas Emitidas',
      value: '31',
      change: '+15%',
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
            <span className="text-sm font-medium text-green-600 bg-green-50 px-2 py-1 rounded-lg">
              {stat.change}
            </span>
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
