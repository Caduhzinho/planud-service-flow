import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Shield, FileText, ExternalLink } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';

interface PrivacyModalProps {
  open: boolean;
  onClose: () => void;
}

export const PrivacyModal = ({ open, onClose }: PrivacyModalProps) => {
  const [acceptPrivacy, setAcceptPrivacy] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const { userData, setUserData } = useAuth();
  const navigate = useNavigate();

  const handleAccept = async () => {
    console.log('handleAccept chamado');
    console.log('acceptPrivacy:', acceptPrivacy);
    console.log('acceptTerms:', acceptTerms);
    console.log('userData:', userData);

    if (!acceptPrivacy || !acceptTerms) {
      console.log('Faltando aceite dos termos');
      toast({
        title: "Aceite necessário",
        description: "Você deve aceitar ambos os termos para continuar",
        variant: "destructive",
      });
      return;
    }

    if (!userData?.id) {
      console.error('ID do usuário não encontrado');
      toast({
        title: "Erro",
        description: "Dados do usuário não encontrados",
        variant: "destructive",
      });
      return;
    }

    setIsLoading(true);
    try {
      console.log('Atualizando usuário:', userData.id);
      
      // Atualizar aceite na tabela usuarios
      const { error: userError } = await supabase
        .from('usuarios')
        .update({
          aceitou_termos: true,
          aceitou_privacidade: true,
          data_aceite_termos: new Date().toISOString(),
          data_aceite_privacidade: new Date().toISOString()
        })
        .eq('id', userData.id);

      if (userError) {
        console.error('Erro ao atualizar usuário:', userError);
        throw userError;
      }

      // Atualizar aceite na tabela empresas
      const { error: empresaError } = await supabase
        .from('empresas')
        .update({
          aceita_privacidade: true,
          data_aceite_privacidade: new Date().toISOString()
        })
        .eq('id', userData?.empresa?.id);

      if (empresaError) {
        console.error('Erro ao atualizar empresa:', empresaError);
        throw empresaError;
      }

      // Atualizar estado local
      setUserData({
        ...userData,
        aceitou_termos: true,
        aceitou_privacidade: true,
        data_aceite_termos: new Date().toISOString(),
        data_aceite_privacidade: new Date().toISOString(),
        empresa: {
          ...userData.empresa,
          aceita_privacidade: true,
          data_aceite_privacidade: new Date().toISOString()
        }
      });

      console.log('Aceite registrado com sucesso, fechando modal');
      
      toast({
        title: "Termos aceitos",
        description: "Bem-vindo ao Planud! Comece cadastrando seus clientes e agendamentos.",
      });

      onClose();
      
      // Redirecionar para o dashboard
      setTimeout(() => {
        navigate('/dashboard');
      }, 500);
    } catch (error) {
      console.error('Erro ao aceitar termos:', error);
      toast({
        title: "Erro",
        description: "Erro ao registrar aceite dos termos",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const openPrivacyPage = () => {
    window.open('/privacidade', '_blank');
  };

  const openTermsPage = () => {
    window.open('/termos', '_blank');
  };

  return (
    <Dialog open={open} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <Shield className="h-6 w-6 text-primary" />
            Bem-vindo ao Planud!
          </DialogTitle>
          <DialogDescription className="text-base">
            Para continuar, precisamos do seu aceite aos nossos termos e política de privacidade.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          <div className="bg-primary/5 border border-primary/20 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Shield className="h-5 w-5 text-primary mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Proteção dos seus dados</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Levamos a sério a proteção das suas informações. Nossa política está em 
                  conformidade com a LGPD e boas práticas internacionais.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={openPrivacyPage}
                  className="text-primary"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ler Política de Privacidade
                </Button>
              </div>
            </div>
          </div>

          <div className="bg-muted/50 border rounded-lg p-4">
            <div className="flex items-start gap-3">
              <FileText className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>
                <h4 className="font-semibold mb-2">Termos de uso</h4>
                <p className="text-sm text-muted-foreground mb-3">
                  Nossos termos de uso definem direitos, responsabilidades e como 
                  utilizar a plataforma de forma adequada.
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={openTermsPage}
                  className="text-muted-foreground"
                >
                  <ExternalLink className="h-3 w-3 mr-1" />
                  Ler Termos de Uso
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-start space-x-3">
              <Checkbox 
                id="privacy" 
                checked={acceptPrivacy}
                onCheckedChange={(checked) => setAcceptPrivacy(checked === true)}
                className="mt-1"
              />
              <label htmlFor="privacy" className="text-sm leading-relaxed cursor-pointer">
                Li e aceito a <strong>Política de Privacidade</strong> do Planud, 
                compreendendo como meus dados pessoais serão tratados.
              </label>
            </div>

            <div className="flex items-start space-x-3">
              <Checkbox 
                id="terms" 
                checked={acceptTerms}
                onCheckedChange={(checked) => setAcceptTerms(checked === true)}
                className="mt-1"
              />
              <label htmlFor="terms" className="text-sm leading-relaxed cursor-pointer">
                Li e aceito os <strong>Termos de Uso</strong> do Planud, 
                concordando com as condições de utilização da plataforma.
              </label>
            </div>
          </div>

          <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
            <p className="text-xs text-amber-800">
              <strong>Importante:</strong> Ao aceitar, você confirma que tem autoridade 
              para vincular sua empresa a estes termos e que as informações fornecidas 
              são verdadeiras e atualizadas.
            </p>
          </div>
        </div>

        <div className="flex justify-end space-x-3 pt-4 border-t">
          <Button
            onClick={() => {
              console.log('Botão clicado!');
              handleAccept();
            }}
            disabled={!acceptPrivacy || !acceptTerms || isLoading}
            className="px-8"
          >
            {isLoading ? 'Processando...' : 'Aceitar e Continuar'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};