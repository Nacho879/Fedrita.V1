import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { format, addMinutes } from 'date-fns';

import BookingLoader from '@/components/booking/BookingLoader';
import BookingError from '@/components/booking/BookingError';
import BookingHeader from '@/components/booking/BookingHeader';
import BookingProgress from '@/components/booking/BookingProgress';
import BookingSummary from '@/components/booking/BookingSummary';
import StepService from '@/components/booking/StepService';
import StepEmployee from '@/components/booking/StepEmployee';
import StepDateTime from '@/components/booking/StepDateTime';
import StepClientDetails from '@/components/booking/StepClientDetails';
import StepConfirmation from '@/components/booking/StepConfirmation';

import { DEMO_SALONS, DEMO_SERVICES, DEMO_EMPLOYEES } from '@/lib/demo-data';

const BookingBySlug = () => {
    const { slug } = useParams();
    const navigate = useNavigate();

    const [step, setStep] = useState(1);
    const [salon, setSalon] = useState(null);
    const [services, setServices] = useState([]);
    const [employees, setEmployees] = useState([]);
    const [availableSlots, setAvailableSlots] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const [selectedService, setSelectedService] = useState(null);
    const [selectedEmployee, setSelectedEmployee] = useState(null);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [clientDetails, setClientDetails] = useState({ name: '', email: '', phone: '' });
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [loadingSlots, setLoadingSlots] = useState(false);

    useEffect(() => {
        const fetchSalonData = async () => {
            setLoading(true);

            const demoSalonData = DEMO_SALONS.find(s => s.public_slug === slug);

            if (demoSalonData) {
                const demoServicesForSalon = DEMO_SERVICES.filter(s => s.salon_id === demoSalonData.id && s.activo);
                const demoEmployeesForSalon = DEMO_EMPLOYEES.filter(e => e.salon_id === demoSalonData.id);

                setSalon(demoSalonData);
                setServices(demoServicesForSalon);
                setEmployees(demoEmployeesForSalon);
                setLoading(false);
                return;
            }

            try {
                const { data: salonData, error: salonError } = await supabase
                    .from('salons')
                    .select('*, services(id, name, duracion_minutos, precio, activo), employees(*)')
                    .eq('public_slug', slug)
                    .eq('url_publica_activada', true)
                    .single();

                if (salonError) {
                    if (salonError.message.includes('column') && salonError.message.includes('does not exist')) {
                        setError('La base de datos no está configurada correctamente para esta función. Por favor, sigue las instrucciones para añadir las columnas necesarias.');
                    } else {
                        setError('Este enlace de reservas no está disponible o no existe.');
                    }
                    throw salonError;
                }
                
                if (!salonData) {
                    setError('Este enlace de reservas no está disponible o no existe.');
                    throw new Error('Salon not found');
                }
                
                setSalon(salonData);
                setServices(salonData.services.filter(s => s.activo) || []);
                setEmployees(salonData.employees || []);
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };
        fetchSalonData();
    }, [slug]);

    useEffect(() => {
        const fetchSlots = async () => {
            if (!salon || !selectedService || !selectedEmployee || !selectedDate) return;

            setLoadingSlots(true);
            setAvailableSlots([]);

            const isDemoSalon = DEMO_SALONS.some(s => s.id === salon.id);

            if (isDemoSalon) {
                setTimeout(() => {
                    const demoSlots = [
                        { start_time: '09:00:00' }, { start_time: '09:30:00' }, { start_time: '10:00:00' },
                        { start_time: '11:00:00' }, { start_time: '11:30:00' }, { start_time: '12:00:00' },
                        { start_time: '15:00:00' }, { start_time: '15:30:00' }, { start_time: '16:00:00' },
                    ];
                    setAvailableSlots(demoSlots);
                    setLoadingSlots(false);
                }, 500);
                return;
            }

            try {
                const serviceDuration = selectedService.duracion_minutos;
                const day = format(selectedDate, 'yyyy-MM-dd');

                const { data: bookedSlots, error: bookedSlotsError } = await supabase
                    .from('calendar_slots')
                    .select('hora_inicio, hora_fin')
                    .eq('salon_id', salon.id)
                    .eq('employee_id', selectedEmployee.id)
                    .eq('fecha', day)
                    .or('estado.eq.reservado,estado.eq.bloqueado');

                if (bookedSlotsError) throw bookedSlotsError;

                const workDayStart = new Date(`${day}T09:00:00`);
                const workDayEnd = new Date(`${day}T18:00:00`);
                const potentialSlots = [];
                let currentTime = workDayStart;

                while (addMinutes(currentTime, serviceDuration) <= workDayEnd) {
                    const slotStart = new Date(currentTime);
                    const slotEnd = addMinutes(slotStart, serviceDuration);

                    const hasConflict = bookedSlots.some(booked => {
                        const bookedStart = new Date(`${day}T${booked.hora_inicio}`);
                        const bookedEnd = new Date(`${day}T${booked.hora_fin}`);
                        return slotStart < bookedEnd && slotEnd > bookedStart;
                    });

                    if (!hasConflict) {
                        potentialSlots.push({ start_time: format(slotStart, 'HH:mm:ss') });
                    }
                    currentTime = addMinutes(currentTime, 15);
                }
                setAvailableSlots(potentialSlots);
            } catch (err) {
                toast({ title: "Error al cargar horarios", description: "No se pudieron obtener los horarios disponibles.", variant: "destructive" });
            } finally {
                setLoadingSlots(false);
            }
        };
        fetchSlots();
    }, [salon, selectedService, selectedEmployee, selectedDate]);

    const handleClientDetailsChange = (e) => {
        setClientDetails({ ...clientDetails, [e.target.id]: e.target.value });
    };

    const findOrCreateClient = async (ownerId) => {
        let clientId;
        if (clientDetails.phone || clientDetails.email) {
          const orFilter = [];
          if (clientDetails.phone) orFilter.push(`phone.eq.${clientDetails.phone}`);
          if (clientDetails.email) orFilter.push(`email.eq.${clientDetails.email.toLowerCase()}`);
          
          const { data: existingClient, error: findError } = await supabase
            .from('clients')
            .select('id')
            .eq('owner_id', ownerId)
            .or(orFilter.join(','))
            .limit(1)
            .single();
          if (findError && findError.code !== 'PGRST116') throw findError;
          if (existingClient) clientId = existingClient.id;
        }
    
        if (!clientId) {
          const { data: newClient, error: createError } = await supabase
            .from('clients')
            .insert({
              name: clientDetails.name,
              email: clientDetails.email ? clientDetails.email.toLowerCase() : null,
              phone: clientDetails.phone,
              owner_id: ownerId
            })
            .select('id')
            .single();
          if (createError) throw createError;
          clientId = newClient.id;
        }
        return clientId;
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        if (!selectedService || !selectedEmployee || !selectedDate || !selectedTime) {
            toast({ title: "Faltan datos", description: "Por favor, completa todos los pasos de la reserva.", variant: "destructive" });
            return;
        }
        setIsSubmitting(true);

        const isDemoSalon = DEMO_SALONS.some(s => s.id === salon.id);
        if (isDemoSalon) {
            setTimeout(() => {
                setStep(5);
                setIsSubmitting(false);
            }, 1000);
            return;
        }

        try {
            const clientId = await findOrCreateClient(salon.owner_id);
            const appointmentStartTime = new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`);
            const appointmentEndTime = addMinutes(appointmentStartTime, selectedService.duracion_minutos);

            const { data: conflictingSlots, error: conflictError } = await supabase
                .from('calendar_slots')
                .select('id')
                .eq('salon_id', salon.id)
                .eq('employee_id', selectedEmployee.id)
                .eq('fecha', format(appointmentStartTime, 'yyyy-MM-dd'))
                .or('estado.eq.reservado,estado.eq.bloqueado')
                .lt('hora_inicio', format(appointmentEndTime, 'HH:mm:ss'))
                .gt('hora_fin', format(appointmentStartTime, 'HH:mm:ss'));
            
            if (conflictError) throw conflictError;

            if (conflictingSlots && conflictingSlots.length > 0) {
                toast({ title: "Horario no disponible", description: "Este horario ya no está disponible. Por favor, elige otro.", variant: "destructive" });
                setIsSubmitting(false);
                setStep(3);
                return;
            }

            const { data: newAppointment, error: appointmentError } = await supabase.from('appointments').insert([{
                salon_id: salon.id,
                employee_id: selectedEmployee.id,
                service_id: selectedService.id,
                owner_id: salon.owner_id,
                client_id: clientId,
                client_name: clientDetails.name,
                client_phone: clientDetails.phone,
                client_email: clientDetails.email,
                appointment_time: appointmentStartTime.toISOString(),
                end_time: appointmentEndTime.toISOString(),
                status: 'confirmada',
                source: 'public_url',
                price: selectedService.precio,
            }]).select().single();

            if (appointmentError) throw appointmentError;

            const { error: slotError } = await supabase.from('calendar_slots').insert([{
                salon_id: salon.id,
                employee_id: selectedEmployee.id,
                fecha: format(appointmentStartTime, 'yyyy-MM-dd'),
                hora_inicio: format(appointmentStartTime, 'HH:mm:ss'),
                hora_fin: format(appointmentEndTime, 'HH:mm:ss'),
                estado: 'reservado',
                cita_id: newAppointment.id,
                cliente_id: clientId,
                cliente_nombre: clientDetails.name,
                servicio_id: selectedService.id,
                motivo: 'Reserva automática'
            }]);

            if (slotError) {
                await supabase.from('appointments').delete().eq('id', newAppointment.id);
                throw slotError;
            }

            setStep(5);
        } catch (err) {
            toast({ title: "Error al crear la cita", description: "No se pudo guardar la reserva. Inténtalo de nuevo.", variant: "destructive" });
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderStepContent = () => {
        switch (step) {
            case 1: return <StepService services={services} onSelectService={(s) => { setSelectedService(s); setStep(2); }} />;
            case 2: return <StepEmployee employees={employees} onSelectEmployee={(e) => { setSelectedEmployee(e); setStep(3); }} />;
            case 3: return <StepDateTime selectedDate={selectedDate} onSelectDate={setSelectedDate} availableSlots={availableSlots} onSelectTime={(t) => { setSelectedTime(t); setStep(4); }} loadingSlots={loadingSlots} />;
            case 4: return <StepClientDetails clientDetails={clientDetails} onDetailsChange={handleClientDetailsChange} onSubmit={handleFormSubmit} isSubmitting={isSubmitting} />;
            case 5: return <StepConfirmation clientName={clientDetails.name} salonName={salon.name} selectedDate={selectedDate} selectedTime={selectedTime} />;
            default: return null;
        }
    };

    if (loading) return <BookingLoader />;
    if (error) return <BookingError message={error} />;

    return (
        <div className="min-h-screen bg-secondary">
            <div className="container mx-auto p-4 md:p-8 max-w-4xl">
                <BookingHeader salonName={salon.name} />
                <Card>
                    <CardContent className="p-6">
                        <BookingProgress step={step} setStep={setStep} />
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                            <div className="md:col-span-2">
                                <AnimatePresence mode="wait">
                                    <motion.div
                                        key={step}
                                        initial={{ opacity: 0, x: 50 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -50 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        {renderStepContent()}
                                    </motion.div>
                                </AnimatePresence>
                            </div>
                            <BookingSummary selectedService={selectedService} selectedEmployee={selectedEmployee} selectedDate={selectedDate} selectedTime={selectedTime} />
                        </div>
                    </CardContent>
                </Card>
                 <footer className="text-center mt-8 text-sm text-muted-foreground">
                    Potenciado por <a href="https://fedrita.com" target="_blank" rel="noopener noreferrer" className="font-bold text-primary">Fedrita.com</a>
                </footer>
            </div>
        </div>
    );
};

export default BookingBySlug;