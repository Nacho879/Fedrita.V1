import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { Calendar, Bot, Users, Briefcase, ArrowLeft, XCircle, FileDown, CalendarDays } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startOfDay, endOfDay, startOfWeek, endOfWeek, startOfMonth, endOfMonth, format as formatDate, parseISO, getDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_SALONS } from '@/lib/demo-data';
import * as XLSX from 'xlsx';

const SalonMetrics = () => {
  const { salonId } = useParams();
  const { user, loading: authLoading } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();
  const [salon, setSalon] = useState(null);
  const [metrics, setMetrics] = useState({
    today: 0,
    thisWeek: 0,
    thisMonth: 0,
    cancellations: 0,
    popularServices: [],
    weeklyOccupancy: [],
  });
  const [loadingMetrics, setLoadingMetrics] = useState(true);
  const [isExporting, setIsExporting] = useState(false);
  
  const dayMapping = { 1: 'Lunes', 2: 'Martes', 3: 'Miércoles', 4: 'Jueves', 5: 'Viernes', 6: 'Sábado', 0: 'Domingo' };
  const weekOrder = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];

  useEffect(() => {
    const fetchRealMetrics = async () => {
      setLoadingMetrics(true);
      try {
        const { data: salonData, error: salonError } = await supabase
          .from('salons')
          .select('name')
          .eq('id', salonId)
          .single();
        if (salonError) throw salonError;
        setSalon(salonData);
        
        const now = new Date();
        const todayStart = startOfDay(now).toISOString();
        const todayEnd = endOfDay(now).toISOString();
        const weekStart = startOfWeek(now, { weekStartsOn: 1 }).toISOString();
        const weekEnd = endOfWeek(now, { weekStartsOn: 1 }).toISOString();
        const monthStart = startOfMonth(now).toISOString();
        const monthEnd = endOfMonth(now).toISOString();
        
        const { count: todayCount, error: todayError } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('salon_id', salonId).gte('appointment_time', todayStart).lte('appointment_time', todayEnd);
        if (todayError) throw todayError;

        const { data: weekAppointments, error: weekError } = await supabase.from('appointments').select('appointment_time, service_name').eq('salon_id', salonId).gte('appointment_time', weekStart).lte('appointment_time', weekEnd);
        if (weekError) throw weekError;

        const { count: monthCount, error: monthError } = await supabase.from('appointments').select('*', { count: 'exact', head: true }).eq('salon_id', salonId).gte('appointment_time', monthStart).lte('appointment_time', monthEnd);
        if (monthError) throw monthError;
        
        const serviceCounts = weekAppointments.reduce((acc, curr) => {
          acc[curr.service_name] = (acc[curr.service_name] || 0) + 1;
          return acc;
        }, {});
        const popularServices = Object.entries(serviceCounts).sort((a, b) => b[1] - a[1]).slice(0, 5).map(([name, count])=> ({name, count}));

        const occupancyByDay = weekAppointments.reduce((acc, curr) => {
          const dayIndex = getDay(parseISO(curr.appointment_time));
          const dayName = dayMapping[dayIndex];
          acc[dayName] = (acc[dayName] || 0) + 1;
          return acc;
        }, {});

        const weeklyOccupancy = weekOrder.map(day => ({
          name: day.substring(0,3),
          longName: day,
          Citas: occupancyByDay[day] || 0
        }));

        setMetrics({
          today: todayCount || 0,
          thisWeek: weekAppointments.length || 0,
          thisMonth: monthCount || 0,
          cancellations: 0,
          popularServices,
          weeklyOccupancy
        });

      } catch (error) {
        toast({ title: 'Error al cargar las métricas', description: error.message, variant: 'destructive' });
      } finally {
        setLoadingMetrics(false);
      }
    };

    if (authLoading) return;

    if (isDemo) {
      const demoSalon = DEMO_SALONS.find(s => s.id === salonId);
      setSalon(demoSalon || { name: 'Local Demo' });
      setMetrics({
        today: 5,
        thisWeek: 25,
        thisMonth: 110,
        cancellations: 2,
        popularServices: [
          { name: 'Corte Demo', count: 10 },
          { name: 'Color Demo', count: 8 },
          { name: 'Peinado Demo', count: 7 },
        ],
        weeklyOccupancy: weekOrder.map(day => ({
          name: day.substring(0,3),
          longName: day,
          Citas: Math.floor(Math.random() * 10) + 1
        }))
      });
      setLoadingMetrics(false);
    } else {
      if (!user || !salonId) {
        setLoadingMetrics(false);
        return;
      }
      fetchRealMetrics();
    }
  }, [user, salonId, authLoading, isDemo]);

  const kpiData = [
    { title: "Citas Hoy", value: metrics.today, icon: Calendar, color: "text-blue-600" },
    { title: "Citas (Semana)", value: metrics.thisWeek, icon: CalendarDays, color: "text-green-600" },
    { title: "Citas (Mes)", value: metrics.thisMonth, icon: Briefcase, color: "text-orange-600" },
    { title: "Cancelaciones", value: metrics.cancellations, icon: XCircle, color: "text-red-600", note: "(N/A)" },
  ];

  const handleExportToExcel = () => {
    setIsExporting(true);
    try {
      const wb = XLSX.utils.book_new();

      const kpiExport = kpiData.map(kpi => ({ Métrica: kpi.title, Valor: kpi.value }));
      const occupancyExport = metrics.weeklyOccupancy.map(item => ({ Día: item.longName, Citas: item.Citas }));
      const servicesExport = metrics.popularServices.map(item => ({ Servicio: item.name, Cantidad: item.count }));

      const ws_kpi = XLSX.utils.json_to_sheet(kpiExport);
      XLSX.utils.book_append_sheet(wb, ws_kpi, "Resumen Métricas");
      
      const ws_occupancy = XLSX.utils.json_to_sheet(occupancyExport);
      XLSX.utils.book_append_sheet(wb, ws_occupancy, "Ocupación Semanal");

      const ws_services = XLSX.utils.json_to_sheet(servicesExport);
      XLSX.utils.book_append_sheet(wb, ws_services, "Servicios Populares");

      const fileName = `metricas_${(salon?.name || 'local').replace(/\s+/g, '_')}_${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`;
      XLSX.writeFile(wb, fileName);
      
      toast({
        title: "¡Exportación Exitosa!",
        description: `El archivo ${fileName} se ha descargado.`,
      });
    } catch (error) {
      toast({
        title: "Error al exportar",
        description: "No se pudo generar el archivo de Excel.",
        variant: "destructive",
      });
    } finally {
      setIsExporting(false);
    }
  };


  if (authLoading || loadingMetrics) {
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
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-6 w-6" />
              </Button>
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-hub-anthracite">
                  Métricas del Local: {salon?.name}
                </h1>
                <p className="text-foreground mt-1">Análisis de rendimiento detallado.</p>
              </div>
            </div>
            <div className="flex items-center space-x-2">
               <Button onClick={handleExportToExcel} disabled={isExporting}>
                <FileDown className="mr-2 h-4 w-4" />
                {isExporting ? 'Exportando...' : 'Exportar a Excel'}
              </Button>
              <Button onClick={() => navigate(`/salon/${salonId}/asistente`)}>
                <Bot className="mr-2 h-4 w-4" />
                Configurar Asistente IA
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
          {kpiData.map((kpi, index) => (
            <Card key={index} className="shadow-hub">
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium text-foreground">{kpi.title}</CardTitle>
                <kpi.icon className={`h-5 w-5 ${kpi.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold">{kpi.value}</div>
                {kpi.note && <p className="text-xs text-muted-foreground">{kpi.note}</p>}
              </CardContent>
            </Card>
          ))}
        </motion.section>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <motion.div 
                className="lg:col-span-2"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
            >
                <Card className="shadow-hub h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-hub-anthracite">Ocupación Semanal</CardTitle>
                        <CardDescription>Número de citas por día en la semana actual.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div style={{ width: '100%', height: 300 }}>
                        <ResponsiveContainer>
                            <BarChart data={metrics.weeklyOccupancy} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" />
                                <YAxis allowDecimals={false}/>
                                <Tooltip contentStyle={{ backgroundColor: '#fff', border: '1px solid #ddd' }} />
                                <Bar dataKey="Citas" fill="#FF7A59" barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
            >
                <Card className="shadow-hub h-full">
                    <CardHeader>
                        <CardTitle className="text-xl font-bold text-hub-anthracite">Servicios Populares</CardTitle>
                        <CardDescription>Top 5 servicios más realizados esta semana.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        {metrics.popularServices.length > 0 ? (
                        <ul className="space-y-4">
                            {metrics.popularServices.map((service, index) => (
                                <li key={index} className="flex justify-between items-center">
                                    <span className="text-sm font-medium text-foreground">{service.name}</span>
                                    <span className="text-sm font-bold text-hub-coral">{service.count}</span>
                                </li>
                            ))}
                        </ul>
                        ) : (
                           <p className="text-sm text-muted-foreground text-center pt-8">No hay datos de servicios para esta semana.</p>
                        )}
                    </CardContent>
                </Card>
            </motion.div>
        </div>
        <motion.div
             initial={{ opacity: 0, y: 20 }}
             animate={{ opacity: 1, y: 0 }}
             transition={{ duration: 0.5, delay: 0.4 }}
             className="mt-6"
        >
            <Card className="shadow-hub">
                 <CardHeader>
                    <CardTitle className="text-xl font-bold text-hub-anthracite">Conversión IA</CardTitle>
                    <CardDescription>Análisis de cuántos mensajes del asistente generan una reserva.</CardDescription>
                 </CardHeader>
                 <CardContent className="text-center">
                    <Bot className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-lg font-semibold text-foreground">Función Próximamente</p>
                    <p className="text-sm text-muted-foreground">Esta métrica estará disponible cuando se active el asistente de IA.</p>
                 </CardContent>
            </Card>
        </motion.div>
      </main>
    </div>
  );
};

export default SalonMetrics;