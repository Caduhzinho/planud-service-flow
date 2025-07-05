
import { useState } from 'react';
import { ArrowDown, Calendar, Check, FileText, Users, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface LandingHeroProps {
  onLogin?: () => void;
  onRegister?: () => void;
}

export const LandingHero = ({ onLogin, onRegister }: LandingHeroProps = {}) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    element?.scrollIntoView({ behavior: 'smooth' });
    setIsMenuOpen(false);
  };

  const features = [
    {
      icon: Calendar,
      title: "Agendamentos Organizados",
      description: "Sistema completo para cadastrar clientes, agendar serviços e controlar horários"
    },
    {
      icon: FileText,
      title: "Cobrança Automática", 
      description: "Envie cobranças por PIX, boleto e cartão via Asaas - o dinheiro vai direto para sua conta"
    },
    {
      icon: Zap,
      title: "Controle Financeiro",
      description: "Acompanhe receitas, despesas e status de pagamentos em tempo real"
    },
    {
      icon: Users,
      title: "Multiempresa",
      description: "Cada empresa tem seus dados separados e seguros, com controle total de acesso"
    }
  ];

  const plans = [
    {
      name: "Gratuito",
      price: "Grátis",
      description: "Ideal para testar",
      features: [
        "1 prestador",
        "10 agendamentos/mês",
        "Painel básico",
        "Suporte por email"
      ],
      highlighted: false,
      buttonText: "Começar Grátis"
    },
    {
      name: "Profissional",
      price: "R$ 49,90",
      description: "Para automação real",
      features: [
        "Até 5 prestadores",
        "Agendamento e cobrança automáticos",
        "Fluxos personalizados",
        "Relatórios e painel completo",
        "Integração com Asaas"
      ],
      highlighted: true,
      buttonText: "Assinar Profissional"
    },
    {
      name: "Avançado", 
      price: "R$ 99,90",
      description: "Para equipes maiores",
      features: [
        "Até 15 prestadores",
        "Assistente automatizado por WhatsApp",
        "Integrações completas",
        "Suporte prioritário",
        "Relatórios avançados"
      ],
      highlighted: false,
      buttonText: "Assinar Avançado"
    }
  ];

  const integrations = [
    { name: "Asaas", description: "Pagamentos automáticos" },
    { name: "n8n", description: "Fluxos de automação" },
    { name: "WhatsApp", description: "Comunicação (futuro)" },
    { name: "Supabase", description: "Banco de dados seguro" }
  ];

  const testimonials = [
    {
      name: "Maria Silva",
      business: "Clínica de Estética", 
      text: "O Planud organizou minha agenda e automatizou as cobranças. Agora recebo direto na conta via Asaas!",
      avatar: "MS"
    },
    {
      name: "João Santos",
      business: "Oficina Mecânica",
      text: "Sistema prático e funcional. Controlo agendamentos e financeiro em um lugar só.",
      avatar: "JS"
    },
    {
      name: "Ana Costa",
      business: "Salão de Beleza",
      text: "Painel simples, dados seguros e cobranças automáticas. Exatamente o que precisava!",
      avatar: "AC"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/20">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-lg border-b border-border/40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">P</span>
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                Planud
              </span>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              <button 
                onClick={() => scrollToSection('inicio')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Início
              </button>
              <button 
                onClick={() => scrollToSection('funcionalidades')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Funcionalidades
              </button>
              <button 
                onClick={() => scrollToSection('planos')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Planos
              </button>
              <button 
                onClick={() => scrollToSection('depoimentos')}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Depoimentos
              </button>
              <button 
                onClick={onLogin}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                Login
              </button>
              <Button 
                onClick={onRegister}
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90"
              >
                Começar Grátis
              </Button>
            </nav>

            {/* Mobile menu button */}
            <button 
              className="md:hidden"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <div className="w-6 h-6 flex flex-col justify-center space-y-1">
                <span className={`w-full h-0.5 bg-foreground transition-all ${isMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
                <span className={`w-full h-0.5 bg-foreground transition-all ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                <span className={`w-full h-0.5 bg-foreground transition-all ${isMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
              </div>
            </button>
          </div>

          {/* Mobile Navigation */}
          {isMenuOpen && (
            <div className="md:hidden py-4 animate-fade-in">
              <div className="flex flex-col space-y-4">
                <button onClick={() => scrollToSection('inicio')} className="text-left text-muted-foreground hover:text-foreground">
                  Início
                </button>
                <button onClick={() => scrollToSection('funcionalidades')} className="text-left text-muted-foreground hover:text-foreground">
                  Funcionalidades
                </button>
                <button onClick={() => scrollToSection('planos')} className="text-left text-muted-foreground hover:text-foreground">
                  Planos
                </button>
                <button onClick={() => scrollToSection('depoimentos')} className="text-left text-muted-foreground hover:text-foreground">
                  Depoimentos
                </button>
                <button onClick={onLogin} className="text-left text-muted-foreground hover:text-foreground">
                  Login
                </button>
                <Button 
                  onClick={onRegister}
                  className="w-fit bg-gradient-to-r from-primary to-secondary"
                >
                  Começar Grátis
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      {/* Hero Section */}
      <section id="inicio" className="py-20 lg:py-32">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in">
            <Badge className="mb-6 bg-gradient-to-r from-primary/10 to-secondary/10 text-primary border-primary/20">
              🎯 Sistema completo para empresas de serviços
            </Badge>
            
            <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-foreground via-primary to-secondary bg-clip-text text-transparent leading-tight">
              Automatize sua empresa<br />
              de serviços com tecnologia inteligente
            </h1>
            
            <p className="text-xl text-muted-foreground mb-8 max-w-3xl mx-auto leading-relaxed">
              Transforme atendimentos, agendamentos e cobranças em processos automáticos.
              Com integração ao Asaas, o dinheiro vai direto para sua conta.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
              <Button 
                size="lg" 
                className="bg-gradient-to-r from-primary to-secondary hover:opacity-90 px-8 py-6 text-lg"
                onClick={onRegister || (() => window.location.href = '/dashboard')}
              >
                Começar Grátis
              </Button>
              <Button 
                size="lg" 
                variant="outline" 
                className="px-8 py-6 text-lg border-primary/20 hover:bg-primary/5"
                onClick={() => scrollToSection('funcionalidades')}
              >
                Ver Demonstração
              </Button>
            </div>

            <div className="relative max-w-4xl mx-auto">
              <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-2xl blur-3xl"></div>
              <div className="relative bg-card border border-border/50 rounded-2xl p-8 shadow-2xl">
                <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">200+</div>
                    <div className="text-sm text-muted-foreground">Empresas usando</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">5k+</div>
                    <div className="text-sm text-muted-foreground">Agendamentos</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">95%</div>
                    <div className="text-sm text-muted-foreground">Satisfação</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-primary mb-2">24/7</div>
                    <div className="text-sm text-muted-foreground">Sistema online</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="funcionalidades" className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Funcionalidades práticas para seu negócio
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Sistema completo para gestão de agendamentos, cobrança e controle financeiro
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="border-border/50 hover:border-primary/30 transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
                  <CardHeader className="text-center">
                    <div className="w-16 h-16 bg-gradient-to-br from-primary to-secondary rounded-2xl mx-auto mb-4 flex items-center justify-center">
                      <Icon className="w-8 h-8 text-white" />
                    </div>
                    <CardTitle className="text-lg">{feature.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <CardDescription className="text-center">
                      {feature.description}
                    </CardDescription>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Plans Section */}
      <section id="planos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Planos para cada tipo de negócio
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Escolha o plano ideal para sua empresa e comece a automatizar hoje mesmo
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {plans.map((plan, index) => (
              <Card 
                key={index} 
                className={`relative ${
                  plan.highlighted 
                    ? 'border-primary shadow-2xl scale-105' 
                    : 'border-border/50'
                } transition-all duration-300 hover:shadow-lg`}
              >
                {plan.highlighted && (
                  <Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-primary to-secondary">
                    Mais Popular
                  </Badge>
                )}
                
                <CardHeader className="text-center">
                  <CardTitle className="text-2xl">{plan.name}</CardTitle>
                  <div className="text-3xl font-bold text-primary mt-2">
                    {plan.price}
                    {plan.price !== "Grátis" && <span className="text-lg text-muted-foreground">/mês</span>}
                  </div>
                  <CardDescription>{plan.description}</CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-6">
                  <div className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start gap-3">
                        <Check className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                        <span className="text-sm">{feature}</span>
                      </div>
                    ))}
                  </div>
                  
                  <Button 
                    className={`w-full ${
                      plan.highlighted 
                        ? 'bg-gradient-to-r from-primary to-secondary hover:opacity-90' 
                        : 'variant-outline'
                    }`}
                    onClick={onRegister || (() => window.location.href = '/dashboard')}
                  >
                    {plan.buttonText}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Integrations Section */}
      <section className="py-20 bg-muted/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Integrações poderosas
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Conecte-se com as melhores ferramentas do mercado
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {integrations.map((integration, index) => (
              <Card key={index} className="text-center border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardHeader>
                  <div className="w-16 h-16 bg-gradient-to-br from-muted to-muted-foreground/10 rounded-2xl mx-auto mb-4 flex items-center justify-center">
                    <span className="text-2xl font-bold text-primary">
                      {integration.name.charAt(0)}
                    </span>
                  </div>
                  <CardTitle className="text-lg">{integration.name}</CardTitle>
                  <CardDescription>{integration.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="depoimentos" className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              O que nossos clientes dizem
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Depoimentos reais de empresários que transformaram seus negócios
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <Card key={index} className="border-border/50 hover:border-primary/30 transition-all duration-300">
                <CardContent className="pt-6">
                  <div className="flex items-center gap-4 mb-4">
                    <div className="w-12 h-12 bg-gradient-to-br from-primary to-secondary rounded-full flex items-center justify-center text-white font-bold">
                      {testimonial.avatar}
                    </div>
                    <div>
                      <div className="font-semibold">{testimonial.name}</div>
                      <div className="text-sm text-muted-foreground">{testimonial.business}</div>
                    </div>
                  </div>
                  <p className="text-muted-foreground italic">"{testimonial.text}"</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary to-secondary">
        <div className="max-w-4xl mx-auto text-center px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            Pronto para automatizar sua empresa?
          </h2>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Junte-se a milhares de empresários que já transformaram seus negócios com o Planud
          </p>
          <Button 
            size="lg" 
            className="bg-white text-primary hover:bg-white/90 px-12 py-6 text-lg font-semibold"
            onClick={onRegister || (() => window.location.href = '/dashboard')}
          >
            Começar Agora – É Grátis!
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-background border-t border-border/50 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="md:col-span-2">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-primary to-secondary rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">P</span>
                </div>
                <span className="text-xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
                  Planud
                </span>
              </div>
              <p className="text-muted-foreground mb-4 max-w-md">
                Sistema completo para empresas de serviços: agendamentos, cobrança via Asaas e controle financeiro.
              </p>
              <p className="text-sm text-muted-foreground">
                © 2025 Planud - Todos os direitos reservados
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Produto</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <button onClick={() => scrollToSection('funcionalidades')} className="block hover:text-foreground">
                  Funcionalidades
                </button>
                <button onClick={() => scrollToSection('planos')} className="block hover:text-foreground">
                  Planos
                </button>
                <button onClick={onLogin} className="block hover:text-foreground">
                  Login
                </button>
              </div>
            </div>

            <div>
              <h3 className="font-semibold mb-4">Suporte</h3>
              <div className="space-y-2 text-sm text-muted-foreground">
                <a href="/termos" className="block hover:text-foreground">
                  Termos de uso
                </a>
                <a href="/privacidade" className="block hover:text-foreground">
                  Política de privacidade
                </a>
                <a href="mailto:contato@planud.com" className="block hover:text-foreground">
                  Contato
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};
