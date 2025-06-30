
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { FinancialManager } from '@/components/financial/FinancialManager';
import { AddFinancialForm } from '@/components/financial/AddFinancialForm';
import { FinancialStats } from '@/components/financial/FinancialStats';

export const Financial = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financeiro</h1>
          <p className="text-gray-600 mt-1">
            Controle suas receitas e despesas
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Movimentação
        </Button>
      </div>

      <FinancialStats />
      
      <FinancialManager />
      
      <AddFinancialForm 
        open={showAddForm} 
        onOpenChange={setShowAddForm}
      />
    </div>
  );
};
