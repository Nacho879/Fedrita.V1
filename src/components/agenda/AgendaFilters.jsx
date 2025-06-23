import React from 'react';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const AgendaFilters = ({
    canEdit,
    employees,
    services,
    employeeFilter,
    onEmployeeFilterChange,
    serviceFilter,
    onServiceFilterChange
}) => {
    return (
        <div className="mb-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {canEdit &&
                <div>
                    <Label>Filtrar por Empleado</Label>
                    <Select value={employeeFilter} onValueChange={onEmployeeFilterChange} disabled={!canEdit}>
                        <SelectTrigger><SelectValue placeholder="Todos los empleados" /></SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los empleados</SelectItem>
                            {employees.map(emp => <SelectItem key={emp.id} value={emp.id}>{emp.name}</SelectItem>)}
                        </SelectContent>
                    </Select>
                </div>
            }
            <div>
                <Label>Filtrar por Servicio</Label>
                <Select value={serviceFilter} onValueChange={onServiceFilterChange}>
                    <SelectTrigger><SelectValue placeholder="Todos los servicios" /></SelectTrigger>
                    <SelectContent>
                        <SelectItem value="all">Todos los servicios</SelectItem>
                        {services.map(srv => <SelectItem key={srv.id} value={srv.id}>{srv.name}</SelectItem>)}
                    </SelectContent>
                </Select>
            </div>
        </div>
    );
};

export default AgendaFilters;