import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { format, parseISO, setHours, setMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { User, Phone, Calendar as CalendarIcon, Clock, Briefcase, Loader2 } from 'lucide-react';
import { useDemo } from '@/hooks/useDemo.jsx';
import { DEMO_APPOINTMENTS, DEMO_EMPLOYEES } from '@/lib/demo-data';

const EditAppointmentModal = ({ appointmentId, onAppointmentUpdated }) => {
    const { isDemo } = useDemo();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [clientName, setClientName] = useState('');
    const [clientPhone, setClientPhone] = useState('');
    const [appointmentDate, setAppointmentDate] = useState(new Date());
    const [appointmentTime, setAppointmentTime] = useState('');
    const [employeeId, setEmployeeId] = useState('');
    const [notes, setNotes] = useState('');
    
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        const fetchAppointmentData = async () => {
            if (!appointmentId) return;
            setLoading(true);

            if (isDemo) {
                const apptData = DEMO_APPOINTMENTS.find(a => a.id === appointmentId);
                if (apptData) {
                    setClientName(apptData.client_name);
                    setClientPhone(apptData.client_phone || '555-DEMO');
                    const parsedDate = new Date(apptData.appointment_time);
                    setAppointmentDate(parsedDate);
                    setAppointmentTime(format(parsedDate, 'HH:mm'));
                    setEmployeeId(apptData.employee_id || 'unassigned');
                    setNotes(apptData.notes || '');
                    setEmployees(DEMO_EMPLOYEES.filter(e => e.salon_id === apptData.salon_id));
                }
                setLoading(false);
                return;
            }

            try {
                const { data: apptData, error: apptError } = await supabase
                    .from('appointments')
                    .select('*')
                    .eq('id', appointmentId)
                    .single();

                if (apptError) throw apptError;

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

            } catch (error) {
                toast({ title: "Error", description: "No se pudo cargar la información de la cita.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchAppointmentData();
    }, [appointmentId, isDemo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);
        
        if (isDemo) {
            toast({ title: "Modo Demo", description: "Los cambios no se guardarán, pero la lista se actualizará para simular la acción." });
            setIsSubmitting(false);
            onAppointmentUpdated();
            return;
        }

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
            onAppointmentUpdated();

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

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle className="text-2xl">Editar Cita</DialogTitle>
                <DialogDescription>
                    Modifica los detalles de la cita. Haz clic en guardar cuando termines.
                </DialogDescription>
            </DialogHeader>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="clientName">Nombre del Cliente *</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input id="clientName" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="clientPhone">Teléfono del Cliente</Label>
                        <div className="relative">
                            <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input id="clientPhone" type="tel" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="pl-10" />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label>Fecha de la Cita *</Label>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Button variant={"outline"} className="w-full justify-start text-left font-normal pl-10">
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
                                    <SelectTrigger className="w-full pl-10">
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
                                <SelectTrigger className="w-full pl-10">
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
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
    );
};

export default EditAppointmentModal;