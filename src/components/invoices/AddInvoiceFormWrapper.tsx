import { useState } from 'react';
import { AddInvoiceForm } from './AddInvoiceForm';
import { UpgradeModal } from '@/components/plans/UpgradeModal';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddInvoiceFormWrapperProps {
  onSuccess: () => void;
}

export const AddInvoiceFormWrapper = ({ onSuccess }: AddInvoiceFormWrapperProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { limits, isLoading } = usePlanLimits();

  const handleAddClick = () => {
    if (!limits.canCreateInvoice) {
      setShowUpgradeModal(true);
      return;
    }
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    onSuccess();
  };

  if (isLoading) {
    return <Button disabled>Carregando...</Button>;
  }

  return (
    <>
      <Button onClick={handleAddClick} className="flex items-center gap-2">
        <Plus className="h-4 w-4" />
        Nova Nota Fiscal
      </Button>

      {showForm && (
        <AddInvoiceForm 
          open={showForm}
          onOpenChange={setShowForm}
        />
      )}

      <UpgradeModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        type="notas"
      />
    </>
  );
};
