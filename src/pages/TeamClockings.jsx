import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Search, Calendar as CalendarIcon, X, Check, AlertTriangle, Edit } from 'lucide-react';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_EMPLOYEES, DEMO_CLOCKINGS } from '@/lib/demo-data';

const TeamClockings = () => {
    const { user, managedSalon, loading: authLoading } = useAuth();
    const { isDemo } = useDemo();
    const navigate = useNavigate();
    const [clockings, setClockings] = useState([]);
    const [requests, setRequests] = useState([]);
    const [team, setTeam] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);

    const fetchData = useCallback(async () => {
        if (!managedSalon) return;
        setLoading(true);

        if (isDemo) {
            const today = new Date();
            const mockClockings = DEMO_CLOCKINGS.map(c => ({...c, user_id: DEMO_EMPLOYEES[1].owner_id, salon_id: managedSalon.id}))
                .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
            
            const mockRequests = [
                {
                    id: 'req-demo-1',
                    requester_id: DEMO_EMPLOYEES[1].owner_id,
                    salon_id: managedSalon.id,
                    request_details: { event_type: 'salida', timestamp: new Date(new Date(new Date().setDate(today.getDate() - 1)).setHours(18, 5, 0, 0)).toISOString() },
                    reason: 'Olvidé fichar mi salida de ayer.',
                    status: 'pending'
                }
            ];

            setClockings(mockClockings);
            setRequests(mockRequests);
            setTeam(DEMO_EMPLOYEES.filter(e => e.salon_id === managedSalon.id));
            setLoading(false);
            return;
        }

        try {
            const [
                { data: clockingsData, error: clockingsError },
                { data: requestsData, error: requestsError },
                { data: teamData, error: teamError }
            ] = await Promise.all([
                supabase.from('clock_events').select('*').eq('salon_id', managedSalon.id).order('timestamp', { ascending: false }),
                supabase.from('clock_modification_requests').select('*').eq('salon_id', managedSalon.id).eq('status', 'pending').order('created_at', { ascending: true }),
                supabase.from('employees').select('id, name, owner_id').eq('salon_id', managedSalon.id)
            ]);

            if (clockingsError) throw clockingsError;
            if (requestsError) throw requestsError;
            if (teamError) throw teamError;
            
            setClockings(clockingsData || []);
            setRequests(requestsData || []);
            setTeam(teamData || []);

        } catch (error) {
            toast({
                title: 'Error al cargar datos del equipo',
                description: "No se pudo conectar con la base de datos. Por favor, recarga la página.",
                variant: 'destructive',
            });
        } finally {
            setLoading(false);
        }
    }, [managedSalon, isDemo]);

    useEffect(() => {
        if (!authLoading && managedSalon) {
            fetchData();
        } else if (!authLoading && !managedSalon) {
            setLoading(false);
        }
    }, [managedSalon, authLoading, fetchData]);

    const handleRequestAction = async (requestId, newStatus) => {
        const request = requests.find(r => r.id === requestId);
        if (!request || !user) return;

        if (isDemo) {
            if (newStatus === 'approved') {
                const details = request.request_details;
                const newClocking = {
                    id: `clock-demo-${Math.random()}`,
                    user_id: request.requester_id,
                    salon_id: request.salon_id,
                    event_type: details.event_type,
                    timestamp: details.timestamp,
                    is_modified: true,
                };
                setClockings(prev => [newClocking, ...prev].sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)));
            }
            setRequests(requests.filter(r => r.id !== requestId));
            toast({ title: 'Solicitud actualizada', description: `La solicitud ha sido ${newStatus === 'approved' ? 'aprobada' : 'rechazada'}.` });
            return;
        }

        try {
            if (newStatus === 'approved') {
                const details = request.request_details;
                const { error: insertError } = await supabase.from('clock_events').insert([{
                    user_id: request.requester_id,
                    salon_id: request.salon_id,
                    event_type: details.event_type,
                    timestamp: details.timestamp,
                    is_modified: true,
                }]);

                if (insertError) {
                    throw new Error(`No se pudo añadir el fichaje: ${insertError.message}`);
                }
            }

            const { error: updateError } = await supabase
                .from('clock_modification_requests')
                .update({ status: newStatus, resolver_id: user.id, resolved_at: new Date().toISOString() })
                .eq('id', requestId);
            
            if (updateError) {
                throw new Error(`Error al actualizar la solicitud: ${updateError.message}`);
            }

            toast({ title: 'Solicitud actualizada', description: `La solicitud ha sido ${newStatus === 'approved' ? 'aprobada' : 'rechazada'}.` });
            
            await fetchData();

        } catch (error) {
            toast({ title: 'Error en la operación', description: error.message, variant: 'destructive' });
        }
    };

    const filteredClockings = useMemo(() => {
        const teamMap = new Map(team.map(e => [e.owner_id, e.name]));
        return clockings
            .map(c => ({
                ...c,
                employeeName: teamMap.get(c.user_id) || 'Desconocido'
            }))
            .filter(clocking => {
                const matchesSearch = clocking.employeeName.toLowerCase().includes(searchTerm.toLowerCase());
                
                let matchesDate = true;
                if (selectedDate) {
                    const clockingDate = new Date(clocking.timestamp);
                    matchesDate = startOfDay(clockingDate).getTime() === startOfDay(selectedDate).getTime();
                }

                return matchesSearch && matchesDate;
            });
    }, [clockings, team, searchTerm, selectedDate]);

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
                className="max-w-6xl mx-auto"
            >
                <div className="flex items-center mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="ml-4">
                        <h1 className="text-4xl font-bold text-hub-anthracite">Fichajes del Equipo</h1>
                        <p className="text-foreground text-lg">Supervisa los registros de jornada de tu salón.</p>
                    </div>
                </div>

                <Card className="mb-8 shadow-hub">
                    <CardHeader>
                        <CardTitle className="flex items-center"><AlertTriangle className="mr-2 text-yellow-500" /> Solicitudes de Corrección Pendientes</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {requests.length > 0 ? (
                            <div className="space-y-4">
                                {requests.map(req => {
                                    const employeeName = team.find(e => e.owner_id === req.requester_id)?.name || 'Desconocido';
                                    return (
                                        <Card key={req.id} className="bg-secondary">
                                            <CardContent className="p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                                                <div>
                                                    <p><strong>Empleado:</strong> {employeeName}</p>
                                                    <p><strong>Corrección Solicitada:</strong> Añadir fichaje de <span className="font-semibold capitalize">{req.request_details.event_type.replace(/_/g, ' ')}</span></p>
                                                    <p><strong>Fecha y Hora:</strong> {format(new Date(req.request_details.timestamp), 'Pp', { locale: es })}</p>
                                                    <p className="text-sm text-muted-foreground mt-1"><strong>Motivo:</strong> {req.reason}</p>
                                                </div>
                                                <div className="flex gap-2 self-end sm:self-center">
                                                    <Button size="sm" onClick={() => handleRequestAction(req.id, 'approved')}><Check className="mr-2 h-4 w-4" />Aprobar</Button>
                                                    <Button size="sm" variant="destructive" onClick={() => handleRequestAction(req.id, 'rejected')}><X className="mr-2 h-4 w-4" />Rechazar</Button>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </div>
                        ) : <p className="text-muted-foreground">No hay solicitudes pendientes.</p>}
                    </CardContent>
                </Card>

                <Card className="shadow-hub">
                    <CardHeader>
                        <CardTitle>Historial de Fichajes del Equipo</CardTitle>
                        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4">
                            <div className="relative w-full sm:w-auto">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
                                <Input 
                                    placeholder="Buscar por empleado..."
                                    className="pl-10 w-full sm:w-64"
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                />
                            </div>
                            <div className="flex items-center gap-2">
                                <Popover>
                                    <PopoverTrigger asChild>
                                        <Button variant={"outline"} className="w-[240px] justify-start text-left font-normal">
                                            <CalendarIcon className="mr-2 h-4 w-4" />
                                            {selectedDate ? format(selectedDate, 'PPP', { locale: es }) : <span>Filtrar por fecha</span>}
                                        </Button>
                                    </PopoverTrigger>
                                    <PopoverContent className="w-auto p-0" align="start">
                                        <Calendar mode="single" selected={selectedDate} onSelect={setSelectedDate} initialFocus />
                                    </PopoverContent>
                                </Popover>
                                {selectedDate && (
                                    <Button variant="ghost" size="icon" onClick={() => setSelectedDate(null)}><X className="h-4 w-4"/></Button>
                                )}
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empleado</TableHead>
                                    <TableHead>Tipo de Evento</TableHead>
                                    <TableHead>Fecha</TableHead>
                                    <TableHead>Hora</TableHead>
                                    <TableHead>Modificado</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filteredClockings.length > 0 ? (
                                    filteredClockings.map(log => (
                                        <TableRow key={log.id}>
                                            <TableCell className="font-medium">{log.employeeName}</TableCell>
                                            <TableCell className="capitalize">{log.event_type.replace(/_/g, ' ')}</TableCell>
                                            <TableCell>{format(new Date(log.timestamp), 'PPP', { locale: es })}</TableCell>
                                            <TableCell>{format(new Date(log.timestamp), 'p', { locale: es })}</TableCell>
                                            <TableCell>{log.is_modified && <Edit className="h-4 w-4 text-blue-500" title="Modificado por manager" />}</TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center h-24">
                                            No se encontraron registros con los filtros actuales.
                                        </TableCell>
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

export default TeamClockings;