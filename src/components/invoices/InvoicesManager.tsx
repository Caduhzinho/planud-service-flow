
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { FileText, Send, Download, Eye } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Invoice {
  id: string;
  cliente_id: string;
  agendamento_id?: string;
  valor: number;
  status: 'gerado' | 'enviado' | 'pendente' | 'cancelado';
  codigo_nf?: string;
  data_emissao: string;
  forma_pagamento?: string;
  enviada: boolean;
  clientes?: {
    nome: string;
    telefone: string;
  };
}

export const InvoicesManager = () => {
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (userData?.empresa_id) {
      fetchInvoices();
    }
  }, [userData?.empresa_id]);

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
      setInvoices(data || []);
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

  const getStatusBadge = (status: string, enviada: boolean) => {
    const variants = {
      gerado: 'secondary',
      enviado: 'default',
      pendente: 'destructive',
      cancelado: 'outline'
    } as const;

    const labels = {
      gerado: 'Gerada',
      enviado: enviada ? 'Enviada' : 'Gerada',
      pendente: 'Pendente',
      cancelado: 'Cancelada'
    };

    return (
      <Badge variant={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  const handleSendInvoice = async (invoiceId: string) => {
    // Placeholder para envio via WhatsApp
    toast({
      title: "Nota fiscal enviada",
      description: "Funcionalidade de envio será implementada em breve",
    });
  };

  const handleDownloadPDF = async (invoiceId: string) => {
    // Placeholder para download do PDF
    toast({
      title: "Download iniciado",
      description: "Geração de PDF será implementada em breve",
    });
  };

  if (isLoading) {
    return <div className="flex justify-center p-8">Carregando notas fiscais...</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          Notas Fiscais
        </CardTitle>
      </CardHeader>
      <CardContent>
        {invoices.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            Nenhuma nota fiscal encontrada
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Código</TableHead>
                <TableHead>Cliente</TableHead>
                <TableHead>Valor</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Data</TableHead>
                <TableHead>Pagamento</TableHead>
                <TableHead>Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices.map((invoice) => (
                <TableRow key={invoice.id}>
                  <TableCell>
                    {invoice.codigo_nf || `NF-${invoice.id.slice(0, 8)}`}
                  </TableCell>
                  <TableCell>
                    <div>
                      <div className="font-medium">{invoice.clientes?.nome}</div>
                      <div className="text-sm text-gray-500">{invoice.clientes?.telefone}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    R$ {invoice.valor.toFixed(2).replace('.', ',')}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(invoice.status, invoice.enviada)}
                  </TableCell>
                  <TableCell>
                    {new Date(invoice.data_emissao).toLocaleDateString('pt-BR')}
                  </TableCell>
                  <TableCell>
                    {invoice.forma_pagamento ? (
                      <Badge variant="outline">
                        {invoice.forma_pagamento.toUpperCase()}
                      </Badge>
                    ) : '-'}
                  </TableCell>
                  <TableCell>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDownloadPDF(invoice.id)}
                      >
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleSendInvoice(invoice.id)}
                      >
                        <Send className="h-4 w-4" />
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
  );
};
