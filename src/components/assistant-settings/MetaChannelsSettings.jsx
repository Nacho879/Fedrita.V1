import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, TestTube } from 'lucide-react';

const ChannelTokenInput = ({ value, onChange }) => {
  const [showToken, setShowToken] = useState(false);
  return (
    <div className="relative">
      <Input
        type={showToken ? 'text' : 'password'}
        placeholder="Pega tu token aquí"
        value={value}
        onChange={onChange}
      />
      <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7" onClick={() => setShowToken(!showToken)}>
        {showToken ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
      </Button>
    </div>
  );
};

const MetaChannelsSettings = ({ config, handleConfigChange, onTestChannel }) => {
  const channels = config.integrations.metaChannels;

  const renderChannelTab = (channelKey, title, fields) => {
    const channelConfig = channels[channelKey];
    return (
      <TabsContent value={channelKey} className="mt-6 space-y-4">
        <div className="flex items-center justify-between rounded-lg border p-4">
          <Label htmlFor={`${channelKey}-enabled`} className="text-base">Activar Canal de {title}</Label>
          <Switch id={`${channelKey}-enabled`} checked={channelConfig.enabled} onCheckedChange={(v) => handleConfigChange(`integrations.metaChannels.${channelKey}.enabled`, v)} />
        </div>
        {fields.map(field => (
          <div className="space-y-2" key={field.id}>
            <Label htmlFor={`${channelKey}-${field.id}`}>{field.label}</Label>
            {field.type === 'token' ? (
              <ChannelTokenInput value={channelConfig[field.key]} onChange={(e) => handleConfigChange(`integrations.metaChannels.${channelKey}.${field.key}`, e.target.value)} />
            ) : (
              <Input id={`${channelKey}-${field.id}`} placeholder={field.placeholder} value={channelConfig[field.key]} onChange={(e) => handleConfigChange(`integrations.metaChannels.${channelKey}.${field.key}`, e.target.value)} />
            )}
          </div>
        ))}
        <div className="flex justify-end pt-2">
            <Button
                variant="outline"
                onClick={() => onTestChannel(title)}
                disabled={!channelConfig.enabled || !channelConfig.token}
            >
                <TestTube className="w-4 h-4 mr-2" />
                Probar Canal
            </Button>
        </div>
      </TabsContent>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Conexión con Canales Meta</CardTitle>
        <CardDescription>Configura los canales de WhatsApp, Instagram y Facebook Messenger.</CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="whatsapp" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="whatsapp">WhatsApp</TabsTrigger>
            <TabsTrigger value="instagram">Instagram</TabsTrigger>
            <TabsTrigger value="facebook">Facebook</TabsTrigger>
          </TabsList>
          
          {renderChannelTab('whatsapp', 'WhatsApp', [
            { id: 'token', label: 'Token API de Meta (Access Token)', type: 'token', key: 'token' },
            { id: 'phone', label: 'Número de teléfono asociado', placeholder: '+1234567890', key: 'phoneNumber' },
            { id: 'waba-id', label: 'ID de cuenta de WhatsApp Business (WABA ID)', placeholder: 'ID de tu cuenta de WABA', key: 'wabaId' },
          ])}

          {renderChannelTab('instagram', 'Instagram', [
            { id: 'token', label: 'Token API de Meta (Access Token)', type: 'token', key: 'token' },
            { id: 'page-id', label: 'ID de la Página de Facebook conectada', placeholder: '1000...', key: 'pageId' },
            { id: 'username', label: 'Usuario de Instagram (Opcional)', placeholder: '@tu-usuario', key: 'username' },
          ])}

          {renderChannelTab('facebook', 'Facebook', [
            { id: 'token', label: 'Token API de Meta (Access Token)', type: 'token', key: 'token' },
            { id: 'page-id', label: 'ID de la Página', placeholder: '1000...', key: 'pageId' },
            { id: 'page-name', label: 'Nombre de la página (Opcional)', placeholder: 'Nombre de tu página de Facebook', key: 'pageName' },
          ])}
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MetaChannelsSettings;