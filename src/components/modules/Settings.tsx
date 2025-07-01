
import { Settings as SettingsIcon } from 'lucide-react';
import { SettingsManager } from '@/components/settings/SettingsManager';

export const Settings = () => {
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <SettingsIcon className="h-8 w-8" />
            Configurações
          </h1>
          <p className="text-gray-600 mt-1">
            Personalize o sistema conforme suas necessidades
          </p>
        </div>
      </div>

      <SettingsManager />
    </div>
  );
};
