
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from './RevenueChart';
import { UpcomingAppointments } from './UpcomingAppointments';
import { QuickActions } from './QuickActions';
import { AIInsights } from './AIInsights';
import { useAuth } from '@/hooks/useAuth';

export const Dashboard = () => {
  const { userData } = useAuth();

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Bem-vindo, {userData?.nome}! Aqui está o resumo da {userData?.empresa?.nome}
        </p>
      </div>

      <DashboardStats />
      
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <RevenueChart />
        </div>
        <div>
          <QuickActions />
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">
        <UpcomingAppointments />
        <AIInsights />
      </div>
    </div>
  );
};
