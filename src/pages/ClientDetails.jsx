import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, Edit, User, Mail, Phone, Calendar, DollarSign, History, AlertTriangle } from 'lucide-react';
import { motion } from 'framer-motion';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StatCard = ({ icon, title, value }) => (
  <Card>
    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
      <CardTitle className="text-sm font-medium">{title}</CardTitle>
      {icon}
    </CardHeader>
    <CardContent>
      <div className="text-2xl font-bold">{value}</div>
    </CardContent>
  </Card>
);

const ClientDetails = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [client, setClient] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);

      if (clientId.startsWith('client-demo-')) {
        const demoClients = {
          'client-demo-1': { id: 'client-demo-1', name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', phone: '555-1234', created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Cliente de demostración. Prefiere café solo.' },
          'client-demo-2': { id: 'client-demo-2', name: 'Ana García', email: 'ana.garcia@example.com', phone: '555-5678', created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(), notes: 'Cliente de demostración. Alergia a los frutos secos.' },
        };
        const demoAppointments = {
          'client-demo-1': [
            { id: 'appt-demo-1', appointment_time: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(), services: { name: 'Corte y Peinado', precio: 25 }, employees: { name: 'Lucía' } },
          ],
          'client-demo-2': [
            { id: 'appt-demo-2', appointment_time: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(), services: { name: 'Coloración Completa', precio: 75 }, employees: { name: 'Sofía' } },
            { id: 'appt-demo-3', appointment_time: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(), services: { name: 'Manicura', precio: 20 }, employees: { name: 'Elena' } },
            { id: 'appt-demo-4', appointment_time: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(), services: { name: 'Corte Caballero', precio: 15 }, employees: { name: 'Lucía' } },
          ]
        };

        if (demoClients[clientId]) {
          setClient(demoClients[clientId]);
          setAppointments(demoAppointments[clientId] || []);
        } else {
          setClient(null);
          toast({ title: "Error", description: "No se pudo encontrar el cliente de demostración.", variant: "destructive" });
        }
        setLoading(false);
        return;
      }

      if (!user || authLoading) {
        if (!authLoading) setLoading(false);
        return;
      }
      
      setClient(null);

      try {
        const { data: clientData, error: clientError } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (clientError || !clientData) {
          if (clientError) {
            toast({ title: "Error al buscar cliente", description: clientError.message, variant: "destructive" });
          } else {
            toast({ title: "Error", description: "No se pudo encontrar el cliente.", variant: "destructive" });
          }
          setLoading(false);
          return;
        }

        const { data: apptData, error: apptError } = await supabase
          .from('appointments')
          .select('*, employees(name), services(name, precio)')
          .eq('client_id', clientId)
          .order('appointment_time', { ascending: false });

        if (apptError) throw apptError;

        setClient(clientData);
        setAppointments(apptData || []);
      } catch (error) {
        toast({ title: "Error", description: "No se pudo cargar la información del cliente.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [clientId, user, authLoading, navigate]);

  const totalSpent = appointments.reduce((acc, curr) => acc + (curr.services?.precio || 0), 0);

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!client) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background text-center p-4">
        <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.5 }}>
          <Card className="max-w-md mx-auto">
            <CardHeader className="p-6">
              <div className="mx-auto bg-destructive/10 p-3 rounded-full w-fit mb-4">
                <AlertTriangle className="h-10 w-10 text-destructive" />
              </div>
              <CardTitle className="text-2xl font-bold text-destructive">Error al Cargar Cliente</CardTitle>
              <CardDescription className="text-base">No se pudo encontrar la información. Verifica que el cliente exista y vuelve a intentarlo.</CardDescription>
            </CardHeader>
            <CardFooter>
              <Button onClick={() => navigate(-1)} className="w-full">
                <ArrowLeft className="mr-2 h-4 w-4" /> Volver
              </Button>
            </CardFooter>
          </Card>
        </motion.div>
      </div>
    );
  }

  const handleEditClick = () => {
    if (clientId.startsWith('client-demo-')) {
      toast({
        title: 'Modo Demostración',
        description: 'No se pueden editar clientes en modo demostración.',
      });
      return;
    }
    navigate(`/editar-cliente/${clientId}`);
  };

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-bold text-hub-anthracite flex items-center">
                <User className="mr-3 h-8 w-8 text-hub-coral" />
                {client.name}
              </h1>
              <p className="text-foreground text-lg">Perfil del Cliente</p>
            </div>
          </div>
          <Button onClick={handleEditClick}>
            <Edit className="mr-2 h-4 w-4" /> Editar Cliente
          </Button>
        </div>

        <div className="grid gap-4 md:grid-cols-3">
          <StatCard icon={<Calendar className="h-4 w-4 text-muted-foreground" />} title="Total de Citas" value={appointments.length} />
          <StatCard icon={<DollarSign className="h-4 w-4 text-muted-foreground" />} title="Gasto Total" value={`${totalSpent.toFixed(2)} €`} />
          <StatCard icon={<History className="h-4 w-4 text-muted-foreground" />} title="Miembro Desde" value={client.created_at ? format(new Date(client.created_at), 'PPP', { locale: es }) : 'N/A'} />
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <div className="md:col-span-1 space-y-8">
            <Card>
              <CardHeader>
                <CardTitle>Información de Contacto</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center">
                  <Mail className="mr-3 h-5 w-5 text-hub-coral" />
                  <span>{client.email || 'No proporcionado'}</span>
                </div>
                <div className="flex items-center">
                  <Phone className="mr-3 h-5 w-5 text-hub-coral" />
                  <span>{client.phone || 'No proporcionado'}</span>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>Notas del Cliente</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground italic">
                  {client.notes || 'No hay notas para este cliente.'}
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="md:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Historial de Citas</CardTitle>
                <CardDescription>Todas las citas pasadas y futuras de {client.name}.</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha y Hora</TableHead>
                      <TableHead>Servicio</TableHead>
                      <TableHead>Empleado</TableHead>
                      <TableHead className="text-right">Precio</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {appointments.length > 0 ? (
                      appointments.map(appt => (
                        <TableRow key={appt.id}>
                          <TableCell>{appt.appointment_time ? format(new Date(appt.appointment_time), 'PPpp', { locale: es }) : 'Fecha no disponible'}</TableCell>
                          <TableCell>{appt.services?.name || 'Servicio eliminado'}</TableCell>
                          <TableCell>{appt.employees?.name || 'No asignado'}</TableCell>
                          <TableCell className="text-right">{(appt.services?.precio || 0).toFixed(2)} €</TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan="4" className="text-center h-24">Este cliente aún no tiene citas.</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default ClientDetails;