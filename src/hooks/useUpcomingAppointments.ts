import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from './useAuth';

interface UpcomingAppointment {
  id: string;
  client_name: string;
  servico: string;
  data_hora: string;
  valor: number;
  status: string;
}

interface UpcomingAppointmentsData {
  appointments: UpcomingAppointment[];
  isLoading: boolean;
  error: string | null;
}

export const useUpcomingAppointments = (): UpcomingAppointmentsData => {
  const { userData } = useAuth();
  const [data, setData] = useState<UpcomingAppointmentsData>({
    appointments: [],
    isLoading: true,
    error: null
  });

  useEffect(() => {
    if (!userData?.empresa_id) return;

    const fetchUpcomingAppointments = async () => {
      setData(prev => ({ ...prev, isLoading: true, error: null }));

      try {
        const today = new Date();
        const nextWeek = new Date(today);
        nextWeek.setDate(today.getDate() + 7);

        const { data: appointments, error } = await supabase
          .from('agendamentos')
          .select(`
            id,
            servico,
            data_hora,
            valor,
            status,
            clientes (
              nome
            )
          `)
          .eq('empresa_id', userData.empresa_id)
          .gte('data_hora', today.toISOString())
          .lte('data_hora', nextWeek.toISOString())
          .order('data_hora', { ascending: true })
          .limit(5);

        if (error) throw error;

        const formattedAppointments: UpcomingAppointment[] = appointments?.map(apt => ({
          id: apt.id,
          client_name: apt.clientes?.nome || 'Cliente não encontrado',
          servico: apt.servico,
          data_hora: apt.data_hora,
          valor: Number(apt.valor),
          status: apt.status
        })) || [];

        setData({
          appointments: formattedAppointments,
          isLoading: false,
          error: null
        });

      } catch (error) {
        console.error('Erro ao buscar agendamentos próximos:', error);
        setData(prev => ({
          ...prev,
          isLoading: false,
          error: 'Erro ao carregar agendamentos próximos'
        }));
      }
    };

    fetchUpcomingAppointments();
  }, [userData?.empresa_id]);

  return data;
};