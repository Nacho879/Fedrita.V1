import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog } from '@/components/ui/dialog';
import EditAppointmentModal from '@/components/dashboard/EditAppointmentModal.jsx';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Edit3, Trash2, User, Scissors, CalendarDays, Clock, Home, Briefcase, Crown, Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_APPOINTMENTS } from '@/lib/demo-data';

const AppointmentsSalon = () => {
  const { user, managedSalon, loading: authLoading } = useAuth();
  const { isDemo } = useDemo();
  const [appointments, setAppointments] = useState([]);
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();
  const [salonDisplayName, setSalonDisplayName] = useState('');
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);

  const fetchAppointments = useCallback(async () => {
    if (authLoading) return;

    if (isDemo) {
      if (managedSalon) {
        setSalonDisplayName(managedSalon.name);
        const demoAppointments = DEMO_APPOINTMENTS.filter(a => a.salon_id === managedSalon.id);
        setAppointments(demoAppointments);
      }
      setLoadingAppointments(false);
      return;
    }
    
    if (!user || !managedSalon) {
      if (!authLoading) setLoadingAppointments(false);
      return;
    }
    
    setSalonDisplayName(managedSalon.name);
    
    try {
      setLoadingAppointments(true);
      const { data, error } = await supabase
        .from('appointments')
        .select(`
          *,
          employees (name)
        `)
        .eq('salon_id', managedSalon.id)
        .order('appointment_time', { ascending: false });

      if (error) throw error;
      setAppointments(data || []);
    } catch (error) {
      toast({ title: 'Error al cargar las citas', description: error.message, variant: 'destructive' });
    } finally {
      setLoadingAppointments(false);
    }
  }, [user, managedSalon, authLoading, isDemo]);
  
  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handleDeleteAppointment = async (appointmentId) => {
    if (isDemo) {
      toast({ title: 'Modo Demo', description: 'No se pueden eliminar citas en modo demostración.' });
      return;
    }
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId)
        .eq('salon_id', managedSalon.id);

      if (error) throw error;
      setAppointments(appointments.filter((appt) => appt.id !== appointmentId));
      toast({ title: 'Cita eliminada', description: 'La cita ha sido eliminada exitosamente.' });
    } catch (error) {
      toast({ title: 'Error al eliminar la cita', description: error.message, variant: 'destructive' });
    }
  };

  const handleAppointmentUpdated = () => {
    setEditingAppointmentId(null);
    fetchAppointments();
  };

  const filteredAppointments = appointments.filter(appt => {
    const searchTermLower = searchTerm.toLowerCase();
    return (
      appt.client_name?.toLowerCase().includes(searchTermLower) ||
      (appt.service || appt.service_name)?.toLowerCase().includes(searchTermLower) ||
      appt.employees?.name?.toLowerCase().includes(searchTermLower)
    );
  });

  if (authLoading || loadingAppointments) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!managedSalon) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
        <Crown className="w-24 h-24 text-hub-coral opacity-50 mb-6" />
        <h1 className="text-3xl font-bold text-hub-anthracite mb-4">No tienes un salón asignado</h1>
        <p className="text-foreground mb-8">
          Contacta con el administrador para que te asigne como manager de un salón.
        </p>
        <Button onClick={() => navigate('/dashboard-manager')} className="btn-primary">
          Volver al Panel de Manager
        </Button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-bold text-hub-anthracite flex items-center">
              <Crown className="mr-3 h-10 w-10 text-hub-coral" />
              Citas de {salonDisplayName}
            </h1>
            <p className="text-foreground text-lg">Gestiona todas las reservas del salón.</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => navigate('/dashboard-manager')} variant="outline">
              <Home className="mr-2 h-4 w-4" /> Volver al Panel
            </Button>
            <Button onClick={() => navigate('/crear-reserva')} className="btn-primary">
              <PlusCircle className="mr-2 h-5 w-5" /> Nueva Cita
            </Button>
          </div>
        </div>

        <div className="mb-8 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Buscar por cliente, servicio o empleado..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full md:w-1/2 lg:w-1/3"
          />
        </div>

        {filteredAppointments.length === 0 && !loadingAppointments ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }} className="text-center py-16 bg-card rounded-xl shadow-hub">
            <CalendarDays className="w-24 h-24 text-hub-coral opacity-50 mx-auto mb-6" />
            {searchTerm ? (
              <>
                <h2 className="text-2xl font-bold text-hub-anthracite mb-3">No se encontraron resultados</h2>
                <p className="text-foreground mb-6">Intenta con otros términos de búsqueda.</p>
              </>
            ) : (
              <>
                <h2 className="text-2xl font-bold text-hub-anthracite mb-3">Aún no hay citas en este salón</h2>
                <p className="text-foreground mb-6">¡Empieza creando la primera reserva para tus clientes!</p>
                <Button onClick={() => navigate('/crear-reserva')} className="btn-primary text-lg px-8 py-3">
                  <PlusCircle className="mr-2 h-5 w-5" /> Agendar Primera Cita
                </Button>
              </>
            )}
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredAppointments.map((appt, index) => (
              <motion.div key={appt.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.1 }}>
                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                  <CardHeader className="bg-secondary p-6">
                    <CardTitle className="text-2xl text-hub-anthracite flex items-center">
                      <User className="mr-3 h-6 w-6 text-hub-coral" /> {appt.client_name}
                    </CardTitle>
                    <CardDescription className="text-foreground flex items-center pt-1">
                      <Scissors className="mr-2 h-4 w-4 text-hub-coral" /> {appt.service || appt.service_name}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="p-6 space-y-3 flex-grow">
                    <div className="flex items-center text-foreground">
                      <CalendarDays className="mr-3 h-5 w-5 text-hub-coral" />
                      <span>{format(new Date(appt.appointment_time), "PPP", { locale: es })}</span>
                    </div>
                    <div className="flex items-center text-foreground">
                      <Clock className="mr-3 h-5 w-5 text-hub-coral" />
                      <span>{format(new Date(appt.appointment_time), "p", { locale: es })}</span>
                    </div>
                    {appt.employees?.name && (
                      <div className="flex items-center text-foreground">
                        <Briefcase className="mr-3 h-5 w-5 text-hub-coral" />
                        <span>Atendido por: {appt.employees.name}</span>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter className="p-4 bg-background/50 border-t flex justify-end space-x-3">
                    <Button variant="outline" size="sm" onClick={() => setEditingAppointmentId(appt.id)}>
                      <Edit3 className="mr-2 h-4 w-4" /> Editar
                    </Button>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button variant="destructive" size="sm">
                          <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Estás seguro de eliminar esta cita?</AlertDialogTitle>
                          <AlertDialogDescription>
                            Esta acción no se puede deshacer. Se eliminará la cita para "{appt.client_name}" el {format(new Date(appt.appointment_time), "PPP 'a las' p", { locale: es })}.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={() => handleDeleteAppointment(appt.id)} className="bg-destructive hover:bg-destructive/90">
                            Sí, eliminar cita
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
        
        <Dialog open={!!editingAppointmentId} onOpenChange={(isOpen) => !isOpen && setEditingAppointmentId(null)}>
            {editingAppointmentId && (
                <EditAppointmentModal
                    appointmentId={editingAppointmentId}
                    onAppointmentUpdated={handleAppointmentUpdated}
                />
            )}
        </Dialog>

      </motion.div>
    </div>
  );
};

export default AppointmentsSalon;