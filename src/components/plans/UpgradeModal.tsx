import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Crown, Zap } from 'lucide-react';

interface UpgradeModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  type: 'agendamentos' | 'notas';
}

export const UpgradeModal = ({ open, onOpenChange, type }: UpgradeModalProps) => {
  const handleUpgrade = () => {
    window.location.href = '/configuracoes?tab=planos';
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Crown className="h-5 w-5 text-yellow-600" />
            Limite Atingido
          </DialogTitle>
          <DialogDescription>
            Você atingiu o limite de {type === 'agendamentos' ? 'agendamentos' : 'notas fiscais'} do seu plano atual.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="bg-gradient-to-r from-indigo-50 to-purple-50 p-4 rounded-lg">
            <div className="flex items-center gap-2 mb-2">
              <Zap className="h-5 w-5 text-indigo-600" />
              <span className="font-medium">Faça upgrade e desbloqueie:</span>
            </div>
            <ul className="space-y-1 text-sm text-gray-600">
              <li>• {type === 'agendamentos' ? 'Mais agendamentos' : 'Mais notas fiscais'} por mês</li>
              <li>• Automações inteligentes</li>
              <li>• Logo personalizada</li>
              <li>• Suporte prioritário</li>
            </ul>
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Fechar
            </Button>
            <Button onClick={handleUpgrade} className="flex-1">
              Ver Planos
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
