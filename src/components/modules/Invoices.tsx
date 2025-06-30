
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { InvoicesManager } from '@/components/invoices/InvoicesManager';
import { AddInvoiceForm } from '@/components/invoices/AddInvoiceForm';

export const Invoices = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas notas fiscais e envios
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" />
          Nova Nota Fiscal
        </Button>
      </div>

      <InvoicesManager />
      
      <AddInvoiceForm 
        open={showAddForm} 
        onOpenChange={setShowAddForm}
      />
    </div>
  );
};
