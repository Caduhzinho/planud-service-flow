import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface DashboardStats {
  clientesAtivos: number;
  agendamentosHoje: number;
  notasEmitidas: number;
  receitaMensal: number;
  isLoading: boolean;
  error: string | null;
}

export const useDashboardStats = (): DashboardStats => {
  const { userData } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    clientesAtivos: 0,
    agendamentosHoje: 0,
    notasEmitidas: 0,
    receitaMensal: 0,
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!userData?.empresa_id) return;

    const fetchStats = async () => {
      setStats(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const today = new Date().toISOString().split('T')[0];
        const currentMonth = new Date().getMonth() + 1;
        const currentYear = new Date().getFullYear();

        // Clientes ativos
        const { count: clientesAtivos, error: clientesError } = await supabase
          .from('clientes')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', userData.empresa_id);

        if (clientesError) throw clientesError;

        // Agendamentos hoje
        const { count: agendamentosHoje, error: agendamentosError } = await supabase
          .from('agendamentos')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', userData.empresa_id)
          .gte('data_hora', `${today}T00:00:00`)
          .lt('data_hora', `${today}T23:59:59`);

        if (agendamentosError) throw agendamentosError;

        // Notas fiscais emitidas no mês
        const { count: notasEmitidas, error: notasError } = await supabase
          .from('notas_fiscais')
          .select('*', { count: 'exact', head: true })
          .eq('empresa_id', userData.empresa_id)
          .gte('data_emissao', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
          .lt('data_emissao', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

        if (notasError) throw notasError;

        // Receita mensal
        const { data: receitaData, error: receitaError } = await supabase
          .from('financeiro')
          .select('valor')
          .eq('empresa_id', userData.empresa_id)
          .eq('tipo', 'receita')
          .gte('data_lancamento', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
          .lt('data_lancamento', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

        if (receitaError) throw receitaError;

        const receitaMensal = receitaData?.reduce((total, item) => total + Number(item.valor), 0) || 0;

        setStats({
          clientesAtivos: clientesAtivos || 0,
          agendamentosHoje: agendamentosHoje || 0,
          notasEmitidas: notasEmitidas || 0,
          receitaMensal,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error('Erro ao buscar estatísticas do dashboard:', error);
        setStats(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar dados do dashboard'
        }));
      }
    };

    fetchStats();
  }, [userData?.empresa_id]);

  return stats;
};
