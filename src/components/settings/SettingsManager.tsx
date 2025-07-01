
import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Separator } from '@/components/ui/separator';
import { Building2, Upload, Settings, Bell, Smartphone, Palette, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Configuracao = Tables<'configuracoes'>;

export const SettingsManager = () => {
  const { userData } = useAuth();
  const [configuracao, setConfiguracao] = useState<Configuracao | null>(null);
  const [empresaNome, setEmpresaNome] = useState('');
  const [empresaRamo, setEmpresaRamo] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (userData?.empresa) {
      loadConfiguracoes();
      setEmpresaNome(userData.empresa.nome);
      setEmpresaRamo(userData.empresa.ramo);
    }
  }, [userData]);

  const loadConfiguracoes = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .select('*')
        .eq('empresa_id', userData?.empresa?.id)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar configurações:', error);
        return;
      }

      if (data) {
        setConfiguracao(data);
      } else {
        // Criar configuração padrão se não existir
        await createDefaultConfig();
      }
    } catch (error) {
      console.error('Erro ao carregar configurações:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createDefaultConfig = async () => {
    try {
      const { data, error } = await supabase
        .from('configuracoes')
        .insert({
          empresa_id: userData?.empresa?.id,
          plano_ativo: userData?.empresa?.plano || 'basico',
          gerar_nota_automatica: false,
          enviar_whatsapp_automatico: false,
          notificacoes_email: true,
          notificacoes_push: false,
          tema_visual: 'claro'
        })
        .select()
        .single();

      if (error) throw error;
      setConfiguracao(data);
    } catch (error) {
      console.error('Erro ao criar configuração padrão:', error);
    }
  };

  const saveEmpresaInfo = async () => {
    if (!userData?.empresa?.id) return;

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('empresas')
        .update({
          nome: empresaNome,
          ramo: empresaRamo
        })
        .eq('id', userData.empresa.id);

      if (error) throw error;
      toast.success('Informações da empresa atualizadas!');
    } catch (error) {
      console.error('Erro ao salvar informações da empresa:', error);
      toast.error('Erro ao salvar informações da empresa');
    } finally {
      setIsSaving(false);
    }
  };

  const updateConfiguracao = async (campo: keyof Configuracao, valor: any) => {
    if (!configuracao) return;

    try {
      const { error } = await supabase
        .from('configuracoes')
        .update({ [campo]: valor })
        .eq('id', configuracao.id);

      if (error) throw error;

      setConfiguracao(prev => prev ? { ...prev, [campo]: valor } : null);
      toast.success('Configuração atualizada!');
    } catch (error) {
      console.error('Erro ao atualizar configuração:', error);
      toast.error('Erro ao atualizar configuração');
    }
  };

  const getPlanoInfo = (plano: string) => {
    const planos = {
      basico: { label: 'Básico', color: 'bg-green-100 text-green-800' },
      intermediario: { label: 'Intermediário', color: 'bg-blue-100 text-blue-800' },
      pro: { label: 'Pro', color: 'bg-purple-100 text-purple-800' }
    };
    return planos[plano as keyof typeof planos] || planos.basico;
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Carregando configurações...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Informações da Empresa */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Informações da Empresa
          </CardTitle>
          <CardDescription>
            Gerencie as informações básicas da sua empresa
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center space-x-6">
            <div>
              <Avatar className="h-20 w-20">
                <AvatarImage src={configuracao?.logo_url || ''} />
                <AvatarFallback className="text-2xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                  {empresaNome.charAt(0)}
                </AvatarFallback>
              </Avatar>
            </div>
            <div className="flex-1 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="empresa-nome">Nome da Empresa</Label>
                  <Input
                    id="empresa-nome"
                    value={empresaNome}
                    onChange={(e) => setEmpresaNome(e.target.value)}
                    placeholder="Nome da sua empresa"
                  />
                </div>
                <div>
                  <Label htmlFor="empresa-ramo">Ramo de Atuação</Label>
                  <Input
                    id="empresa-ramo"
                    value={empresaRamo}
                    onChange={(e) => setEmpresaRamo(e.target.value)}
                    placeholder="Ex: Beleza, Consultoria, etc."
                  />
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button
                  onClick={saveEmpresaInfo}
                  disabled={isSaving}
                  className="flex items-center gap-2"
                >
                  {isSaving ? 'Salvando...' : 'Salvar Alterações'}
                </Button>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-600">Plano:</span>
                  <Badge className={getPlanoInfo(userData?.empresa?.plano || 'basico').color}>
                    {getPlanoInfo(userData?.empresa?.plano || 'basico').label}
                  </Badge>
                </div>
              </div>
            </div>
          </div>

          <Separator />

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              <Upload className="h-4 w-4" />
              Logo da Empresa
            </Label>
            <div className="flex items-center gap-4">
              <Input
                type="file"
                accept="image/png,image/svg+xml,image/jpeg"
                className="flex-1"
                disabled
              />
              <Button variant="outline" disabled>
                Upload (Em breve)
              </Button>
            </div>
            <p className="text-sm text-gray-500">
              A logo será exibida nas notas fiscais e no cabeçalho do sistema
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Preferências do Sistema */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Preferências do Sistema
          </CardTitle>
          <CardDescription>
            Configure o comportamento automático do sistema
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Automações */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Zap className="h-4 w-4" />
              Automações
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="nota-automatica">Emitir nota fiscal automaticamente</Label>
                  <p className="text-sm text-gray-500">
                    Gera nota fiscal automaticamente ao concluir um agendamento
                  </p>
                </div>
                <Switch
                  id="nota-automatica"
                  checked={configuracao?.gerar_nota_automatica || false}
                  onCheckedChange={(checked) => updateConfiguracao('gerar_nota_automatica', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="whatsapp-automatico">Enviar WhatsApp automaticamente</Label>
                  <p className="text-sm text-gray-500">
                    Envia nota fiscal por WhatsApp automaticamente após emissão
                  </p>
                </div>
                <Switch
                  id="whatsapp-automatico"
                  checked={configuracao?.enviar_whatsapp_automatico || false}
                  onCheckedChange={(checked) => updateConfiguracao('enviar_whatsapp_automatico', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Notificações */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Bell className="h-4 w-4" />
              Notificações
            </h4>
            
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notif-email">Notificações por e-mail</Label>
                  <p className="text-sm text-gray-500">
                    Receba atualizações importantes por e-mail
                  </p>
                </div>
                <Switch
                  id="notif-email"
                  checked={configuracao?.notificacoes_email || false}
                  onCheckedChange={(checked) => updateConfiguracao('notificacoes_email', checked)}
                />
              </div>

              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label htmlFor="notif-push">Notificações push</Label>
                  <p className="text-sm text-gray-500">
                    Receba notificações instantâneas no navegador
                  </p>
                </div>
                <Switch
                  id="notif-push"
                  checked={configuracao?.notificacoes_push || false}
                  onCheckedChange={(checked) => updateConfiguracao('notificacoes_push', checked)}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Aparência */}
          <div className="space-y-4">
            <h4 className="font-medium flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Aparência
            </h4>

            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <Label htmlFor="tema-visual">Tema visual</Label>
                <p className="text-sm text-gray-500">
                  Escolha entre tema claro ou escuro
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">Claro</span>
                <Switch
                  id="tema-visual"
                  checked={configuracao?.tema_visual === 'escuro'}
                  onCheckedChange={(checked) => updateConfiguracao('tema_visual', checked ? 'escuro' : 'claro')}
                />
                <span className="text-sm">Escuro</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Resumo das Configurações */}
      <Card>
        <CardHeader>
          <CardTitle>Resumo das Configurações</CardTitle>
          <CardDescription>
            Visão geral das suas preferências atuais
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Nota automática</span>
                <Badge variant={configuracao?.gerar_nota_automatica ? "default" : "secondary"}>
                  {configuracao?.gerar_nota_automatica ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">WhatsApp automático</span>
                <Badge variant={configuracao?.enviar_whatsapp_automatico ? "default" : "secondary"}>
                  {configuracao?.enviar_whatsapp_automatico ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm">Notificações push</span>
                <Badge variant={configuracao?.notificacoes_push ? "default" : "secondary"}>
                  {configuracao?.notificacoes_push ? 'Ativo' : 'Inativo'}
                </Badge>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm">Tema visual</span>
                <Badge variant="outline">
                  {configuracao?.tema_visual === 'escuro' ? 'Escuro' : 'Claro'}
                </Badge>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
