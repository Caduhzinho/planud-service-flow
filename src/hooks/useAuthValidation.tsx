
import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { usePlanLimits } from '@/hooks/usePlanLimits';

interface ValidationState {
  isValid: boolean;
  isLoading: boolean;
  error: string | null;
  redirectTo: string | null;
  message: string | null;
}

export const useAuthValidation = () => {
  const { user, userData, loading: authLoading } = useAuth();
  const { limits, isLoading: limitsLoading } = usePlanLimits();
  const [validation, setValidation] = useState<ValidationState>({
    isValid: false,
    isLoading: true,
    error: null,
    redirectTo: null,
    message: null,
  });

  useEffect(() => {
    const validateAccess = async () => {
      // Se ainda está carregando auth, aguarda
      if (authLoading || limitsLoading) {
        setValidation(prev => ({ ...prev, isLoading: true }));
        return;
      }

      // Usuário não autenticado
      if (!user) {
        setValidation({
          isValid: false,
          isLoading: false,
          error: 'Usuário não autenticado',
          redirectTo: '/',
          message: 'Você precisa fazer login para acessar o sistema.',
        });
        return;
      }

      // Dados do usuário não carregados
      if (!userData) {
        setValidation({
          isValid: false,
          isLoading: false,
          error: 'Dados do usuário não encontrados',
          redirectTo: null,
          message: 'Erro ao carregar os dados do usuário. Tente fazer login novamente.',
        });
        return;
      }

      // Empresa não configurada
      if (!userData.empresa || !userData.empresa.id) {
        setValidation({
          isValid: false,
          isLoading: false,
          error: 'Empresa não configurada',
          redirectTo: '/configuracoes',
          message: 'Você ainda não tem uma empresa cadastrada. Complete o cadastro inicial para acessar o sistema.',
        });
        return;
      }

      // Tudo válido
      setValidation({
        isValid: true,
        isLoading: false,
        error: null,
        redirectTo: null,
        message: null,
      });
    };

    validateAccess();
  }, [user, userData, authLoading, limitsLoading, limits]);

  return validation;
};
