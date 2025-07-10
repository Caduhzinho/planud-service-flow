import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Download, Send, Printer } from 'lucide-react';
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

    // Criar uma nova janela para impressão
    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast({
        title: "Erro",
        description: "Não foi possível abrir a janela de impressão. Verifique se o bloqueador de pop-ups está desabilitado.",
        variant: "destructive",
      });
      return;
    }

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Nota de Serviço ${invoice.codigo_nf || 'N/A'}</title>
          <meta charset="utf-8">
          <style>
            * { margin: 0; padding: 0; box-sizing: border-box; }
            body { 
              font-family: 'Arial', sans-serif; 
              line-height: 1.6; 
              color: #333;
              background: white;
            }
            .container { max-width: 800px; margin: 0 auto; padding: 20px; }
            .header { 
              text-align: center; 
              border-bottom: 3px solid #4f46e5; 
              padding-bottom: 20px; 
              margin-bottom: 30px; 
            }
            .logo { 
              max-width: 150px; 
              max-height: 80px; 
              margin-bottom: 15px;
              object-fit: contain;
            }
            .company-title { 
              font-size: 28px; 
              font-weight: bold; 
              color: #4f46e5; 
              margin-bottom: 5px;
            }
            .invoice-number { 
              font-size: 18px; 
              color: #666; 
              font-weight: 600;
            }
            .section { 
              margin-bottom: 25px; 
              background: #f8fafc;
              padding: 15px;
              border-radius: 8px;
              border-left: 4px solid #4f46e5;
            }
            .section-title { 
              font-size: 16px; 
              font-weight: bold; 
              color: #1e293b; 
              margin-bottom: 10px;
              display: flex;
              align-items: center;
            }
            .section-content { 
              background: white;
              padding: 12px;
              border-radius: 6px;
            }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 15px 0;
              background: white;
              border-radius: 8px;
              overflow: hidden;
              box-shadow: 0 1px 3px rgba(0,0,0,0.1);
            }
            th, td { 
              padding: 12px 15px; 
              text-align: left; 
              border-bottom: 1px solid #e2e8f0; 
            }
            th { 
              background: #f1f5f9; 
              font-weight: 600;
              color: #475569;
            }
            .total-row { 
              background: #4f46e5; 
              color: white; 
              font-weight: bold; 
              font-size: 18px;
            }
            .footer { 
              margin-top: 40px; 
              text-align: center; 
              font-size: 12px; 
              color: #64748b;
              border-top: 1px solid #e2e8f0;
              padding-top: 20px;
            }
            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 15px;
              margin-top: 10px;
            }
            .info-item {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              border-bottom: 1px solid #e2e8f0;
            }
            .info-label {
              font-weight: 600;
              color: #475569;
            }
            .info-value {
              color: #1e293b;
            }
            @media print {
              body { margin: 0; }
              .container { padding: 10px; }
              .no-print { display: none !important; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            ${printContent.innerHTML}
          </div>
          <script>
            window.onload = function() {
              window.print();
              window.onafterprint = function() {
                window.close();
              };
            };
          </script>
        </body>
      </html>
    `);
    
    printWindow.document.close();
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
          <div className="header text-center border-b-3 border-indigo-600 pb-6 mb-8">
            {companyLogo && (
              <img 
                src={companyLogo} 
                alt="Logo da empresa" 
                className="logo mx-auto mb-4 max-w-[150px] max-h-[80px] object-contain"
              />
            )}
            <h1 className="company-title text-3xl font-bold text-indigo-600">NOTA DE SERVIÇO</h1>
            <p className="invoice-number text-lg font-semibold text-gray-600">Nº {invoice.codigo_nf || 'N/A'}</p>
          </div>

          {/* Dados da Empresa */}
          <div className="section mb-8">
            <h2 className="section-title text-lg font-semibold mb-3 text-gray-800">🏢 Prestador de Serviços</h2>
            <div className="section-content bg-white p-4 rounded-lg">
              <p className="font-semibold text-lg">{companyData.nome}</p>
              {companyData.cnpj && (
                <div className="info-item">
                  <span className="info-label">CNPJ:</span>
                  <span className="info-value">{companyData.cnpj}</span>
                </div>
              )}
              {companyData.endereco && (
                <div className="info-item">
                  <span className="info-label">Endereço:</span>
                  <span className="info-value">{companyData.endereco}</span>
                </div>
              )}
              {companyData.cidade && (
                <div className="info-item">
                  <span className="info-label">Cidade:</span>
                  <span className="info-value">{companyData.cidade}</span>
                </div>
              )}
            </div>
          </div>

          {/* Dados do Cliente */}
          <div className="section mb-8">
            <h2 className="section-title text-lg font-semibold mb-3 text-gray-800">👤 Tomador de Serviços</h2>
            <div className="section-content bg-white p-4 rounded-lg">
              <p className="font-semibold text-lg">{invoice.clientes?.nome}</p>
              <div className="info-item">
                <span className="info-label">Telefone:</span>
                <span className="info-value">{invoice.clientes?.telefone}</span>
              </div>
              {invoice.clientes?.email && (
                <div className="info-item">
                  <span className="info-label">E-mail:</span>
                  <span className="info-value">{invoice.clientes.email}</span>
                </div>
              )}
              {invoice.clientes?.endereco && (
                <div className="info-item">
                  <span className="info-label">Endereço:</span>
                  <span className="info-value">{invoice.clientes.endereco}</span>
                </div>
              )}
            </div>
          </div>

          {/* Detalhes do Serviço */}
          <div className="section mb-8">
            <h2 className="section-title text-lg font-semibold mb-3 text-gray-800">📋 Discriminação dos Serviços</h2>
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-50">
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
                <tr className="total-row bg-indigo-600 text-white">
                  <td className="border border-gray-300 p-3 font-bold text-white">TOTAL</td>
                  <td className="border border-gray-300 p-3 text-right font-bold text-lg text-white">
                    R$ {invoice.valor.toFixed(2).replace('.', ',')}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>

          {/* Informações Adicionais */}
          <div className="section mb-8">
            <h2 className="section-title text-lg font-semibold mb-3 text-gray-800">💳 Informações de Pagamento</h2>
            <div className="section-content">
              <div className="info-grid grid grid-cols-2 gap-4">
                <div className="info-item">
                  <span className="info-label">Forma de Pagamento:</span>
                  <span className="info-value">{(invoice.forma_pagamento || 'Não informado').toUpperCase()}</span>
                </div>
                <div className="info-item">
                  <span className="info-label">Data de Emissão:</span>
                  <span className="info-value">{format(new Date(invoice.data_emissao), 'dd/MM/yyyy', { locale: ptBR })}</span>
                </div>
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
          <Button variant="outline" onClick={generatePDF} className="flex items-center gap-2">
            <Printer className="h-4 w-4" />
            Imprimir
          </Button>
          <Button variant="outline" onClick={sendWhatsApp} className="flex items-center gap-2">
            <Send className="h-4 w-4" />
            Enviar WhatsApp
          </Button>
          <Button onClick={generatePDF} className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700">
            <Download className="h-4 w-4" />
            Gerar PDF
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};