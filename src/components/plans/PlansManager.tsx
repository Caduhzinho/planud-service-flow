import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check, X, Crown, Zap, Users, RefreshCw } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Tables } from '@/integrations/supabase/types';

type Plano = Tables<'planos'>;

interface PlanUsage {
  agendamentos_usado: number;
  notas_usado: number;
  agendamentos_limite: number;
  notas_limite: number;
}

interface SubscriptionInfo {
  subscribed: boolean;
  subscription_tier?: string;
  subscription_end?: string;
}

const STRIPE_PRICES = {
  'gratuito': '', // Free plan, no price ID needed
  'intermediario': 'price_1QdJCDRMO6njjwBTtPATf8YfR5rDPCNhzTF9Ez6JMLpWBe4eQubc4mwKNmPbmXqQ2Iu1mAueKeGLupGMDm74eIAf00wlngEL3O', // Replace with actual price ID for R$ 29,90
  'pro': 'price_2QdJCDRMO6njjwBTtPATf8YfR5rDPCNhzTF9Ez6JMLpWBe4eQubc4mwKNmPbmXqQ2Iu1mAueKeGLupGMDm74eIAf00wlngEL3O' // Replace with actual price ID for R$ 59,90
};

export const PlansManager = () => {
  const { userData } = useAuth();
  const [planos, setPlanos] = useState<Plano[]>([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState<SubscriptionInfo>({ subscribed: false });
  const [planUsage, setPlanUsage] = useState<PlanUsage | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCreatingSubscription, setIsCreatingSubscription] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);

  useEffect(() => {
    if (userData?.empresa?.id) {
      loadData();
    }
  }, [userData]);

  const loadData = async () => {
    await Promise.all([
      loadPlanos(),
      checkSubscription(),
      loadPlanUsage()
    ]);
  };

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

  const checkSubscription = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('check-subscription');
      
      if (error) throw error;
      
      setSubscriptionInfo(data || { subscribed: false });
    } catch (error) {
      console.error('Erro ao verificar assinatura:', error);
      setSubscriptionInfo({ subscribed: false });
    } finally {
      setIsLoading(false);
    }
  };

  const loadPlanUsage = async () => {
    try {
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
    }
  };

  const createStripeCheckout = async (plano: Plano) => {
    if (plano.nome === 'gratuito') return;
    
    setIsCreatingSubscription(true);
    try {
      const priceId = STRIPE_PRICES[plano.nome as keyof typeof STRIPE_PRICES];
      
      if (!priceId) {
        toast.error('Price ID não configurado para este plano');
        return;
      }

      const { data, error } = await supabase.functions.invoke('create-stripe-checkout', {
        body: {
          priceId,
          planName: plano.nome,
        },
      });

      if (error) throw error;

      if (data.url) {
        toast.success('Redirecionando para pagamento...');
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao criar checkout:', error);
      toast.error('Erro ao criar checkout do Stripe');
    } finally {
      setIsCreatingSubscription(false);
    }
  };

  const openCustomerPortal = async () => {
    try {
      const { data, error } = await supabase.functions.invoke('customer-portal');
      
      if (error) throw error;
      
      if (data.url) {
        window.open(data.url, '_blank');
      }
    } catch (error) {
      console.error('Erro ao abrir portal:', error);
      toast.error('Erro ao abrir portal do cliente');
    }
  };

  const refreshSubscription = async () => {
    setIsRefreshing(true);
    await checkSubscription();
    setIsRefreshing(false);
    toast.success('Status da assinatura atualizado');
  };

  const isCurrentPlan = (planoNome: string) => {
    return subscriptionInfo.subscription_tier === planoNome;
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
      {/* Subscription Status */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle>Status da Assinatura</CardTitle>
            <Button 
              variant="outline" 
              size="sm" 
              onClick={refreshSubscription}
              disabled={isRefreshing}
            >
              <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
              Atualizar
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <span className="font-medium">Status:</span>
              <Badge className={`ml-2 ${
                subscriptionInfo.subscribed ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
              }`}>
                {subscriptionInfo.subscribed ? 'Ativa' : 'Inativa'}
              </Badge>
            </div>
            <div>
              <span className="font-medium">Plano:</span>
              <span className="ml-2 capitalize">
                {subscriptionInfo.subscription_tier || 'Gratuito'}
              </span>
            </div>
            <div>
              <span className="font-medium">Vencimento:</span>
              <span className="ml-2">
                {subscriptionInfo.subscription_end 
                  ? new Date(subscriptionInfo.subscription_end).toLocaleDateString('pt-BR') 
                  : '-'
                }
              </span>
            </div>
          </div>
          
          {subscriptionInfo.subscribed && (
            <div className="mt-4">
              <Button onClick={openCustomerPortal} variant="outline">
                Gerenciar Assinatura
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Plan Usage */}
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

      {/* Available Plans */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {planos.map((plano) => (
          <Card key={plano.id} className={`relative ${
            isCurrentPlan(plano.nome) ? 'ring-2 ring-indigo-500' : ''
          }`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {getPlanoIcon(plano.nome)}
                  <CardTitle className="capitalize">{plano.nome}</CardTitle>
                </div>
                <Badge className={getPlanoColor(plano.nome)}>
                  {isCurrentPlan(plano.nome) ? 'Atual' : ''}
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

              {!isCurrentPlan(plano.nome) && plano.nome !== 'gratuito' && (
                <Button 
                  onClick={() => createStripeCheckout(plano)}
                  disabled={isCreatingSubscription}
                  className="w-full"
                >
                  {isCreatingSubscription ? 'Criando...' : 'Assinar Plano'}
                </Button>
              )}

              {isCurrentPlan(plano.nome) && (
                <Badge className="w-full justify-center bg-green-100 text-green-800">
                  Plano Ativo
                </Badge>
              )}

              {plano.nome === 'gratuito' && !isCurrentPlan(plano.nome) && (
                <Badge className="w-full justify-center bg-gray-100 text-gray-800">
                  Plano Gratuito
                </Badge>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};