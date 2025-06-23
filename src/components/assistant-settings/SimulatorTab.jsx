import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Send, User, Bot as BotIcon, Info, RefreshCw, Loader2 } from 'lucide-react';
import ActionableMessage from '@/components/assistant-settings/ActionableMessage.jsx';

const SimulatorTab = ({
    simulationMessages,
    simulationInput,
    setSimulationInput,
    handleSimulate,
    isSimulating,
    onClearSimulation,
    onConfirmAppointment,
}) => {

    const renderMessage = (msg) => {
        switch (msg.type) {
            case 'user':
                return (
                    <div className="flex items-start gap-2.5 justify-end">
                        <div className="p-3 rounded-lg max-w-md bg-primary text-primary-foreground">
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                        <User className="w-6 h-6 text-muted-foreground flex-shrink-0" />
                    </div>
                );
            case 'bot':
                 return (
                    <div className="flex items-start gap-2.5">
                        <BotIcon className="w-6 h-6 text-primary flex-shrink-0" />
                        <div className="p-3 rounded-lg max-w-md bg-muted">
                            <p className="text-sm whitespace-pre-wrap">{msg.text}</p>
                        </div>
                    </div>
                );
            case 'bot_action':
                return <ActionableMessage message={msg} onConfirm={onConfirmAppointment} />;
            case 'system':
                return (
                    <div className="flex items-center gap-2.5 text-yellow-600 my-2 justify-center">
                        <Info className="w-5 h-5 flex-shrink-0" />
                        <p className="text-xs font-medium text-center">{msg.text}</p>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <Card>
            <CardHeader className="flex flex-row justify-between items-start">
                <div>
                    <CardTitle>Simulador de Prueba</CardTitle>
                    <CardDescription>Simula una conversación para probar la configuración de tu asistente.</CardDescription>
                </div>
                <Button variant="ghost" size="icon" onClick={onClearSimulation} title="Reiniciar conversación">
                    <RefreshCw className="w-4 h-4" />
                </Button>
            </CardHeader>
            <CardContent>
                <div className="border rounded-lg h-[70vh] md:h-[32rem] flex flex-col bg-background/50">
                    <div className="flex-grow p-4 space-y-4 overflow-y-auto">
                        {simulationMessages.map((msg) => (
                           <div key={msg.id}>{renderMessage(msg)}</div>
                        ))}
                         {isSimulating && (
                            <div className="flex items-start gap-2.5">
                                <BotIcon className="w-6 h-6 text-primary flex-shrink-0" />
                                <div className="p-3 rounded-lg bg-muted flex items-center space-x-2">
                                    <Loader2 className="w-4 h-4 animate-spin" />
                                    <span className="text-sm">Pensando...</span>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="p-4 border-t flex items-center gap-2">
                        <Input
                            placeholder="Escribe un mensaje..."
                            value={simulationInput}
                            onChange={(e) => setSimulationInput(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSimulate()}
                            disabled={isSimulating}
                        />
                        <Button onClick={handleSimulate} disabled={isSimulating || !simulationInput}>
                            <Send className="w-4 h-4" />
                        </Button>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
};

export default SimulatorTab;