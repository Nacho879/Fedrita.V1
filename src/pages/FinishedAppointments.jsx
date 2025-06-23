import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { useDemo } from '@/hooks/useDemo';
import { DEMO_APPOINTMENTS, DEMO_SALONS, DEMO_EMPLOYEES } from '@/lib/demo-data';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const APPOINTMENTS_PER_PAGE = 10;

const FinishedAppointments = () => {
  const { company, loading: authLoading } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();
  const { toast } = useToast();

  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetchAppointments = useCallback(async () => {
    setLoading(true);

    if (isDemo) {
      const finishedAppointments = DEMO_APPOINTMENTS
        .filter(appt => appt.status === 'completed')
        .map(appt => {
            const salon = DEMO_SALONS.find(s => s.id === appt.salon_id);
            const employee = DEMO_EMPLOYEES.find(e => e.id === appt.employee_id);
            return {
                ...appt,
                salons: salon ? { name: salon.name } : { name: 'Salón Demo' },
                employees: employee ? { name: employee.name } : { name: 'Empleado Demo' },
            };
        });

      setTotalPages(Math.ceil(finishedAppointments.length / APPOINTMENTS_PER_PAGE));
      const paginatedAppointments = finishedAppointments.slice(
          (currentPage - 1) * APPOINTMENTS_PER_PAGE,
          currentPage * APPOINTMENTS_PER_PAGE
      );
      setAppointments(paginatedAppointments);
      setLoading(false);
      return;
    }

    if (!company) {
      if (!authLoading) setLoading(false);
      return;
    }

    try {
      const from = (currentPage - 1) * APPOINTMENTS_PER_PAGE;
      const to = from + APPOINTMENTS_PER_PAGE - 1;

      const { count, error: countError } = await supabase
        .from('appointments')
        .select('*', { count: 'exact', head: true })
        .eq('company_id', company.id)
        .eq('status', 'completed');

      if (countError) throw countError;
      setTotalPages(Math.ceil(count / APPOINTMENTS_PER_PAGE) || 1);

      const { data, error } = await supabase
        .from('appointments')
        .select(`
          id,
          client_name,
          service_name,
          appointment_time,
          price,
          salons (name),
          employees (name)
        `)
        .eq('company_id', company.id)
        .eq('status', 'completed')
        .order('appointment_time', { ascending: false })
        .range(from, to);
      
      if (error) throw error;
      setAppointments(data || []);

    } catch (error) {
      toast({
        title: 'Error al cargar las citas',
        description: error.message,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  }, [company, currentPage, authLoading, toast, isDemo]);

  useEffect(() => {
    fetchAppointments();
  }, [fetchAppointments]);

  const handlePreviousPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
       <header className="bg-card shadow-sm border-b sticky top-0 z-40">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl font-bold text-hub-anthracite">
                  Citas Finalizadas
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Historial de todas las citas completadas en tus salones.
                </p>
              </div>
            </div>
          </div>
        </div>
      </header>
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <Card>
            <CardHeader>
              <CardTitle>Historial de Citas</CardTitle>
              <CardDescription>
                Aquí puedes ver todas las citas que han sido marcadas como finalizadas.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
                </div>
              ) : appointments.length > 0 ? (
                <>
                  <div className="overflow-x-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Servicio</TableHead>
                          <TableHead>Empleado</TableHead>
                          <TableHead>Salón</TableHead>
                          <TableHead>Fecha y Hora</TableHead>
                          <TableHead className="text-right">Precio</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {appointments.map((appt) => (
                          <TableRow key={appt.id}>
                            <TableCell className="font-medium">{appt.client_name}</TableCell>
                            <TableCell>{appt.service_name}</TableCell>
                            <TableCell>{appt.employees?.name || 'No asignado'}</TableCell>
                            <TableCell>{appt.salons?.name || 'N/A'}</TableCell>
                            <TableCell>{format(new Date(appt.appointment_time), "dd/MM/yyyy HH:mm", { locale: es })}</TableCell>
                            <TableCell className="text-right">${appt.price?.toFixed(2) || '0.00'}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  </div>
                  <div className="flex items-center justify-end space-x-2 py-4">
                    <span className="text-sm text-muted-foreground">
                      Página {currentPage} de {totalPages}
                    </span>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handlePreviousPage}
                      disabled={currentPage === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      Anterior
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleNextPage}
                      disabled={currentPage === totalPages}
                    >
                      Siguiente
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-16">
                    <p className="text-muted-foreground">No se encontraron citas finalizadas.</p>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default FinishedAppointments;