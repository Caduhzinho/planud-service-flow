
import { useState } from 'react';
import { AddAppointmentForm } from './AddAppointmentForm';
import { UpgradeModal } from '@/components/plans/UpgradeModal';
import { usePlanLimits } from '@/hooks/usePlanLimits';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

interface AddAppointmentFormWrapperProps {
  onSuccess: () => void;
}

export const AddAppointmentFormWrapper = ({ onSuccess }: AddAppointmentFormWrapperProps) => {
  const [showForm, setShowForm] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const { limits, isLoading } = usePlanLimits();

  const handleAddClick = () => {
    if (!limits.canCreateAppointment) {
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
        Novo Agendamento
      </Button>

      {showForm && (
        <AddAppointmentForm 
          open={showForm}
          onOpenChange={setShowForm}
          onSuccess={handleSuccess}
        />
      )}

      <UpgradeModal 
        open={showUpgradeModal}
        onOpenChange={setShowUpgradeModal}
        type="agendamentos"
      />
    </>
  );
};
