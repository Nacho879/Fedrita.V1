import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { format, parseISO, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Phone, Calendar as CalendarIcon, Clock, Briefcase, ArrowLeft } from 'lucide-react';

const EditAppointment = () => {
    const { appointmentId } = useParams();
    const navigate = useNavigate();
    const { user, company, managedSalon, userRole, loading: authLoading } = useAuth();
    
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);

    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [notes, setNotes] = useState('');
    
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchAppointmentAndCheckPermission = async () => {
            if (!appointmentId || appointmentId === 'undefined') {
                toast({ title: "Error", description: "Identificador de cita no válido.", variant: "destructive" });
                navigate(-1);
                return;
            }

            setLoading(true);
            try {
                const { data: apptData, error: apptError } = await supabase
                    .from('appointments')
                    .select('*, salons(*, companies(*))')
                    .eq('id', appointmentId)
                    .single();

                if (apptError) throw apptError;

                let canEdit = false;
                if (userRole === 'admin' && apptData.salons.company_id === company?.id) {
                    canEdit = true;
                } else if (userRole === 'manager' && apptData.salon_id === managedSalon?.id) {
                    canEdit = true;
                }
                
                if (canEdit) {
                    setHasPermission(true);
                    setAppointment(apptData);
                    setClientName(apptData.client_name);
                    setClientPhone(apptData.client_phone);
                    const parsedDate = parseISO(apptData.appointment_time);
                    setAppointmentDate(parsedDate);
                    setAppointmentTime(format(parsedDate, 'HH:mm'));
                    setEmployeeId(apptData.employee_id || 'unassigned');
                    setNotes(apptData.notes || '');

                    const { data: employeesData, error: employeesError } = await supabase
                        .from('employees')
                        .select('id, name')
                        .eq('salon_id', apptData.salon_id);
                    
                    if (employeesError) throw employeesError;
                    setEmployees(employeesData || []);

                } else {
                    setHasPermission(false);
                    toast({ title: "Acceso denegado", description: "No tienes permiso para editar esta cita.", variant: "destructive" });
                    navigate('/dashboard');
                }
            } catch (error) {
                toast({ title: "Error", description: "No se pudo cargar la información de la cita.", variant: "destructive" });
                navigate(-1);
            } finally {
                setLoading(false);
            }
        };

        if (!authLoading) {
            fetchAppointmentAndCheckPermission();
        }
    }, [appointmentId, user, company, managedSalon, userRole, authLoading, navigate]);


    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        const [hours, minutes] = appointmentTime.split(':').map(Number);
        const fullAppointmentDateTime = setMinutes(setHours(appointmentDate, hours), minutes);

        try {
            const updatedData = {
                client_name: clientName,
                client_phone: clientPhone,
                appointment_time: fullAppointmentDateTime.toISOString(),
                employee_id: employeeId === 'unassigned' ? null : employeeId,
                notes: notes,
            };

            const { error } = await supabase
                .from('appointments')
                .update(updatedData)
                .eq('id', appointmentId);

            if (error) throw error;
            
            toast({
                title: "¡Cita actualizada!",
                description: "La cita ha sido modificada exitosamente.",
            });
            navigate(-1);

        } catch (error) {
            toast({
                title: "Error al actualizar la cita",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const timeSlots = Array.from({ length: (22 - 8) * 2 }, (_, i) => {
        const totalMinutes = 8 * 60 + i * 30;
        const hours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
        const minutes = (totalMinutes % 60).toString().padStart(2, '0');
        return `${hours}:${minutes}`;
    });

    if (loading || authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div></div>;
    }

    if (!hasPermission) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
                <h1 className="text-3xl font-bold text-hub-anthracite mb-4">Acceso Denegado</h1>
                <p className="text-foreground mb-8">Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-2xl"
            >
                <Card>
                    <CardHeader>
                        <div className="flex items-center space-x-4">
                            <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                                <ArrowLeft className="h-4 w-4" />
                            </Button>
                            <div>
                                <CardTitle className="text-3xl">Editar Cita</CardTitle>
                                <CardDescription className="text-lg">
                                    Modifica los detalles de la cita para {appointment?.client_name}.
                                </CardDescription>
                            </div>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="clientName">Nombre del Cliente *</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="pl-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="clientPhone">Teléfono del Cliente *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="clientPhone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} required className="pl-12" />
                                </div>
                            </div>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label>Fecha de la Cita *</Label>
                                    <Popover>
                                        <PopoverTrigger asChild>
                                            <Button variant={"outline"} className="w-full justify-start text-left font-normal pl-12">
                                                <CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                                {appointmentDate ? format(appointmentDate, "PPP", { locale: es }) : <span>Elige una fecha</span>}
                                            </Button>
                                        </PopoverTrigger>
                                        <PopoverContent className="w-auto p-0">
                                            <Calendar mode="single" selected={appointmentDate} onSelect={setAppointmentDate} initialFocus />
                                        </PopoverContent>
                                    </Popover>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="appointmentTime">Hora *</Label>
                                    <div className="relative">
                                        <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                        <Select value={appointmentTime} onValueChange={setAppointmentTime}>
                                            <SelectTrigger className="w-full pl-12">
                                                <SelectValue placeholder="Selecciona hora" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {timeSlots.map(slot => (
                                                    <SelectItem key={slot} value={slot}>{slot}</SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                    </div>
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="employeeId">Empleado Asignado</Label>
                                <div className="relative">
                                    <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Select value={employeeId} onValueChange={setEmployeeId}>
                                        <SelectTrigger className="w-full pl-12">
                                            <SelectValue placeholder="Selecciona un empleado" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="unassigned">Sin asignar</SelectItem>
                                            {employees.map(emp => (
                                                <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="notes">Notas Adicionales</Label>
                                <Textarea id="notes" value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Alergias, preferencias, etc." />
                            </div>
                            <Button type="submit" className="w-full h-12 btn-primary text-lg" disabled={isSubmitting}>
                                {isSubmitting ? "Guardando..." : "Guardar Cambios"}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default EditAppointment;