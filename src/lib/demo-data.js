import { v4 as uuidv4 } from 'uuid';
import { addYears, addDays, subDays } from 'date-fns';

export const DEMO_COMPANY_ID = '00000000-0000-0000-0000-000000000001';
export const DEMO_ADMIN_USER_ID = '00000000-0000-0000-0000-000000000002';
export const DEMO_MANAGER_USER_ID = '00000000-0000-0000-0000-000000000003';
export const DEMO_EMPLOYEE_USER_ID = '00000000-0000-0000-0000-000000000004';

export const DEMO_SALON_1_ID = '00000000-0000-0000-0001-000000000001';
export const DEMO_SALON_2_ID = '00000000-0000-0000-0001-000000000002';

export const DEMO_EMPLOYEE_1_ID = '00000000-0000-0000-0002-000000000001';
export const DEMO_EMPLOYEE_2_ID = '00000000-0000-0000-0002-000000000002';
export const DEMO_EMPLOYEE_3_ID = '00000000-0000-0000-0002-000000000003';

export const DEMO_SERVICE_1_ID = '00000000-0000-0000-0003-000000000001';
export const DEMO_SERVICE_2_ID = '00000000-0000-0000-0003-000000000002';
export const DEMO_SERVICE_3_ID = '00000000-0000-0000-0003-000000000003';
export const DEMO_SERVICE_4_ID = '00000000-0000-0000-0003-000000000004';

export const DEMO_CLIENT_1_ID = '00000000-0000-0000-0004-000000000001';
export const DEMO_CLIENT_2_ID = '00000000-0000-0000-0004-000000000002';
export const DEMO_CLIENT_3_ID = '00000000-0000-0000-0004-000000000003';

export const DEMO_APPOINTMENT_1_ID = '00000000-0000-0000-0005-000000000001';
export const DEMO_APPOINTMENT_2_ID = '00000000-0000-0000-0005-000000000002';
export const DEMO_APPOINTMENT_3_ID = '00000000-0000-0000-0005-000000000003';
export const DEMO_APPOINTMENT_4_ID = '00000000-0000-0000-0005-000000000004';

export const DEMO_PLAN_ID = '00000000-0000-0000-0006-000000000001';

export const DEMO_TIME_OFF_REQUEST_1_ID = '00000000-0000-0000-0007-000000000001';
export const DEMO_TIME_OFF_REQUEST_2_ID = '00000000-0000-0000-0007-000000000002';

export const DEMO_COMPANY = {
    id: DEMO_COMPANY_ID,
    name: 'Witar Demo',
    owner_id: DEMO_ADMIN_USER_ID,
};

export const DEMO_PLAN = {
    id: DEMO_PLAN_ID,
    name: 'Crecimiento',
    citas_mensuales: 200
};

export const DEMO_SALONS = [
    {
        id: DEMO_SALON_1_ID,
        company_id: DEMO_COMPANY_ID,
        owner_id: DEMO_ADMIN_USER_ID,
        manager_id: DEMO_MANAGER_USER_ID,
        name: 'Sede Principal',
        address: 'Av. Demo 123, Ciudad Demo',
        phone: '555-1111',
        opening_hours: 'Lun-Vie 9-18, Sab 9-14',
        pago_estado: 'activo',
        plans: DEMO_PLAN,
        citas_consumidas_mes: 50,
        subscription_ends_at: addYears(new Date(), 1).toISOString(),
        access_code: '123456',
        access_code_expires_at: addDays(new Date(), 7).toISOString(),
        public_slug: 'sede-principal-demo',
        url_publica_activada: true,
        companies: DEMO_COMPANY,
    },
    {
        id: DEMO_SALON_2_ID,
        company_id: DEMO_COMPANY_ID,
        owner_id: DEMO_ADMIN_USER_ID,
        manager_id: DEMO_MANAGER_USER_ID,
        name: 'Salón Secundario',
        address: 'Calle Falsa 456, Ciudad Demo',
        phone: '555-2222',
        opening_hours: 'Lun-Sab 10-20',
        pago_estado: 'activo',
        plans: DEMO_PLAN,
        citas_consumidas_mes: 75,
        subscription_ends_at: addYears(new Date(), 1).toISOString(),
        access_code: '654321',
        access_code_expires_at: addDays(new Date(), 7).toISOString(),
        public_slug: 'salon-secundario-demo',
        url_publica_activada: true,
        companies: DEMO_COMPANY,
    }
];

