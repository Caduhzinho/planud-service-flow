-- Adicionar coluna updated_at na tabela empresas
ALTER TABLE public.empresas 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Atualizar registros existentes na tabela empresas
UPDATE public.empresas 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Tornar a coluna NOT NULL após atualizar os registros existentes
ALTER TABLE public.empresas 
ALTER COLUMN updated_at SET NOT NULL;

-- Criar trigger para atualizar updated_at automaticamente na tabela empresas
CREATE TRIGGER update_empresas_updated_at
  BEFORE UPDATE ON public.empresas
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();