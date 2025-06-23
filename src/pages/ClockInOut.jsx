import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, LogOut, Coffee, ArrowLeft, Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_CLOCKINGS } from '@/lib/demo-data.js';
import { v4 as uuidv4 } from 'uuid';

const ClockInOut = () => {
    const { user, managedSalon, userRole, loading: authLoading } = useAuth();
    const { isDemo } = useDemo();
    const navigate = useNavigate();
    const [clockings, setClockings] = useState([]);
    const [lastEvent, setLastEvent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isRequestDialogOpen, setIsRequestDialogOpen] = useState(false);
    const [requestDetails, setRequestDetails] = useState({
        date: format(new Date(), 'yyyy-MM-dd'),
        time: format(new Date(), 'HH:mm'),
        eventType: 'entrada',
        reason: ''
    });

    const fetchClockings = useCallback(async () => {
        if (!user) return;
        setLoading(true);

        if (isDemo) {
            const mockData = [...DEMO_CLOCKINGS].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setClockings(mockData);
            if (mockData.length > 0) {
                setLastEvent(mockData[0]);
            } else {
                setLastEvent(null);
            }
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('clock_events')
                .select('*')
                .eq('user_id', user.id)
                .order('timestamp', { ascending: false });

            if (error) throw error;
            setClockings(data || []);
            if (data && data.length > 0) {
                setLastEvent(data[0]);
            } else {
                setLastEvent(null);
            }
        } catch (error) {
            toast({
                title: 'Error al cargar los fichajes',
                description: "No se pudo conectar con la base de datos. Por favor, recarga la página.",
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [user, isDemo]);
    
    useEffect(() => {
        if (!authLoading) {
            fetchClockings();
        }
    }, [authLoading, fetchClockings]);

    const handleClockEvent = async (eventType) => {
        if (!user || !managedSalon) {
            toast({ title: 'Error', description: 'No se pudo identificar al usuario o salón.', variant: 'destructive' });
            return;
        }
        if (isDemo) {
            const newClocking = {
                id: uuidv4(),
                event_type: eventType,
                timestamp: new Date().toISOString(),
            };
            toast({ title: '¡Fichaje de demostración!', description: `Se ha registrado tu ${eventType.replace('_', ' ')}.` });
            const newClockings = [newClocking, ...clockings].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            setClockings(newClockings);
            setLastEvent(newClocking);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('clock_events')
                .insert([{
                    user_id: user.id,
                    salon_id: managedSalon.id,
                    event_type: eventType,
                    timestamp: new Date().toISOString(),
                }])
                .select()
                .single();

            if (error) throw error;
            
            toast({ title: '¡Fichaje exitoso!', description: `Se ha registrado tu ${eventType.replace('_', ' ')}.` });
            setClockings([data, ...clockings]);
            setLastEvent(data);
        } catch (error) {
            toast({
                title: 'Error al registrar el fichaje',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleRequestModification = async (e) => {
        e.preventDefault();
        if (!user || !managedSalon) {
            toast({ title: 'Error', description: 'No se pudo identificar al usuario o salón.', variant: 'destructive' });
            return;
        }
        if (isDemo) {
            toast({ title: 'Solicitud de demostración enviada', description: 'En una cuenta real, tu solicitud sería revisada por un manager.' });
            setIsRequestDialogOpen(false);
            return;
        }
        if (!requestDetails.date || !requestDetails.time || !requestDetails.reason) {
            toast({ title: 'Campos requeridos', description: 'Por favor, completa todos los campos para la solicitud.', variant: 'destructive' });
            return;
        }

        const approverId = userRole === 'manager' ? managedSalon.owner_id : managedSalon.manager_id;

        if (!approverId) {
            toast({ title: 'Error de configuración', description: 'No se pudo determinar un aprobador para la solicitud.', variant: 'destructive' });
            return;
        }

        const timestamp = `${requestDetails.date}T${requestDetails.time}:00`;

        try {
            const { error } = await supabase.from('clock_modification_requests').insert([{
                requester_id: user.id,
                salon_id: managedSalon.id,
                manager_id: approverId,
                request_details: {
                    type: 'add',
                    event_type: requestDetails.eventType,
                    timestamp: new Date(timestamp).toISOString(),
                },
                reason: requestDetails.reason,
                status: 'pending',
            }]);

            if (error) throw error;

            toast({ title: 'Solicitud enviada', description: 'Tu solicitud de corrección será revisada.' });
            setIsRequestDialogOpen(false);
        } catch (error) {
            toast({ title: 'Error al enviar la solicitud', description: error.message, variant: 'destructive' });
        }
    };

    const getStatusText = () => {
        if (!lastEvent) return { text: "Listo para empezar", color: "text-gray-500" };
        switch (lastEvent.event_type) {
            case 'entrada': return { text: "Jornada iniciada", color: "text-green-600" };
            case 'pausa_inicio': return { text: "En pausa", color: "text-yellow-600" };
            case 'pausa_fin': return { text: "Jornada iniciada", color: "text-green-600" };
            case 'salida': return { text: "Jornada finalizada", color: "text-red-600" };
            default: return { text: "Listo para empezar", color: "text-gray-500" };
        }
    };

    const status = getStatusText();

    const renderButtons = () => {
        const lastType = lastEvent?.event_type;
        const canClockIn = !lastType || lastType === 'salida';
        const canClockOut = lastType === 'entrada' || lastType === 'pausa_fin';
        const canStartBreak = lastType === 'entrada' || lastType === 'pausa_fin';
        const canEndBreak = lastType === 'pausa_inicio';

        return (
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Button size="lg" className="btn-primary" onClick={() => handleClockEvent('entrada')} disabled={!canClockIn}>
                    <LogIn className="mr-2 h-5 w-5" /> Entrada
                </Button>
                <Button size="lg" variant="outline" onClick={() => handleClockEvent(canStartBreak ? 'pausa_inicio' : 'pausa_fin')} disabled={!canStartBreak && !canEndBreak}>
                    <Coffee className="mr-2 h-5 w-5" /> {canEndBreak ? 'Fin Pausa' : 'Inicio Pausa'}
                </Button>
                <Button size="lg" variant="destructive" onClick={() => handleClockEvent('salida')} disabled={!canClockOut}>
                    <LogOut className="mr-2 h-5 w-5" /> Salida
                </Button>
            </div>
        );
    };

    if (loading || authLoading) {
        return (
          <div className="min-h-screen flex items-center justify-center bg-background">
            <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
          </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-4xl mx-auto"
            >
                <div className="flex items-center mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="ml-4">
                        <h1 className="text-4xl font-bold text-hub-anthracite">Mi Fichaje</h1>
                        <p className="text-foreground text-lg">Registra tu jornada laboral.</p>
                    </div>
                </div>

                <Card className="mb-8 shadow-hub">
                    <CardHeader>
                        <CardTitle>Panel de Fichaje</CardTitle>
                        <CardDescription>
                            Tu estado actual es: <span className={`font-bold ${status.color}`}>{status.text}</span>
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        {renderButtons()}
                    </CardContent>
                </Card>

                <Card className="mb-8 shadow-hub">
                    <CardHeader>
                        <CardTitle>¿Error en tu fichaje?</CardTitle>
                        <CardDescription>Si olvidaste fichar o cometiste un error, puedes solicitar una corrección.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Dialog open={isRequestDialogOpen} onOpenChange={setIsRequestDialogOpen}>
                            <DialogTrigger asChild>
                                <Button variant="secondary"><Send className="mr-2 h-4 w-4" />Solicitar Corrección</Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                    <DialogTitle>Solicitar Corrección de Fichaje</DialogTitle>
                                    <DialogDescription>
                                        Describe el error y proporciona la información correcta. Tu solicitud será revisada.
                                    </DialogDescription>
                                </DialogHeader>
                                <form onSubmit={handleRequestModification}>
                                    <div className="grid gap-4 py-4">
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="eventType" className="text-right">Tipo</Label>
                                            <Select value={requestDetails.eventType} onValueChange={(value) => setRequestDetails(prev => ({ ...prev, eventType: value }))}>
                                                <SelectTrigger className="col-span-3">
                                                    <SelectValue placeholder="Selecciona un tipo" />
                                                </SelectTrigger>
                                                <SelectContent>
                                                    <SelectItem value="entrada">Entrada</SelectItem>
                                                    <SelectItem value="pausa_inicio">Inicio Pausa</SelectItem>
                                                    <SelectItem value="pausa_fin">Fin Pausa</SelectItem>
                                                    <SelectItem value="salida">Salida</SelectItem>
                                                </SelectContent>
                                            </Select>
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="date" className="text-right">Fecha</Label>
                                            <Input id="date" type="date" value={requestDetails.date} onChange={(e) => setRequestDetails(prev => ({ ...prev, date: e.target.value }))} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="time" className="text-right">Hora</Label>
                                            <Input id="time" type="time" value={requestDetails.time} onChange={(e) => setRequestDetails(prev => ({ ...prev, time: e.target.value }))} className="col-span-3" />
                                        </div>
                                        <div className="grid grid-cols-4 items-center gap-4">
                                            <Label htmlFor="reason" className="text-right">Motivo</Label>
                                            <Textarea id="reason" value={requestDetails.reason} onChange={(e) => setRequestDetails(prev => ({ ...prev, reason: e.target.value }))} className="col-span-3" placeholder="Ej: Olvidé fichar mi salida de ayer." />
                                        </div>
                                    </div>
                                    <DialogFooter>
                                        <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
                                        <Button type="submit">Enviar Solicitud</Button>
                                    </DialogFooter>
                                </form>
                            </DialogContent>
                        </Dialog>
                    </CardContent>
                </Card>

                <Card className="shadow-hub">
                    <CardHeader>
                        <CardTitle>Historial de Fichajes</CardTitle>
                        <CardDescription>Tus últimos registros de jornada.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Tipo de Evento</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Hora</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {clockings.length > 0 ? (
                                    clockings.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium capitalize">{log.event_type.replace(/_/g, ' ')}</TableCell>
                                            <TableCell>{format(new Date(log.timestamp), 'PPP', { locale: es })}</TableCell>
                                            <TableCell>{format(new Date(log.timestamp), 'p', { locale: es })}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="3" className="text-center">No hay registros de fichaje todavía.</TableCell>
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

export default ClockInOut;