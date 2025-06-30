import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { FileText, Send, Download, Eye, X, Filter } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { InvoiceDetailsModal } from './InvoiceDetailsModal';

interface Invoice {
  id: string;
  cliente_id: string;
  agendamento_id?: string;
  valor: number;
  descricao?: string;
  status: 'gerado' | 'enviado' | 'pendente' | 'cancelado';
  codigo_nf?: string;
  data_emissao: string;
  forma_pagamento?: string;
  link_pagamento?: string;
  enviada: boolean;
  clientes?: {
    nome: string;
    telefone: string;
  };
}

export const InvoicesManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [filteredInvoices, setFilteredInvoices] = useState<Invoice[]>([]);
  const [selectedInvoice, setSelectedInvoice] = useState<Invoice | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<string>('todos');
  const [clientFilter, setClientFilter] = useState<string>('todos');
  const { userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userData?.empresa_id) {
      fetchInvoices();
    }
  }, [userData?.empresa_id]);

  useEffect(() => {
    applyFilters();
  }, [invoices, statusFilter, clientFilter]);

  const fetchInvoices = async () => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase
        .from('notas_fiscais')
        .select(`
          *,
          clientes (
            nome,
            telefone
          )
        `)
        .eq('empresa_id', userData?.empresa_id)
        .order('data_emissao', { ascending: false });

      if (error) throw error;
      
      // Type assertion to ensure proper typing
      const typedData = (data || []).map(invoice => ({
        ...invoice,
        status: invoice.status as 'gerado' | 'enviado' | 'pendente' | 'cancelado',
        enviada: invoice.enviada ?? false
      }));
      
      setInvoices(typedData);
    } catch (error) {
      console.error('Erro ao carregar notas fiscais:', error);
      toast({
        title: "Erro",
        description: "Erro ao carregar notas fiscais",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = invoices;

    if (statusFilter !== 'todos') {
      filtered = filtered.filter(invoice => invoice.status === statusFilter);
    }

    if (clientFilter !== 'todos') {
      filtered = filtered.filter(invoice => invoice.cliente_id === clientFilter);
    }

    setFilteredInvoices(filtered);
  };

  const getStatusBadge = (status: string, enviada: boolean) => {
    const colors = {
      gerado: 'bg-gray-100 text-gray-800',
      enviado: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800'
    };

    const labels = {
      gerado: 'Gerada',
      enviado: enviada ? 'Enviada' : 'Gerada',
      pendente: 'Pendente',
      cancelado: 'Cancelada'
    };

    return (
      <Badge className={colors[status as keyof typeof colors]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleViewInvoice = (invoice: Invoice) => {
    setSelectedInvoice(invoice);
    setShowDetailsModal(true);
  };

  const handleSendInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('notas_fiscais')
        .update({ enviada: true, status: 'enviado' })
        .eq('id', invoiceId);

      if (error) throw error;

      toast({
        title: "Nota fiscal enviada",
        description: "Nota fiscal marcada como enviada com sucesso",
      });
      
      fetchInvoices();
    } catch (error) {
      console.error('Erro ao enviar nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao enviar nota fiscal",
        variant: "destructive",
      });
    }
  };

  const handleCancelInvoice = async (invoiceId: string) => {
    try {
      const { error } = await supabase
        .from('notas_fiscais')
        .update({ status: 'cancelado' })
        .eq('id', invoiceId);

      if (error) throw error;

      toast({
        title: "Nota fiscal cancelada",
        description: "Nota fiscal cancelada com sucesso",
      });
      
      fetchInvoices();
    } catch (error) {
      console.error('Erro ao cancelar nota fiscal:', error);
      toast({
        title: "Erro",
        description: "Erro ao cancelar nota fiscal",
        variant: "destructive",
      });
    }
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    // Placeholder para download do PDF
    toast({
      title: "Download iniciado",
      description: "Geração de PDF será implementada em breve",
    });
  };

  const getUniqueClients = () => {
    const clients = invoices.map(invoice => ({
      id: invoice.cliente_id,
      nome: invoice.clientes?.nome || 'Cliente sem nome'
    }));
    
    return clients.filter((client, index, self) => 
      index === self.findIndex(c => c.id === client.id)
    );
  };

  const getStats = () => {
    const geradas = invoices.filter(i => i.status === 'gerado').length;
    const pendentes = invoices.filter(i => i.status === 'pendente').length;
    const enviadas = invoices.filter(i => i.status === 'enviado').length;
    const canceladas = invoices.filter(i => i.status === 'cancelado').length;
    const valorTotal = invoices.reduce((sum, i) => sum + i.valor, 0);

    return { geradas, pendentes, enviadas, canceladas, valorTotal };
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando notas fiscais...</div>;
  }

  const stats = getStats();
  const uniqueClients = getUniqueClients();

  return (
    <div className="space-y-6">
      {/* Cards de Estatísticas */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Notas Geradas</p>
                <p className="text-2xl font-bold">{stats.geradas}</p>
              </div>
              <FileText className="h-8 w-8 text-gray-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-yellow-600">Pendentes</p>
                <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
              </div>
              <div className="h-8 w-8 bg-yellow-100 rounded-full flex items-center justify-center">
                <span className="text-yellow-600 font-bold">!</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-green-600">Enviadas</p>
                <p className="text-2xl font-bold text-green-600">{stats.enviadas}</p>
              </div>
              <div className="h-8 w-8 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-green-600 font-bold">✓</span>
              </div>
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-red-600">Canceladas</p>
                <p className="text-2xl font-bold text-red-600">{stats.canceladas}</p>
              </div>
              <X className="h-8 w-8 text-red-500" />
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-blue-600">Valor Total</p>
                <p className="text-2xl font-bold text-blue-600">
                  R$ {stats.valorTotal.toFixed(2).replace('.', ',')}
                </p>
              </div>
              <div className="h-8 w-8 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-blue-600 font-bold">$</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabela de Notas Fiscais */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Notas Fiscais
            </CardTitle>
            <div className="flex gap-2">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[130px]">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="gerado">Geradas</SelectItem>
                  <SelectItem value="pendente">Pendentes</SelectItem>
                  <SelectItem value="enviado">Enviadas</SelectItem>
                  <SelectItem value="cancelado">Canceladas</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={clientFilter} onValueChange={setClientFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Cliente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os clientes</SelectItem>
                  {uniqueClients.map((client) => (
                    <SelectItem key={client.id} value={client.id}>
                      {client.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {filteredInvoices.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              Nenhuma nota fiscal encontrada
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>N° Nota</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Valor</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Pagamento</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvoices.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell>
                      <div className="font-mono text-sm">
                        {invoice.codigo_nf || `#${invoice.id.slice(0, 6).toUpperCase()}`}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div>
                        <div className="font-medium">{invoice.clientes?.nome}</div>
                        <div className="text-sm text-gray-500">{invoice.clientes?.telefone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="max-w-xs truncate">
                        {invoice.descricao || 'Sem descrição'}
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="font-semibold">
                        R$ {invoice.valor.toFixed(2).replace('.', ',')}
                      </span>
                    </TableCell>
                    <TableCell>
                      {getStatusBadge(invoice.status, invoice.enviada)}
                    </TableCell>
                    <TableCell>
                      {new Date(invoice.data_emissao).toLocaleDateString('pt-BR')}
                    </TableCell>
                    <TableCell>
                      {invoice.forma_pagamento ? (
                        <Badge variant="outline" className="text-xs">
                          {invoice.forma_pagamento.toUpperCase()}
                        </Badge>
                      ) : (
                        <span className="text-gray-400">-</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <div className="flex gap-1">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleViewInvoice(invoice)}
                          title="Ver detalhes"
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleDownloadPDF(invoice.id)}
                          title="Baixar PDF"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleSendInvoice(invoice.id)}
                          disabled={invoice.status === 'cancelado'}
                          title="Enviar via WhatsApp"
                        >
                          <Send className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleCancelInvoice(invoice.id)}
                          disabled={invoice.status === 'cancelado'}
                          title="Cancelar nota"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      <InvoiceDetailsModal
        invoice={selectedInvoice}
        open={showDetailsModal}
        onOpenChange={setShowDetailsModal}
        onSend={handleSendInvoice}
        onDownload={handleDownloadPDF}
      />
    </div>
  );
};
