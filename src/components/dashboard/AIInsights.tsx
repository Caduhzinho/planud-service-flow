import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Sparkles, TrendingUp, Bell, Lightbulb } from 'lucide-react';

export const AIInsights = () => {
  const insights = [
    {
      id: 1,
      type: 'sugestao',
      icon: Lightbulb,
      title: 'Otimização de Agenda',
      description: 'Considerando seu histórico, as terças às 14h têm menor taxa de cancelamento.',
      priority: 'medium',
      color: 'bg-blue-50 text-blue-600'
    },
    {
      id: 2,
      type: 'alerta',
      icon: Bell,
      title: 'Cobrança Pendente',
      description: 'João Santos tem um pagamento em atraso de 5 dias. Enviar lembrete?',
      priority: 'high',
      color: 'bg-orange-50 text-orange-600'
    },
    {
      id: 3,
      type: 'insight',
      icon: TrendingUp,
      title: 'Tendência de Receita',
      description: 'Sua receita está 15% acima da média dos últimos 3 meses.',
      priority: 'low',
      color: 'bg-green-50 text-green-600'
    }
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-700';
      case 'medium':
        return 'bg-yellow-100 text-yellow-700';
      case 'low':
        return 'bg-green-100 text-green-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-md">
      <div className="mb-6">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-5 w-5 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-900">
            Sugestões Inteligentes do Planud
          </h3>
          <Badge className="bg-purple-100 text-purple-700 text-xs px-2 py-1">
            IA Beta
          </Badge>
        </div>
        <p className="text-gray-600">
          Insights personalizados para otimizar seu negócio
        </p>
      </div>

      <div className="space-y-4">
        {insights.map((insight) => (
          <div
            key={insight.id}
            className="flex items-start space-x-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
          >
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${insight.color}`}>
              <insight.icon className="h-5 w-5" />
            </div>
            <div className="flex-1">
              <div className="flex items-center justify-between mb-1">
                <h4 className="font-semibold text-gray-900">{insight.title}</h4>
                <Badge className={`${getPriorityColor(insight.priority)} text-xs border-0`}>
                  {insight.priority === 'high' ? 'Urgente' : 
                   insight.priority === 'medium' ? 'Média' : 'Baixa'}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">{insight.description}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 p-4 bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl border border-purple-100">
        <div className="flex items-center space-x-2 mb-2">
          <Sparkles className="h-4 w-4 text-purple-600" />
          <span className="text-sm font-medium text-purple-900">Funcionalidade em Desenvolvimento</span>
        </div>
        <p className="text-xs text-purple-700">
          Em breve, nossa IA analisará seus dados para oferecer sugestões ainda mais precisas sobre 
          horários ideais, cobranças automáticas e otimização de receita.
        </p>
      </div>
    </Card>
  );
};
