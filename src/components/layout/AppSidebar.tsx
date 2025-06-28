
import { 
  LayoutDashboard, 
  Calendar, 
  Users, 
  DollarSign, 
  FileText, 
  Settings,
  Zap
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';

const menuItems = [
  { title: 'Dashboard', url: '/dashboard', icon: LayoutDashboard },
  { title: 'Agendamentos', url: '/agendamentos', icon: Calendar },
  { title: 'Clientes', url: '/clientes', icon: Users },
  { title: 'Financeiro', url: '/financeiro', icon: DollarSign },
  { title: 'Notas Fiscais', url: '/notas', icon: FileText },
  { title: 'Configurações', url: '/configuracoes', icon: Settings },
];

export function AppSidebar() {
  const { state } = useSidebar();
  const isCollapsed = state === 'collapsed';

  return (
    <Sidebar className={isCollapsed ? "w-16" : "w-64"} collapsible="icon">
      <SidebarContent className="bg-white">
        {/* Logo */}
        <div className="p-6 border-b">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            {!isCollapsed && (
              <span className="text-xl font-bold text-gray-900">Planud</span>
            )}
          </div>
        </div>

        <SidebarGroup>
          <SidebarGroupLabel className="px-6 py-2 text-xs font-semibold text-gray-500 uppercase tracking-wider">
            {!isCollapsed && 'Menu Principal'}
          </SidebarGroupLabel>
          <SidebarGroupContent className="px-3">
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a
                      href={item.url}
                      className="flex items-center space-x-3 px-3 py-3 rounded-xl text-gray-700 hover:bg-gray-100 hover:text-indigo-600 transition-colors font-medium"
                    >
                      <item.icon className="h-5 w-5" />
                      {!isCollapsed && <span>{item.title}</span>}
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
