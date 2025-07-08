import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Download, Send } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

interface InvoiceReceiptProps {
  invoice: {
    id: string;
    codigo_nf?: string;
    cliente_id: string;
    valor: number;
    descricao?: string;
    forma_pagamento?: string;
    data_emissao: string;
    clientes?: {
      nome: string;
      telefone: string;
      email?: string;
      endereco?: string;
    };
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const InvoiceReceipt = ({ invoice, open, onOpenChange }: InvoiceReceiptProps) => {
  const [companyData, setCompanyData] = useState<any>(null);
  const [companyLogo, setCompanyLogo] = useState<string | null>(null);
  const { userData } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (open && userData?.empresa_id) {
      fetchCompanyData();
    }
  }, [open, userData?.empresa_id]);

  const fetchCompanyData = async () => {
    try {
      // Buscar dados da empresa
      const { data: empresa, error: empresaError } = await supabase
        .from('empresas')
        .select('*')
        .eq('id', userData?.empresa_id)
        .single();

      if (empresaError) throw empresaError;

      // Buscar configurações (logo)
      const { data: config, error: configError } = await supabase
        .from('configuracoes')
        .select('logo_url')
        .eq('empresa_id', userData?.empresa_id)
        .single();

      setCompanyData(empresa);
      setCompanyLogo(config?.logo_url || null);
    } catch (error) {
      console.error('Erro ao carregar dados da empresa:', error);
    }
  };

  const generatePDF = () => {
    const printContent = document.getElementById('invoice-content');
    if (!printContent) return;

    const originalContents = document.body.innerHTML;
    const printContents = printContent.innerHTML;

    document.body.innerHTML = `
      <html>
        <head>
          <title>Nota de Serviço ${invoice.codigo_nf}</title>
          <style>
            body { font-family: Arial, sans-serif; margin: 0; padding: 20px; }
            .header { text-align: center; border-bottom: 2px solid #333; padding-bottom: 20px; margin-bottom: 30px; }
            .logo { max-width: 150px; max-height: 80px; margin-bottom: 10px; }
            .company-info { margin-bottom: 20px; }
            .invoice-details { margin: 20px 0; }
            .footer { margin-top: 40px; text-align: center; font-size: 12px; color: #666; }
            table { width: 100%; border-collapse: collapse; margin: 20px 0; }
            th, td { padding: 10px; text-align: left; border-bottom: 1px solid #ddd; }
            .total { font-weight: bold; font-size: 18px; }
            @media print {
              body { margin: 0; }
              .no-print { display: none; }
            }
          </style>
        </head>
        <body onload="window.print(); window.close();">
          ${printContents}
        </body>
      </html>
    `;

    window.print();
    document.body.innerHTML = originalContents;
    window.location.reload();
  };

  const sendWhatsApp = () => {
    if (!invoice.clientes?.telefone) {
      toast({
        title: "Erro",
        description: "Cliente não possui telefone cadastrado",
        variant: "destructive",
      });
      return;
    }

    const message = `Olá ${invoice.clientes.nome}!\n\nSegue sua nota de serviço:\n\n📋 Nota: ${invoice.codigo_nf || 'N/A'}\n💼 Serviço: ${invoice.descricao || 'Serviço prestado'}\n💰 Valor: R$ ${invoice.valor.toFixed(2).replace('.', ',')}\n💳 Pagamento: ${(invoice.forma_pagamento || 'não informado').toUpperCase()}\n📅 Data: ${format(new Date(invoice.data_emissao), 'dd/MM/yyyy', { locale: ptBR })}\n\nObrigado pela confiança!`;
    
    const phone = invoice.clientes.telefone.replace(/\D/g, '');
    const whatsappUrl = `https://wa.me/55${phone}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, '_blank');
    
    toast({
      title: "WhatsApp aberto",
      description: "Mensagem preparada para envio",
    });
  };

  if (!invoice || !companyData) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Nota de Serviço {invoice.codigo_nf || 'N/A'}</DialogTitle>
        </DialogHeader>
        
        <div id="invoice-content" className="p-6 bg-white">
          {/* Cabeçalho com Logo */}
          <div className="text-center border-b-2 border-gray-300 pb-6 mb-8">
            {companyLogo && (
              <img 
                src={companyLogo} 
                alt="Logo da empresa" 
                className="mx-auto mb-4 max-w-[150px] max-h-[80px] object-contain"
              />
            )}
            <h1 className="text-2xl font-bold text-gray-800">NOTA DE SERVIÇO</h1>
            <p className="text-lg font-semibold text-gray-600">Nº {invoice.codigo_nf || 'N/A'}</p>
          </div>

          {/* Dados da Empresa */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Prestador de Serviços</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-lg">{companyData.nome}</p>
              {companyData.cnpj && (
                <p><strong>CNPJ:</strong> {companyData.cnpj}</p>
              )}
              {companyData.endereco && (
                <p><strong>Endereço:</strong> {companyData.endereco}</p>
              )}
              {companyData.cidade && (
                <p><strong>Cidade:</strong> {companyData.cidade}</p>
              )}
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Tomador de Serviços</h2>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="font-semibold text-lg">{invoice.clientes?.nome}</p>
              <p><strong>Telefone:</strong> {invoice.clientes?.telefone}</p>
              {invoice.clientes?.email && (
                <p><strong>E-mail:</strong> {invoice.clientes.email}</p>
              )}
              {invoice.clientes?.endereco && (
                <p><strong>Endereço:</strong> {invoice.clientes.endereco}</p>
              )}
            </div>
          </div>

          {/* Detalhes do Serviço */}
          <div className="mb-8">
            <h2 className="text-lg font-semibold mb-3 text-gray-800">Discriminação dos Serviços</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left">Descrição</th>
                  <th className="border border-gray-300 p-3 text-right">Valor</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-gray-300 p-3">{invoice.descricao || 'Serviço prestado'}</td>
                  <td className="border border-gray-300 p-3 text-right font-semibold">
                    R$ {invoice.valor.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              </tbody>
              <tfoot>
                <tr className="bg-gray-100">
                  <td className="border border-gray-300 p-3 font-bold">TOTAL</td>
                  <td className="border border-gray-300 p-3 text-right font-bold text-lg">
                    R$ {invoice.valor.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Informações Adicionais */}
          <div className="mb-8">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <p><strong>Forma de Pagamento:</strong> {(invoice.forma_pagamento || 'Não informado').toUpperCase()}</p>
                <p><strong>Data de Emissão:</strong> {format(new Date(invoice.data_emissao), 'dd/MM/yyyy', { locale: ptBR })}</p>
              </div>
            </div>
          </div>

          {/* Rodapé */}
          <div className="text-center text-sm text-gray-600 mt-8 pt-4 border-t border-gray-300">
            <p>Esta é uma nota de serviço simples e não possui valor fiscal.</p>
            <p>Emitida em {format(new Date(), 'dd/MM/yyyy \'às\' HH:mm', { locale: ptBR })}</p>
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button variant="outline" onClick={sendWhatsApp} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviar WhatsApp
          </Button>
          <Button onClick={generatePDF} className="flex items-center gap-2">
            <Download className="h-4 w-4" />
            Gerar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};