const salon1Data = DEMO_SALONS.find(s => s.id === DEMO_SALON_1_ID);
const salon2Data = DEMO_SALONS.find(s => s.id === DEMO_SALON_2_ID);

export const DEMO_EMPLOYEES = [
    {
        id: DEMO_EMPLOYEE_1_ID,
        name: 'Manager Demo',
        is_manager: true,
        email: 'manager@fedrita.com',
        owner_id: DEMO_MANAGER_USER_ID,
        salon_id: DEMO_SALON_1_ID,
        salons: salon1Data,
        services: ['Gestión', 'Supervisión'],
        work_hours: 'L-V 9:00 - 18:00',
    },
    {
        id: DEMO_EMPLOYEE_2_ID,
        name: 'Empleado Demo',
        is_manager: false,
        email: 'empleado@fedrita.com',
        owner_id: DEMO_EMPLOYEE_USER_ID,
        salon_id: DEMO_SALON_1_ID,
        salons: salon1Data,
        services: ['Corte', 'Color', 'Peinado'],
        work_hours: 'M-S 10:00 - 19:00',
    },
    {
        id: DEMO_EMPLOYEE_3_ID,
        name: 'Ana García',
        is_manager: false,
        email: 'ana.garcia@demo.com',
        owner_id: uuidv4(),
        salon_id: DEMO_SALON_2_ID,
        salons: salon2Data,
        services: ['Manicura', 'Pedicura'],
        work_hours: 'M-S 10:00 - 19:00',
    }
];

export const DEMO_SERVICES = [
    { id: DEMO_SERVICE_1_ID, salon_id: DEMO_SALON_1_ID, name: 'Corte de Pelo', description: 'Corte moderno para caballero.', precio: 25, duracion_minutos: 30, activo: true, assigned_employees: [DEMO_EMPLOYEE_2_ID] },
    { id: DEMO_SERVICE_2_ID, salon_id: DEMO_SALON_1_ID, name: 'Afeitado Clásico', description: 'Afeitado con navaja y toalla caliente.', precio: 20, duracion_minutos: 25, activo: true, assigned_employees: [DEMO_EMPLOYEE_2_ID] },
    { id: DEMO_SERVICE_3_ID, salon_id: DEMO_SALON_2_ID, name: 'Tinte de Cabello', description: 'Coloración completa para un nuevo look.', precio: 50, duracion_minutos: 60, activo: false, assigned_employees: [DEMO_EMPLOYEE_3_ID] },
    { id: DEMO_SERVICE_4_ID, salon_id: DEMO_SALON_2_ID, name: 'Manicura Completa', description: 'Cuidado completo de manos y uñas.', precio: 30, duracion_minutos: 45, activo: true, assigned_employees: [DEMO_EMPLOYEE_3_ID] },
];

export const DEMO_CLIENTS = [
    { id: DEMO_CLIENT_1_ID, name: 'Carlos Ruiz', email: 'carlos.ruiz@example.com', phone: '555-1234', appointments_count: 5, last_appointment: subDays(new Date(), 10).toISOString() },
    { id: DEMO_CLIENT_2_ID, name: 'Luisa Martinez', email: 'luisa.martinez@example.com', phone: '555-5678', appointments_count: 1, last_appointment: subDays(new Date(), 2).toISOString() },
    { id: DEMO_CLIENT_3_ID, name: 'Jorge Torres', email: 'jorge.torres@example.com', phone: '555-9012', appointments_count: 8, last_appointment: subDays(new Date(), 30).toISOString() },
];

