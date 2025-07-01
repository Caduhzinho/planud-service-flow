
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LogOut, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

export const AppHeader = () => {
  const { userData, signOut } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await signOut();
      toast.success('Logout realizado com sucesso!');
      navigate('/');
    } catch (error) {
      toast.error('Erro ao fazer logout');
    }
  };

  const getPlanoColor = (plano: string) => {
    switch (plano) {
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      case 'intermediario':
        return 'bg-blue-100 text-blue-800';
      case 'basico':
        return 'bg-green-100 text-green-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanoLabel = (plano: string) => {
    switch (plano) {
      case 'pro':
        return 'Pro';
      case 'intermediario':
        return 'Intermediário';
      case 'basico':
        return 'Básico';
      default:
        return 'Básico';
    }
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 flex items-center justify-between px-6">
      <div className="flex items-center space-x-4">
        <SidebarTrigger />
        <div className="flex items-center space-x-3">
          <h2 className="text-lg font-semibold text-gray-900">Planud</h2>
          {userData?.empresa && (
            <div className="text-sm text-gray-600">
              {userData.empresa.nome}
            </div>
          )}
        </div>
      </div>

      <div className="flex items-center space-x-4">
        {userData?.empresa && (
          <Badge className={`${getPlanoColor(userData.empresa.plano)} border-0`}>
            {getPlanoLabel(userData.empresa.plano)}
          </Badge>
        )}
        
        <div className="flex items-center space-x-2 text-sm text-gray-700">
          <User className="h-4 w-4" />
          <span>{userData?.nome || 'Usuário'}</span>
        </div>

        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className="text-gray-600 hover:text-red-600"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
    </header>
  );
};
