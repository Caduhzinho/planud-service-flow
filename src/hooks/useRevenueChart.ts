import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface MonthlyData {
  name: string;
  receita: number;
  despesa: number;
  month: number;
  year: number;
}

interface RevenueChartData {
  data: MonthlyData[];
  isLoading: boolean;
  error: string | null;
}

export const useRevenueChart = (): RevenueChartData => {
  const { userData } = useAuth();
  const [chartData, setChartData] = useState<RevenueChartData>({
    data: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!userData?.empresa_id) return;

    const fetchRevenueData = async () => {
      setChartData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const currentDate = new Date();
        const months = [];

        // Gerar últimos 6 meses
        for (let i = 5; i >= 0; i--) {
          const date = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
          months.push({
            name: date.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', ''),
            month: date.getMonth() + 1,
            year: date.getFullYear(),
            receita: 0,
            despesa: 0
          });
        }

        // Buscar dados financeiros dos últimos 6 meses
        const startDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - 5, 1);
        const { data: financialData, error } = await supabase
          .from('financeiro')
          .select('valor, tipo, data_lancamento')
          .eq('empresa_id', userData.empresa_id)
          .gte('data_lancamento', startDate.toISOString().split('T')[0]);

        if (error) throw error;

        // Agrupar dados por mês
        financialData?.forEach(item => {
          const itemDate = new Date(item.data_lancamento);
          const monthIndex = months.findIndex(m => 
            m.month === itemDate.getMonth() + 1 && m.year === itemDate.getFullYear()
          );

          if (monthIndex >= 0) {
            if (item.tipo === 'receita') {
              months[monthIndex].receita += Number(item.valor);
            } else if (item.tipo === 'despesa') {
              months[monthIndex].despesa += Number(item.valor);
            }
          }
        });

        setChartData({
          data: months,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error('Erro ao buscar dados do gráfico:', error);
        setChartData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar dados do gráfico'
        }));
      }
    };

    fetchRevenueData();
  }, [userData?.empresa_id]);

  return chartData;
};