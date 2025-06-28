
-- Criar tabela de clientes
CREATE TABLE public.clientes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  nome TEXT NOT NULL,
  telefone TEXT NOT NULL,
  email TEXT,
  endereco TEXT,
  observacoes TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de agendamentos
CREATE TABLE public.agendamentos (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  cliente_id UUID NOT NULL REFERENCES public.clientes(id) ON DELETE CASCADE,
  data_hora TIMESTAMP WITH TIME ZONE NOT NULL,
  servico TEXT NOT NULL,
  valor DECIMAL(10,2) NOT NULL,
  status TEXT NOT NULL DEFAULT 'Agendado' CHECK (status IN ('Agendado', 'Confirmado', 'Cancelado', 'Concluído')),
  observacao TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS nas novas tabelas
ALTER TABLE public.clientes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.agendamentos ENABLE ROW LEVEL SECURITY;

-- Políticas para clientes
CREATE POLICY "Usuários podem ver clientes da sua empresa" 
  ON public.clientes 
  FOR SELECT 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem inserir clientes na sua empresa" 
  ON public.clientes 
  FOR INSERT 
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem atualizar clientes da sua empresa" 
  ON public.clientes 
  FOR UPDATE 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem deletar clientes da sua empresa" 
  ON public.clientes 
  FOR DELETE 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

-- Políticas para agendamentos
CREATE POLICY "Usuários podem ver agendamentos da sua empresa" 
  ON public.agendamentos 
  FOR SELECT 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem inserir agendamentos na sua empresa" 
  ON public.agendamentos 
  FOR INSERT 
  WITH CHECK (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem atualizar agendamentos da sua empresa" 
  ON public.agendamentos 
  FOR UPDATE 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem deletar agendamentos da sua empresa" 
  ON public.agendamentos 
  FOR DELETE 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

-- Criar índices para performance
CREATE INDEX idx_clientes_empresa_id ON public.clientes(empresa_id);
CREATE INDEX idx_clientes_telefone ON public.clientes(telefone);
CREATE INDEX idx_agendamentos_empresa_id ON public.agendamentos(empresa_id);
CREATE INDEX idx_agendamentos_cliente_id ON public.agendamentos(cliente_id);
CREATE INDEX idx_agendamentos_data_hora ON public.agendamentos(data_hora);
CREATE INDEX idx_agendamentos_status ON public.agendamentos(status);

-- Função para atualizar updated_at automaticamente
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Triggers para atualizar updated_at
CREATE TRIGGER update_clientes_updated_at BEFORE UPDATE ON public.clientes
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_agendamentos_updated_at BEFORE UPDATE ON public.agendamentos
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
