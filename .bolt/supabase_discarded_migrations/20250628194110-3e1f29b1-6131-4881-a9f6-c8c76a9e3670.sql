
-- Criar tabela de empresas
CREATE TABLE public.empresas (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  nome TEXT NOT NULL,
  ramo TEXT NOT NULL,
  plano TEXT NOT NULL CHECK (plano IN ('Básico', 'Intermediário', 'Pro')),
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Criar tabela de usuários (profiles)
CREATE TABLE public.usuarios (
  id UUID NOT NULL REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY,
  nome TEXT NOT NULL,
  email TEXT NOT NULL UNIQUE,
  empresa_id UUID NOT NULL REFERENCES public.empresas(id) ON DELETE CASCADE,
  tipo TEXT NOT NULL DEFAULT 'admin',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Habilitar RLS (Row Level Security)
ALTER TABLE public.empresas ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.usuarios ENABLE ROW LEVEL SECURITY;

-- Políticas para empresas
CREATE POLICY "Usuários podem ver sua própria empresa" 
  ON public.empresas 
  FOR SELECT 
  USING (id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem atualizar sua própria empresa" 
  ON public.empresas 
  FOR UPDATE 
  USING (id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

-- Políticas para usuários
CREATE POLICY "Usuários podem ver perfis da mesma empresa" 
  ON public.usuarios 
  FOR SELECT 
  USING (empresa_id IN (SELECT empresa_id FROM public.usuarios WHERE id = auth.uid()));

CREATE POLICY "Usuários podem ver seu próprio perfil" 
  ON public.usuarios 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Usuários podem atualizar seu próprio perfil" 
  ON public.usuarios 
  FOR UPDATE 
  USING (id = auth.uid());

-- Política para inserir novos usuários (necessário para o registro)
CREATE POLICY "Permitir inserção de novos usuários" 
  ON public.usuarios 
  FOR INSERT 
  WITH CHECK (true);

-- Política para inserir novas empresas (necessário para o registro)
CREATE POLICY "Permitir inserção de novas empresas" 
  ON public.empresas 
  FOR INSERT 
  WITH CHECK (true);

-- Função para criar usuário automaticamente após signup
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = ''
AS $$
DECLARE
  empresa_id_var UUID;
BEGIN
  -- Extrair dados do metadata
  IF NEW.raw_user_meta_data IS NOT NULL THEN
    -- Primeiro criar a empresa se os dados estão no metadata
    IF NEW.raw_user_meta_data ->> 'empresa_nome' IS NOT NULL THEN
      INSERT INTO public.empresas (nome, ramo, plano)
      VALUES (
        NEW.raw_user_meta_data ->> 'empresa_nome',
        NEW.raw_user_meta_data ->> 'empresa_ramo',
        NEW.raw_user_meta_data ->> 'empresa_plano'
      )
      RETURNING id INTO empresa_id_var;
      
      -- Depois criar o usuário
      INSERT INTO public.usuarios (id, nome, email, empresa_id, tipo)
      VALUES (
        NEW.id,
        COALESCE(NEW.raw_user_meta_data ->> 'nome', split_part(NEW.email, '@', 1)),
        NEW.email,
        empresa_id_var,
        'admin'
      );
    END IF;
  END IF;
  
  RETURN NEW;
END;
$$;

-- Trigger para executar a função após criação de usuário
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user();
