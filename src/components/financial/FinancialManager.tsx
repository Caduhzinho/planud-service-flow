
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { TrendingUp, TrendingDown, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface FinancialRecord {
  id: string;
  tipo: 'entrada' | 'saida';
  origem?: string;
  valor: number;
  categoria?: string;
  descricao?: string;
  data_lancamento: string;
  pago: boolean;
  recorrente: boolean;
}

export const FinancialManager = () => {
  const [records, setRecords] = useState<FinancialRecord[]>([]);
  const [filteredRecords, setFilteredRecords] = useState<FinancialRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [tipoFilter, setTipoFilter] = useState<string>('todos');
  const [pagoFilter, setPagoFilter] = useState<string>('todos');
  const { userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userData?.empresa_id) {
      fetchRecords();
    }
  }, [userData?.empresa_id]);

  useEffect(() => {
    applyFilters();
  }, [records, tipoFilter, pagoFilter]);

  const fetchRecords = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('financeiro')
        .select('*')
        .eq('empresa_id', userData?.empresa_id)
        .order('data_lancamento', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedData = (data || []).map(record => ({
        ...record,
        tipo: record.tipo as 'entrada' | 'saida',
        pago: record.pago ?? true,
        recorrente: record.recorrente ?? false
      }));
      
      setRecords(typedData);
    } catch (error) {
      console.error('Erro ao carregar registros financeiros:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar registros financeiros",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = records;

    if (tipoFilter !== 'todos') {
      filtered = filtered.filter(record => record.tipo === tipoFilter);
    }

    if (pagoFilter !== 'todos') {
      const isPaid = pagoFilter === 'pago';
      filtered = filtered.filter(record => record.pago === isPaid);
    }

    setFilteredRecords(filtered);
  };

  const getTipoBadge = (tipo: string) => {
    return tipo === 'entrada' ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-200">
        <TrendingUp className="h-3 w-3 mr-1" />
        Entrada
      </Badge>
    ) : (
      <Badge className="bg-red-100 text-red-800 hover:bg-red-200">
        <TrendingDown className="h-3 w-3 mr-1" />
        Saída
      </Badge>
    );
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando registros financeiros...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <CardTitle className="flex items-center gap-2">
            <Filter className="h-5 w-5" />
            Movimentações Financeiras
          </CardTitle>
          <div className="flex gap-2">
            <Select value={tipoFilter} onValueChange={setTipoFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="entrada">Entradas</SelectItem>
                <SelectItem value="saida">Saídas</SelectItem>
              </SelectContent>
            </Select>
            
            <Select value={pagoFilter} onValueChange={setPagoFilter}>
              <SelectTrigger className="w-[130px]">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                <SelectItem value="pago">Pagos</SelectItem>
                <SelectItem value="pendente">Pendentes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {filteredRecords.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhum registro encontrado
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo</TableHead>
                <TableHead>Descrição</TableHead>
                <TableHead>Categoria</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Origem</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRecords.map((record) => (
                <TableRow key={record.id}>
                  <TableCell>
                    {getTipoBadge(record.tipo)}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{record.descricao || '-'}</div>
                      {record.recorrente && (
                        <Badge variant="outline" className="text-xs mt-1">
                          Recorrente
                        </Badge>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    {record.categoria ? (
                      <Badge variant="secondary">{record.categoria}</Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <span className={record.tipo === 'entrada' ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>
                      {record.tipo === 'entrada' ? '+' : '-'} R$ {record.valor.toFixed(2).replace('.', ',')}
                    </span>
                  </TableCell>
                  <TableCell>
                    {new Date(record.data_lancamento).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    <Badge variant={record.pago ? 'default' : 'destructive'}>
                      {record.pago ? 'Pago' : 'Pendente'}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {record.origem ? (
                      <Badge variant="outline">{record.origem}</Badge>
                    ) : '-'}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
