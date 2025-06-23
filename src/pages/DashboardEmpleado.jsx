import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { motion } from 'framer-motion';
import { Calendar, Clock, FileText, Sun, Scissors } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_APPOINTMENTS, DEMO_SERVICES } from '@/lib/demo-data';

const DashboardEmpleado = () => {
    const { managedSalon, loading, displayName } = useAuth();
    const { isDemo } = useDemo();
    const navigate = useNavigate();

    const mockAppointments = DEMO_APPOINTMENTS.filter(a => a.salon_id === managedSalon?.id).slice(0, 3);
    const mockServices = DEMO_SERVICES.filter(s => s.salon_id === managedSalon?.id).map(s => s.name);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
            </div>
        );
    }
    
    if (!managedSalon && !isDemo) {
        return (
          <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
            <Scissors className="w-24 h-24 text-hub-coral opacity-50 mb-6" />
            <h1 className="text-3xl font-bold text-hub-anthracite mb-4">No tienes un salón asignado</h1>
            <p className="text-foreground mb-8">
              Contacta con el manager o administrador para que te asignen a un salón.
            </p>
          </div>
        );
    }

    const QuickActionButton = ({ icon, title, description, path, disabled }) => (
        <Card 
            className={`hover:shadow-xl hover:-translate-y-1 transition-transform duration-300 ${disabled ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}
            onClick={() => !disabled && navigate(path)}
        >
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-lg font-medium">{title}</CardTitle>
                <div className="bg-primary text-primary-foreground p-2 rounded-lg">{icon}</div>
            </CardHeader>
            <CardContent>
                <p className="text-sm text-muted-foreground">{description}</p>
            </CardContent>
        </Card>
    );

    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-6xl mx-auto"
            >
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-hub-anthracite capitalize">¡Hola, {displayName}!</h1>
                    <p className="text-foreground text-lg">Bienvenido/a a tu panel de empleado en {managedSalon?.name}.</p>
                </div>

                <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4 mb-8">
                     <QuickActionButton 
                        icon={<Calendar size={24} />} 
                        title="Mi Agenda" 
                        description="Consulta tus citas programadas."
                        path="/mi-agenda"
                        disabled={!managedSalon?.id}
                    />
                    <QuickActionButton 
                        icon={<Clock size={24} />} 
                        title="Mi Fichaje" 
                        description="Registra tu entrada, pausas y salida."
                        path="/fichaje"
                    />
                     <QuickActionButton 
                        icon={<FileText size={24} />} 
                        title="Mis Documentos" 
                        description="Accede a tus nóminas y contratos."
                        path="/mis-documentos"
                    />
                    <QuickActionButton 
                        icon={<Sun size={24} />} 
                        title="Solicitar Descanso" 
                        description="Pide tus vacaciones o días libres."
                        path="/solicitar-descanso"
                    />
                </div>

                <div className="grid gap-8 md:grid-cols-5">
                    <div className="md:col-span-3">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Calendar className="mr-2 text-primary" />
                                    Tus Citas de Hoy
                                </CardTitle>
                                <CardDescription>
                                    {format(new Date(), "'Hoy es' EEEE, d 'de' MMMM", { locale: es })}
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Table>
                                    <TableHeader>
                                        <TableRow>
                                            <TableHead className="w-[100px]">Hora</TableHead>
                                            <TableHead>Servicio</TableHead>
                                            <TableHead>Cliente</TableHead>
                                        </TableRow>
                                    </TableHeader>
                                    <TableBody>
                                        {mockAppointments.map((apt) => (
                                            <TableRow key={apt.id}>
                                                <TableCell className="font-medium">{format(new Date(apt.appointment_time), 'HH:mm')}</TableCell>
                                                <TableCell>{apt.service}</TableCell>
                                                <TableCell>{apt.client_name}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </CardContent>
                        </Card>
                    </div>
                    <div className="md:col-span-2">
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center">
                                    <Scissors className="mr-2 text-primary" />
                                    Tus Servicios
                                </CardTitle>
                                <CardDescription>Servicios que tienes asignados.</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-3">
                                    {mockServices.map(service => (
                                        <li key={service} className="flex items-center bg-secondary p-3 rounded-md">
                                            <div className="bg-primary/20 text-primary p-1.5 rounded-md mr-3">
                                                <Scissors size={16} />
                                            </div>
                                            <span className="font-medium text-secondary-foreground">{service}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </motion.div>
        </div>
    );
};

export default DashboardEmpleado;