export const DEMO_APPOINTMENTS = [
    { id: DEMO_APPOINTMENT_1_ID, salon_id: DEMO_SALON_1_ID, appointment_time: new Date().toISOString(), client_name: 'Carlos Ruiz', service: 'Corte de Pelo', employees: { name: 'Empleado Demo' }, service_id: DEMO_SERVICE_1_ID, employee_id: DEMO_EMPLOYEE_2_ID, client_id: DEMO_CLIENT_1_ID, precio: 25, status: 'completed', salons: salon1Data },
    { id: DEMO_APPOINTMENT_2_ID, salon_id: DEMO_SALON_1_ID, appointment_time: addDays(new Date(), 1).toISOString(), client_name: 'Luisa Martinez', service: 'Afeitado Clásico', employees: { name: 'Empleado Demo' }, service_id: DEMO_SERVICE_2_ID, employee_id: DEMO_EMPLOYEE_2_ID, client_id: DEMO_CLIENT_2_ID, precio: 20, status: 'confirmada', salons: salon1Data },
    { id: DEMO_APPOINTMENT_3_ID, salon_id: DEMO_SALON_2_ID, appointment_time: addDays(new Date(), 2).toISOString(), client_name: 'Jorge Torres', service: 'Manicura Completa', employees: { name: 'Ana García' }, service_id: DEMO_SERVICE_4_ID, employee_id: DEMO_EMPLOYEE_3_ID, client_id: DEMO_CLIENT_3_ID, precio: 30, status: 'confirmada', salons: salon2Data },
    { id: DEMO_APPOINTMENT_4_ID, salon_id: DEMO_SALON_1_ID, appointment_time: subDays(new Date(), 5).toISOString(), client_name: 'Carlos Ruiz', service: 'Corte de Pelo', employees: { name: 'Empleado Demo' }, service_id: DEMO_SERVICE_1_ID, employee_id: DEMO_EMPLOYEE_2_ID, client_id: DEMO_CLIENT_1_ID, precio: 25, status: 'completed', salons: salon1Data },
];

export const DEMO_CLOCKINGS = [
    { id: uuidv4(), event_type: 'entrada', timestamp: new Date(new Date().setHours(9, 2, 15, 0)).toISOString() },
    { id: uuidv4(), event_type: 'salida', timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(17, 31, 0, 0)).toISOString() },
    { id: uuidv4(), event_type: 'pausa_fin', timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(14, 1, 0, 0)).toISOString() },
    { id: uuidv4(), event_type: 'pausa_inicio', timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(13, 30, 0, 0)).toISOString() },
    { id: uuidv4(), event_type: 'entrada', timestamp: new Date(new Date(new Date().setDate(new Date().getDate() - 1)).setHours(9, 5, 0, 0)).toISOString() },
];

export const DEMO_TIME_OFF_REQUESTS = [
    {
        id: DEMO_TIME_OFF_REQUEST_1_ID,
        user_id: DEMO_MANAGER_USER_ID,
        start_date: addDays(new Date(), 20).toISOString(),
        end_date: addDays(new Date(), 25).toISOString(),
        reason: 'Vacaciones planificadas',
        status: 'approved',
        created_at: subDays(new Date(), 10).toISOString(),
    },
    {
        id: DEMO_TIME_OFF_REQUEST_2_ID,
        user_id: DEMO_MANAGER_USER_ID,
        start_date: addDays(new Date(), 2).toISOString(),
        end_date: addDays(new Date(), 2).toISOString(),
        reason: 'Cita médica',
        status: 'pending',
        created_at: subDays(new Date(), 1).toISOString(),
    },
    {
        id: uuidv4(),
        user_id: DEMO_EMPLOYEE_USER_ID,
        start_date: addDays(new Date(), 30).toISOString(),
        end_date: addDays(new Date(), 31).toISOString(),
        reason: 'Asuntos personales',
        status: 'rejected',
        created_at: subDays(new Date(), 5).toISOString(),
    }
];