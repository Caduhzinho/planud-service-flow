import { Settings as SettingsIcon } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { SettingsManager } from '@/components/settings/SettingsManager';
import { PlansManager } from '@/components/plans/PlansManager';

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

      <Tabs defaultValue="geral" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="geral">Configurações Gerais</TabsTrigger>
          <TabsTrigger value="planos">Planos e Assinatura</TabsTrigger>
        </TabsList>
        
        <TabsContent value="geral">
          <SettingsManager />
        </TabsContent>
        
        <TabsContent value="planos">
          <PlansManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};
