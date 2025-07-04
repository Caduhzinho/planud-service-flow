-- Adicionar campos de aceite de termos na tabela usuarios
ALTER TABLE public.usuarios 
ADD COLUMN IF NOT EXISTS aceitou_termos BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS aceitou_privacidade BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_aceite_termos TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS data_aceite_privacidade TIMESTAMP WITH TIME ZONE;

-- Atualizar trigger para updated_at na tabela usuarios se não existir
CREATE OR REPLACE FUNCTION public.update_usuarios_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_usuarios_updated_at_trigger') THEN
    CREATE TRIGGER update_usuarios_updated_at_trigger
      BEFORE UPDATE ON public.usuarios
      FOR EACH ROW
      EXECUTE FUNCTION public.update_usuarios_updated_at();
  END IF;
END $$;