
-- Criar tabela de notas fiscais
CREATE TABLE public.notas_fiscais (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  cliente_id UUID REFERENCES public.clientes(id) NOT NULL,
  agendamento_id UUID REFERENCES public.agendamentos(id),
  valor NUMERIC(10,2) NOT NULL,
  status TEXT CHECK (status IN ('gerado', 'enviado', 'pendente', 'cancelado')) DEFAULT 'gerado',
  pdf_url TEXT,
  codigo_nf TEXT,
  data_emissao TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  forma_pagamento TEXT CHECK (forma_pagamento IN ('pix', 'boleto', 'cartao', 'manual')),
  link_pagamento TEXT,
  enviada BOOLEAN DEFAULT false,
  criada_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Criar tabela financeiro
CREATE TABLE public.financeiro (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  empresa_id UUID REFERENCES public.empresas(id) ON DELETE CASCADE NOT NULL,
  tipo TEXT CHECK (tipo IN ('entrada', 'saida')) NOT NULL,
  origem TEXT,
  valor NUMERIC(10,2) NOT NULL,
  categoria TEXT,
  descricao TEXT,
  data_lancamento DATE DEFAULT CURRENT_DATE,
  pago BOOLEAN DEFAULT true,
  recorrente BOOLEAN DEFAULT false,
  observacoes TEXT,
  criado_em TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Adicionar trigger para updated_at nas notas fiscais
CREATE TRIGGER update_notas_fiscais_updated_at
  BEFORE UPDATE ON public.notas_fiscais
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Adicionar trigger para updated_at no financeiro
CREATE TRIGGER update_financeiro_updated_at
  BEFORE UPDATE ON public.financeiro
  FOR EACH ROW EXECUTE FUNCTION public.update_updated_at_column();

-- Habilitar RLS
ALTER TABLE public.notas_fiscais ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.financeiro ENABLE ROW LEVEL SECURITY;

-- Políticas RLS para notas_fiscais
CREATE POLICY "Users can view invoices from their company" 
  ON public.notas_fiscais 
  FOR SELECT 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can insert invoices for their company" 
  ON public.notas_fiscais 
  FOR INSERT 
  WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can update invoices from their company" 
  ON public.notas_fiscais 
  FOR UPDATE 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can delete invoices from their company" 
  ON public.notas_fiscais 
  FOR DELETE 
  USING (empresa_id = public.get_user_empresa_id());

-- Políticas RLS para financeiro
CREATE POLICY "Users can view financial records from their company" 
  ON public.financeiro 
  FOR SELECT 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can insert financial records for their company" 
  ON public.financeiro 
  FOR INSERT 
  WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can update financial records from their company" 
  ON public.financeiro 
  FOR UPDATE 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can delete financial records from their company" 
  ON public.financeiro 
  FOR DELETE 
  USING (empresa_id = public.get_user_empresa_id());
