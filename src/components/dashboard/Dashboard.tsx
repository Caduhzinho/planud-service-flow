
import { DashboardStats } from './DashboardStats';
import { RevenueChart } from './RevenueChart';
import { UpcomingAppointments } from './UpcomingAppointments';
import { QuickActions } from './QuickActions';

export const Dashboard = () => {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Dashboard
        </h1>
        <p className="text-gray-600">
          Visão geral da sua empresa
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

      <UpcomingAppointments />
    </div>
  );
};
