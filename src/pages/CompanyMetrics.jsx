
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { motion } from 'framer-motion';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, FileDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import MetricsFilters from '@/components/metrics/MetricsFilters.jsx';
import { subDays, format as formatDate, endOfDay, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_SALONS, DEMO_EMPLOYEES, DEMO_SERVICES, DEMO_APPOINTMENTS, DEMO_CLIENTS } from '@/lib/demo-data';
import * as XLSX from 'xlsx';

import TotalAppointmentsCard from '@/components/metrics/TotalAppointmentsCard.jsx';
import AppointmentsTodayCard from '@/components/metrics/AppointmentsTodayCard.jsx';
import AppointmentsWeekCard from '@/components/metrics/AppointmentsWeekCard.jsx';
import CancelledAppointmentsCard from '@/components/metrics/CancelledAppointmentsCard.jsx';
import AppointmentsByChannelCard from '@/components/metrics/AppointmentsByChannelCard.jsx';
import AttendanceRateCard from '@/components/metrics/AttendanceRateCard.jsx';
import AverageBookingTimeCard from '@/components/metrics/AverageBookingTimeCard.jsx';

import TotalServicesCard from '@/components/metrics/TotalServicesCard.jsx';
import PopularServicesCard from '@/components/metrics/PopularServicesCard.jsx';
import AverageServiceDurationCard from '@/components/metrics/AverageServiceDurationCard.jsx';

import TotalClientsCard from '@/components/metrics/TotalClientsCard.jsx';
import NewClientsCard from '@/components/metrics/NewClientsCard.jsx';
import RetentionRateCard from '@/components/metrics/RetentionRateCard.jsx';
import ClientTypeDistributionCard from '@/components/metrics/ClientTypeDistributionCard.jsx';

import AIMessagesCard from '@/components/metrics/AIMessagesCard.jsx';
import AIBookingsCard from '@/components/metrics/AIBookingsCard.jsx';
import AIConversionRateCard from '@/components/metrics/AIConversionRateCard.jsx';
import AIResponseTimeCard from '@/components/metrics/AIResponseTimeCard.jsx';

import ActiveEmployeesCard from '@/components/metrics/ActiveEmployeesCard.jsx';
import EmployeePerformanceCard from '@/components/metrics/EmployeePerformanceCard.jsx';
import WorkingHoursCard from '@/components/metrics/WorkingHoursCard.jsx';
import ActiveAbsencesCard from '@/components/metrics/ActiveAbsencesCard.jsx';

import SalonStatusCard from '@/components/metrics/SalonStatusCard.jsx';
import OccupancyRateCard from '@/components/metrics/OccupancyRateCard.jsx';
import SalonComparisonCard from '@/components/metrics/SalonComparisonCard.jsx';

