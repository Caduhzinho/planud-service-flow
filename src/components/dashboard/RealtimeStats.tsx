import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { TrendingUp, TrendingDown, Users, Calendar, DollarSign, Target } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';

interface RealtimeStatsData {
  clientesTotal: number;
  agendamentosHoje: number;
  receitaMensal: number;
  metaMensal: number;
  crescimentoMensal: number;
  agendamentosPendentes: number;
}

export const RealtimeStats = () => {
  const { userData } = useAuth();
  const [stats, setStats] = useState<RealtimeStatsData>({
    clientesTotal: 0,
    agendamentosHoje: 0,
    receitaMensal: 0,
    metaMensal: 5000, // Meta padrão
    crescimentoMensal: 0,
    agendamentosPendentes: 0
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData?.empresa_id) {
      loadStats();
      
      // Atualizar stats a cada 30 segundos
      const interval = setInterval(loadStats, 30000);
      return () => clearInterval(interval);
    }
  }, [userData?.empresa_id]);

  const loadStats = async () => {
    if (!userData?.empresa_id) return;

    try {
      const today = new Date();
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      const startOfLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
      const endOfLastMonth = new Date(today.getFullYear(), today.getMonth(), 0);

      // Clientes total
      const { count: clientesTotal } = await supabase
        .from('clientes')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', userData.empresa_id);

      // Agendamentos hoje
      const { count: agendamentosHoje } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', userData.empresa_id)
        .gte('data_hora', today.toISOString().split('T')[0])
        .lt('data_hora', new Date(today.getTime() + 24 * 60 * 60 * 1000).toISOString().split('T')[0]);

      // Agendamentos pendentes (próximos 7 dias)
      const nextWeek = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000);
      const { count: agendamentosPendentes } = await supabase
        .from('agendamentos')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', userData.empresa_id)
        .eq('status', 'Agendado')
        .gte('data_hora', today.toISOString())
        .lte('data_hora', nextWeek.toISOString());

      // Receita mensal atual
      const { data: receitaAtual } = await supabase
        .from('agendamentos')
        .select('valor')
        .eq('empresa_id', userData.empresa_id)
        .eq('status', 'Concluído')
        .gte('data_hora', startOfMonth.toISOString());

      const receitaMensal = receitaAtual?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;

      // Receita mês anterior para calcular crescimento
      const { data: receitaAnterior } = await supabase
        .from('agendamentos')
        .select('valor')
        .eq('empresa_id', userData.empresa_id)
        .eq('status', 'Concluído')
        .gte('data_hora', startOfLastMonth.toISOString())
        .lte('data_hora', endOfLastMonth.toISOString());

      const receitaMesAnterior = receitaAnterior?.reduce((sum, item) => sum + Number(item.valor), 0) || 0;
      const crescimentoMensal = receitaMesAnterior > 0 
        ? ((receitaMensal - receitaMesAnterior) / receitaMesAnterior) * 100 
        : 0;

      setStats({
        clientesTotal: clientesTotal || 0,
        agendamentosHoje: agendamentosHoje || 0,
        receitaMensal,
        metaMensal: 5000, // Pode ser configurável no futuro
        crescimentoMensal,
        agendamentosPendentes: agendamentosPendentes || 0
      });
    } catch (error) {
      console.error('Erro ao carregar estatísticas:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const progressoMeta = Math.min((stats.receitaMensal / stats.metaMensal) * 100, 100);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="animate-pulse">
            <CardContent className="p-6">
              <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-3/4"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Clientes Total</p>
                <p className="text-3xl font-bold text-gray-900">{stats.clientesTotal}</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Agendamentos Hoje</p>
                <p className="text-3xl font-bold text-gray-900">{stats.agendamentosHoje}</p>
                {stats.agendamentosPendentes > 0 && (
                  <Badge variant="outline" className="mt-1 text-xs">
                    +{stats.agendamentosPendentes} próximos
                  </Badge>
                )}
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                <Calendar className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Receita Mensal</p>
                <p className="text-3xl font-bold text-gray-900">
                  R$ {stats.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                </p>
                <div className="flex items-center mt-1">
                  {stats.crescimentoMensal >= 0 ? (
                    <TrendingUp className="h-4 w-4 text-green-600 mr-1" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-red-600 mr-1" />
                  )}
                  <span className={`text-sm font-medium ${
                    stats.crescimentoMensal >= 0 ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {stats.crescimentoMensal >= 0 ? '+' : ''}{stats.crescimentoMensal.toFixed(1)}%
                  </span>
                </div>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                <DollarSign className="h-6 w-6 text-purple-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-3">
              <div>
                <p className="text-sm font-medium text-gray-600">Meta Mensal</p>
                <p className="text-3xl font-bold text-gray-900">
                  {progressoMeta.toFixed(0)}%
                </p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                <Target className="h-6 w-6 text-orange-600" />
              </div>
            </div>
            <div className="space-y-2">
              <Progress value={progressoMeta} className="h-2" />
              <p className="text-xs text-gray-500">
                R$ {stats.receitaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })} de R$ {stats.metaMensal.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
              </p>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Indicadores de Performance */}
      <Card className="border-0 shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-indigo-600" />
            Indicadores de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {stats.clientesTotal > 0 ? (stats.receitaMensal / stats.clientesTotal).toFixed(0) : '0'}
              </div>
              <div className="text-sm text-blue-700">Receita por Cliente</div>
              <div className="text-xs text-blue-600 mt-1">R$ médio</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-green-50 to-emerald-50 rounded-xl">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {stats.agendamentosHoje + stats.agendamentosPendentes}
              </div>
              <div className="text-sm text-green-700">Agendamentos Ativos</div>
              <div className="text-xs text-green-600 mt-1">Próximos 7 dias</div>
            </div>
            
            <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-violet-50 rounded-xl">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {progressoMeta >= 100 ? '🎯' : progressoMeta >= 75 ? '📈' : progressoMeta >= 50 ? '⚡' : '🚀'}
              </div>
              <div className="text-sm text-purple-700">Status da Meta</div>
              <div className="text-xs text-purple-600 mt-1">
                {progressoMeta >= 100 ? 'Atingida!' : 
                 progressoMeta >= 75 ? 'Quase lá!' : 
                 progressoMeta >= 50 ? 'No caminho' : 'Acelere!'}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
