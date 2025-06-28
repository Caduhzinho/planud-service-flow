
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Calendar, Users, DollarSign, FileText, Zap, Star } from 'lucide-react';

interface LandingHeroProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const LandingHero = ({ onLogin, onRegister }: LandingHeroProps) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Planud</span>
          </div>
          <div className="flex items-center space-x-3">
            <Button variant="ghost" onClick={onLogin} className="font-medium">
              Entrar
            </Button>
            <Button onClick={onRegister} className="bg-indigo-600 hover:bg-indigo-700 h-11 px-5 rounded-xl font-medium">
              Começar Grátis
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-6 py-20">
        <div className="text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center space-x-2 bg-indigo-50 text-indigo-700 px-4 py-2 rounded-full text-sm font-medium mb-8">
            <Star className="h-4 w-4" />
            <span>O SaaS completo para prestadores de serviço</span>
          </div>
          
          <h1 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Automatize sua empresa de 
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600"> serviços</span>
          </h1>
          
          <p className="text-xl text-gray-600 mb-10 leading-relaxed">
            Do agendamento ao recebimento: gerencie clientes, emita notas fiscais, 
            receba pagamentos e conte com IA para automatizar tudo.
          </p>
          
          <div className="flex items-center justify-center space-x-4 mb-16">
            <Button onClick={onRegister} size="lg" className="bg-indigo-600 hover:bg-indigo-700 h-12 px-8 rounded-xl font-medium text-base">
              Começar Gratuitamente
            </Button>
            <Button variant="outline" size="lg" className="h-12 px-8 rounded-xl font-medium text-base">
              Ver Demo
            </Button>
          </div>
        </div>

        {/* Features Cards */}
        <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
          <Card className="p-8 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-6">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Agendamentos Inteligentes</h3>
            <p className="text-gray-600 leading-relaxed">
              Sistema completo de agendamentos com IA que sugere horários e confirma automaticamente via WhatsApp.
            </p>
          </Card>

          <Card className="p-8 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center mb-6">
              <Users className="h-6 w-6 text-green-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Gestão de Clientes</h3>
            <p className="text-gray-600 leading-relaxed">
              Perfis completos dos clientes com histórico, tags automáticas e classificação por IA.
            </p>
          </Card>

          <Card className="p-8 rounded-2xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-white">
            <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-6">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-3">Notas Fiscais Automáticas</h3>
            <p className="text-gray-600 leading-relaxed">
              Emissão automática de NFS-e ao finalizar serviços, com envio via WhatsApp e geração de cobrança.
            </p>
          </Card>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-20">
        <div className="max-w-4xl mx-auto text-center px-6">
          <h2 className="text-3xl font-bold mb-4">
            Pronto para automatizar sua empresa?
          </h2>
          <p className="text-xl opacity-90 mb-8">
            Junte-se a centenas de empresas que já automatizaram seus processos
          </p>
          <Button onClick={onRegister} size="lg" className="bg-white text-indigo-600 hover:bg-gray-50 h-12 px-8 rounded-xl font-medium text-base">
            Começar Agora - Grátis
          </Button>
        </div>
      </section>
    </div>
  );
};
