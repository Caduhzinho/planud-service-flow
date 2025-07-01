
-- Primeiro, vamos remover a constraint existente na tabela empresas
ALTER TABLE public.empresas DROP CONSTRAINT IF EXISTS empresas_plano_check;

-- Agora vamos atualizar os valores para os novos padrões
UPDATE public.empresas 
SET plano = CASE 
  WHEN plano = 'Básico' THEN 'basico'
  WHEN plano = 'Intermediário' THEN 'intermediario' 
  WHEN plano = 'Pro' THEN 'pro'
  ELSE 'basico'
END;

-- Adicionar nova constraint com os valores corretos
ALTER TABLE public.empresas 
ADD CONSTRAINT empresas_plano_check 
CHECK (plano IN ('basico', 'intermediario', 'pro'));

-- Criar a tabela de configurações
CREATE TABLE public.configuracoes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID UNIQUE REFERENCES public.empresas(id) ON DELETE CASCADE,
  logo_url TEXT,
  plano_ativo TEXT CHECK (plano_ativo IN ('basico', 'intermediario', 'pro')) DEFAULT 'basico',
  gerar_nota_automatica BOOLEAN DEFAULT false,
  enviar_whatsapp_automatico BOOLEAN DEFAULT false,
  notificacoes_email BOOLEAN DEFAULT true,
  notificacoes_push BOOLEAN DEFAULT false,
  tema_visual TEXT CHECK (tema_visual IN ('claro', 'escuro')) DEFAULT 'claro',
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS na tabela configuracoes
ALTER TABLE public.configuracoes ENABLE ROW LEVEL SECURITY;

-- Políticas RLS
CREATE POLICY "Users can view settings from their company"
  ON public.configuracoes
  FOR SELECT
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can insert settings for their company"
  ON public.configuracoes
  FOR INSERT
  WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can update settings from their company"
  ON public.configuracoes
  FOR UPDATE
  USING (empresa_id = public.get_user_empresa_id());

-- Trigger para updated_at
CREATE TRIGGER update_configuracoes_updated_at
  BEFORE UPDATE ON public.configuracoes
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir configurações padrão para empresas existentes
INSERT INTO public.configuracoes (empresa_id, plano_ativo)
SELECT id, plano FROM public.empresas
ON CONFLICT (empresa_id) DO NOTHING;
