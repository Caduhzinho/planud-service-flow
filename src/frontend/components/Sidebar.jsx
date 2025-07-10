import { NavLink } from 'react-router-dom';
import { Home, Users, Calendar, FileText, Settings, Sliders } from 'lucide-react';

export default function Sidebar() {
  return (
    <aside className="fixed inset-y-0 left-0 w-64 bg-white border-r">
      <div className="px-6 py-8">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
            <Home className="h-5 w-5 text-white" />
          </div>
          <span className="text-xl font-bold">Planud</span>
        </div>
        
        <nav className="mt-10 space-y-2">
          <NavLink
            to="/dashboard"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Home className="h-5 w-5" />
            <span>Dashboard</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/clients"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Users className="h-5 w-5" />
            <span>Clientes</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/appointments"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Calendar className="h-5 w-5" />
            <span>Agendamentos</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/service-notes"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <FileText className="h-5 w-5" />
            <span>Notas de Serviço</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/company"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Settings className="h-5 w-5" />
            <span>Empresa</span>
          </NavLink>
          
          <NavLink
            to="/dashboard/preferences"
            className={({ isActive }) => 
              `flex items-center space-x-3 px-4 py-2 rounded-lg transition-colors ${
                isActive ? 'bg-indigo-50 text-indigo-700' : 'text-gray-700 hover:bg-gray-100'
              }`
            }
          >
            <Sliders className="h-5 w-5" />
            <span>Preferências</span>
          </NavLink>
        </nav>
      </div>
    </aside>
  );
}
