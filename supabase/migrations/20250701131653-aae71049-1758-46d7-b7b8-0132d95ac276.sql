
-- Criar tabela de planos
CREATE TABLE public.planos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nome TEXT UNIQUE NOT NULL,
  preco_mensal NUMERIC(10,2),
  descricao TEXT,
  limite_agendamentos INT,
  limite_notas INT,
  permite_ia BOOLEAN DEFAULT false,
  permite_logo BOOLEAN DEFAULT false,
  suporte_whatsapp BOOLEAN DEFAULT false,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela de assinaturas
CREATE TABLE public.assinaturas (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE,
  plano_id UUID REFERENCES public.planos(id),
  status TEXT CHECK (status IN ('ativa', 'cancelada', 'pendente', 'vencida')) DEFAULT 'pendente',
  forma_pagamento TEXT CHECK (forma_pagamento IN ('pix', 'boleto', 'cartao')),
  vencimento DATE,
  link_pagamento TEXT,
  id_asaas TEXT,
  ativa BOOLEAN DEFAULT false,
  criada_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.planos ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.assinaturas ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para planos (todos podem ver)
CREATE POLICY "Anyone can view plans"
  ON public.planos
  FOR SELECT
  USING (true);

-- Políticas RLS para assinaturas
CREATE POLICY "Users can view subscriptions from their company"
  ON public.assinaturas
  FOR SELECT
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can insert subscriptions for their company"
  ON public.assinaturas
  FOR INSERT
  WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can update subscriptions from their company"
  ON public.assinaturas
  FOR UPDATE
  USING (empresa_id = public.get_user_empresa_id());

-- Trigger para updated_at na tabela assinaturas
CREATE TRIGGER update_assinaturas_updated_at
  BEFORE UPDATE ON public.assinaturas
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Inserir planos básicos
INSERT INTO public.planos (nome, preco_mensal, descricao, limite_agendamentos, limite_notas, permite_ia, permite_logo, suporte_whatsapp) VALUES
('gratuito', 0.00, 'Plano gratuito com funcionalidades básicas', 10, 5, false, false, false),
('intermediario', 29.90, 'Plano intermediário com automações', 100, 50, true, true, true),
('pro', 59.90, 'Plano profissional com recursos ilimitados', -1, -1, true, true, true);

-- Atualizar tabela empresas para usar referência aos planos
ALTER TABLE public.empresas ADD COLUMN IF NOT EXISTS plano_id UUID REFERENCES public.planos(id);

-- Atualizar empresas existentes para usar o plano gratuito
UPDATE public.empresas 
SET plano_id = (SELECT id FROM public.planos WHERE nome = 'gratuito')
WHERE plano_id IS NULL;

-- Função para verificar limites do plano
CREATE OR REPLACE FUNCTION public.verificar_limite_plano(
  empresa_id_param UUID,
  tipo_limite TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  plano_atual RECORD;
  uso_atual INT;
  limite INT;
BEGIN
  -- Buscar plano atual da empresa
  SELECT p.* INTO plano_atual
  FROM public.planos p
  JOIN public.empresas e ON e.plano_id = p.id
  WHERE e.id = empresa_id_param;
  
  IF NOT FOUND THEN
    RETURN false;
  END IF;
  
  -- Verificar limite baseado no tipo
  IF tipo_limite = 'agendamentos' THEN
    limite := plano_atual.limite_agendamentos;
    
    -- Se limite é -1, é ilimitado
    IF limite = -1 THEN
      RETURN true;
    END IF;
    
    -- Contar agendamentos do mês atual
    SELECT COUNT(*) INTO uso_atual
    FROM public.agendamentos
    WHERE empresa_id = empresa_id_param
    AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE);
    
  ELSIF tipo_limite = 'notas' THEN
    limite := plano_atual.limite_notas;
    
    -- Se limite é -1, é ilimitado
    IF limite = -1 THEN
      RETURN true;
    END IF;
    
    -- Contar notas do mês atual
    SELECT COUNT(*) INTO uso_atual
    FROM public.notas_fiscais
    WHERE empresa_id = empresa_id_param
    AND EXTRACT(YEAR FROM criada_em) = EXTRACT(YEAR FROM CURRENT_DATE)
    AND EXTRACT(MONTH FROM criada_em) = EXTRACT(MONTH FROM CURRENT_DATE);
    
  ELSE
    RETURN false;
  END IF;
  
  RETURN uso_atual < limite;
END;
$$;
