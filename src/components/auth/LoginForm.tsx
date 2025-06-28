
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowLeft, Zap } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface LoginFormProps {
  onBack: () => void;
  onRegister: () => void;
}

export const LoginForm = ({ onBack, onRegister }: LoginFormProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const { signIn } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const { error } = await signIn(email, password);

      if (error) {
        if (error.message.includes('Invalid login credentials')) {
          toast.error('Email ou senha incorretos');
        } else {
          toast.error('Erro ao fazer login: ' + error.message);
        }
      } else {
        toast.success('Login realizado com sucesso!');
        navigate('/dashboard');
      }
    } catch (error) {
      toast.error('Erro inesperado ao fazer login');
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
            Bem-vindo de volta
          </h1>
          <p className="text-gray-600">
            Faça login para acessar sua empresa
          </p>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
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

          <Button 
            type="submit" 
            className="w-full bg-indigo-600 hover:bg-indigo-700 h-11 rounded-xl font-medium"
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>
        </form>

        <div className="mt-6 text-center">
          <p className="text-gray-600">
            Não tem uma conta?{' '}
            <button
              onClick={onRegister}
              className="text-indigo-600 hover:text-indigo-700 font-medium"
            >
              Cadastrar-se
            </button>
          </p>
        </div>
      </Card>
    </div>
  );
};
