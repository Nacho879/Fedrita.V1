import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

const GeneralSettingsTab = ({ config, handleConfigChange, setPromptFromPreset }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuración General</CardTitle>
        <CardDescription>Activa el asistente y define su personalidad y comportamiento base.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <div className="space-y-0.5">
            <Label htmlFor="assistant-enabled" className="text-base">Activar Asistente</Label>
            <p className="text-sm text-muted-foreground">Permite que el asistente responda a los clientes.</p>
          </div>
          <Switch id="assistant-enabled" checked={config.enabled} onCheckedChange={(v) => handleConfigChange('enabled', v)} />
        </div>
        <div>
          <div className="flex flex-col sm:flex-row justify-between sm:items-center gap-2 mb-2">
            <Label htmlFor="base-prompt">Prompt Base del Asistente</Label>
            <div className="flex items-center gap-2 flex-wrap sm:flex-nowrap justify-start sm:justify-end">
              <span className="text-sm text-muted-foreground hidden sm:inline">Presets:</span>
              <Button size="sm" variant="outline" onClick={() => setPromptFromPreset('amigable')} className="w-full sm:w-auto">
                <Sparkles className="w-4 h-4 mr-2 text-yellow-500" /> Amigable
              </Button>
              <Button size="sm" variant="outline" onClick={() => setPromptFromPreset('formal')} className="w-full sm:w-auto">
                <Sparkles className="w-4 h-4 mr-2 text-blue-500" /> Formal
              </Button>
            </div>
          </div>
          <Textarea 
            id="base-prompt" 
            placeholder="Define la personalidad y las instrucciones principales del asistente." 
            rows={10} 
            value={config.prompt} 
            onChange={(e) => handleConfigChange('prompt', e.target.value)}
            className="text-sm leading-relaxed"
          />
          <p className="text-sm text-muted-foreground mt-2">Este es el cerebro del asistente. Define su tono, sus límites y sus objetivos principales. ¡Sé detallado!</p>
        </div>
      </CardContent>
    </Card>
  );
};

export default GeneralSettingsTab;