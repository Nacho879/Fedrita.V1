import React from 'react';
import MetaChannelsSettings from '@/components/assistant-settings/MetaChannelsSettings.jsx';
import AIProviderSettings from '@/components/assistant-settings/AIProviderSettings.jsx';

const IntegrationsTab = ({ config, handleConfigChange, onTestChannel }) => {
  return (
    <div className="space-y-8">
      <MetaChannelsSettings config={config} handleConfigChange={handleConfigChange} onTestChannel={onTestChannel} />
      <AIProviderSettings config={config} handleConfigChange={handleConfigChange} />
    </div>
  );
};

export default IntegrationsTab;