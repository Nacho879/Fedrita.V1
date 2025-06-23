import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';

const MODEL_OPTIONS = {
  openai: [
    { value: 'gpt-4', label: 'GPT-4' },
    { value: 'gpt-4-turbo', label: 'GPT-4 Turbo' },
    { value: 'gpt-3.5-turbo', label: 'GPT-3.5 Turbo' },
  ],
  gemini: [
    { value: 'gemini-pro', label: 'Gemini Pro' },
    { value: 'gemini-flash', label: 'Gemini Flash' },
  ],
  deepseek: [
    { value: 'deepseek-v2', label: 'DeepSeek V2' },
    { value: 'deepseek-coder', label: 'DeepSeek Coder' },
  ],
};

const getApiKeyPlaceholder = (provider) => {
    switch (provider) {
        case 'openai': return 'Pega tu API Key de OpenAI';
        case 'gemini': return 'Pega tu API Key de Google AI';
        case 'deepseek': return 'Pega tu API Key de DeepSeek';
        default: return 'Pega tu API Key';
    }
};

const ApiKeyInput = ({ value, onChange, provider }) => {
  const [showKey, setShowKey] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showKey ? 'text' : 'password'}
        placeholder={getApiKeyPlaceholder(provider)}
        value={value}
        onChange={onChange}
      />
      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowKey(!showKey)}>
        {showKey ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const AIProviderSettings = ({ config, handleConfigChange }) => {
  const aiProviderConfig = config.integrations.aiProvider;

  const handleProviderChange = (newProvider) => {
    handleConfigChange('integrations.aiProvider.provider', newProvider);
    const defaultModel = MODEL_OPTIONS[newProvider]?.[0]?.value || '';
    handleConfigChange('integrations.aiProvider.model', defaultModel);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Proveedor de IA</CardTitle>
        <CardDescription>Configura la conexión con tu proveedor de IA (OpenAI, Google Gemini o DeepSeek).</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
                <Label htmlFor="ai-provider">Proveedor</Label>
                <Select value={aiProviderConfig.provider} onValueChange={handleProviderChange}>
                    <SelectTrigger id="ai-provider">
                        <SelectValue placeholder="Selecciona un proveedor" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectItem value="openai">OpenAI</SelectItem>
                        <SelectItem value="gemini">Google Gemini</SelectItem>
                        <SelectItem value="deepseek">DeepSeek</SelectItem>
                    </SelectContent>
                </Select>
            </div>
            <div className="space-y-2">
                <Label htmlFor="api-key">API Key</Label>
                <ApiKeyInput 
                    provider={aiProviderConfig.provider}
                    value={aiProviderConfig.apiKey} 
                    onChange={(e) => handleConfigChange('integrations.aiProvider.apiKey', e.target.value)} 
                />
            </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <Label htmlFor="ai-model">Modelo de IA</Label>
            <Select value={aiProviderConfig.model} onValueChange={(v) => handleConfigChange('integrations.aiProvider.model', v)}>
              <SelectTrigger id="ai-model">
                <SelectValue placeholder="Selecciona un modelo" />
              </SelectTrigger>
              <SelectContent>
                {MODEL_OPTIONS[aiProviderConfig.provider]?.map(model => (
                    <SelectItem key={model.value} value={model.value}>{model.label}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="temperature">Temperatura</Label>
            <div className="flex items-center gap-4">
              <Slider
                id="temperature"
                min={0}
                max={1}
                step={0.1}
                value={[aiProviderConfig.temperature]}
                onValueChange={(v) => handleConfigChange('integrations.aiProvider.temperature', v[0])}
              />
              <span className="text-sm font-medium w-12 text-center">{aiProviderConfig.temperature.toFixed(1)}</span>
            </div>
            <p className="text-xs text-muted-foreground">Valores más altos (ej. 0.8) son más creativos, valores bajos (ej. 0.2) son más predecibles.</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default AIProviderSettings;