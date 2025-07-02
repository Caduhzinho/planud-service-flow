
import { useState } from 'react';
import { Plus, AlertTriangle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { InvoicesManager } from '@/components/invoices/InvoicesManager';
import { AddInvoiceFormWrapper } from '@/components/invoices/AddInvoiceFormWrapper';
import { useAuth } from '@/hooks/useAuth';

export const Invoices = () => {
  const { userData } = useAuth();
  const hasCnpj = userData?.empresa?.cnpj;

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Notas Fiscais</h1>
          <p className="text-gray-600 mt-1">
            Gerencie suas notas fiscais e envios
          </p>
        </div>
        <AddInvoiceFormWrapper onSuccess={() => window.location.reload()} />
      </div>

      {!hasCnpj && (
        <Alert>
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            Para emitir notas fiscais, você precisa cadastrar o CNPJ da sua empresa nas configurações.
          </AlertDescription>
        </Alert>
      )}

      <InvoicesManager />
    </div>
  );
};
