
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

interface PlanLimits {
  canCreateAppointment: boolean;
  canCreateInvoice: boolean;
  appointmentsUsed: number;
  appointmentsLimit: number;
  invoicesUsed: number;
  invoicesLimit: number;
}

export const usePlanLimits = () => {
  const { userData } = useAuth();
  const [limits, setLimits] = useState<PlanLimits>({
    canCreateAppointment: true,
    canCreateInvoice: true,
    appointmentsUsed: 0,
    appointmentsLimit: 0,
    invoicesUsed: 0,
    invoicesLimit: 0,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (userData?.empresa?.id) {
      checkLimits();
    }
  }, [userData]);

  const checkLimits = async () => {
    try {
      setIsLoading(true);

      // Verificar limite de agendamentos
      const { data: canCreateAppointment } = await supabase
        .rpc('verificar_limite_plano', {
          empresa_id_param: userData?.empresa?.id,
          tipo_limite: 'agendamentos'
        });

      // Verificar limite de notas fiscais
      const { data: canCreateInvoice } = await supabase
        .rpc('verificar_limite_plano', {
          empresa_id_param: userData?.empresa?.id,
          tipo_limite: 'notas'
        });

      // Buscar uso atual
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const { data: agendamentos } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('empresa_id', userData?.empresa?.id)
        .gte('created_at', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('created_at', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      const { data: notas } = await supabase
        .from('notas_fiscais')
        .select('id')
        .eq('empresa_id', userData?.empresa?.id)
        .gte('criada_em', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('criada_em', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      // Buscar limites do plano
      const { data: empresa } = await supabase
        .from('empresas')
        .select('planos(limite_agendamentos, limite_notas)')
        .eq('id', userData?.empresa?.id)
        .single();

      setLimits({
        canCreateAppointment: canCreateAppointment || false,
        canCreateInvoice: canCreateInvoice || false,
        appointmentsUsed: agendamentos?.length || 0,
        appointmentsLimit: empresa?.planos?.limite_agendamentos || 0,
        invoicesUsed: notas?.length || 0,
        invoicesLimit: empresa?.planos?.limite_notas || 0,
      });
    } catch (error) {
      console.error('Erro ao verificar limites:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const showLimitModal = (type: 'agendamentos' | 'notas') => {
    const message = type === 'agendamentos' 
      ? 'Você atingiu o limite de agendamentos do seu plano atual.'
      : 'Você atingiu o limite de notas fiscais do seu plano atual.';
    
    toast.error(`${message} Faça upgrade do seu plano para continuar.`);
  };

  return {
    limits,
    isLoading,
    checkLimits,
    showLimitModal,
  };
};
