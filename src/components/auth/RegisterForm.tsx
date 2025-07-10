import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface RegisterFormProps {
  onBack: () => void;
  onLogin: () => void;
}

const ramoOptions = [
  'Salão de Beleza',
  'Barbeiro',
  'Técnico em Refrigeração',
  'Esteticista',
  'Eletricista',
  'Manicure e Pedicure',
  'Instalador de Ar Condicionado',
  'Jardineiro',
  'Autônomo Geral',
  'Mecânico',
  'Pet Shop',
  'Consultoria',
  'Psicólogo',
  'Nutricionista',
  'Outros'
];

export const RegisterForm = ({ onBack, onLogin }: RegisterFormProps) => {
  const [nome, setNome] = useState('');
  const [empresaNome, setEmpresaNome] = useState('');
  const [empresaRamo, setEmpresaRamo] = useState('');
  const [empresaPlano, setEmpresaPlano] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signUp } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (password !== confirmPassword) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (password.length < 6) {
      toast.error('A senha deve ter pelo menos 6 caracteres');
      return;
    }

    if (!empresaRamo || !empresaPlano) {
      toast.error('Por favor, preencha todos os campos obrigatórios');
      return;
    }

    setLoading(true);

    try {
      const { error } = await signUp(email, password, {
        nome,
        empresaNome,
        empresaRamo,
        empresaPlano
      });

      if (error) {
        if (error.message.includes('already registered')) {
          toast.error('Este email já está cadastrado');
        } else {
          toast.error('Erro ao criar conta: ' + error.message);
        }
      } else {
        toast.success('Conta criada com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Erro inesperado ao criar conta');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 flex items-center justify-center p-6">
      <Card className="w-full max-w-md p-8 rounded-2xl border-0 shadow-xl bg-white">
        <div className="flex items-center mb-8">
          <Button variant="ghost" onClick={onBack} className="p-2 -ml-2">
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <div className="flex items-center space-x-3 mx-auto">
            <div className="w-8 h-8 bg-gradient-to-br from-indigo-600 to-purple-600 rounded-xl flex items-center justify-center">
              <Zap className="h-4 w-4 text-white" />
            </div>
            <span className="text-xl font-bold text-gray-900">Planud</span>
          </div>
        </div>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Crie sua conta
          </h1>
          <p className="text-gray-600">
            Automatize sua empresa em minutos
          </p>
        </div>

        <form onSubmit={handleRegister} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="nome">Seu Nome</Label>
            <Input
              id="nome"
              type="text"
              placeholder="João Silva"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresaNome">Nome da Empresa</Label>
            <Input
              id="empresaNome"
              type="text"
              placeholder="Sua Empresa Ltda"
              value={empresaNome}
              onChange={(e) => setEmpresaNome(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresaRamo">Ramo de Atuação</Label>
            <Select value={empresaRamo} onValueChange={setEmpresaRamo} required>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Selecione o ramo" />
              </SelectTrigger>
              <SelectContent>
                {ramoOptions.map((ramo) => (
                  <SelectItem key={ramo} value={ramo}>
                    {ramo}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="empresaPlano">Plano</Label>
            <Select value={empresaPlano} onValueChange={setEmpresaPlano} required>
              <SelectTrigger className="h-11 rounded-xl">
                <SelectValue placeholder="Selecione o plano" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Básico">Básico</SelectItem>
                <SelectItem value="Intermediário">Intermediário</SelectItem>
                <SelectItem value="Pro">Pro</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="password">Senha</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">Confirmar Senha</Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="h-11 rounded-xl"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl font-medium"
            disabled={loading}
          >
            {loading ? 'Criando conta...' : 'Criar Conta'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Já tem uma conta?{' '}
            <button
              onClick={onLogin}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Fazer login
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
