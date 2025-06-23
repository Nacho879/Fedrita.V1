import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate, NavLink } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useDemo } from '@/hooks/useDemo.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import {
  Calendar,
  Users,
  Scissors,
  BarChart3,
  Settings,
  Bot,
  BookOpen,
  Building,
  LogOut,
  Loader2,
  Briefcase,
  Pencil,
  Trash2,
  Copy,
  Link as LinkIcon,
  QrCode
} from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_APPOINTMENTS } from '@/lib/demo-data';
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog } from '@/components/ui/dialog';
import ClientDetailsModal from '@/components/dashboard/ClientDetailsModal.jsx';
import EditAppointmentModal from '@/components/dashboard/EditAppointmentModal.jsx';
import QRCodeModal from '@/components/dashboard/QRCodeModal.jsx';

const DashboardManager = () => {
  const { user, salonId, logout, managedSalon, displayName } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedClientId, setSelectedClientId] = useState(null);
  const [editingAppointmentId, setEditingAppointmentId] = useState(null);
  const [isQrModalOpen, setIsQrModalOpen] = useState(false);

  const fetchDashboardData = useCallback(async () => {
    if (!managedSalon) {
      setLoading(false);
      return;
    }

    if (isDemo) {
      setAppointments(DEMO_APPOINTMENTS.filter(a => a.salon_id === managedSalon.id).slice(0, 5));
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      const todayStart = new Date();
      todayStart.setHours(0, 0, 0, 0);
      const todayEnd = new Date();
      todayEnd.setHours(23, 59, 59, 999);

      const { data: appointmentsData, error: appointmentsError } = await supabase
        .from('appointments')
        .select('id, appointment_time, client_name, client_id, services(name)')
        .eq('salon_id', salonId)
        .gte('appointment_time', todayStart.toISOString())
        .lte('appointment_time', todayEnd.toISOString())
        .order('appointment_time', { ascending: true })
        .limit(5);

      if (appointmentsError) throw appointmentsError;
      setAppointments(appointmentsData);

    } catch (error) {
      toast({
        title: 'Error al cargar el panel',
        description: 'No se pudieron obtener los datos del salón.',
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [isDemo, managedSalon, salonId]);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleDeleteAppointment = async (appointmentId) => {
    if (isDemo) {
      toast({ title: 'Modo Demo', description: 'No se pueden eliminar citas en modo demostración.' });
      return;
    }
    try {
      const { error } = await supabase
        .from('appointments')
        .delete()
        .eq('id', appointmentId);

      if (error) throw error;
      setAppointments(appointments.filter((app) => app.id !== appointmentId));
      toast({ title: 'Cita eliminada', description: 'La cita ha sido eliminada exitosamente.' });
    } catch (error) {
      toast({ title: 'Error al eliminar la cita', description: error.message, variant: 'destructive' });
    }
  };

  const handleAppointmentUpdated = () => {
    setEditingAppointmentId(null);
    fetchDashboardData();
  };

  const handleClientNameClick = (clientId) => {
    setSelectedClientId(clientId);
  };

  const handleCopyLink = () => {
    if (!managedSalon?.public_slug || !managedSalon?.url_publica_activada) {
      toast({
        title: 'Enlace no disponible',
        description: 'Activa la URL pública en los ajustes del salón para poder compartirla.',
        variant: 'destructive',
      });
      return;
    }
    const bookingUrl = `${window.location.origin}/reservas/${managedSalon.public_slug}`;
    navigator.clipboard.writeText(bookingUrl).then(() => {
      toast({
        title: '¡Enlace copiado!',
        description: 'Ya puedes compartir el enlace de reservas de tu salón.',
      });
    }).catch(err => {
      console.error('Failed to copy: ', err);
      toast({
        title: 'Error al copiar',
        description: 'No se pudo copiar el enlace. Inténtalo de nuevo.',
        variant: 'destructive',
      });
    });
  };

  const quickActions = [
    { name: 'Agenda', icon: Calendar, link: `/salon/${salonId}/agenda`, color: 'text-sky-500', bg: 'bg-sky-50' },
    { name: 'Gestionar Servicios', icon: Scissors, link: `/salon/${salonId}/servicios`, color: 'text-purple-500', bg: 'bg-purple-50' },
    { name: 'Citas', icon: BookOpen, link: '/citas-salon', color: 'text-green-500', bg: 'bg-green-50' },
    { name: 'Empleados', icon: Users, link: '/empleados-salon', color: 'text-orange-500', bg: 'bg-orange-50' },
    { name: 'Clientes', icon: Briefcase, link: '/clientes-salon', color: 'text-red-500', bg: 'bg-red-50' },
    { name: 'Métricas', icon: BarChart3, link: `/salon/${salonId}/metricas`, color: 'text-yellow-500', bg: 'bg-yellow-50' },
    { name: 'Asistente IA', icon: Bot, link: `/salon/${salonId}/asistente`, color: 'text-teal-500', bg: 'bg-teal-50' },
    { name: 'Editar Negocio', icon: Settings, link: `/salon/${salonId}/editar`, color: 'text-gray-500', bg: 'bg-gray-50' },
  ];

  if (loading || !managedSalon) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-16 w-16 animate-spin text-primary" /></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center">
            <Building className="h-8 w-8 text-primary" />
            <h1 className="ml-3 text-2xl font-bold text-gray-900">{managedSalon?.name || 'Panel de Manager'}</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600 hidden sm:block">Hola, {displayName || 'Manager'}</span>
            <Button onClick={handleLogout} variant="outline" size="sm">
              <LogOut className="h-4 w-4 mr-2" />
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <section className="mb-8">
              <Card>
                <CardContent className="p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <LinkIcon className="h-5 w-5 text-primary" />
                      <CardTitle className="text-lg">Enlace de Reservas Online</CardTitle>
                    </div>
                    <CardDescription className="mt-1 pl-7">
                      {managedSalon?.url_publica_activada 
                        ? "Comparte este enlace con tus clientes para que reserven 24/7."
                        : "Activa la URL pública en los ajustes para recibir reservas online."}
                    </CardDescription>
                  </div>
                  {managedSalon?.url_publica_activada ? (
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto shrink-0">
                      <Button onClick={handleCopyLink} className="w-full">
                        <Copy className="h-4 w-4 mr-2" />
                        Copiar Enlace
                      </Button>
                      <Button onClick={() => setIsQrModalOpen(true)} variant="outline" className="w-full">
                        <QrCode className="h-4 w-4 mr-2" />
                        Generar QR
                      </Button>
                    </div>
                  ) : (
                    <Button asChild className="w-full sm:w-auto shrink-0">
                      <Link to={`/salon/${salonId}/editar`}>
                        <Settings className="mr-2 h-4 w-4" /> Activar
                      </Link>
                    </Button>
                  )}
                </CardContent>
              </Card>
            </section>

            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Acciones Rápidas</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4">
                {quickActions.map((action, index) => (
                  <motion.div key={action.name} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.3, delay: index * 0.05 }}>
                    <NavLink to={action.link} end className={action.disabled ? 'pointer-events-none' : ''}>
                      <Card className={`hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ease-in-out ${action.bg} ${action.disabled ? 'opacity-50' : ''}`}>
                        <CardContent className="p-4 flex flex-col items-center justify-center text-center">
                          <action.icon className={`h-8 w-8 mb-2 ${action.color}`} />
                          <p className="font-semibold text-sm text-gray-700">{action.name}</p>
                        </CardContent>
                      </Card>
                    </NavLink>
                  </motion.div>
                ))}
              </div>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-gray-800 mb-4">Próximas Citas</h2>
              <Card>
                <CardContent className="p-0">
                  {appointments.length > 0 ? (
                    <ul className="divide-y divide-gray-200">
                      {appointments.map(app => (
                        <li key={app.id} className="p-4 flex items-center justify-between hover:bg-gray-50">
                          <div className="flex items-center flex-1 min-w-0">
                            <Avatar className="h-10 w-10 mr-4">
                              <AvatarFallback>{app.client_name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div className="min-w-0">
                              <button onClick={() => handleClientNameClick(app.client_id)} className="font-semibold text-gray-800 text-left truncate hover:underline cursor-pointer">
                                {app.client_name}
                              </button>
                              <p className="text-sm text-gray-500 truncate">{app.service || app.services?.name || 'Servicio no especificado'}</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-1 sm:gap-2 ml-4">
                            <div className="text-right hidden sm:block">
                              <p className="font-mono text-gray-800">{format(new Date(app.appointment_time), 'HH:mm')}</p>
                              <p className="text-sm text-gray-500">{format(new Date(app.appointment_time), 'dd MMM', { locale: es })}</p>
                            </div>
                            <Button variant="ghost" size="icon" onClick={() => setEditingAppointmentId(app.id)}>
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente la cita de
                                    <strong> {app.client_name}</strong>.
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={() => handleDeleteAppointment(app.id)} className="bg-destructive hover:bg-destructive/90">
                                    Sí, eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <div className="text-center p-8 text-gray-500">
                      <Calendar className="mx-auto h-12 w-12 text-gray-400" />
                      <p className="mt-4 font-semibold">No hay citas programadas para hoy.</p>
                    </div>
                  )}

                  <Dialog open={!!selectedClientId} onOpenChange={(isOpen) => !isOpen && setSelectedClientId(null)}>
                    {selectedClientId && <ClientDetailsModal clientId={selectedClientId} />}
                  </Dialog>

                  <Dialog open={!!editingAppointmentId} onOpenChange={(isOpen) => !isOpen && setEditingAppointmentId(null)}>
                    {editingAppointmentId && (
                      <EditAppointmentModal 
                        appointmentId={editingAppointmentId}
                        onAppointmentUpdated={handleAppointmentUpdated}
                      />
                    )}
                  </Dialog>
                  
                  <Dialog open={isQrModalOpen} onOpenChange={setIsQrModalOpen}>
                    {managedSalon?.public_slug && (
                      <QRCodeModal 
                        bookingUrl={`${window.location.origin}/reservas/${managedSalon.public_slug}`}
                        salonName={managedSalon.name}
                      />
                    )}
                  </Dialog>

                </CardContent>
              </Card>
            </section>
          </motion.div>
        </div>
      </main>
    </div>
  );
};

export default DashboardManager;