import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';

const ModelSettingsTab = ({ config, handleConfigChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Modelo de IA</CardTitle>
        <CardDescription>Define el "cerebro" de tu asistente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <Label htmlFor="ia-provider">Proveedor de IA</Label>
          <Select value={config.model.provider} onValueChange={(v) => handleConfigChange('model.provider', v)}>
            <SelectTrigger id="ia-provider"><SelectValue placeholder="Selecciona un proveedor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="openai">OpenAI (GPT-4, GPT-3.5)</SelectItem>
              <SelectItem value="gemini">Google Gemini</SelectItem>
              <SelectItem value="deepseek">DeepSeek</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label htmlFor="base-prompt">Prompt Base</Label>
          <Textarea id="base-prompt" placeholder="Define la personalidad y las instrucciones principales del asistente." rows={8} value={config.model.prompt} onChange={(e) => handleConfigChange('model.prompt', e.target.value)} />
        </div>
      </CardContent>
    </Card>
  );
};

export default ModelSettingsTab;