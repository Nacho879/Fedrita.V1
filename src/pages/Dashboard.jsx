
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { motion } from 'framer-motion';
import { PlusCircle, Users, BarChart3, BellRing, Building2, Calendar, Eye, Clock, LogOut, AreaChart, Store } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { format, isToday, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from '@/components/ui/use-toast';
import { DEMO_SALONS, DEMO_EMPLOYEES, DEMO_APPOINTMENTS } from '@/lib/demo-data';

const Dashboard = () => {
  const { user, company, logout, loading: authLoading, displayName } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    salons: 0,
    employees: 0,
    totalAppointments: 0,
    upcomingAppointments: [],
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (isDemo) {
        const upcoming = (DEMO_APPOINTMENTS || [])
          .filter(appt => new Date(appt.appointment_time) >= new Date())
          .slice(0, 3);
        setStats({
          salons: DEMO_SALONS.length,
          employees: DEMO_EMPLOYEES.length,
          totalAppointments: DEMO_APPOINTMENTS.length,
          upcomingAppointments: upcoming,
        });
        setLoadingStats(false);
        return;
      }
      
      if (!user || !company) {
        if(!authLoading) setLoadingStats(false);
        return;
      }
      setLoadingStats(true);
      try {
        const { data: companySalons, error: salonsError } = await supabase
          .from('salons')
          .select('id')
          .eq('company_id', company.id);

        if (salonsError) throw salonsError;
        
        const salonIds = companySalons.map(s => s.id);

        const [
          { count: employeesCount, error: employeesError },
          { data: appointmentsData, error: appointmentsError }
        ] = await Promise.all([
          salonIds.length > 0 ? supabase.from('employees').select('*', { count: 'exact', head: true }).in('salon_id', salonIds) : Promise.resolve({ count: 0, error: null }),
          supabase.from('appointments').select('id, client_name, appointment_time, salons (name)').eq('owner_id', user.id).order('appointment_time', { ascending: true }).limit(50)
        ]);

        if (employeesError) throw employeesError;
        if (appointmentsError) throw appointmentsError;

        const upcoming = (appointmentsData || [])
          .filter(appt => new Date(appt.appointment_time) >= new Date())
          .slice(0, 3);

        setStats({
          salons: companySalons.length || 0,
          employees: employeesCount || 0,
          totalAppointments: (appointmentsData || []).length,
          upcomingAppointments: upcoming,
        });
      } catch (error) {
        console.error("Error fetching dashboard data:", error);
        toast({ title: "Error al cargar datos del panel", description: error.message, variant: "destructive" });
      } finally {
        setLoadingStats(false);
      }
    };

    if (!authLoading) {
      fetchDashboardData();
    }
  }, [user, company, authLoading, isDemo]);


  const quickActions = [
    { icon: Store, title: "Crear Local", description: "Configura un nuevo local.", action: "/crear-salon" },
    { icon: Users, title: "Gestionar Empleados", description: "Administra los roles y el acceso de tu equipo.", action: "/mis-empleados" },
    { icon: BarChart3, title: "Métricas Globales", description: "Visualiza el rendimiento de todos tus salones.", action: "/metricas-empresa" },
    { icon: BellRing, title: "Solicitudes de Managers", description: "Revisa y aprueba las peticiones de los managers.", action: "/solicitudes-manager" }
  ];

  const overviewStats = [
    { icon: Building2, label: "Locales Registrados", value: stats.salons, color: "text-blue-600", link: "/mis-salones"},
    { icon: Users, label: "Empleados Activos", value: stats.employees, color: "text-green-600", link: "/mis-empleados" },
    { icon: Calendar, label: "Total de Citas", value: stats.totalAppointments, color: "text-hub-coral", link: "/citas-finalizadas" },
    { icon: AreaChart, label: "Métricas", value: "Ver", color: "text-orange-600", link: "/metricas-empresa" } 
  ];

  if (authLoading || loadingStats) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <header className="bg-card shadow-hub border-b sticky top-0 z-40">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-hub-anthracite">
                Panel de {displayName || 'Fedrita'}
              </h1>
              <p className="text-foreground mt-1">
                ¡Bienvenido de nuevo, {displayName}! 👋
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <span className="font-poppins text-xl font-semibold text-hub-coral">Fedrita</span>
              <Button variant="outline" onClick={() => navigate('/editar-empresa')}>
                <Building2 className="mr-2 h-4 w-4" />
                Editar Empresa
              </Button>
              <Button variant="outline" onClick={logout}>
                <LogOut className="mr-2 h-4 w-4" />
                Cerrar Sesión
              </Button>
            </div>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-6 py-10">
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10"
        >
          {overviewStats.map((stat, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow duration-300 cursor-pointer" onClick={() => stat.link && navigate(stat.link)}>
              <CardContent className="p-6 flex flex-col justify-between h-full">
                <div className="flex items-center justify-between mb-3">
                  <stat.icon className={`w-9 h-9 ${stat.color}`} />
                  <span className={`text-3xl font-bold ${stat.color}`}>{stat.value}</span>
                </div>
                <p className="text-md font-semibold text-foreground">{stat.label}</p>
              </CardContent>
            </Card>
          ))}
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-10"
        >
          <h2 className="text-2xl font-bold text-hub-anthracite mb-6">Acciones Rápidas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Card key={index} className="hover:shadow-lg transition-all duration-300 group overflow-hidden">
                <CardHeader className="p-6 bg-hub-coral text-white">
                  <div className="flex items-center space-x-3">
                    <action.icon className="w-7 h-7" />
                    <CardTitle className="text-xl text-white">{action.title}</CardTitle>
                  </div>
                </CardHeader>
                <CardContent className="p-6">
                  <p className="text-foreground text-sm mb-4 min-h-[40px]">{action.description}</p>
                  <Button asChild className="w-full btn-primary" disabled={action.disabled}>
                      <Link to={action.action}>Comenzar</Link>
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-hub-anthracite mb-6">Próximas Citas</h2>
          {stats.upcomingAppointments.length > 0 ? (
            <div className="space-y-4">
              {stats.upcomingAppointments.map(appt => (
                <Card key={appt.id}>
                  <CardContent className="p-5 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                       <div className={`p-3 rounded-lg ${isToday(parseISO(appt.appointment_time)) ? 'bg-green-100' : 'bg-secondary'}`}>
                        <Calendar className={`w-6 h-6 ${isToday(parseISO(appt.appointment_time)) ? 'text-green-600' : 'text-hub-coral'}`} />
                      </div>
                      <div>
                        <p className="font-semibold text-foreground">{appt.client_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(parseISO(appt.appointment_time), "eeee dd 'de' MMMM, HH:mm 'hs'", { locale: es })}
                        </p>
                        {appt.salons?.name && <p className="text-xs text-muted-foreground">En: {appt.salons.name}</p>}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" onClick={() => navigate(`/mis-citas#${appt.id}`)}>
                      Ver Detalles <Eye className="ml-2 h-4 w-4"/>
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Card className="border-dashed">
              <CardContent className="p-10 text-center">
                <Clock className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-foreground">No tienes citas programadas próximamente.</p>
              </CardContent>
            </Card>
          )}
        </motion.section>
      </main>
    </div>
  );
};

export default Dashboard;
