import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/components/ui/use-toast';
import { ArrowLeft, Check, X } from 'lucide-react';

const mockRequests = [
  { id: 1, manager: 'Laura Gómez', salon: 'Salón Principal', type: 'Presupuesto', details: 'Aprobación de presupuesto de $250 para evento de marketing.', date: '2025-06-18', status: 'Pendiente' },
  { id: 2, manager: 'Carlos Diaz', salon: 'Sucursal Centro', type: 'Día Libre', details: 'Solicitud de día libre adicional para el 25 de Junio.', date: '2025-06-17', status: 'Pendiente' },
  { id: 3, manager: 'Laura Gómez', salon: 'Salón Principal', type: 'Compra', details: 'Solicitud de compra de nuevo secador de pelo profesional ($150).', date: '2025-06-15', status: 'Pendiente' },
];

const ManagerRequests = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [requests, setRequests] = React.useState(mockRequests);

  const handleRequest = (requestId, approved) => {
    setRequests(requests.filter(req => req.id !== requestId));
    toast({
      title: `Solicitud ${approved ? 'aprobada' : 'rechazada'}`,
      description: `La solicitud ha sido gestionada.`,
    });
  };

  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex items-center mb-8">
          <Button variant="ghost" size="icon" onClick={() => navigate('/dashboard')}>
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div className="ml-4">
            <h1 className="text-3xl font-bold text-hub-anthracite">Solicitudes de Managers</h1>
            <p className="text-foreground">Gestiona las peticiones pendientes de los managers de tus salones.</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Solicitudes Pendientes</CardTitle>
            <CardDescription>Tienes {requests.length} solicitud(es) pendiente(s) de revisión.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Manager</TableHead>
                    <TableHead>Salón</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead>Detalles</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.length > 0 ? (
                    requests.map((request) => (
                      <TableRow key={request.id}>
                        <TableCell className="font-medium">{request.manager}</TableCell>
                        <TableCell>{request.salon}</TableCell>
                        <TableCell>
                          <Badge variant="secondary">{request.type}</Badge>
                        </TableCell>
                        <TableCell className="max-w-xs truncate">{request.details}</TableCell>
                        <TableCell>{request.date}</TableCell>
                        <TableCell className="text-right space-x-2">
                          <Button size="sm" variant="outline" className="bg-green-100 text-green-800 hover:bg-green-200" onClick={() => handleRequest(request.id, true)}>
                            <Check className="h-4 w-4 mr-1" /> Aprobar
                          </Button>
                          <Button size="sm" variant="destructive" onClick={() => handleRequest(request.id, false)}>
                            <X className="h-4 w-4 mr-1" /> Rechazar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan="6" className="h-24 text-center">
                        ¡Todo al día! No hay solicitudes pendientes.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default ManagerRequests;