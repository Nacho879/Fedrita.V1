import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';

import {
  ProtectedRoute,
  CompanySetupRoute,
  DashboardRoute,
  ManagerRoute,
  EmployeeRoute,
  AdminOrManagerRoute,
  SuperAdminRoute
} from '@/navigation/RouteGuards.jsx';

import DashboardLayout from '@/components/layout/DashboardLayout.jsx';

import Home from '@/pages/Home.jsx';
import Login from '@/pages/Login.jsx';
import Register from '@/pages/Register.jsx';
import PricingPage from '@/pages/PricingPage.jsx';
import Terms from '@/pages/Terms.jsx';
import Privacy from '@/pages/Privacy.jsx';
import About from '@/pages/About.jsx';
import Contact from '@/pages/Contact.jsx';
import CompanyRegistration from '@/pages/CompanyRegistration.jsx';
import Dashboard from '@/pages/Dashboard.jsx';
import DashboardManager from '@/pages/DashboardManager.jsx';
import DashboardEmpleado from '@/pages/DashboardEmpleado.jsx';
import SuperAdminDashboard from '@/pages/SuperAdminDashboard.jsx';
import CreateSalon from '@/pages/CreateSalon.jsx';
import EditSalon from '@/pages/EditSalon.jsx';
import MySalons from '@/pages/MySalons.jsx';
import CreateEmployee from '@/pages/CreateEmployee.jsx';
import MyEmployees from '@/pages/MyEmployees.jsx';
import EmployeesSalon from '@/pages/EmployeesSalon.jsx';
import CreateAppointment from '@/pages/CreateAppointment.jsx';
import EditAppointment from '@/pages/EditAppointment.jsx';
import EditCompany from '@/pages/EditCompany.jsx';
import MyAppointments from '@/pages/MyAppointments.jsx';
import AppointmentsSalon from '@/pages/AppointmentsSalon.jsx';
import MyClients from '@/pages/MyClients.jsx';
import ClientsSalon from '@/pages/ClientsSalon.jsx';
import AssistantSettings from '@/pages/AssistantSettings.jsx';
import CompanyMetrics from '@/pages/CompanyMetrics.jsx';
import SalonMetrics from '@/pages/SalonMetrics.jsx';
import ClockInOut from '@/pages/ClockInOut.jsx';
import TeamClockings from '@/pages/TeamClockings.jsx';
import RequestTimeOff from '@/pages/RequestTimeOff.jsx';
import ManageTimeOff from '@/pages/ManageTimeOff.jsx';
import MyDocuments from '@/pages/MyDocuments.jsx';
import MessageLogs from '@/pages/MessageLogs.jsx';
import SalonSubscription from '@/pages/SalonSubscription.jsx';
import SalonAgenda from '@/pages/SalonAgenda.jsx';
import CompleteInvitation from '@/pages/CompleteInvitation.jsx';
import PaymentSuccess from '@/pages/PaymentSuccess.jsx';
import PaymentCancelled from '@/pages/PaymentCancelled.jsx';
import BookingBySlug from '@/pages/BookingBySlug.jsx';
import ManageServices from '@/pages/ManageServices.jsx';
import MyClockings from '@/pages/MyClockings.jsx';
import SalonClockings from '@/pages/SalonClockings.jsx';
import CompanyClockings from '@/pages/CompanyClockings.jsx';
import ManageDocuments from '@/pages/ManageDocuments.jsx';
import ClientDetails from '@/pages/ClientDetails.jsx';
import EditClient from '@/pages/EditClient.jsx';
import CreateClient from '@/pages/CreateClient.jsx';
import ManagerRequests from '@/pages/ManagerRequests.jsx';
import FinishedAppointments from '@/pages/FinishedAppointments.jsx';
import MyAgenda from '@/pages/MyAgenda.jsx';

import Peluquerias from '@/pages/landing/Peluquerias.jsx';
import Barberias from '@/pages/landing/Barberias.jsx';
import CentrosUnas from '@/pages/landing/CentrosUnas.jsx';
import CentrosEstetica from '@/pages/landing/CentrosEstetica.jsx';
import MasajistasSpa from '@/pages/landing/MasajistasSpa.jsx';
import Psicologos from '@/pages/landing/Psicologos.jsx';
import Dentistas from '@/pages/landing/Dentistas.jsx';
import Fisioterapeutas from '@/pages/landing/Fisioterapeutas.jsx';
import ClinicasFisioterapia from '@/pages/landing/ClinicasFisioterapia.jsx';
import Veterinarias from '@/pages/landing/Veterinarias.jsx';
import YogaPilates from '@/pages/landing/YogaPilates.jsx';
import ClinicasEsteticaLaser from '@/pages/landing/ClinicasEsteticaLaser.jsx';
import Tatuadores from '@/pages/landing/Tatuadores.jsx';
import Logopedia from '@/pages/landing/Logopedia.jsx';
import PsicologiaInfantil from '@/pages/landing/PsicologiaInfantil.jsx';

const AdminLayout = () => (<DashboardRoute><DashboardLayout /></DashboardRoute>);
const ManagerLayout = () => (<ManagerRoute><DashboardLayout /></ManagerRoute>);
const AdminOrManagerLayout = () => (<AdminOrManagerRoute><DashboardLayout /></AdminOrManagerRoute>);
const EmployeeLayout = () => (<EmployeeRoute><DashboardLayout /></EmployeeRoute>);

