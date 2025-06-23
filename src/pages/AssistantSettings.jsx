import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useIA } from '@/hooks/useIA';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Bot, Save, Loader2, SlidersHorizontal, List, TestTube, History, CheckCircle, Plug, LayoutDashboard } from 'lucide-react';

import DashboardTab from '@/components/assistant-settings/DashboardTab';
import GeneralSettingsTab from '@/components/assistant-settings/GeneralSettingsTab';
import IntegrationsTab from '@/components/assistant-settings/IntegrationsTab';
import RulesSettingsTab from '@/components/assistant-settings/RulesSettingsTab';
import ServicesTab from '@/components/assistant-settings/ServicesTab';
import SimulatorTab from '@/components/assistant-settings/SimulatorTab';
import HistoryTab from '@/components/assistant-settings/HistoryTab';

const AssistantSettings = () => {
    const {
        config,
        services,
        employees,
        iaStats,
        simulationMessages,
        loading,
        isSaving,
        isSimulating,
        handleConfigChange,
        setPromptFromPreset,
        saveIAConfig,
        simulateInteraction,
        clearSimulation,
        testChannel,
        confirmAppointmentFromIA,
    } = useIA();

    const [simulationInput, setSimulationInput] = useState('');

    const handleSimulate = () => {
        if (!simulationInput.trim() || isSimulating) return;
        simulateInteraction(simulationInput);
        setSimulationInput('');
    };

    if (loading) {
        return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
    }

    const TABS = [
        { value: 'dashboard', icon: LayoutDashboard, label: 'Estadísticas' },
        { value: 'general', icon: SlidersHorizontal, label: 'General' },
        { value: 'integrations', icon: Plug, label: 'Integraciones' },
        { value: 'reglas', icon: List, label: 'Reglas' },
        { value: 'servicios', icon: CheckCircle, label: 'Servicios' },
        { value: 'simulador', icon: TestTube, label: 'Simulador' },
        { value: 'historial', icon: History, label: 'Historial' },
    ];

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <Card className="max-w-5xl mx-auto">
                    <CardHeader>
                        <div className="flex items-center gap-4">
                            <div className="p-3 bg-primary/10 rounded-full flex-shrink-0">
                                <Bot className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
                            </div>
                            <div>
                                <CardTitle className="text-xl sm:text-2xl">Configuración del Asistente IA</CardTitle>
                                <CardDescription>Gestiona tu asistente virtual para WhatsApp, Instagram y Facebook.</CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Tabs defaultValue="dashboard" className="w-full">
                            <div className="overflow-x-auto pb-2 -mb-2">
                                <TabsList className="inline-grid w-max grid-flow-col">
                                    {TABS.map(tab => (
                                        <TabsTrigger key={tab.value} value={tab.value} className="px-2 sm:px-3">
                                            <tab.icon className="w-4 h-4 sm:mr-2 flex-shrink-0" />
                                            <span className="hidden sm:inline">{tab.label}</span>
                                        </TabsTrigger>
                                    ))}
                                </TabsList>
                            </div>
                            
                            <TabsContent value="dashboard" className="mt-6">
                                <DashboardTab stats={iaStats} />
                            </TabsContent>

                            <TabsContent value="general" className="mt-6">
                                <GeneralSettingsTab config={config} handleConfigChange={handleConfigChange} setPromptFromPreset={setPromptFromPreset} />
                            </TabsContent>

                            <TabsContent value="integrations" className="mt-6">
                                <IntegrationsTab config={config} handleConfigChange={handleConfigChange} onTestChannel={testChannel} />
                            </TabsContent>

                            <TabsContent value="reglas" className="mt-6">
                                <RulesSettingsTab config={config} handleConfigChange={handleConfigChange} />
                            </TabsContent>

                            <TabsContent value="servicios" className="mt-6">
                                <ServicesTab services={services} employees={employees} />
                            </TabsContent>

                            <TabsContent value="simulador" className="mt-6">
                                <SimulatorTab 
                                    simulationMessages={simulationMessages}
                                    simulationInput={simulationInput}
                                    setSimulationInput={setSimulationInput}
                                    handleSimulate={handleSimulate}
                                    isSimulating={isSimulating}
                                    onClearSimulation={clearSimulation}
                                    onConfirmAppointment={confirmAppointmentFromIA}
                                />
                            </TabsContent>

                            <TabsContent value="historial" className="mt-6">
                                <HistoryTab logs={iaStats.logs} />
                            </TabsContent>
                        </Tabs>
                    </CardContent>
                    <CardFooter>
                        <Button onClick={saveIAConfig} disabled={isSaving} className="ml-auto">
                            {isSaving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                            Guardar Configuración
                        </Button>
                    </CardFooter>
                </Card>
            </motion.div>
        </div>
    );
};

export default AssistantSettings;