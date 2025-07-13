/*
# Adiciona coluna descrição na tabela de notas fiscais
1. Nova Coluna: descricao (TEXT) na tabela notas_fiscais
2. Segurança: Mantém RLS habilitado
*/
ALTER TABLE notas_fiscais 
ADD COLUMN IF NOT EXISTS descricao TEXT;

-- Garantir que RLS permaneça habilitado
ALTER TABLE notas_fiscais ENABLE ROW LEVEL SECURITY;
