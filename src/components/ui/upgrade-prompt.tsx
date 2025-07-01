
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Crown, Zap } from 'lucide-react';

interface UpgradePromptProps {
  message: string;
  action: string;
  to?: string;
  onClick?: () => void;
}

export const UpgradePrompt = ({ message, action, to, onClick }: UpgradePromptProps) => {
  const handleClick = () => {
    if (to) {
      window.location.href = to;
    } else if (onClick) {
      onClick();
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[400px] p-8">
      <Card className="max-w-md w-full">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div className="p-3 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full">
              <Crown className="h-6 w-6 text-white" />
            </div>
          </div>
          <CardTitle className="flex items-center gap-2 justify-center">
            <Zap className="h-5 w-5 text-indigo-600" />
            Upgrade Necessário
          </CardTitle>
          <CardDescription>
            {message}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• Recursos ilimitados</li>
              <li>• Automações inteligentes</li>
              <li>• Logo personalizada</li>
              <li>• Suporte prioritário</li>
            </ul>
          </div>
          <Button onClick={handleClick} className="w-full">
            {action}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};
