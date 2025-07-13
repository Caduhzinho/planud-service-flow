
-- First, drop the existing problematic policies that are causing recursion
DROP POLICY IF EXISTS "Usuários podem ver perfis da mesma empresa" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem ver seu próprio perfil" ON public.usuarios;
DROP POLICY IF EXISTS "Usuários podem atualizar seu próprio perfil" ON public.usuarios;

-- Create new, simpler policies for usuarios table
CREATE POLICY "Users can view their own profile" 
  ON public.usuarios 
  FOR SELECT 
  USING (id = auth.uid());

CREATE POLICY "Users can update their own profile" 
  ON public.usuarios 
  FOR UPDATE 
  USING (id = auth.uid());

-- Fix policies for agendamentos table
DROP POLICY IF EXISTS "Usuários podem ver agendamentos da sua empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Usuários podem inserir agendamentos na sua empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Usuários podem atualizar agendamentos da sua empresa" ON public.agendamentos;
DROP POLICY IF EXISTS "Usuários podem deletar agendamentos da sua empresa" ON public.agendamentos;

-- Create security definer function to avoid recursion
CREATE OR REPLACE FUNCTION public.get_user_empresa_id()
RETURNS UUID AS $$
  SELECT empresa_id FROM public.usuarios WHERE id = auth.uid();
$$ LANGUAGE SQL SECURITY DEFINER STABLE;

-- Create new policies for agendamentos using the security definer function
CREATE POLICY "Users can view appointments from their company" 
  ON public.agendamentos 
  FOR SELECT 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can insert appointments for their company" 
  ON public.agendamentos 
  FOR INSERT 
  WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can update appointments from their company" 
  ON public.agendamentos 
  FOR UPDATE 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can delete appointments from their company" 
  ON public.agendamentos 
  FOR DELETE 
  USING (empresa_id = public.get_user_empresa_id());

-- Fix policies for clientes table
DROP POLICY IF EXISTS "Usuários podem ver clientes da sua empresa" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem inserir clientes na sua empresa" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem atualizar clientes da sua empresa" ON public.clientes;
DROP POLICY IF EXISTS "Usuários podem deletar clientes da sua empresa" ON public.clientes;

-- Create new policies for clientes using the security definer function
CREATE POLICY "Users can view clients from their company" 
  ON public.clientes 
  FOR SELECT 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can insert clients for their company" 
  ON public.clientes 
  FOR INSERT 
  WITH CHECK (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can update clients from their company" 
  ON public.clientes 
  FOR UPDATE 
  USING (empresa_id = public.get_user_empresa_id());

CREATE POLICY "Users can delete clients from their company" 
  ON public.clientes 
  FOR DELETE 
  USING (empresa_id = public.get_user_empresa_id());
