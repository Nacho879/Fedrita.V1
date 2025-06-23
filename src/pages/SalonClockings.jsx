import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';
import { Label } from '@/components/ui/label';

const SalonClockings = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Función no implementada 🚧",
      description: "¡Esta función aún no está lista, pero podrás solicitarla en tu próximo prompt! 🚀",
    });
  };

  const clockings = [
    { employee: 'Ana García', date: '2025-05-20', entry: '09:01', exit: '18:05', hours: '7h 59m' },
    { employee: 'Luis Pérez', date: '2025-05-20', entry: '10:05', exit: '19:02', hours: '7h 57m' },
    { employee: 'Ana García', date: '2025-05-19', entry: '08:58', exit: '18:01', hours: '8h 01m' },
  ];

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Card>
          <CardHeader>
            <CardTitle className="text-3xl font-bold">Fichajes del Salón</CardTitle>
            <CardDescription>Consulta y exporta el historial de fichajes de los empleados de tu salón.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="lg:col-span-2">
                <Label>Rango de Fechas</Label>
                <DateRangePicker onUpdate={() => {}} />
              </div>
              <div>
                <Label htmlFor="employee-select">Empleado</Label>
                <Select>
                  <SelectTrigger id="employee-select">
                    <SelectValue placeholder="Seleccionar empleado" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos los empleados</SelectItem>
                    <SelectItem value="ana-garcia">Ana García</SelectItem>
                    <SelectItem value="luis-perez">Luis Pérez</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end gap-2">
                <Button onClick={handleDownload} variant="outline" className="w-full">
                  <User className="mr-2 h-4 w-4" />
                  Por Empleado
                </Button>
                <Button onClick={handleDownload} className="w-full">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar Todos
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Empleado</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Entrada</TableHead>
                    <TableHead>Salida</TableHead>
                    <TableHead className="text-right">Horas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clockings.map((clocking, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{clocking.employee}</TableCell>
                      <TableCell>{clocking.date}</TableCell>
                      <TableCell>{clocking.entry}</TableCell>
                      <TableCell>{clocking.exit}</TableCell>
                      <TableCell className="text-right">{clocking.hours}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default SalonClockings;