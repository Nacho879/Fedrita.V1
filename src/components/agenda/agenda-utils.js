import React from 'react';
import { parseISO, formatISO } from 'date-fns';

export const mapSlotsToEvents = (slots, employees, services, employeeFilter, serviceFilter) => {
    return slots
        .filter(slot => {
            const employeeMatch = employeeFilter === 'all' || slot.employee_id === employeeFilter;
            const serviceMatch = serviceFilter === 'all' || slot.servicio_id === serviceFilter;
            return employeeMatch && serviceMatch;
        })
        .map(slot => {
            const start = parseISO(`${slot.fecha}T${slot.hora_inicio}`);
            const end = parseISO(`${slot.fecha}T${slot.hora_fin}`);
            const employee = employees.find(e => e.id === slot.employee_id);
            const service = services.find(s => s.id === slot.servicio_id);

            let title = '';
            let color = '';
            let borderColor = '';
            switch (slot.estado) {
                case 'reservado':
                    title = `${slot.cliente_nombre || 'Cliente'} - ${service?.name || 'Servicio'}`;
                    color = '#FEE2E2';
                    borderColor = '#EF4444';
                    break;
                case 'bloqueado':
                    title = slot.motivo || 'Bloqueado';
                    color = '#E5E7EB';
                    borderColor = '#6B7280';
                    break;
                case 'disponible':
                    title = 'Disponible';
                    color = '#D1FAE5';
                    borderColor = '#10B981';
                    break;
                default:
                    title = 'Desconocido';
            }

            return {
                id: slot.id,
                title: title,
                start: formatISO(start),
                end: formatISO(end),
                backgroundColor: color,
                borderColor: borderColor,
                textColor: '#1F2937',
                extendedProps: { ...slot, employeeName: employee?.name, serviceName: service?.name },
            };
        });
};