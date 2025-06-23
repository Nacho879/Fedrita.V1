import React, { useState, useEffect, useMemo } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDemo } from '@/hooks/useDemo.jsx';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import interactionPlugin from '@fullcalendar/interaction';
import { es } from 'date-fns/locale';
import { DEMO_APPOINTMENTS, DEMO_EMPLOYEES } from '@/lib/demo-data';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { motion } from 'framer-motion';
import { Scissors } from 'lucide-react';

const MyAgenda = () => {
    const { user, managedSalon } = useAuth();
    const { isDemo } = useDemo();
    const [events, setEvents] = useState([]);

    const employeeId = useMemo(() => {
        if (isDemo) {
            const demoEmployee = DEMO_EMPLOYEES.find(e => e.salon_id === managedSalon?.id);
            return demoEmployee?.id;
        }
        return user?.id;
    }, [isDemo, user, managedSalon]);

    useEffect(() => {
        const fetchAppointments = () => {
            if (!employeeId) return;

            let appointments = [];
            if (isDemo) {
                appointments = DEMO_APPOINTMENTS.filter(apt => apt.employee_id === employeeId);
            } else {
                appointments = DEMO_APPOINTMENTS.filter(apt => apt.employee_id === employeeId);
            }

            const calendarEvents = appointments.map(apt => ({
                id: apt.id,
                title: `${apt.service} - ${apt.client_name}`,
                start: new Date(apt.appointment_time),
                end: new Date(new Date(apt.appointment_time).getTime() + apt.duration * 60000),
                backgroundColor: '#3b82f6',
                borderColor: '#3b82f6',
                extendedProps: {
                    client: apt.client_name,
                    service: apt.service,
                }
            }));
            setEvents(calendarEvents);
        };

        fetchAppointments();
    }, [employeeId, isDemo]);

    if (!managedSalon && !isDemo) {
        return (
          <div className="flex flex-col items-center justify-center h-full bg-secondary p-4 text-center">
            <Scissors className="w-24 h-24 text-primary opacity-50 mb-6" />
            <h1 className="text-3xl font-bold text-hub-anthracite mb-4">No tienes un salón asignado</h1>
            <p className="text-foreground mb-8">
              No podemos mostrar tu agenda porque no estás asignado/a a ningún salón. Contacta con tu manager.
            </p>
          </div>
        );
    }

    return (
        <div className="p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <Card>
                    <CardHeader>
                        <CardTitle>Mi Agenda</CardTitle>
                        <CardDescription>Aquí puedes ver todas tus citas programadas.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="h-[75vh]">
                            <FullCalendar
                                plugins={[dayGridPlugin, timeGridPlugin, interactionPlugin]}
                                initialView="timeGridWeek"
                                headerToolbar={{
                                    left: 'prev,next today',
                                    center: 'title',
                                    right: 'dayGridMonth,timeGridWeek,timeGridDay'
                                }}
                                events={events}
                                locale={es}
                                editable={false}
                                selectable={false}
                                allDaySlot={false}
                                slotMinTime="08:00:00"
                                slotMaxTime="22:00:00"
                                height="100%"
                                eventContent={(eventInfo) => (
                                    <div className="p-1">
                                        <b>{eventInfo.timeText}</b>
                                        <p className="text-sm truncate">{eventInfo.event.title}</p>
                                    </div>
                                )}
                            />
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default MyAgenda;