const CompanyMetrics = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();

  const [filters, setFilters] = useState({
    dateRange: {
      from: subDays(new Date(), 29),
      to: new Date(),
    },
    salonId: 'all',
    employeeId: 'all',
    serviceId: 'all',
    channel: 'all',
    status: 'all',
    clientType: 'all',
  });

  const [filterOptions, setFilterOptions] = useState({
    salons: [],
    employees: [],
    services: [],
    channels: [
      { value: 'whatsapp', label: 'WhatsApp' },
      { value: 'web', label: 'Web' },
      { value: 'manual', label: 'Manual' },
      { value: 'instagram', label: 'Instagram' },
    ],
    statuses: [
      { value: 'confirmed', label: 'Confirmada' },
      { value: 'cancelled', label: 'Cancelada' },
      { value: 'completed', label: 'Completada' },
      { value: 'no_show', label: 'No Asistió' },
    ],
    clientTypes: [
      { value: 'new', label: 'Nuevo' },
      { value: 'recurrent', label: 'Recurrente' },
    ],
  });
  const [loadingFilters, setLoadingFilters] = useState(true);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoadingFilters(true);
      if (isDemo) {
        setFilterOptions(prev => ({
          ...prev,
          salons: DEMO_SALONS.map(s => ({ id: s.id, name: s.name })),
          employees: DEMO_EMPLOYEES.map(e => ({ id: e.id, name: e.name, salon_id: e.salon_id })),
          services: DEMO_SERVICES.map(s => ({ id: s.id, name: s.name })),
        }));
        setLoadingFilters(false);
        return;
      }

      if (!company) {
        if (!authLoading) setLoadingFilters(false);
        return;
      }
      
      try {
        const { data: salonsData, error: salonsError } = await supabase.from('salons').select('id, name').eq('company_id', company.id);
        if (salonsError) throw salonsError;

        const salonIds = salonsData.map(s => s.id);

        const [employeesRes, servicesRes] = await Promise.all([
          salonIds.length > 0 ? supabase.from('employees').select('id, name, salon_id').in('salon_id', salonIds) : Promise.resolve({ data: [], error: null }),
          salonIds.length > 0 ? supabase.from('services').select('id, name').in('salon_id', salonIds) : Promise.resolve({ data: [], error: null }),
        ]);

        if (employeesRes.error) throw employeesRes.error;
        if (servicesRes.error) throw servicesRes.error;

        setFilterOptions(prev => ({
          ...prev,
          salons: salonsData || [],
          employees: employeesRes.data || [],
          services: servicesRes.data || [],
        }));
      } catch (error) {
        toast({
          title: 'Error al cargar los filtros',
          description: error.message,
          variant: 'destructive',
        });
      } finally {
        setLoadingFilters(false);
      }
    };

    if (!authLoading) {
      fetchFilterOptions();
    }
  }, [user, company, authLoading, isDemo]);

  const handleExportToExcel = async () => {
    if (!company && !isDemo) {
        toast({ title: 'Error', description: 'No se pudo identificar la empresa.', variant: 'destructive' });
        return;
    }
    setIsExporting(true);
    toast({ title: 'Iniciando exportación...', description: 'Recopilando datos, esto puede tardar un momento.' });

    try {
        const wb = XLSX.utils.book_new();
        const timestamp = formatDate(new Date(), 'yyyy-MM-dd');

        if (isDemo) {
            const demoAppointments = DEMO_APPOINTMENTS.map(a => ({ ...a, salon_name: DEMO_SALONS.find(s => s.id === a.salon_id)?.name, employee_name: DEMO_EMPLOYEES.find(e => e.id === a.employee_id)?.name }));
            const ws_appointments = XLSX.utils.json_to_sheet(demoAppointments);
            XLSX.utils.book_append_sheet(wb, ws_appointments, "Citas");

            const ws_clients = XLSX.utils.json_to_sheet(DEMO_CLIENTS);
            XLSX.utils.book_append_sheet(wb, ws_clients, "Clientes");

            const ws_employees = XLSX.utils.json_to_sheet(DEMO_EMPLOYEES);
            XLSX.utils.book_append_sheet(wb, ws_employees, "Empleados");

            const ws_services = XLSX.utils.json_to_sheet(DEMO_SERVICES);
            XLSX.utils.book_append_sheet(wb, ws_services, "Servicios");
        } else {
            const { data: companySalons, error: salonsError } = await supabase.from('salons').select('id').eq('company_id', company.id);
            if (salonsError) throw salonsError;
            const salonIds = companySalons.map(s => s.id);

            let appointmentsQuery = supabase
                .from('appointments')
                .select('*, salons(name), employees(name), services(name, price)');

            if (salonIds.length > 0) {
                appointmentsQuery = appointmentsQuery.in('salon_id', salonIds);
            } else {
                appointmentsQuery = appointmentsQuery.eq('id', '00000000-0000-0000-0000-000000000000'); // No results
            }

            if (filters.dateRange.from) appointmentsQuery = appointmentsQuery.gte('appointment_time', filters.dateRange.from.toISOString());
            if (filters.dateRange.to) appointmentsQuery = appointmentsQuery.lte('appointment_time', endOfDay(filters.dateRange.to).toISOString());
            if (filters.salonId !== 'all') appointmentsQuery = appointmentsQuery.eq('salon_id', filters.salonId);
            if (filters.employeeId !== 'all') appointmentsQuery = appointmentsQuery.eq('employee_id', filters.employeeId);
            if (filters.serviceId !== 'all') appointmentsQuery = appointmentsQuery.eq('service_id', filters.serviceId);
            if (filters.channel !== 'all') appointmentsQuery = appointmentsQuery.eq('source', filters.channel);
            if (filters.status !== 'all') appointmentsQuery = appointmentsQuery.eq('status', filters.status);

            const { data: appointments, error: appointmentsError } = await appointmentsQuery;
            if (appointmentsError) throw appointmentsError;

            const appointmentsExport = appointments.map(a => ({
                'ID Cita': a.id,
                'Fecha y Hora': formatDate(parseISO(a.appointment_time), 'Pp', { locale: es }),
                'Cliente': a.client_name,
                'Teléfono Cliente': a.client_phone,
                'Email Cliente': a.client_email,
                'Local': a.salons?.name || 'N/A',
                'Empleado': a.employees?.name || 'N/A',
                'Servicio': a.services?.name || a.service_name || 'N/A',
                'Precio': a.price || a.services?.price || 'N/A',
                'Estado': a.status,
                'Canal': a.source,
            }));
            const ws_appointments = XLSX.utils.json_to_sheet(appointmentsExport);
            XLSX.utils.book_append_sheet(wb, ws_appointments, "Citas");

            const [clientsRes, employeesRes, servicesRes] = await Promise.all([
                supabase.from('clients').select('*').eq('owner_id', company.owner_id),
                salonIds.length > 0 ? supabase.from('employees').select('*, salons(name)').in('salon_id', salonIds) : Promise.resolve({ data: [], error: null }),
                salonIds.length > 0 ? supabase.from('services').select('*, salons(name)').in('salon_id', salonIds) : Promise.resolve({ data: [], error: null }),
            ]);

            if (clientsRes.error) throw clientsRes.error;
            const clientsExport = clientsRes.data.map(c => ({
                'ID Cliente': c.id, 'Nombre': c.name, 'Email': c.email, 'Teléfono': c.phone,
                'Total Citas': c.appointments_count,
                'Última Cita': c.last_appointment ? formatDate(parseISO(c.last_appointment), 'P', { locale: es }) : 'N/A',
            }));
            const ws_clients = XLSX.utils.json_to_sheet(clientsExport);
            XLSX.utils.book_append_sheet(wb, ws_clients, "Clientes");

            if (employeesRes.error) throw employeesRes.error;
            const employeesExport = employeesRes.data.map(e => ({
                'ID Empleado': e.id, 'Nombre': e.name, 'Email': e.email,
                'Manager': e.is_manager ? 'Sí' : 'No', 'Local': e.salons?.name || 'N/A',
            }));
            const ws_employees = XLSX.utils.json_to_sheet(employeesExport);
            XLSX.utils.book_append_sheet(wb, ws_employees, "Empleados");

            if (servicesRes.error) throw servicesRes.error;
            const servicesExport = servicesRes.data.map(s => ({
                'ID Servicio': s.id, 'Nombre': s.name, 'Descripción': s.description, 'Precio': s.price,
                'Duración (min)': s.duration_minutes, 'Local': s.salons?.name || 'N/A', 'Activo': s.activo ? 'Sí' : 'No',
            }));
            const ws_services = XLSX.utils.json_to_sheet(servicesExport);
            XLSX.utils.book_append_sheet(wb, ws_services, "Servicios");
        }

        const fileName = `metricas_empresa_${(company?.name || 'demo').replace(/\s+/g, '_')}_${timestamp}.xlsx`;
        XLSX.writeFile(wb, fileName);

        toast({
            title: "¡Exportación Exitosa!",
            description: `El archivo ${fileName} se ha descargado.`,
        });
    } catch (error) {
        console.error("Export error:", error);
        toast({
            title: "Error al exportar",
            description: "No se pudo generar el archivo de Excel. " + error.message,
            variant: "destructive",
        });
    } finally {
        setIsExporting(false);
    }
  };

  if (authLoading || loadingFilters) {
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
                  Métricas de la Empresa
                </h1>
                <p className="text-muted-foreground mt-1 text-sm sm:text-base">
                  Una vista detallada del rendimiento de {company?.name || 'tu empresa'}.
                </p>
              </div>
            </div>
            <Button onClick={handleExportToExcel} disabled={isExporting}>
              <FileDown className="mr-2 h-4 w-4" />
              {isExporting ? 'Exportando...' : 'Exportar a Excel'}
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
          <MetricsFilters
            salons={filterOptions.salons}
            employees={filterOptions.employees}
            services={filterOptions.services}
            channels={filterOptions.channels}
            statuses={filterOptions.statuses}
            clientTypes={filterOptions.clientTypes}
            onFilterChange={setFilters}
            initialFilters={filters}
          />
        </motion.div>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-hub-anthracite mb-4">📅 Métricas de Citas</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {company && <TotalAppointmentsCard filters={filters} companyId={company.id} />}
            {company && <AppointmentsTodayCard filters={filters} companyId={company.id} />}
            {company && <AppointmentsWeekCard filters={filters} companyId={company.id} />}
            {company && <CancelledAppointmentsCard filters={filters} companyId={company.id} />}
            {company && <AttendanceRateCard filters={filters} companyId={company.id} />}
            {company && <AverageBookingTimeCard filters={filters} companyId={company.id} />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {company && <AppointmentsByChannelCard filters={filters} companyId={company.id} />}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-hub-anthracite mb-4">✂️ Métricas de Servicios</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {company && <TotalServicesCard filters={filters} companyId={company.id} />}
            {company && <AverageServiceDurationCard filters={filters} companyId={company.id} />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {company && <PopularServicesCard filters={filters} companyId={company.id} />}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-hub-anthracite mb-4">👥 Métricas de Clientes</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {company && <TotalClientsCard filters={filters} companyId={company.id} />}
            {company && <NewClientsCard filters={filters} companyId={company.id} />}
            {company && <RetentionRateCard filters={filters} companyId={company.id} />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {company && <ClientTypeDistributionCard filters={filters} companyId={company.id} />}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-hub-anthracite mb-4">🤖 Métricas de IA y Automatización</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {company && <AIMessagesCard filters={filters} companyId={company.id} />}
            {company && <AIBookingsCard filters={filters} companyId={company.id} />}
            {company && <AIConversionRateCard filters={filters} companyId={company.id} />}
            {company && <AIResponseTimeCard filters={filters} companyId={company.id} />}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-hub-anthracite mb-4">👨‍💼 Métricas de Empleados</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {company && <ActiveEmployeesCard filters={filters} companyId={company.id} />}
            {company && <WorkingHoursCard filters={filters} companyId={company.id} />}
            {company && <ActiveAbsencesCard filters={filters} companyId={company.id} />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {company && <EmployeePerformanceCard filters={filters} companyId={company.id} />}
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="mt-8"
        >
          <h2 className="text-xl font-bold text-hub-anthracite mb-4">🏢 Rendimiento Global</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
            {company && <OccupancyRateCard filters={filters} companyId={company.id} />}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-6 mb-8">
            {company && <SalonStatusCard filters={filters} companyId={company.id} />}
            {company && <SalonComparisonCard filters={filters} companyId={company.id} />}
          </div>
        </motion.section>
      </main>
    </div>
  );
};

export default CompanyMetrics;
