import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

const ServicesTab = ({ services, employees }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Servicios y Disponibilidad</CardTitle>
        <CardDescription>Revisa los servicios que el asistente puede agendar. La edición se realiza en la sección "Gestionar Servicios".</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="max-h-96 overflow-y-auto pr-2">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Servicio</TableHead>
                <TableHead>Duración</TableHead>
                <TableHead>Empleados Habilitados</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {services.map(service => (
                <TableRow key={service.id}>
                  <TableCell className="font-medium">{service.name}</TableCell>
                  <TableCell>{service.duration_minutes} min</TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {employees
                        .filter(emp => service.assigned_employees?.includes(emp.id))
                        .map(emp => <Badge key={emp.id} variant="secondary">{emp.name}</Badge>)
                      }
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ServicesTab;