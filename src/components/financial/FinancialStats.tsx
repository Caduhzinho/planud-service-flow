import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp, TrendingDown, DollarSign, Calendar } from 'lucide-react';

interface FinancialData {
  totalEntradas: number;
  totalSaidas: number;
  saldoMes: number;
  movimentacoesMes: number;
}

export const FinancialStats = () => {
  const [data, setData] = useState<FinancialData>({
    totalEntradas: 0,
    totalSaidas: 0,
    saldoMes: 0,
    movimentacoesMes: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();

  useEffect(() => {
    if (userData?.empresa_id) {
      fetchFinancialData();
    }
  }, [userData?.empresa_id]);

  const fetchFinancialData = async () => {
    try {
      setIsLoading(true);
      const currentMonth = new Date().toISOString().slice(0, 7); // YYYY-MM

      // Buscar entradas do mês
      const { data: entradas, error: entradasError } = await supabase
        .from('financeiro')
        .select('valor')
        .eq('empresa_id', userData?.empresa_id)
        .eq('tipo', 'entrada')
        .gte('data_lancamento', `${currentMonth}-01`)
        .lt('data_lancamento', `${currentMonth}-32`);

      if (entradasError) throw entradasError;

      // Buscar saídas do mês
      const { data: saidas, error: saidasError } = await supabase
        .from('financeiro')
        .select('valor')
        .eq('empresa_id', userData?.empresa_id)
        .eq('tipo', 'saida')
        .gte('data_lancamento', `${currentMonth}-01`)
        .lt('data_lancamento', `${currentMonth}-32`);

      if (saidasError) throw saidasError;

      // Contar movimentações
      const { count, error: countError } = await supabase
        .from('financeiro')
        .select('*', { count: 'exact', head: true })
        .eq('empresa_id', userData?.empresa_id)
        .gte('data_lancamento', `${currentMonth}-01`)
        .lt('data_lancamento', `${currentMonth}-32`);

      if (countError) throw countError;

      const totalEntradas = entradas?.reduce((sum, item) => sum + parseFloat(item.valor.toString()), 0) || 0;
      const totalSaidas = saidas?.reduce((sum, item) => sum + parseFloat(item.valor.toString()), 0) || 0;

      setData({
        totalEntradas,
        totalSaidas,
        saldoMes: totalEntradas - totalSaidas,
        movimentacoesMes: count || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar dados financeiros:', error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="animate-pulse space-y-2">
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                <div className="h-8 bg-gray-200 rounded w-3/4"></div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Entradas
          </CardTitle>
          <TrendingUp className="h-4 w-4 text-green-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-green-600">
            R$ {data.totalEntradas.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            No mês atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Total de Saídas
          </CardTitle>
          <TrendingDown className="h-4 w-4 text-red-600" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold text-red-600">
            R$ {data.totalSaidas.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            No mês atual
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Saldo do Mês
          </CardTitle>
          <DollarSign className={`h-4 w-4 ${data.saldoMes >= 0 ? 'text-green-600' : 'text-red-600'}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${data.saldoMes >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            R$ {data.saldoMes.toFixed(2).replace('.', ',')}
          </div>
          <p className="text-xs text-muted-foreground">
            Receita - Despesas
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">
            Movimentações
          </CardTitle>
          <Calendar className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            {data.movimentacoesMes}
          </div>
          <p className="text-xs text-muted-foreground">
            No mês atual
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
