
import { Card } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { useRevenueChart } from '@/hooks/useRevenueChart';

export const RevenueChart = () => {
  const { data, isLoading, error } = useRevenueChart();

  if (isLoading) {
    return (
      <Card className="p-6 rounded-2xl border-0 shadow-md">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Receita vs Despesa
          </h3>
          <p className="text-gray-600">
            Últimos 6 meses
          </p>
        </div>
        <div className="h-80 flex items-center justify-center">
          <LoadingSpinner size="lg" />
        </div>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="p-6 rounded-2xl border-0 shadow-md">
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            Receita vs Despesa
          </h3>
          <p className="text-red-600">{error}</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6 rounded-2xl border-0 shadow-md">
      <div className="mb-6">
        <h3 className="text-xl font-semibold text-gray-900 mb-2">
          Receita vs Despesa
        </h3>
        <p className="text-gray-600">
          Últimos 6 meses
        </p>
      </div>
      
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis 
              dataKey="name" 
              stroke="#64748b"
              fontSize={12}
            />
            <YAxis 
              stroke="#64748b"
              fontSize={12}
              tickFormatter={(value) => new Intl.NumberFormat('pt-BR', { 
                style: 'currency', 
                currency: 'BRL',
                notation: 'compact'
              }).format(value)}
            />
            <Tooltip 
              formatter={(value: number) => [
                new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value), 
                ''
              ]}
              contentStyle={{
                backgroundColor: 'white',
                border: 'none',
                borderRadius: '12px',
                boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)'
              }}
            />
            <Line 
              type="monotone" 
              dataKey="receita" 
              stroke="#6366f1" 
              strokeWidth={3}
              dot={{ fill: '#6366f1', strokeWidth: 2, r: 4 }}
              name="Receita"
            />
            <Line 
              type="monotone" 
              dataKey="despesa" 
              stroke="#ef4444" 
              strokeWidth={3}
              dot={{ fill: '#ef4444', strokeWidth: 2, r: 4 }}
              name="Despesa"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
};
