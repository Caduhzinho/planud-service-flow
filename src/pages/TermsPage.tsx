import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, FileText, CreditCard, AlertTriangle, Gavel } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const TermsPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          
          <div className="flex items-center gap-3 mb-2">
            <FileText className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Termos de Uso</h1>
          </div>
          <p className="text-muted-foreground">
            Última atualização: Julho de 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>1. Aceitação dos Termos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Ao acessar e utilizar o Planud, você concorda em cumprir estes Termos de Uso e nossa 
                Política de Privacidade. Se você não concorda com qualquer parte destes termos, 
                não deve utilizar nossos serviços.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>2. Descrição do Serviço</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  O Planud é uma plataforma de gestão empresarial que oferece:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Sistema de agendamentos e gestão de clientes</li>
                  <li>Controle financeiro e emissão de notas fiscais</li>
                  <li>Relatórios e dashboards gerenciais</li>
                  <li>Integração com meios de pagamento</li>
                  <li>Automações via WhatsApp e email</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>3. Cadastro e Responsabilidades</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Informações Precisas:</h4>
                  <p className="text-muted-foreground">
                    Você se compromete a fornecer informações verdadeiras, precisas e atualizadas 
                    durante o cadastro e uso da plataforma.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Segurança da Conta:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Manter a confidencialidade dos dados de acesso</li>
                    <li>Notificar imediatamente sobre uso não autorizado</li>
                    <li>Não compartilhar credenciais com terceiros</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="h-5 w-5" />
                4. Planos e Pagamentos
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-semibold mb-2">Planos Disponíveis:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li><strong>Gratuito:</strong> Funcionalidades básicas com limitações</li>
                    <li><strong>Intermediário:</strong> Recursos avançados com limites ampliados</li>
                    <li><strong>Profissional:</strong> Acesso completo e suporte prioritário</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Cobrança:</h4>
                  <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                    <li>Pagamentos processados via ASAAS (PIX, boleto, cartão)</li>
                    <li>Cobrança mensal antecipada</li>
                    <li>Cancelamento pode ser feito a qualquer momento</li>
                    <li>Não há reembolso de períodos já pagos</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Notas Fiscais e CNPJ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground">
                  A emissão de notas fiscais de serviço (NFS-e) está condicionada ao cadastro 
                  de um CNPJ válido na plataforma.
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Empresas sem CNPJ não podem emitir notas fiscais</li>
                  <li>Dados fiscais devem estar atualizados e corretos</li>
                  <li>Responsabilidade fiscal é exclusiva do usuário</li>
                  <li>Planud não se responsabiliza por questões tributárias</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5" />
                6. Uso Apropriado
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <p className="text-muted-foreground mb-2">É proibido utilizar a plataforma para:</p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Atividades ilegais ou que violem direitos de terceiros</li>
                  <li>Enviar spam ou conteúdo malicioso</li>
                  <li>Tentar acessar dados de outros usuários</li>
                  <li>Realizar engenharia reversa ou comprometer a segurança</li>
                  <li>Usar bots ou automações não autorizadas</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>7. Disponibilidade e Suporte</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Nos esforçamos para manter 99.9% de disponibilidade</li>
                <li>Manutenções programadas serão comunicadas antecipadamente</li>
                <li>Suporte técnico via WhatsApp e email</li>
                <li>Tempo de resposta: até 24h para planos pagos</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>8. Propriedade Intelectual</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Todos os direitos sobre o software, design, marca e conteúdo do Planud pertencem 
                à nossa empresa. Você mantém a propriedade sobre os dados que inserir na plataforma.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>9. Limitação de Responsabilidade</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                O Planud não se responsabiliza por danos indiretos, perda de dados, lucros cessantes 
                ou interrupção de negócios. Nossa responsabilidade máxima é limitada ao valor pago 
                pelo serviço nos últimos 12 meses.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5" />
                10. Lei Aplicável
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Estes termos são regidos pelas leis brasileiras. Qualquer disputa será resolvida 
                no foro da comarca de São Paulo, SP.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>11. Alterações dos Termos</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                Podemos atualizar estes termos periodicamente. Mudanças significativas serão 
                comunicadas por email ou através da plataforma. O uso continuado após as alterações 
                constitui aceitação dos novos termos.
              </p>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <div className="space-y-2">
                <h4 className="font-semibold">Contato:</h4>
                <div className="text-sm text-muted-foreground space-y-1">
                  <p><strong>Email:</strong> contato@planud.com.br</p>
                  <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
                  <p><strong>Site:</strong> www.planud.com.br</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default TermsPage;
