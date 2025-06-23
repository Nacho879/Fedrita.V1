import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useAuth } from '@/hooks/useAuth.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Calendar as CalendarIcon, ChevronDown, Bot, User } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';

const mockLogs = [
  {
    id: 'log1',
    timestamp: '2025-06-20T10:30:00Z',
    clientName: 'Ana García',
    channel: 'whatsapp',
    lastAction: 'Reserva Creada',
    conversation: [
      { sender: 'client', text: 'Hola, ¿tienen turno para un corte de pelo mañana?', time: '10:28' },
      { sender: 'bot', text: '¡Hola Ana! Claro, tenemos disponibilidad a las 11:00 y a las 15:00. ¿Cuál prefieres?', time: '10:29' },
      { sender: 'client', text: 'A las 15:00 está perfecto.', time: '10:29' },
      { sender: 'bot', text: '¡Genial! Te he agendado un corte de pelo para mañana a las 15:00. ¡Te esperamos!', time: '10:30' },
    ],
  },
  {
    id: 'log2',
    timestamp: '2025-06-19T18:15:00Z',
    clientName: 'Carlos Ruiz',
    channel: 'instagram',
    lastAction: 'Consulta Resuelta',
    conversation: [
      { sender: 'client', text: 'Hola, ¿cuánto cuesta el teñido?', time: '18:14' },
      { sender: 'bot', text: '¡Hola Carlos! El servicio de teñido completo tiene un costo de $3500. Incluye lavado y secado.', time: '18:15' },
    ],
  },
  {
    id: 'log3',
    timestamp: '2025-06-19T14:05:00Z',
    clientName: 'Laura Mendez',
    channel: 'facebook',
    lastAction: 'Sin Respuesta',
    conversation: [
      { sender: 'bot', text: '¡Hola Laura! Vimos que te interesan nuestros servicios de manicura. ¿Te gustaría agendar una cita?', time: '14:05' },
    ],
  },
];

const ChannelBadge = ({ channel }) => {
  const styles = {
    whatsapp: 'bg-green-100 text-green-800 border-green-300',
    instagram: 'bg-pink-100 text-pink-800 border-pink-300',
    facebook: 'bg-blue-100 text-blue-800 border-blue-300',
  };
  return <Badge variant="outline" className={`capitalize ${styles[channel] || ''}`}>{channel}</Badge>;
};

const ActionBadge = ({ action }) => {
    const styles = {
        'Reserva Creada': 'bg-green-500',
        'Consulta Resuelta': 'bg-blue-500',
        'Sin Respuesta': 'bg-yellow-500',
    };
    return <Badge className={`text-white ${styles[action] || 'bg-gray-500'}`}>{action}</Badge>;
};

const MessageLogs = () => {
    const { salonId } = useParams();
    const navigate = useNavigate();
    const [salonName, setSalonName] = useState('');
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    useEffect(() => {
        const fetchSalonInfo = async () => {
            setLoading(true);
            try {
                const { data, error } = await supabase.from('salons').select('name').eq('id', salonId).single();
                if (error) throw error;
                setSalonName(data.name);
                setLogs(mockLogs);
            } catch (error) {
                toast({ title: 'Error', description: 'No se pudo cargar la información del salón.', variant: 'destructive' });
                navigate('/mis-salones');
            } finally {
                setLoading(false);
            }
        };
        fetchSalonInfo();
    }, [salonId, navigate]);

    const filteredLogs = useMemo(() => {
        return logs.filter(log => {
            const matchesSearch = log.clientName.toLowerCase().includes(searchTerm.toLowerCase());
            let matchesDate = true;
            if (selectedDate) {
                const logDate = new Date(log.timestamp);
                matchesDate = startOfDay(logDate).getTime() === startOfDay(selectedDate).getTime();
            }
            return matchesSearch && matchesDate;
        });
    }, [logs, searchTerm, selectedDate]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(`/salon/${salonId}/asistente`)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="ml-4">
                        <h1 className="text-4xl font-bold text-hub-anthracite">Registros de Mensajes</h1>
                        <p className="text-foreground text-lg">Conversaciones del asistente para {salonName}.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <div className="flex flex-col md:flex-row gap-4 justify-between">
                            <div>
                                <CardTitle>Historial de Conversaciones</CardTitle>
                                <CardDescription>Busca y revisa las interacciones de la IA.</CardDescription>
                            </div>
                            <div className="flex gap-2">
                                <div className="relative">
                                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                    <Input placeholder="Buscar por cliente..." className="pl-8" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
                                </div>
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-[240px] justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, "PPP", { locale: es }) : <span>Filtrar por fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                {selectedDate && <Button variant="ghost" onClick={() => setSelectedDate(null)}>Limpiar</Button>}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead className="w-[200px]">Fecha y Hora</TableHead>
                                    <TableHead>Cliente</TableHead>
                                    <TableHead>Canal</TableHead>
                                    <TableHead>Acción Tomada</TableHead>
                                    <TableHead className="w-[50px]"></TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredLogs.length > 0 ? filteredLogs.map(log => (
                                    <Collapsible asChild key={log.id}>
                                        <>
                                            <TableRow>
                                                <TableCell>{format(new Date(log.timestamp), "dd/MM/yy, HH:mm", { locale: es })}</TableCell>
                                                <TableCell className="font-medium">{log.clientName}</TableCell>
                                                <TableCell><ChannelBadge channel={log.channel} /></TableCell>
                                                <TableCell><ActionBadge action={log.lastAction} /></TableCell>
                                                <TableCell>
                                                    <CollapsibleTrigger asChild>
                                                        <Button variant="ghost" size="sm"><ChevronDown className="h-4 w-4" /></Button>
                                                    </CollapsibleTrigger>
                                                </TableCell>
                                            </TableRow>
                                            <CollapsibleContent asChild>
                                                <TableRow>
                                                    <TableCell colSpan={5} className="p-0">
                                                        <div className="p-6 bg-secondary">
                                                            <h4 className="font-semibold mb-4">Conversación Completa</h4>
                                                            <div className="space-y-4 max-h-60 overflow-y-auto pr-4">
                                                                {log.conversation.map((msg, index) => (
                                                                    <div key={index} className={`flex items-start gap-3 ${msg.sender === 'bot' ? '' : 'justify-end'}`}>
                                                                        {msg.sender === 'bot' && <div className="bg-hub-coral rounded-full p-2 text-white"><Bot size={16} /></div>}
                                                                        <div className={`rounded-lg px-4 py-2 max-w-md ${msg.sender === 'bot' ? 'bg-background' : 'bg-blue-100'}`}>
                                                                            <p className="text-sm">{msg.text}</p>
                                                                            <p className="text-xs text-muted-foreground text-right mt-1">{msg.time}</p>
                                                                        </div>
                                                                        {msg.sender === 'client' && <div className="bg-gray-300 rounded-full p-2"><User size={16} /></div>}
                                                                    </div>
                                                                ))}
                                                            </div>
                                                        </div>
                                                    </TableCell>
                                                </TableRow>
                                            </CollapsibleContent>
                                        </>
                                    </Collapsible>
                                )) : (
                                    <TableRow>
                                        <TableCell colSpan="5" className="h-24 text-center">No se encontraron registros.</TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default MessageLogs;