import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Building2, Upload, Save, AlertCircle, CheckCircle } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const CompanySettings = () => {
  const { userData } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [formData, setFormData] = useState({
    nome: '',
    cnpj: '',
    endereco: '',
    cidade: '',
    logo_url: ''
  });

  useEffect(() => {
    if (userData?.empresa) {
      setFormData({
        nome: userData.empresa.nome || '',
        cnpj: userData.empresa.cnpj || '',
        endereco: userData.empresa.endereco || '',
        cidade: userData.empresa.cidade || '',
        logo_url: userData.empresa.logo_url || ''
      });
    }
  }, [userData]);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const formatCNPJ = (value: string) => {
    // Remove tudo que não é dígito
    const digits = value.replace(/\D/g, '');
    
    // Aplica a máscara XX.XXX.XXX/XXXX-XX
    if (digits.length <= 14) {
      return digits
        .replace(/(\d{2})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1.$2')
        .replace(/(\d{3})(\d)/, '$1/$2')
        .replace(/(\d{4})(\d)/, '$1-$2');
    }
    return value;
  };

  const validateCNPJ = (cnpj: string) => {
    const digits = cnpj.replace(/\D/g, '');
    return digits.length === 14;
  };

  const handleCNPJChange = (value: string) => {
    const formatted = formatCNPJ(value);
    handleInputChange('cnpj', formatted);
  };

  const handleLogoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file || !userData?.id) return;

    // Validar tipo e tamanho do arquivo
    const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast.error('Formato não suportado. Use PNG, JPEG ou SVG.');
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      toast.error('Arquivo muito grande. Máximo 2MB.');
      return;
    }

    setIsUploadingLogo(true);
    try {
      // Upload para o storage
      const fileName = `${userData.id}/logo.${file.type.split('/')[1]}`;
      const { error: uploadError } = await supabase.storage
        .from('company-logos')
        .upload(fileName, file, { upsert: true });

      if (uploadError) throw uploadError;

      // Obter URL pública
      const { data: { publicUrl } } = supabase.storage
        .from('company-logos')
        .getPublicUrl(fileName);

      // Atualizar estado local
      handleInputChange('logo_url', publicUrl);
      
      toast.success('Logo carregado com sucesso!');
    } catch (error) {
      console.error('Erro ao fazer upload do logo:', error);
      toast.error('Erro ao fazer upload do logo');
    } finally {
      setIsUploadingLogo(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async () => {
    if (!userData?.empresa?.id) return;

    // Validações
    if (!formData.nome.trim()) {
      toast.error('Nome da empresa é obrigatório');
      return;
    }

    if (formData.cnpj && !validateCNPJ(formData.cnpj)) {
      toast.error('CNPJ inválido. Deve ter 14 dígitos.');
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase
        .from('empresas')
        .update({
          nome: formData.nome.trim(),
          cnpj: formData.cnpj.replace(/\D/g, '') || null,
          endereco: formData.endereco.trim() || null,
          cidade: formData.cidade.trim() || null,
          logo_url: formData.logo_url || null
        })
        .eq('id', userData.empresa.id);

      if (error) throw error;
      
      toast.success('Dados da empresa atualizados com sucesso!');
      
      // Recarregar dados do usuário
      window.location.reload();
    } catch (error) {
      console.error('Erro ao salvar dados da empresa:', error);
      toast.error('Erro ao salvar dados da empresa');
    } finally {
      setIsSaving(false);
    }
  };

  const getCompanyInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  };

  const hasRequiredData = formData.nome.trim() && formData.cnpj && validateCNPJ(formData.cnpj);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Building2 className="h-5 w-5" />
          Dados da Empresa
        </CardTitle>
        <CardDescription>
          Configure as informações da sua empresa. CNPJ é obrigatório para emissão de notas fiscais.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Status da Configuração */}
        <div className="flex items-center gap-3 p-4 rounded-lg border">
          {hasRequiredData ? (
            <>
              <CheckCircle className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-medium text-green-800">Empresa configurada</p>
                <p className="text-sm text-green-600">Todos os dados obrigatórios foram preenchidos</p>
              </div>
              <Badge className="ml-auto bg-green-100 text-green-800">Completo</Badge>
            </>
          ) : (
            <>
              <AlertCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-medium text-orange-800">Configuração incompleta</p>
                <p className="text-sm text-orange-600">Preencha nome e CNPJ para emitir notas fiscais</p>
              </div>
              <Badge className="ml-auto bg-orange-100 text-orange-800">Pendente</Badge>
            </>
          )}
        </div>

        {/* Logo e Informações Básicas */}
        <div className="flex items-start space-x-6">
          <div className="flex flex-col items-center space-y-3">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.logo_url} />
              <AvatarFallback className="text-xl bg-gradient-to-br from-indigo-600 to-purple-600 text-white">
                {formData.nome ? getCompanyInitials(formData.nome) : 'EM'}
              </AvatarFallback>
            </Avatar>
            <div className="text-center">
              <Input
                ref={fileInputRef}
                type="file"
                accept="image/png,image/jpeg,image/jpg,image/svg+xml"
                onChange={handleLogoUpload}
                className="hidden"
                disabled={isUploadingLogo}
              />
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingLogo}
                className="flex items-center gap-2"
              >
                <Upload className="h-4 w-4" />
                {isUploadingLogo ? 'Enviando...' : 'Alterar Logo'}
              </Button>
              <p className="text-xs text-gray-500 mt-1">
                PNG, JPEG, SVG (máx. 2MB)
              </p>
            </div>
          </div>

          <div className="flex-1 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="nome">Nome da Empresa *</Label>
                <Input
                  id="nome"
                  value={formData.nome}
                  onChange={(e) => handleInputChange('nome', e.target.value)}
                  placeholder="Sua Empresa Ltda"
                  className={!formData.nome.trim() ? 'border-orange-300' : ''}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="cnpj">CNPJ *</Label>
                <Input
                  id="cnpj"
                  value={formData.cnpj}
                  onChange={(e) => handleCNPJChange(e.target.value)}
                  placeholder="00.000.000/0000-00"
                  maxLength={18}
                  className={formData.cnpj && !validateCNPJ(formData.cnpj) ? 'border-red-300' : ''}
                />
                {formData.cnpj && !validateCNPJ(formData.cnpj) && (
                  <p className="text-sm text-red-600">CNPJ deve ter 14 dígitos</p>
                )}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="endereco">Endereço Completo</Label>
              <Textarea
                id="endereco"
                value={formData.endereco}
                onChange={(e) => handleInputChange('endereco', e.target.value)}
                placeholder="Rua, número, bairro, CEP"
                rows={2}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="cidade">Cidade/Estado</Label>
              <Input
                id="cidade"
                value={formData.cidade}
                onChange={(e) => handleInputChange('cidade', e.target.value)}
                placeholder="São Paulo, SP"
              />
            </div>
          </div>
        </div>

        {/* Informações Importantes */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">📋 Informações Importantes</h4>
          <ul className="text-sm text-blue-800 space-y-1">
            <li>• O CNPJ é obrigatório para emissão de notas fiscais</li>
            <li>• O logo aparecerá nas notas de serviço geradas</li>
            <li>• Mantenha os dados sempre atualizados</li>
            <li>• Todos os dados são protegidos pela LGPD</li>
          </ul>
        </div>

        {/* Botão de Salvar */}
        <div className="flex justify-end">
          <Button
            onClick={handleSave}
            disabled={isSaving || !formData.nome.trim()}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700"
          >
            <Save className="h-4 w-4" />
            {isSaving ? 'Salvando...' : 'Salvar Alterações'}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
