
import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDemo } from '@/hooks/useDemo';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { DEMO_SERVICES, DEMO_EMPLOYEES } from '@/lib/demo-data';

const IAContext = createContext();

export const useIA = () => {
    const context = useContext(IAContext);
    if (!context) {
        throw new Error('useIA must be used within an IAProvider');
    }
    return context;
};

const PROMPT_PRESETS = {
  amigable: "Eres un asistente virtual amigable y cercano para un salón de belleza. Tu nombre es Lexi. Tu objetivo es ser amable, eficiente y ayudar a los clientes a agendar citas. Siempre usas emojis para hacer la conversación más amena. Solo puedes agendar citas, no cancelarlas ni reprogramarlas. Si no entiendes algo, pide al cliente que lo reformule. Si insiste, dile que un humano del equipo se pondrá en contacto pronto.",
  formal: "Usted es un asistente virtual profesional para un centro de estética. Su principal función es gestionar la reserva de citas de manera eficiente y cordial. No debe cancelar ni reprogramar citas; si un cliente lo solicita, indique que un miembro del personal se comunicará para atender su petición. Si no comprende una solicitud, pida amablemente que se reformule. Ante la insistencia, informe al cliente que su consulta será escalada a un agente humano.",
};

const DEFAULT_CONFIG = {
    enabled: true,
    prompt: PROMPT_PRESETS.amigable,
    integrations: {
        metaChannels: {
            whatsapp: { enabled: true, token: '', phoneNumber: '', wabaId: '' },
            instagram: { enabled: false, token: '', pageId: '', username: '' },
            facebook: { enabled: false, token: '', pageId: '', pageName: '' },
        },
        aiProvider: {
            provider: 'openai',
            apiKey: '',
            model: 'gpt-4',
            temperature: 0.7,
            tokenLimit: 2048,
        }
    },
    rules: {
        canCancel: false,
        canReschedule: false,
        escalateToHuman: true,
        assignmentLogic: 'first_available',
    },
};

const DEMO_IA_STATS = {
    totalAppointments: 128,
    processedMessages: 1450,
    errors: 23,
    interactionsByChannel: [
        { name: 'WhatsApp', value: 980, fill: '#25D366' },
        { name: 'Instagram', value: 320, fill: '#E4405F' },
        { name: 'Facebook', value: 150, fill: '#1877F2' },
    ],
    logs: [
        { id: 1, client: 'Cliente Demo 1', channel: 'WhatsApp', message: 'Hola, quiero una cita para corte', action: 'Proponer Cita', result: 'success', timestamp: new Date().toISOString() },
        { id: 2, client: 'Cliente Demo 2', channel: 'Instagram', message: '¿Cuánto cuesta el tinte?', action: 'Informar Precio', result: 'success', timestamp: new Date().toISOString() },
        { id: 3, client: 'Cliente Demo 3', channel: 'Facebook', message: 'asdasd', action: 'Derivar a humano', result: 'failure', timestamp: new Date().toISOString() },
        { id: 4, client: 'Cliente Demo 4', channel: 'WhatsApp', message: 'Necesito cancelar mi cita de mañana', action: 'Derivar a humano', result: 'failure', timestamp: new Date().toISOString() },
    ]
};

