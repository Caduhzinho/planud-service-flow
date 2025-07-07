import { useCallback } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface AutomationOptions {
  agendamentoId?: string;
  clienteId: string;
  valor: number;
  servico: string;
  empresaId: string;
}

export const useAutomations = () => {
  // Função para gerar nota de serviço automaticamente
  const gerarNotaAutomatica = useCallback(async (options: AutomationOptions) => {
    try {
      const { data, error } = await supabase
        .from('notas_fiscais')
        .insert({
          agendamento_id: options.agendamentoId,
          cliente_id: options.clienteId,
          empresa_id: options.empresaId,
          valor: options.valor,
          data_emissao: new Date().toISOString(),
          status: 'gerado'
        })
        .select()
        .single();

      if (error) throw error;

      toast.success('Nota de serviço gerada automaticamente!');
      return data;
    } catch (error) {
      console.error('Erro ao gerar nota automática:', error);
      toast.error('Erro ao gerar nota automática');
      return null;
    }
  }, []);

  // Função para enviar WhatsApp automaticamente
  const enviarWhatsAppAutomatico = useCallback(async (clienteId: string, notaId: string) => {
    try {
      // Buscar dados do cliente
      const { data: cliente, error: clienteError } = await supabase
        .from('clientes')
        .select('nome, telefone')
        .eq('id', clienteId)
        .single();

      if (clienteError) throw clienteError;

      // Preparar mensagem para WhatsApp
      const mensagem = `Olá ${cliente.nome}! Sua nota de serviço foi gerada. Acesse: ${window.location.origin}/nota/${notaId}`;
      const whatsappUrl = `https://wa.me/${cliente.telefone.replace(/\D/g, '')}?text=${encodeURIComponent(mensagem)}`;
      
      // Abrir WhatsApp em nova aba
      window.open(whatsappUrl, '_blank');
      
      toast.success('WhatsApp aberto automaticamente!');
    } catch (error) {
      console.error('Erro ao enviar WhatsApp automático:', error);
      toast.error('Erro ao enviar WhatsApp automático');
    }
  }, []);

  // Função para verificar e executar automações
  const executarAutomacoes = useCallback(async (options: AutomationOptions) => {
    try {
      // Buscar configurações da empresa
      const { data: config, error } = await supabase
        .from('configuracoes')
        .select('gerar_nota_automatica, enviar_whatsapp_automatico')
        .eq('empresa_id', options.empresaId)
        .single();

      if (error) throw error;

      let notaGerada = null;

      // Executar geração automática de nota
      if (config.gerar_nota_automatica) {
        notaGerada = await gerarNotaAutomatica(options);
      }

      // Executar envio automático de WhatsApp
      if (config.enviar_whatsapp_automatico && notaGerada) {
        await enviarWhatsAppAutomatico(options.clienteId, notaGerada.id);
      }

      return notaGerada;
    } catch (error) {
      console.error('Erro ao executar automações:', error);
      return null;
    }
  }, [gerarNotaAutomatica, enviarWhatsAppAutomatico]);

  return {
    gerarNotaAutomatica,
    enviarWhatsAppAutomatico,
    executarAutomacoes
  };
};