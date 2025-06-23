import React, { useState, useEffect } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Card, CardContent } from '@/components/ui/card';

const MetricsFilters = ({
  salons,
  employees,
  services,
  channels,
  statuses,
  clientTypes,
  onFilterChange,
  initialFilters,
}) => {
  const [currentFilters, setCurrentFilters] = useState(initialFilters);
  const [filteredEmployees, setFilteredEmployees] = useState(employees);

  useEffect(() => {
    if (currentFilters.salonId === 'all') {
      setFilteredEmployees(employees);
    } else {
      const salonEmployees = employees.filter(e => e.salon_id === currentFilters.salonId);
      setFilteredEmployees(salonEmployees);
    }
  }, [currentFilters.salonId, employees]);

  const handleFilterChange = (filterType, value) => {
    const newFilters = { ...currentFilters, [filterType]: value };
    if (filterType === 'salonId' && value !== currentFilters.salonId) {
        newFilters.employeeId = 'all';
    }
    setCurrentFilters(newFilters);
    onFilterChange(newFilters);
  };
  
  const handleDateChange = (range) => {
    const newFilters = { ...currentFilters, dateRange: range };
    setCurrentFilters(newFilters);
    onFilterChange(newFilters);
  };

  return (
    <Card>
      <CardContent className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          <DateRangePicker
            onUpdate={({ range }) => handleDateChange(range)}
            initialDateFrom={initialFilters.dateRange.from}
            initialDateTo={initialFilters.dateRange.to}
            align="start"
            locale="es-ES"
            showCompare={false}
          />
          <Select onValueChange={(value) => handleFilterChange('salonId', value)} value={currentFilters.salonId}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por salón..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los salones</SelectItem>
              {salons.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('employeeId', value)} value={currentFilters.employeeId} disabled={filteredEmployees.length === 0}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por empleado..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los empleados</SelectItem>
              {filteredEmployees.map((e) => (
                <SelectItem key={e.id} value={e.id}>
                  {e.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('serviceId', value)} value={currentFilters.serviceId}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por servicio..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los servicios</SelectItem>
              {services.map((s) => (
                <SelectItem key={s.id} value={s.id}>
                  {s.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('channel', value)} value={currentFilters.channel}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por canal..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los canales</SelectItem>
              {channels.map((c) => (
                <SelectItem key={c.value} value={c.value}>
                  {c.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('status', value)} value={currentFilters.status}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por estado..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los estados</SelectItem>
              {statuses.map((s) => (
                <SelectItem key={s.value} value={s.value}>
                  {s.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Select onValueChange={(value) => handleFilterChange('clientType', value)} value={currentFilters.clientType}>
            <SelectTrigger>
              <SelectValue placeholder="Filtrar por tipo cliente..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">Todos los tipos</SelectItem>
              {clientTypes.map((ct) => (
                <SelectItem key={ct.value} value={ct.value}>
                  {ct.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default MetricsFilters;