export const IAProvider = ({ children }) => {
    const { company, salonId, user } = useAuth();
    const { isDemo } = useDemo();
    const { toast } = useToast();

    const [config, setConfig] = useState(DEFAULT_CONFIG);
    const [configId, setConfigId] = useState(null);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [iaStats, setIaStats] = useState(DEMO_IA_STATS);
    const [simulationMessages, setSimulationMessages] = useState([{ type: 'bot', id: 'initial', text: '¡Hola! Soy tu asistente de pruebas. Escribe un mensaje para ver cómo respondo.' }]);
    const [loading, setLoading] = useState(true);
    const [isSaving, setIsSaving] = useState(false);
    const [isSimulating, setIsSimulating] = useState(false);
    
    const getIAConfig = useCallback(async () => {
        if (!company?.id) return;
        if (isDemo) {
            setConfig(DEFAULT_CONFIG);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('ia_config')
                .select('*')
                .eq('company_id', company.id)
                .single();

            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                const dbConfig = data.config_data;
                const mergedConfig = {
                    ...DEFAULT_CONFIG,
                    ...dbConfig,
                    integrations: {
                        ...DEFAULT_CONFIG.integrations,
                        ...(dbConfig.integrations || {}),
                        metaChannels: {
                            ...DEFAULT_CONFIG.integrations.metaChannels,
                            ...(dbConfig.integrations?.metaChannels || {}),
                        },
                        aiProvider: {
                            ...DEFAULT_CONFIG.integrations.aiProvider,
                            ...(dbConfig.integrations?.aiProvider || {}),
                        }
                    },
                    rules: {
                        ...DEFAULT_CONFIG.rules,
                        ...(dbConfig.rules || {}),
                    }
                };
                setConfig(mergedConfig);
                setConfigId(data.id);
            } else {
                setConfig(DEFAULT_CONFIG);
                setConfigId(null);
            }
        } catch (error) {
            toast({ title: 'Error al cargar configuración de IA', description: error.message, variant: 'destructive' });
            setConfig(DEFAULT_CONFIG);
        }
    }, [company, isDemo, toast]);

    const getSalonData = useCallback(async () => {
        if (!salonId && !isDemo) return;
        if (isDemo) {
            setServices(DEMO_SERVICES);
            setEmployees(DEMO_EMPLOYEES);
            return;
        }
        try {
            const { data: servicesData, error: servicesError } = await supabase.from('services').select('*').eq('salon_id', salonId);
            if (servicesError) throw servicesError;
            setServices(servicesData);

            const { data: employeesData, error: employeesError } = await supabase.from('employees').select('*').eq('salon_id', salonId);
            if (employeesError) throw employeesError;
            setEmployees(employeesData);
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudieron cargar los datos del salón.', variant: 'destructive' });
        }
    }, [salonId, isDemo, toast]);

    const getStatsAndLogs = useCallback(async () => {
        if(isDemo) {
            setIaStats(DEMO_IA_STATS);
            return;
        }
        toast({ title: '🚧 Datos no implementados', description: 'La carga de estadísticas y logs se conectará pronto a Supabase.' });
        setIaStats({ ...DEMO_IA_STATS, logs: [] });
    }, [isDemo, toast]);


    useEffect(() => {
        if (user) {
            setLoading(true);
            Promise.all([getIAConfig(), getSalonData(), getStatsAndLogs()]).finally(() => setLoading(false));
        } else {
             setLoading(false);
        }
    }, [user, getIAConfig, getSalonData, getStatsAndLogs]);

    const handleConfigChange = (path, value) => {
        const keys = path.split('.');
        setConfig(prev => {
            const newConfig = JSON.parse(JSON.stringify(prev));
            let current = newConfig;
            for (let i = 0; i < keys.length - 1; i++) {
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newConfig;
        });
    };

    const setPromptFromPreset = (presetKey) => {
      const prompt = PROMPT_PRESETS[presetKey];
      if (prompt) {
        handleConfigChange('prompt', prompt);
        toast({ title: 'Preset aplicado', description: `Se ha cargado el prompt del asistente "${presetKey}".`});
      }
    };

    const saveIAConfig = async () => {
        if (isDemo) {
            toast({ title: 'Modo Demo', description: 'La configuración no se puede guardar en modo demo.' });
            return;
        }
        if (!company?.id) {
            toast({ title: 'Error', description: 'No se ha identificado la empresa.', variant: 'destructive' });
            return;
        }
        setIsSaving(true);
        try {
            const upsertData = {
                id: configId,
                company_id: company.id,
                config_data: config,
                updated_at: new Date().toISOString(),
            };
            if (!configId) {
                delete upsertData.id;
            }
            
            const { data, error } = await supabase.from('ia_config').upsert(upsertData, { onConflict: 'company_id' }).select().single();
            if (error) throw error;
            
            setConfigId(data.id);
            toast({ title: '✅ ¡Guardado!', description: 'Configuración de IA guardada correctamente.' });

        } catch (error) {
            toast({ title: 'Error al guardar', description: error.message, variant: 'destructive' });
        } finally {
            setIsSaving(false);
        }
    };

    const simulateInteraction = (message) => {
        const userMessage = { type: 'user', text: message, id: Date.now() };
        setSimulationMessages(prev => [...prev, userMessage]);
        setIsSimulating(true);

        setTimeout(() => {
            let botResponse;
            if (message.toLowerCase().includes('cita')) {
                botResponse = {
                    type: 'bot_action',
                    id: Date.now() + 1,
                    text: "¡Claro! He encontrado un hueco para un 'Corte de Pelo' mañana a las 15:00 con Empleado Demo. ¿Te gustaría confirmar la reserva?",
                    actionDetails: {
                        client: 'Cliente de Prueba',
                        service: 'Corte de Pelo',
                        date: 'Mañana',
                        time: '15:00',
                        employee: 'Empleado Demo',
                    }
                };
            } else {
                botResponse = { type: 'bot', id: Date.now() + 1, text: `Esta es una respuesta simulada para tu mensaje: "${message}". En un entorno real, usaría el prompt que has definido para generar una respuesta más inteligente.` };
            }
            
            setIsSimulating(false);
            setSimulationMessages(prev => [...prev, botResponse]);
        }, 2000);
    };

    const clearSimulation = () => {
        setSimulationMessages([{ type: 'bot', id: 'restarted', text: 'Conversación reiniciada. ¡Envíame un nuevo mensaje!' }]);
        toast({ title: 'Simulador reiniciado' });
    };

    const testChannel = async (channel) => {
        toast({ title: `Probando canal ${channel}...` });
        await new Promise(res => setTimeout(res, 1500));
        const isSuccess = Math.random() > 0.2; 
        if (isSuccess) {
            toast({ title: `✅ ¡Éxito en ${channel}!`, description: `Mensaje de prueba enviado correctamente.` });
        } else {
            toast({ title: `❌ Error en ${channel}`, description: `No se pudo enviar el mensaje. Revisa la configuración.`, variant: 'destructive' });
        }
    };
    
    const confirmAppointmentFromIA = async (appointmentDetails) => {
        toast({ title: 'Confirmando cita...', description: `Creando cita para ${appointmentDetails.client}` });
        await new Promise(res => setTimeout(res, 1500));
        
        const systemMessage = { type: 'system', id: Date.now(), text: `Cita confirmada para ${appointmentDetails.client} (${appointmentDetails.service}) el ${appointmentDetails.date} a las ${appointmentDetails.time}.` };
        setSimulationMessages(prev => {
            const newMessages = prev.filter(m => m.id !== (appointmentDetails.id - 1));
            return [...newMessages, systemMessage];
        });

        toast({ title: '✅ ¡Cita creada!', description: 'La cita se ha agendado correctamente en el sistema.' });
    };

    const value = {
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
    };

    return <IAContext.Provider value={value}>{children}</IAContext.Provider>;
};
