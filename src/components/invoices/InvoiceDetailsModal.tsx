import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, Download, Send, Calendar, User, CreditCard } from 'lucide-react';

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

interface InvoiceDetailsModalProps {
  invoice: Invoice | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSend: (invoiceId: string) => void;
  onDownload: (invoiceId: string) => void;
}

export const InvoiceDetailsModal = ({ 
  invoice, 
  open, 
  onOpenChange, 
  onSend, 
  onDownload 
}: InvoiceDetailsModalProps) => {
  if (!invoice) return null;

  const getStatusBadge = (status: string) => {
    const variants = {
      gerado: 'bg-gray-100 text-gray-800',
      enviado: 'bg-green-100 text-green-800',
      pendente: 'bg-yellow-100 text-yellow-800',
      cancelado: 'bg-red-100 text-red-800'
    };

    const labels = {
      gerado: 'Gerada',
      enviado: 'Enviada',
      pendente: 'Pendente',
      cancelado: 'Cancelada'
    };

    return (
      <Badge className={variants[status as keyof typeof variants]}>
        {labels[status as keyof typeof labels]}
      </Badge>
    );
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            Detalhes da Nota Fiscal
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Cabeçalho da Nota */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-lg font-semibold">
                  {invoice.codigo_nf || `#${invoice.id.slice(0, 6).toUpperCase()}`}
                </h3>
                <p className="text-sm text-gray-600">
                  Emitida em {new Date(invoice.data_emissao).toLocaleDateString('pt-BR')}
                </p>
              </div>
              {getStatusBadge(invoice.status)}
            </div>
          </div>

          {/* Informações do Cliente */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <User className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Cliente</span>
            </div>
            <div className="bg-white border rounded-lg p-3">
              <p className="font-medium">{invoice.clientes?.nome}</p>
              <p className="text-sm text-gray-600">{invoice.clientes?.telefone}</p>
            </div>
          </div>

          {/* Descrição do Serviço */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="font-medium">Descrição do Serviço</span>
            </div>
            <div className="bg-white border rounded-lg p-3">
              <p>{invoice.descricao || 'Sem descrição'}</p>
            </div>
          </div>

          {/* Valor e Pagamento */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Valor Total</span>
              <div className="text-2xl font-bold text-green-600">
                R$ {invoice.valor.toFixed(2).replace('.', ',')}
              </div>
            </div>
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Forma de Pagamento</span>
              <div className="flex items-center gap-2">
                <CreditCard className="h-4 w-4 text-gray-500" />
                <span className="capitalize">
                  {invoice.forma_pagamento || 'Não definida'}
                </span>
              </div>
            </div>
          </div>

          {/* Data de Emissão */}
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-600">Data de Emissão</span>
            </div>
            <div>
              {new Date(invoice.data_emissao).toLocaleDateString('pt-BR', {
                weekday: 'long',
                year: 'numeric',
                month: 'long',
                day: 'numeric'
              })}
            </div>
          </div>

          {/* Link de Pagamento */}
          {invoice.link_pagamento && (
            <div className="space-y-2">
              <span className="text-sm font-medium text-gray-600">Link de Pagamento</span>
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <a 
                  href={invoice.link_pagamento} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-blue-600 hover:underline text-sm break-all"
                >
                  {invoice.link_pagamento}
                </a>
              </div>
            </div>
          )}

          {/* Ações */}
          <div className="flex gap-2 pt-4 border-t">
            <Button
              onClick={() => onDownload(invoice.id)}
              variant="outline"
              className="flex-1"
            >
              <Download className="h-4 w-4 mr-2" />
              Baixar PDF
            </Button>
            <Button
              onClick={() => onSend(invoice.id)}
              disabled={invoice.status === 'cancelado'}
              className="flex-1"
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar WhatsApp
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