const AppRoutes = () => {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<Home />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/precios" element={<PricingPage />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/acerca-de" element={<About />} />
      <Route path="/contacto" element={<Contact />} />
      <Route path="/invite/complete" element={<CompleteInvitation />} />
      <Route path="/reservas/:slug" element={<BookingBySlug />} />
      
      {/* Landing Pages */}
      <Route path="/gestion-citas-peluquerias" element={<Peluquerias />} />
      <Route path="/gestion-citas-barberias" element={<Barberias />} />
      <Route path="/gestion-citas-unas" element={<CentrosUnas />} />
      <Route path="/gestion-tratamientos-estetica" element={<CentrosEstetica />} />
      <Route path="/gestion-reservas-spa" element={<MasajistasSpa />} />
      <Route path="/gestion-pacientes-psicologos" element={<Psicologos />} />
      <Route path="/gestion-clinica-dental" element={<Dentistas />} />
      <Route path="/gestion-pacientes-fisioterapia" element={<Fisioterapeutas />} />
      <Route path="/gestion-clinica-fisioterapia" element={<ClinicasFisioterapia />} />
      <Route path="/gestion-clinica-veterinaria" element={<Veterinarias />} />
      <Route path="/gestion-clases-yoga-pilates" element={<YogaPilates />} />
      <Route path="/gestion-clinica-estetica-laser" element={<ClinicasEsteticaLaser />} />
      <Route path="/gestion-citas-tatuajes" element={<Tatuadores />} />
      <Route path="/gestion-pacientes-logopedia" element={<Logopedia />} />
      <Route path="/gestion-pacientes-psicologia-infantil" element={<PsicologiaInfantil />} />

      {/* Super Admin Route */}
      <Route 
        path="/super-admin"
        element={
          <SuperAdminRoute>
            <SuperAdminDashboard />
          </SuperAdminRoute>
        }
      />

      {/* Company Setup */}
      <Route 
        path="/registro-empresa" 
        element={
          <CompanySetupRoute>
            <CompanyRegistration />
          </CompanySetupRoute>
        } 
      />
      
      {/* Admin Routes */}
      <Route element={<AdminLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/metricas-empresa" element={<CompanyMetrics />} />
        <Route path="/editar-empresa" element={<EditCompany />} />
        <Route path="/suscripciones" element={<MySalons />} />
        <Route path="/salon/:salonId/suscripcion" element={<SalonSubscription />} />
        <Route path="/pago-exitoso" element={<PaymentSuccess />} />
        <Route path="/pago-cancelado" element={<PaymentCancelled />} />
        <Route path="/crear-salon" element={<CreateSalon />} />
        <Route path="/mis-salones" element={<MySalons />} />
        <Route path="/mis-empleados" element={<MyEmployees />} />
        <Route path="/mis-citas" element={<MyAppointments />} />
        <Route path="/mis-clientes" element={<MyClients />} />
        <Route path="/fichajes-empresa" element={<CompanyClockings />} />
        <Route path="/solicitudes-manager" element={<ManagerRequests />} />
        <Route path="/citas-finalizadas" element={<FinishedAppointments />} />
      </Route>

      {/* Manager Routes */}
      <Route element={<ManagerLayout />}>
        <Route path="/dashboard-manager" element={<DashboardManager />} />
        <Route path="/empleados-salon" element={<EmployeesSalon />} />
        <Route path="/equipo/fichajes" element={<TeamClockings />} />
        <Route path="/gestionar-descansos" element={<ManageTimeOff />} />
        <Route path="/citas-salon" element={<AppointmentsSalon />} />
        <Route path="/clientes-salon" element={<ClientsSalon />} />
        <Route path="/panel/fichaje" element={<ClockInOut />} />
        <Route path="/fichajes-salon" element={<SalonClockings />} />
        <Route path="/gestionar-documentos" element={<ManageDocuments />} />
        <Route path="/panel/mis-documentos" element={<MyDocuments />} />
        <Route path="/panel/solicitar-descanso" element={<RequestTimeOff />} />
      </Route>

      {/* Admin or Manager Routes */}
      <Route element={<AdminOrManagerLayout />}>
        <Route path="/salon/:salonId/agenda" element={<SalonAgenda />} />
        <Route path="/salon/:salonId/metricas" element={<SalonMetrics />} />
        <Route path="/salon/:salonId/editar" element={<EditSalon />} />
        <Route path="/salon/:salonId/asistente" element={<AssistantSettings />} />
        <Route path="/salon/:salonId/message-logs" element={<MessageLogs />} />
        <Route path="/crear-empleado" element={<CreateEmployee />} />
        <Route path="/crear-reserva" element={<CreateAppointment />} />
        <Route path="/editar-reserva/:appointmentId" element={<EditAppointment />} />
        <Route path="/salon/:salonId/servicios" element={<ManageServices />} />
        <Route path="/cliente/:clientId" element={<ClientDetails />} />
        <Route path="/editar-cliente/:clientId" element={<EditClient />} />
        <Route path="/crear-cliente" element={<CreateClient />} />
      </Route>

      {/* Employee Routes */}
      <Route element={<EmployeeLayout />}>
        <Route path="/dashboard-empleado" element={<DashboardEmpleado />} />
        <Route path="/fichaje" element={<ClockInOut />} />
        <Route path="/mis-fichajes" element={<MyClockings />} />
        <Route path="/mis-documentos" element={<MyDocuments />} />
        <Route path="/solicitar-descanso" element={<RequestTimeOff />} />
        <Route path="/mi-agenda" element={<MyAgenda />} />
      </Route>

      {/* Fallback Route */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;