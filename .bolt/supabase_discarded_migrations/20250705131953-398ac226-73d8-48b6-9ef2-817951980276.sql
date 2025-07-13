-- Adicionar coluna updated_at na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN updated_at TIMESTAMP WITH TIME ZONE DEFAULT now();

-- Atualizar registros existentes
UPDATE public.usuarios 
SET updated_at = created_at 
WHERE updated_at IS NULL;

-- Tornar a coluna NOT NULL após atualizar os registros existentes
ALTER TABLE public.usuarios 
ALTER COLUMN updated_at SET NOT NULL;

-- Criar trigger para atualizar updated_at automaticamente
CREATE TRIGGER update_usuarios_updated_at
  BEFORE UPDATE ON public.usuarios
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();