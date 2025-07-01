
import { ReactNode } from 'react';
import { useAuthValidation } from '@/hooks/useAuthValidation';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { EmptyState } from '@/components/ui/empty-state';
import { AlertCircle, Building, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

interface AuthWrapperProps {
  children: ReactNode;
}

export const AuthWrapper = ({ children }: AuthWrapperProps) => {
  const { signOut } = useAuth();
  const validation = useAuthValidation();

  if (validation.isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" message="Carregando dados do usuário..." />
      </div>
    );
  }

  if (!validation.isValid) {
    // Erro de autenticação - redirecionar para login
    if (validation.error === 'Usuário não autenticado') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <EmptyState
            icon={<AlertCircle className="h-12 w-12 text-red-500" />}
            title="Acesso não autorizado"
            description="Você precisa fazer login para acessar o sistema."
            action="Ir para Login"
            to="/"
            variant="error"
          />
        </div>
      );
    }

    // Empresa não configurada
    if (validation.error === 'Empresa não configurada') {
      return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
          <EmptyState
            icon={<Building className="h-12 w-12 text-orange-500" />}
            title="Empresa não configurada"
            description="Complete o cadastro inicial da sua empresa para acessar o sistema."
            action="Configurar Empresa"
            to="/configuracoes"
            variant="warning"
          />
        </div>
      );
    }

    // Erro genérico nos dados
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <EmptyState
          icon={<RefreshCw className="h-12 w-12 text-gray-500" />}
          title="Erro ao carregar dados"
          description={validation.message || 'Ocorreu um erro inesperado. Tente fazer logout e login novamente.'}
          action="Tentar Novamente"
          onClick={async () => {
            await signOut();
            window.location.href = '/';
          }}
          variant="error"
        />
      </div>
    );
  }

  return <>{children}</>;
};
