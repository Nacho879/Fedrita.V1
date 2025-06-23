import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from "@/components/ui/badge";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_TIME_OFF_REQUESTS, DEMO_EMPLOYEES } from '@/lib/demo-data';

const ManageTimeOff = () => {
    const { user, managedSalon, loading: authLoading } = useAuth();
    const { isDemo } = useDemo();
    const navigate = useNavigate();
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchRequests = async () => {
        if (!user || !managedSalon) return;
        setLoading(true);

        if (isDemo) {
            const salonEmployees = DEMO_EMPLOYEES.filter(e => e.salon_id === managedSalon.id);
            const employeeUserIds = salonEmployees.map(e => e.owner_id);
            
            const statusMap = {
                approved: 'aprobada',
                rejected: 'rechazada',
                pending: 'pendiente',
            };

            const demoRequests = DEMO_TIME_OFF_REQUESTS
                .filter(r => employeeUserIds.includes(r.user_id))
                .map(req => {
                    const employee = salonEmployees.find(e => e.owner_id === req.user_id);
                    return { 
                        ...req, 
                        employee_name: employee ? employee.name : 'Empleado Demo',
                        status: statusMap[req.status] || 'pendiente',
                    };
                });
            setRequests(demoRequests);
            setLoading(false);
            return;
        }

        try {
            const { data, error } = await supabase
                .from('time_off_requests')
                .select('*, employees(name)')
                .eq('salon_id', managedSalon.id)
                .order('created_at', { ascending: false });

            if (error) {
                if (error.message.includes('relation "public.time_off_requests" does not exist')) {
                    toast({
                        title: 'Función no disponible',
                        description: 'La gestión de ausencias no está habilitada todavía en tu plan.',
                        variant: 'destructive',
                    });
                    setRequests([]);
                } else {
                    throw error;
                }
            } else {
                setRequests(data.map(r => ({...r, employee_name: r.employees?.name || 'N/A'})) || []);
            }
        } catch (error) {
            toast({ title: 'Error', description: 'No se pudieron cargar las solicitudes del equipo.', variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!authLoading && user && managedSalon) {
            fetchRequests();
        }
    }, [user, authLoading, managedSalon, isDemo]);

    const handleUpdateRequest = async (requestId, newStatus) => {
        if (isDemo) {
            setRequests(prev => prev.map(r => r.id === requestId ? { ...r, status: newStatus } : r));
            toast({ title: '¡Solicitud actualizada! (Demo)', description: `La solicitud ha sido ${newStatus}.` });
            return;
        }
        try {
            const { error } = await supabase
                .from('time_off_requests')
                .update({ status: newStatus })
                .eq('id', requestId);

            if (error) throw error;
            toast({ title: '¡Solicitud actualizada!', description: `La solicitud ha sido ${newStatus}.` });
            await fetchRequests();
        } catch (error) {
            toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
        }
    };

    const getStatusVariant = (status) => {
        switch (status) {
            case 'aprobada': return 'success';
            case 'rechazada': return 'destructive';
            case 'pendiente': return 'secondary';
            default: return 'default';
        }
    };

    if (loading || authLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="h-16 w-16 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
                <div className="flex items-center mb-8">
                    <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                        <ArrowLeft className="h-6 w-6" />
                    </Button>
                    <div className="ml-4">
                        <h1 className="text-4xl font-bold text-hub-anthracite">Gestionar Ausencias</h1>
                        <p className="text-foreground text-lg">Revisa y aprueba las solicitudes de tu equipo.</p>
                    </div>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Solicitudes del Equipo</CardTitle>
                        <CardDescription>Todas las solicitudes de descanso para {managedSalon?.name}.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Empleado</TableHead>
                                    <TableHead>Periodo</TableHead>
                                    <TableHead>Motivo</TableHead>
                                    <TableHead>Estado</TableHead>
                                    <TableHead className="text-right">Acciones</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {requests.length > 0 ? (
                                    requests.map(req => (
                                        <TableRow key={req.id}>
                                            <TableCell className="font-medium">{req.employee_name || 'N/A'}</TableCell>
                                            <TableCell>{format(new Date(req.start_date), 'dd/MM/yy')} - {format(new Date(req.end_date), 'dd/MM/yy')}</TableCell>
                                            <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                                            <TableCell>
                                                <Badge variant={getStatusVariant(req.status)} className="capitalize">{req.status}</Badge>
                                            </TableCell>
                                            <TableCell className="text-right">
                                                {req.status === 'pendiente' && (
                                                    <div className="flex gap-2 justify-end">
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="icon" variant="ghost" className="text-green-600 hover:text-green-700"><CheckCircle className="h-5 w-5" /></Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Aprobar solicitud?</AlertDialogTitle>
                                                                    <AlertDialogDescription>Esta acción no se puede deshacer. El empleado será notificado.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleUpdateRequest(req.id, 'aprobada')} className="bg-green-600 hover:bg-green-700">Aprobar</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                        <AlertDialog>
                                                            <AlertDialogTrigger asChild>
                                                                <Button size="icon" variant="ghost" className="text-red-600 hover:text-red-700"><XCircle className="h-5 w-5" /></Button>
                                                            </AlertDialogTrigger>
                                                            <AlertDialogContent>
                                                                <AlertDialogHeader>
                                                                    <AlertDialogTitle>¿Rechazar solicitud?</AlertDialogTitle>
                                                                    <AlertDialogDescription>Esta acción no se puede deshacer. El empleado será notificado.</AlertDialogDescription>
                                                                </AlertDialogHeader>
                                                                <AlertDialogFooter>
                                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                    <AlertDialogAction onClick={() => handleUpdateRequest(req.id, 'rechazada')} className="bg-red-600 hover:bg-red-700">Rechazar</AlertDialogAction>
                                                                </AlertDialogFooter>
                                                            </AlertDialogContent>
                                                        </AlertDialog>
                                                    </div>
                                                )}
                                            </TableCell>
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell colSpan="5" className="text-center h-24">No hay solicitudes de descanso pendientes para aprobar.</TableCell>
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

export default ManageTimeOff;