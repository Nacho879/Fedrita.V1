import React, { useState, useEffect } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Calendar as CalendarIcon, User, Mail, Phone, Store, Briefcase, Scissors, Clock, Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { format, addMinutes } from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

const CreateAppointment = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, company, userRole, managedSalon } = useAuth();

  const [clientName, setClientName] = useState('');
  const [clientEmail, setClientEmail] = useState('');
  const [clientPhone, setClientPhone] = useState('');
  const [selectedSalon, setSelectedSalon] = useState('');
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [appointmentDateTime, setAppointmentDateTime] = useState(null);
  const [selectedServiceId, setSelectedServiceId] = useState('');
  
  const [salons, setSalons] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [services, setServices] = useState([]);
  
  const [loading, setLoading] = useState(false);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const [loadingEmployees, setLoadingEmployees] = useState(false);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    if (location.state) {
      const { salonId, employeeId, start } = location.state;
      if (salonId) setSelectedSalon(salonId);
      if (employeeId) setSelectedEmployee(employeeId);
      if (start) setAppointmentDateTime(new Date(start));
    }
  }, [location.state]);

  useEffect(() => {
    const fetchSalons = async () => {
      if (!user) { setLoadingSalons(false); return; }
      try {
        setLoadingSalons(true);
        let query = supabase.from('salons').select('id, name');
        if (userRole === 'admin' && company) query = query.eq('company_id', company.id);
        else if (userRole === 'manager' && managedSalon) {
          query = query.eq('id', managedSalon.id);
          setSelectedSalon(managedSalon.id);
        } else { setLoadingSalons(false); return; }
        
        const { data, error } = await query;
        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        toast({ title: "Error al cargar salones", description: error.message, variant: "destructive" });
      } finally {
        setLoadingSalons(false);
      }
    };
    if (userRole) fetchSalons();
  }, [company, user, userRole, managedSalon]);

  useEffect(() => {
    const fetchEmployeesAndServices = async () => {
      if (!selectedSalon) {
        setEmployees([]);
        setServices([]);
        setSelectedEmployee('');
        setSelectedServiceId('');
        return;
      }

      setLoadingEmployees(true);
      setLoadingServices(true);
      try {
        const { data: empData, error: empError } = await supabase.from('employees').select('id, name').eq('salon_id', selectedSalon);
        if (empError) throw empError;
        setEmployees(empData || []);

        const { data: svcData, error: svcError } = await supabase.from('services').select('id, name, duracion_minutos, precio').eq('salon_id', selectedSalon).eq('activo', true);
        if (svcError) throw svcError;
        setServices(svcData || []);
      } catch (error) {
        toast({ title: "Error al cargar datos del salón", description: error.message, variant: "destructive" });
      } finally {
        setLoadingEmployees(false);
        setLoadingServices(false);
      }
    };
    fetchEmployeesAndServices();
  }, [selectedSalon]);

  const findOrCreateClient = async (ownerId) => {
    let clientId;
    if (clientPhone || clientEmail) {
      const orFilter = [];
      if (clientPhone) orFilter.push(`phone.eq.${clientPhone}`);
      if (clientEmail) orFilter.push(`email.eq.${clientEmail.toLowerCase()}`);
      
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
          name: clientName,
          email: clientEmail ? clientEmail.toLowerCase() : null,
          phone: clientPhone,
          owner_id: ownerId
        })
        .select('id')
        .single();
      if (createError) throw createError;
      clientId = newClient.id;
    }
    return clientId;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const ownerId = company?.owner_id || managedSalon?.owner_id;
    const serviceInfo = services.find(s => s.id === selectedServiceId);

    if (!ownerId || !selectedSalon || !selectedEmployee || !appointmentDateTime || !serviceInfo || !clientName) {
      toast({ title: "Campos incompletos", description: "Por favor, completa todos los campos requeridos.", variant: "destructive" });
      return;
    }
    setLoading(true);

    try {
      const clientId = await findOrCreateClient(ownerId);
      
      const appointmentStartTime = new Date(appointmentDateTime);
      const appointmentEndTime = addMinutes(appointmentStartTime, serviceInfo.duracion_minutos);

      const { data: conflictingSlots, error: conflictError } = await supabase
        .from('calendar_slots')
        .select('id')
        .eq('salon_id', selectedSalon)
        .eq('employee_id', selectedEmployee)
        .eq('fecha', format(appointmentStartTime, 'yyyy-MM-dd'))
        .or('estado.eq.reservado,estado.eq.bloqueado')
        .lt('hora_inicio', format(appointmentEndTime, 'HH:mm:ss'))
        .gt('hora_fin', format(appointmentStartTime, 'HH:mm:ss'));
      
      if (conflictError) throw conflictError;

      if (conflictingSlots && conflictingSlots.length > 0) {
        toast({ title: "Horario no disponible", description: "Este horario ya no está disponible.", variant: "destructive" });
        setLoading(false);
        return;
      }
      
      const { data: appointment, error: appointmentError } = await supabase
        .from('appointments')
        .insert([{
          salon_id: selectedSalon,
          employee_id: selectedEmployee,
          service_id: selectedServiceId,
          owner_id: ownerId,
          client_id: clientId,
          client_name: clientName,
          client_email: clientEmail,
          client_phone: clientPhone,
          appointment_time: appointmentStartTime.toISOString(),
          end_time: appointmentEndTime.toISOString(),
          status: 'confirmada',
          source: 'panel_admin',
          price: serviceInfo.precio,
        }])
        .select()
        .single();

      if (appointmentError) throw appointmentError;
      
      const { error: slotError } = await supabase.from('calendar_slots').insert([{
        salon_id: selectedSalon,
        employee_id: selectedEmployee,
        fecha: format(appointmentStartTime, 'yyyy-MM-dd'),
        hora_inicio: format(appointmentStartTime, 'HH:mm:ss'),
        hora_fin: format(appointmentEndTime, 'HH:mm:ss'),
        estado: 'reservado',
        cita_id: appointment.id,
        cliente_id: clientId,
        cliente_nombre: clientName,
        servicio_id: selectedServiceId,
        motivo: 'Reserva automática',
        creado_por: user.id
      }]);
      
      if (slotError) {
        await supabase.from('appointments').delete().eq('id', appointment.id);
        throw slotError;
      }

      toast({ title: "¡Reserva creada!", description: `Cita para ${clientName} agendada.` });
      navigate(`/salon/${selectedSalon}/agenda`);
    } catch (error) {
      toast({ title: "Error al crear la reserva", description: error.message, variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  
  const handleDateTimeChange = (date) => {
    if (!date) { setAppointmentDateTime(null); return; }
    const currentTime = appointmentDateTime || new Date();
    const newDateTime = new Date(date);
    newDateTime.setHours(currentTime.getHours(), currentTime.getMinutes(), 0, 0);
    setAppointmentDateTime(newDateTime);
  };

  const handleTimeChange = (e) => {
    const timeValue = e.target.value; 
    if (!appointmentDateTime || !timeValue) return;
    const [hours, minutes] = timeValue.split(':').map(Number);
    const newDateTime = new Date(appointmentDateTime);
    newDateTime.setHours(hours, minutes, 0, 0);
    setAppointmentDateTime(newDateTime);
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-3xl">
        <Card>
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-hub-coral flex items-center justify-center">
                <CalendarIcon className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Crear Nueva Reserva</CardTitle>
            <CardDescription className="text-lg">Agenda una nueva cita para tus clientes.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="clientName">Nombre del Cliente *</Label>
                  <div className="relative"><User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="clientName" placeholder="Nombre Apellido" value={clientName} onChange={(e) => setClientName(e.target.value)} required className="h-12 pl-12" /></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="clientEmail">Email del Cliente</Label>
                   <div className="relative"><Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="clientEmail" type="email" placeholder="cliente@ejemplo.com" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} className="h-12 pl-12" /></div>
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="clientPhone">Teléfono del Cliente</Label>
                <div className="relative"><Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="clientPhone" type="tel" placeholder="+1 234 567 8900" value={clientPhone} onChange={(e) => setClientPhone(e.target.value)} className="h-12 pl-12" /></div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="salon">Salón *</Label>
                  <div className="relative"><Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" /><Select onValueChange={setSelectedSalon} value={selectedSalon} disabled={loadingSalons || userRole === 'manager'}><SelectTrigger className="h-12 pl-12"><SelectValue placeholder={loadingSalons ? "Cargando..." : "Selecciona un salón"} /></SelectTrigger><SelectContent>{salons.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}{salons.length === 0 && !loadingSalons && <div className="p-4 text-sm text-muted-foreground">No hay salones. <Link to="/crear-salon" className="underline">Crear uno</Link>.</div>}</SelectContent></Select></div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="employee">Empleado *</Label>
                   <div className="relative"><Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" /><Select onValueChange={setSelectedEmployee} value={selectedEmployee} disabled={!selectedSalon || loadingEmployees}><SelectTrigger className="h-12 pl-12"><SelectValue placeholder={loadingEmployees ? "Cargando..." : "Selecciona un empleado"} /></SelectTrigger><SelectContent>{employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}{employees.length === 0 && !loadingEmployees && selectedSalon && <div className="p-4 text-sm text-muted-foreground">No hay empleados.</div>}</SelectContent></Select></div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="service">Servicio Solicitado *</Label>
                <div className="relative"><Scissors className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" /><Select onValueChange={setSelectedServiceId} value={selectedServiceId} disabled={!selectedSalon || loadingServices}><SelectTrigger className="h-12 pl-12"><SelectValue placeholder={loadingServices ? "Cargando..." : "Selecciona un servicio"} /></SelectTrigger><SelectContent>{services.map(s => <SelectItem key={s.id} value={s.id}>{s.name} ({s.duracion_minutos} min)</SelectItem>)}{services.length === 0 && !loadingServices && selectedSalon && <div className="p-4 text-sm text-muted-foreground">No hay servicios.</div>}</SelectContent></Select></div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                    <Label htmlFor="appointmentDate">Fecha de la Cita *</Label>
                    <Popover><PopoverTrigger asChild><Button variant="outline" className={cn("w-full justify-start text-left font-normal h-12 pl-12", !appointmentDateTime && "text-muted-foreground")}><CalendarIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />{appointmentDateTime ? format(appointmentDateTime, "PPP", { locale: es }) : <span>Selecciona una fecha</span>}</Button></PopoverTrigger><PopoverContent className="w-auto p-0"><Calendar mode="single" selected={appointmentDateTime} onSelect={handleDateTimeChange} initialFocus disabled={(date) => date < new Date(new Date().setHours(0,0,0,0))} /></PopoverContent></Popover>
                </div>
                <div className="space-y-2">
                    <Label htmlFor="appointmentTime">Hora de la Cita *</Label>
                    <div className="relative"><Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" /><Input id="appointmentTime" type="time" value={appointmentDateTime ? format(appointmentDateTime, "HH:mm") : ""} onChange={handleTimeChange} required className="h-12 pl-12" disabled={!appointmentDateTime} /></div>
                </div>
              </div>

              <div className="pt-2 space-y-2">
                <Button type="submit" className="w-full h-12 btn-primary text-lg" disabled={loading || loadingSalons}>
                  {loading ? "Agendando..." : "Crear Reserva"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-12" onClick={() => navigate(-1)}>
                  <Home className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateAppointment;