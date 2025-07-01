
import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Check, X, Crown, Zap, Users } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Plano = Tables<'planos'>;
type Assinatura = Tables<'assinaturas'>;

interface PlanUsage {
  agendamentos_usado: number;
  notas_usado: number;
  agendamentos_limite: number;
  notas_limite: number;
}

export const PlansManager = () => {
  const { userData } = useAuth();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [assinaturaAtual, setAssinaturaAtual] = useState<Assinatura | null>(null);
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);

  useEffect(() => {
    if (userData?.empresa?.id) {
      loadPlanos();
      loadAssinaturaAtual();
      loadPlanUsage();
    }
  }, [userData]);

  const loadPlanos = async () => {
    try {
      const { data, error } = await supabase
        .from('planos')
        .select('*')
        .order('preco_mensal', { ascending: true });

      if (error) throw error;
      setPlanos(data || []);
    } catch (error) {
      console.error('Erro ao carregar planos:', error);
      toast.error('Erro ao carregar planos');
    }
  };

  const loadAssinaturaAtual = async () => {
    try {
      const { data, error } = await supabase
        .from('assinaturas')
        .select('*, planos(*)')
        .eq('empresa_id', userData?.empresa?.id)
        .eq('ativa', true)
        .single();

      if (error && error.code !== 'PGRST116') {
        console.error('Erro ao carregar assinatura:', error);
        return;
      }

      setAssinaturaAtual(data);
    } catch (error) {
      console.error('Erro ao carregar assinatura:', error);
    }
  };

  const loadPlanUsage = async () => {
    try {
      // Buscar uso atual do mês
      const currentMonth = new Date().getMonth() + 1;
      const currentYear = new Date().getFullYear();

      const { data: agendamentos } = await supabase
        .from('agendamentos')
        .select('id')
        .eq('empresa_id', userData?.empresa?.id)
        .gte('created_at', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('created_at', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      const { data: notas } = await supabase
        .from('notas_fiscais')
        .select('id')
        .eq('empresa_id', userData?.empresa?.id)
        .gte('criada_em', `${currentYear}-${currentMonth.toString().padStart(2, '0')}-01`)
        .lt('criada_em', `${currentYear}-${(currentMonth + 1).toString().padStart(2, '0')}-01`);

      // Buscar limites do plano atual
      const { data: empresa } = await supabase
        .from('empresas')
        .select('planos(limite_agendamentos, limite_notas)')
        .eq('id', userData?.empresa?.id)
        .single();

      setPlanUsage({
        agendamentos_usado: agendamentos?.length || 0,
        notas_usado: notas?.length || 0,
        agendamentos_limite: empresa?.planos?.limite_agendamentos || 0,
        notas_limite: empresa?.planos?.limite_notas || 0,
      });
    } catch (error) {
      console.error('Erro ao carregar uso do plano:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const createSubscription = async (planoId: string, formaPagamento: string) => {
    setIsCreatingSubscription(true);
    try {
      const { data, error } = await supabase.functions.invoke('create-asaas-subscription', {
        body: {
          empresa_id: userData?.empresa?.id,
          plano_id: planoId,
          forma_pagamento: formaPagamento,
        },
      });

      if (error) throw error;

      if (data.success) {
        toast.success('Assinatura criada! Redirecionando para pagamento...');
        window.open(data.link_pagamento, '_blank');
        await loadAssinaturaAtual();
      }
    } catch (error) {
      console.error('Erro ao criar assinatura:', error);
      toast.error('Erro ao criar assinatura');
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const getPlanoIcon = (nome: string) => {
    switch (nome) {
      case 'gratuito':
        return <Users className="h-5 w-5" />;
      case 'intermediario':
        return <Zap className="h-5 w-5" />;
      case 'pro':
        return <Crown className="h-5 w-5" />;
      default:
        return <Users className="h-5 w-5" />;
    }
  };

  const getPlanoColor = (nome: string) => {
    switch (nome) {
      case 'gratuito':
        return 'bg-gray-100 text-gray-800';
      case 'intermediario':
        return 'bg-blue-100 text-blue-800';
      case 'pro':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {/* Uso Atual */}
      {planUsage && (
        <Card>
          <CardHeader>
            <CardTitle>Uso do Plano Atual</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Agendamentos</span>
                  <span>
                    {planUsage.agendamentos_usado} / {planUsage.agendamentos_limite === -1 ? '∞' : planUsage.agendamentos_limite}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: planUsage.agendamentos_limite === -1 
                        ? '0%' 
                        : `${Math.min((planUsage.agendamentos_usado / planUsage.agendamentos_limite) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span>Notas Fiscais</span>
                  <span>
                    {planUsage.notas_usado} / {planUsage.notas_limite === -1 ? '∞' : planUsage.notas_limite}
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-indigo-600 h-2 rounded-full"
                    style={{
                      width: planUsage.notas_limite === -1 
                        ? '0%' 
                        : `${Math.min((planUsage.notas_usado / planUsage.notas_limite) * 100, 100)}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Planos Disponíveis */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card key={plano.id} className={`relative ${
            assinaturaAtual?.plano_id === plano.id ? 'ring-2 ring-indigo-500' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPlanoIcon(plano.nome)}
                  <CardTitle className="capitalize">{plano.nome}</CardTitle>
                </div>
                <Badge className={getPlanoColor(plano.nome)}>
                  {assinaturaAtual?.plano_id === plano.id ? 'Atual' : ''}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <div className="text-3xl font-bold">
                  R$ {plano.preco_mensal?.toFixed(2).replace('.', ',')}
                </div>
                <div className="text-gray-600">por mês</div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  {plano.limite_agendamentos === -1 ? <Check className="h-4 w-4 text-green-500" /> : <span className="text-sm">{plano.limite_agendamentos}</span>}
                  <span className="text-sm">
                    {plano.limite_agendamentos === -1 ? 'Agendamentos ilimitados' : 'agendamentos/mês'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {plano.limite_notas === -1 ? <Check className="h-4 w-4 text-green-500" /> : <span className="text-sm">{plano.limite_notas}</span>}
                  <span className="text-sm">
                    {plano.limite_notas === -1 ? 'Notas fiscais ilimitadas' : 'notas fiscais/mês'}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {plano.permite_logo ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  <span className="text-sm">Logo personalizada</span>
                </div>
                <div className="flex items-center gap-2">
                  {plano.permite_ia ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  <span className="text-sm">IA e automações</span>
                </div>
                <div className="flex items-center gap-2">
                  {plano.suporte_whatsapp ? <Check className="h-4 w-4 text-green-500" /> : <X className="h-4 w-4 text-red-500" />}
                  <span className="text-sm">Suporte WhatsApp</span>
                </div>
              </div>

              {assinaturaAtual?.plano_id !== plano.id && plano.nome !== 'gratuito' && (
                <div className="space-y-2">
                  <Select onValueChange={(value) => createSubscription(plano.id, value)}>
                    <SelectTrigger>
                      <SelectValue placeholder="Escolher forma de pagamento" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pix">PIX</SelectItem>
                      <SelectItem value="boleto">Boleto</SelectItem>
                      <SelectItem value="cartao">Cartão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              {assinaturaAtual?.plano_id === plano.id && (
                <Badge className="w-full justify-center bg-green-100 text-green-800">
                  Plano Ativo
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Assinatura Atual */}
      {assinaturaAtual && (
        <Card>
          <CardHeader>
            <CardTitle>Detalhes da Assinatura</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <span className="font-medium">Status:</span>
                <Badge className={`ml-2 ${
                  assinaturaAtual.status === 'ativa' ? 'bg-green-100 text-green-800' : 
                  assinaturaAtual.status === 'pendente' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {assinaturaAtual.status}
                </Badge>
              </div>
              <div>
                <span className="font-medium">Vencimento:</span>
                <span className="ml-2">
                  {assinaturaAtual.vencimento ? new Date(assinaturaAtual.vencimento).toLocaleDateString('pt-BR') : '-'}
                </span>
              </div>
              <div>
                <span className="font-medium">Forma de Pagamento:</span>
                <span className="ml-2 capitalize">{assinaturaAtual.forma_pagamento}</span>
              </div>
              {assinaturaAtual.link_pagamento && assinaturaAtual.status === 'pendente' && (
                <div className="col-span-2">
                  <Button 
                    onClick={() => window.open(assinaturaAtual.link_pagamento!, '_blank')}
                    className="w-full"
                  >
                    Pagar Assinatura
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
