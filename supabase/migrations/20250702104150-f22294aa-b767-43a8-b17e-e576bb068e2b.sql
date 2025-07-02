-- Adicionar campos para conformidade de privacidade e CNPJ
ALTER TABLE public.empresas 
ADD COLUMN IF NOT EXISTS cnpj TEXT,
ADD COLUMN IF NOT EXISTS aceita_privacidade BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS data_aceite_privacidade TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS cidade TEXT,
ADD COLUMN IF NOT EXISTS endereco TEXT;

-- Criar índice para CNPJ para consultas rápidas
CREATE INDEX IF NOT EXISTS idx_empresas_cnpj ON public.empresas(cnpj);

-- Função para validar CNPJ (apenas formato básico)
CREATE OR REPLACE FUNCTION public.validar_cnpj(cnpj_input TEXT)
RETURNS BOOLEAN AS $$
BEGIN
  -- Remove caracteres não numéricos
  cnpj_input := regexp_replace(cnpj_input, '[^0-9]', '', 'g');
  
  -- Verifica se tem 14 dígitos
  IF length(cnpj_input) != 14 THEN
    RETURN false;
  END IF;
  
  -- Verifica se não é uma sequência de números iguais
  IF cnpj_input IN ('00000000000000', '11111111111111', '22222222222222', 
                    '33333333333333', '44444444444444', '55555555555555',
                    '66666666666666', '77777777777777', '88888888888888', 
                    '99999999999999') THEN
    RETURN false;
  END IF;
  
  RETURN true;
END;
$$ LANGUAGE plpgsql;

-- Adicionar constraint para validar CNPJ quando preenchido
ALTER TABLE public.empresas 
ADD CONSTRAINT check_cnpj_valido 
CHECK (cnpj IS NULL OR validar_cnpj(cnpj));

-- Atualizar trigger para updated_at na tabela empresas se não existir
CREATE OR REPLACE FUNCTION public.update_empresas_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Criar trigger se não existir
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'update_empresas_updated_at_trigger') THEN
    CREATE TRIGGER update_empresas_updated_at_trigger
      BEFORE UPDATE ON public.empresas
      FOR EACH ROW
      EXECUTE FUNCTION public.update_empresas_updated_at();
  END IF;
END $$;