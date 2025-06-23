import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { useAuth } from '@/hooks/useAuth';
import { useDemo } from '@/hooks/useDemo';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { motion } from 'framer-motion';

import AgendaHeader from '@/components/agenda/AgendaHeader.jsx';
import AgendaFilters from '@/components/agenda/AgendaFilters.jsx';
import AgendaDialogs from '@/components/agenda/AgendaDialogs.jsx';
import { mapSlotsToEvents } from '@/components/agenda/agenda-utils.js';
import { 
    DEMO_SALONS, 
    DEMO_EMPLOYEES, 
    DEMO_APPOINTMENTS, 
    DEMO_SERVICES,
    DEMO_SALON_1_ID
} from '@/lib/demo-data';

const SalonAgenda = () => {
    const { salonId } = useParams();
    const navigate = useNavigate();
    const { userRole, user, company, managedSalon, loading: authLoading } = useAuth();
    const { isDemo } = useDemo();
    const { toast } = useToast();
    const calendarRef = useRef(null);

    const [salon, setSalon] = useState(null);
    const [employees, setEmployees] = useState([]);
    const [slots, setSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [serviceFilter, setServiceFilter] = useState('all');
    const [dialogState, setDialogState] = useState({ open: false, type: null, data: null });
    
    const canEdit = useMemo(() => userRole === 'admin' || userRole === 'manager', [userRole]);

    const selfEmployeeId = useMemo(() => {
        if (userRole === 'employee' && user && employees.length > 0) {
            const employee = employees.find(e => e.owner_id === user.id);
            return employee?.id;
        }
        return null;
    }, [userRole, user, employees]);

    const [employeeFilter, setEmployeeFilter] = useState('all');

    useEffect(() => {
        if (userRole === 'employee' && selfEmployeeId) {
            setEmployeeFilter(selfEmployeeId);
        } else if (userRole !== 'employee') {
            setEmployeeFilter('all');
        }
    }, [userRole, selfEmployeeId]);

    useEffect(() => {
        const fetchData = async () => {
            if (authLoading) return;
            setLoading(true);

            if (isDemo) {
                const demoSalon = DEMO_SALONS.find(s => s.id === salonId);
                if (!demoSalon) {
                    toast({ title: "Error", description: "Salón de demostración no encontrado.", variant: "destructive" });
                    navigate('/dashboard');
                    setLoading(false);
                    return;
                }

                setSalon(demoSalon);
                setEmployees(DEMO_EMPLOYEES.filter(e => e.salon_id === salonId));
                
                const demoSlots = DEMO_APPOINTMENTS
                    .filter(a => a.salon_id === salonId)
                    .map(a => {
                        const service = DEMO_SERVICES.find(s => s.id === a.service_id);
                        const duration = service ? service.duration_minutes : 30;
                        const startTime = new Date(a.appointment_time);
                        const endTime = new Date(startTime.getTime() + duration * 60000);

                        return {
                            id: a.id,
                            salon_id: a.salon_id,
                            employee_id: a.employee_id,
                            fecha: format(startTime, 'yyyy-MM-dd'),
                            hora_inicio: format(startTime, 'HH:mm:ss'),
                            hora_fin: format(endTime, 'HH:mm:ss'),
                            estado: 'reservado',
                            cliente_nombre: a.client_name,
                            servicio_id: a.service_id,
                            motivo: null,
                        };
                    });
                
                if (salonId === DEMO_SALON_1_ID) {
                    const today = format(new Date(), 'yyyy-MM-dd');
                    const employeeForAvailable = DEMO_EMPLOYEES.find(e => e.salon_id === salonId && !e.is_manager);
                    const employeeForBlocked = DEMO_EMPLOYEES.find(e => e.salon_id === salonId && e.is_manager);

                    if (employeeForAvailable) {
                        demoSlots.push({ id: 'demo-slot-avail-1', salon_id: salonId, employee_id: employeeForAvailable.id, fecha: today, hora_inicio: '15:00:00', hora_fin: '16:00:00', estado: 'disponible' });
                    }
                    if (employeeForBlocked) {
                        demoSlots.push({ id: 'demo-slot-blocked-1', salon_id: salonId, employee_id: employeeForBlocked.id, fecha: today, hora_inicio: '12:00:00', hora_fin: '13:00:00', estado: 'bloqueado', motivo: 'Almuerzo' });
                    }
                }

                setSlots(demoSlots);
                setLoading(false);
                return;
            }

            try {
                const { data: salonData, error: salonError } = await supabase.from('salons').select('*').eq('id', salonId).single();
                if (salonError) throw salonError;

                let hasAccess = false;
                if (userRole === 'admin' && salonData.company_id === company?.id) {
                    hasAccess = true;
                } else if ((userRole === 'manager' || userRole === 'employee') && salonData.id === managedSalon?.id) {
                    hasAccess = true;
                }

                if (!hasAccess) {
                    toast({ title: "Acceso Denegado", description: "No tienes permiso para ver la agenda de este salón.", variant: "destructive" });
                    const homePath = userRole === 'admin' ? '/dashboard' : (userRole === 'manager' ? '/dashboard-manager' : '/dashboard-empleado');
                    navigate(homePath);
                    return;
                }

                setSalon(salonData);

                const { data: employeesData, error: employeesError } = await supabase.from('employees').select('id, name, owner_id').eq('salon_id', salonId);
                if (employeesError) throw employeesError;
                setEmployees(employeesData || []);

                const { data: slotsData, error: slotsError } = await supabase
                    .from('calendar_slots')
                    .select('*, salons!inner(id, company_id)')
                    .eq('salon_id', salonId);
                
                if (slotsError) throw slotsError;
                setSlots(slotsData || []);

            } catch (error) {
                toast({ title: "Error", description: "No se pudo cargar la información de la agenda.", variant: "destructive" });
                const homePath = userRole === 'admin' ? '/dashboard' : (userRole === 'manager' ? '/dashboard-manager' : '/dashboard-empleado');
                navigate(homePath);
            } finally {
                setLoading(false);
            }
        };

        if (salonId && userRole) {
            fetchData();
        }
    }, [salonId, userRole, company, managedSalon, navigate, toast, authLoading, isDemo]);

    const calendarEvents = useMemo(() => {
        return mapSlotsToEvents(slots, employees, DEMO_SERVICES, employeeFilter, serviceFilter);
    }, [slots, employees, employeeFilter, serviceFilter]);

    const handleEventDrop = async (dropInfo) => {
        if (!canEdit) return;
        if (isDemo) {
            toast({ title: "Acción no permitida", description: "No se puede modificar la agenda de demostración." });
            dropInfo.revert();
            return;
        }
    
        const { event } = dropInfo;
        const { id } = event.extendedProps;
        const newStart = event.start;
        const newEnd = event.end;
    
        const updates = {
            fecha: format(newStart, 'yyyy-MM-dd'),
            hora_inicio: format(newStart, 'HH:mm:ss'),
            hora_fin: format(newEnd, 'HH:mm:ss'),
        };
    
        const { data: updatedSlot, error } = await supabase
            .from('calendar_slots')
            .update(updates)
            .eq('id', id)
            .select()
            .single();
    
        if (error) {
            toast({ title: "Error al reagendar", description: error.message, variant: "destructive" });
            dropInfo.revert();
        } else {
            setSlots(prevSlots => prevSlots.map(s => (s.id === id ? updatedSlot : s)));
            toast({ title: "Cita reagendada", description: "La cita se ha movido exitosamente." });
        }
    };

    const handleEventResize = async (resizeInfo) => {
        if (!canEdit) return;
        if (isDemo) {
            toast({ title: "Acción no permitida", description: "No se puede modificar la agenda de demostración." });
            resizeInfo.revert();
            return;
        }

        const { event } = resizeInfo;
        const { id } = event.extendedProps;
        const newStart = event.start;
        const newEnd = event.end;

        const updates = {
            hora_inicio: format(newStart, 'HH:mm:ss'),
            hora_fin: format(newEnd, 'HH:mm:ss'),
        };

        const { data: updatedSlot, error } = await supabase
            .from('calendar_slots')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) {
            toast({ title: "Error al redimensionar", description: error.message, variant: "destructive" });
            resizeInfo.revert();
        } else {
            setSlots(prevSlots => prevSlots.map(s => (s.id === id ? updatedSlot : s)));
            toast({ title: "Duración actualizada", description: "La duración de la cita se ha actualizado." });
        }
    };

    const handleEventClick = (clickInfo) => {
        setDialogState({ open: true, type: 'detail', data: clickInfo.event });
    };

    const handleDateSelect = (selectInfo) => {
        if (!canEdit) return;
        setDialogState({ open: true, type: 'action', data: selectInfo });
    };

    const handleCreateAppointment = () => {
        const { data } = dialogState;
        closeDialog();
        navigate('/crear-reserva', { 
            state: { 
                salonId: salonId,
                employeeId: employeeFilter !== 'all' ? employeeFilter : null,
                start: data.start.toISOString(),
            } 
        });
    };

    const handleBlockTime = async (e) => {
        e.preventDefault();
        if (isDemo) {
            toast({ title: "Acción no permitida", description: "No se puede modificar la agenda de demostración." });
            return;
        }
        const { data: dialogData } = dialogState;
        const form = new FormData(e.target);
        const motivo = form.get('motivo');

        const newSlotData = {
            salon_id: salonId,
            employee_id: employeeFilter !== 'all' ? employeeFilter : null,
            fecha: format(dialogData.start, 'yyyy-MM-dd'),
            hora_inicio: format(dialogData.start, 'HH:mm:ss'),
            hora_fin: format(dialogData.end, 'HH:mm:ss'),
            estado: 'bloqueado',
            motivo: motivo,
            creado_por: user.id
        };

        const { data: insertedSlot, error } = await supabase.from('calendar_slots').insert(newSlotData).select().single();

        if (error) {
            toast({ title: "Error al bloquear", description: error.message, variant: "destructive" });
        } else {
            setSlots(prevSlots => [...prevSlots, insertedSlot]);
            toast({ title: "Tiempo bloqueado", description: "El horario ha sido marcado como no disponible." });
            closeDialog();
        }
    };
    
    const handleReleaseSlot = async () => {
        if (isDemo) {
            toast({ title: "Acción no permitida", description: "No se puede modificar la agenda de demostración." });
            return;
        }
        const { id, estado: originalState } = dialogState.data.extendedProps;
        
        if (originalState === 'reservado') {
            const { data: updatedSlot, error } = await supabase.from('calendar_slots').update({ estado: 'disponible', cliente_nombre: null, cita_id: null, servicio_id: null }).eq('id', id).select().single();
            if (error) {
                toast({ title: "Error al cancelar cita", description: error.message, variant: "destructive" });
            } else {
                setSlots(slots.map(s => s.id === id ? updatedSlot : s));
                toast({ title: "Cita cancelada", description: "El slot ahora está disponible." });
            }
        } else if (originalState === 'bloqueado') {
            const { error } = await supabase.from('calendar_slots').delete().eq('id', id);
            if (error) {
                toast({ title: "Error al eliminar bloqueo", description: error.message, variant: "destructive" });
            } else {
                setSlots(slots.filter(s => s.id !== id));
                toast({ title: "Bloqueo eliminado", description: "El horario ha sido liberado." });
            }
        }
        closeDialog();
    };

    const closeDialog = () => setDialogState({ open: false, type: null, data: null });

    if (loading || authLoading) {
        return <div className="flex items-center justify-center h-screen"><div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div></div>;
    }

    return (
        <div className="min-h-screen bg-background p-4 sm:p-6 md:p-8">
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <AgendaHeader 
                    salonName={salon?.name}
                    onBack={() => navigate(-1)}
                    calendarApi={calendarRef.current?.getApi()}
                />
                <Card>
                    <CardContent className="p-4">
                        <AgendaFilters
                            canEdit={canEdit}
                            employees={employees}
                            services={DEMO_SERVICES}
                            employeeFilter={employeeFilter}
                            onEmployeeFilterChange={setEmployeeFilter}
                            serviceFilter={serviceFilter}
                            onServiceFilterChange={setServiceFilter}
                        />
                        <div className="fc-wrapper">
                            <FullCalendar
                                ref={calendarRef}
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={false}
                                locale="es"
                                allDaySlot={false}
                                slotMinTime="08:00:00"
                                slotMaxTime="22:00:00"
                                height="auto"
                                events={calendarEvents}
                                selectable={canEdit}
                                editable={canEdit}
                                selectMirror={true}
                                dayMaxEvents={true}
                                eventClick={handleEventClick}
                                select={handleDateSelect}
                                eventDrop={handleEventDrop}
                                eventResize={handleEventResize}
                                eventOverlap={false}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <AgendaDialogs
                dialogState={dialogState}
                closeDialog={closeDialog}
                onCreateAppointment={handleCreateAppointment}
                onBlockTime={handleBlockTime}
                onReleaseSlot={handleReleaseSlot}
                canEdit={canEdit}
                onSetDialogState={setDialogState}
            />
            <style>{`
                .fc-event { cursor: pointer; border-width: 2px !important; }
                .fc-daygrid-event-dot { display: none; }
                .fc-event-main-frame { font-size: 0.8rem; }
                .fc-timegrid-event .fc-event-main { padding: 4px; }
                .fc .fc-button { background-color: hsl(var(--primary)); color: hsl(var(--primary-foreground)); border: none; }
                .fc .fc-button:hover { background-color: hsl(var(--primary) / 0.9); }
                .fc .fc-button-primary:not(:disabled).fc-button-active, .fc .fc-button-primary:not(:disabled):active { background-color: hsl(var(--primary) / 0.8); }
            `}</style>
        </div>
    );
};

export default SalonAgenda;