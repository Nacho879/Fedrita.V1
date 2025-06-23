import React from 'react';
import { motion } from 'framer-motion';
import { Download, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DateRangePicker } from '@/components/ui/date-range-picker';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { useToast } from '@/components/ui/use-toast';

const MyClockings = () => {
  const { toast } = useToast();

  const handleDownload = () => {
    toast({
      title: "Función no implementada 🚧",
      description: "¡Esta función aún no está lista, pero podrás solicitarla en tu próximo prompt! 🚀",
    });
  };

  const clockings = [
    { date: '2025-05-20', entry: '09:01', breaks: '1h 05m', exit: '18:05', hours: '7h 59m' },
    { date: '2025-05-19', entry: '08:58', breaks: '1h 02m', exit: '18:01', hours: '8h 01m' },
    { date: '2025-05-18', entry: '09:05', breaks: '1h 00m', exit: '17:55', hours: '7h 50m' },
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
            <CardTitle className="text-3xl font-bold">Mis Fichajes</CardTitle>
            <CardDescription>Consulta y exporta tu historial de fichajes.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col sm:flex-row gap-4 mb-6">
              <div className="flex-grow">
                <DateRangePicker onUpdate={() => {}} />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleDownload} variant="outline">
                  <Download className="mr-2 h-4 w-4" />
                  Descargar PDF
                </Button>
                <Button onClick={handleDownload}>
                  <FileText className="mr-2 h-4 w-4" />
                  Exportar a CSV
                </Button>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora de Entrada</TableHead>
                    <TableHead>Pausas</TableHead>
                    <TableHead>Hora de Salida</TableHead>
                    <TableHead className="text-right">Horas Trabajadas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clockings.map((clocking, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{clocking.date}</TableCell>
                      <TableCell>{clocking.entry}</TableCell>
                      <TableCell>{clocking.breaks}</TableCell>
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

export default MyClockings;