import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Shield, Eye, Lock, UserCheck } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const PrivacyPage = () => {
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
            <Shield className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold text-gray-900">Política de Privacidade</h1>
          </div>
          <p className="text-muted-foreground">
            Última atualização: Julho de 2025
          </p>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Eye className="h-5 w-5" />
                1. Informações que Coletamos
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Dados de Cadastro:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Nome completo e email de acesso</li>
                  <li>Informações da empresa (nome, CNPJ, ramo de atividade)</li>
                  <li>Dados de contato (telefone, endereço)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Dados de Uso:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Informações de clientes cadastrados</li>
                  <li>Agendamentos e serviços prestados</li>
                  <li>Dados financeiros e notas fiscais emitidas</li>
                  <li>Logs de acesso e uso da plataforma</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5" />
                2. Como Utilizamos seus Dados
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-2 text-muted-foreground">
                <li>Fornecer e melhorar nossos serviços de gestão empresarial</li>
                <li>Processar pagamentos e emitir notas fiscais</li>
                <li>Enviar comunicações importantes sobre sua conta</li>
                <li>Oferecer suporte técnico personalizado</li>
                <li>Cumprir obrigações legais e regulamentares</li>
                <li>Prevenir fraudes e garantir a segurança da plataforma</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5" />
                3. Proteção e Compartilhamento
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Segurança:</h4>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Criptografia SSL/TLS em todas as comunicações</li>
                  <li>Dados armazenados em servidores seguros (Supabase)</li>
                  <li>Acesso restrito apenas a pessoal autorizado</li>
                  <li>Monitoramento contínuo de segurança</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Compartilhamento:</h4>
                <p className="text-muted-foreground mb-2">
                  Não vendemos, alugamos ou compartilhamos seus dados pessoais com terceiros, exceto:
                </p>
                <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                  <li>Quando exigido por lei ou ordem judicial</li>
                  <li>Com prestadores de serviços essenciais (pagamento, hospedagem)</li>
                  <li>Em caso de fusão, aquisição ou venda da empresa</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>4. Seus Direitos (LGPD)</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="mb-3 text-muted-foreground">
                Conforme a Lei Geral de Proteção de Dados, você tem direito a:
              </p>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Confirmar a existência de tratamento dos seus dados</li>
                <li>Acessar os dados que temos sobre você</li>
                <li>Corrigir dados incompletos, inexatos ou desatualizados</li>
                <li>Solicitar a exclusão dos seus dados</li>
                <li>Revogar o consentimento a qualquer momento</li>
                <li>Solicitar a portabilidade dos dados</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>5. Retenção e Exclusão de Dados</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc pl-5 space-y-1 text-muted-foreground">
                <li>Dados mantidos enquanto a conta estiver ativa</li>
                <li>Backups mantidos por até 30 dias após exclusão</li>
                <li>Dados financiais mantidos por 5 anos (obrigação legal)</li>
                <li>Logs de segurança mantidos por 1 ano</li>
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>6. Contato</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground mb-3">
                Para exercer seus direitos ou esclarecer dúvidas sobre esta política:
              </p>
              <div className="space-y-2 text-muted-foreground">
                <p><strong>Email:</strong> privacidade@planud.com.br</p>
                <p><strong>WhatsApp:</strong> (11) 99999-9999</p>
                <p><strong>Endereço:</strong> São Paulo, SP - Brasil</p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-primary/20 bg-primary/5">
            <CardContent className="pt-6">
              <p className="text-sm text-muted-foreground">
                Esta política pode ser atualizada periodicamente. Notificaremos sobre mudanças significativas 
                por email ou através da plataforma. O uso continuado dos serviços após as alterações 
                constitui aceitação da nova política.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPage;