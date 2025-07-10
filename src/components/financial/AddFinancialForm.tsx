import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useToast } from '@/hooks/use-toast';

interface AddFinancialFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const AddFinancialForm = ({ open, onOpenChange }: AddFinancialFormProps) => {
  const [tipo, setTipo] = useState<'entrada' | 'saida'>('entrada');
  const [valor, setValor] = useState('');
  const [categoria, setCategoria] = useState('');
  const [descricao, setDescricao] = useState('');
  const [origem, setOrigem] = useState('');
  const [dataLancamento, setDataLancamento] = useState(new Date().toISOString().split('T')[0]);
  const [pago, setPago] = useState(true);
  const [recorrente, setRecorrente] = useState(false);
  const [observacoes, setObservacoes] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { userData } = useAuth();
  const { toast } = useToast();

  const categorias = {
    entrada: ['Serviços', 'Vendas', 'Consultoria', 'Outros'],
    saida: ['Aluguel', 'Salários', 'Marketing', 'Equipamentos', 'Impostos', 'Outros']
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!valor || !descricao) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase
        .from('financeiro')
        .insert({
          empresa_id: userData?.empresa_id,
          tipo,
          valor: parseFloat(valor),
          categoria: categoria || null,
          descricao,
          origem: origem || null,
          data_lancamento: dataLancamento,
          pago,
          recorrente,
          observacoes: observacoes || null,
        });

      if (error) throw error;

      toast({
        title: "Sucesso",
        description: "Movimentação financeira adicionada com sucesso",
      });

      // Reset form
      setTipo('entrada');
      setValor('');
      setCategoria('');
      setDescricao('');
      setOrigem('');
      setDataLancamento(new Date().toISOString().split('T')[0]);
      setPago(true);
      setRecorrente(false);
      setObservacoes('');
      onOpenChange(false);
      
      // Refresh the parent component
      window.location.reload();
    } catch (error) {
      console.error('Erro ao adicionar movimentação:', error);
      toast({
        title: "Erro",
        description: "Erro ao adicionar movimentação financeira",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Nova Movimentação Financeira</DialogTitle>
          <DialogDescription>
            Adicione uma nova entrada ou saída financeira
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tipo">Tipo *</Label>
                <Select value={tipo} onValueChange={(value: 'entrada' | 'saida') => setTipo(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="entrada">Entrada</SelectItem>
                    <SelectItem value="saida">Saída</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="valor">Valor *</Label>
                <Input
                  id="valor"
                  type="number"
                  step="0.01"
                  min="0"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                  placeholder="0,00"
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição *</Label>
              <Input
                id="descricao"
                value={descricao}
                onChange={(e) => setDescricao(e.target.value)}
                placeholder="Descreva a movimentação"
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="categoria">Categoria</Label>
                <Select value={categoria} onValueChange={setCategoria}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {categorias[tipo].map((cat) => (
                      <SelectItem key={cat} value={cat}>
                        {cat}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="origem">Origem</Label>
                <Input
                  id="origem"
                  value={origem}
                  onChange={(e) => setOrigem(e.target.value)}
                  placeholder="Ex: Manual, Nota Fiscal"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="data">Data do Lançamento</Label>
              <Input
                id="data"
                type="date"
                value={dataLancamento}
                onChange={(e) => setDataLancamento(e.target.value)}
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <Switch
                  id="pago"
                  checked={pago}
                  onCheckedChange={setPago}
                />
                <Label htmlFor="pago">Pago</Label>
              </div>

              <div className="flex items-center space-x-2">
                <Switch
                  id="recorrente"
                  checked={recorrente}
                  onCheckedChange={setRecorrente}
                />
                <Label htmlFor="recorrente">Recorrente</Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="observacoes">Observações</Label>
              <Textarea
                id="observacoes"
                value={observacoes}
                onChange={(e) => setObservacoes(e.target.value)}
                placeholder="Observações adicionais"
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Salvar Movimentação'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
