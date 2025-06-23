import React, { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { useDemo } from '@/hooks/useDemo';
import { supabase } from '@/lib/supabaseClient';
import { useToast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CalendarPlus, Loader2, Send } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { DEMO_TIME_OFF_REQUESTS } from '@/lib/demo-data';
import { motion } from 'framer-motion';

const RequestTimeOff = () => {
  const { user } = useAuth();
  const { isDemo } = useDemo();
  const { toast } = useToast();
  
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const fetchRequests = async () => {
      if (!user) return;
      setLoading(true);

      if (isDemo) {
        const userRequests = DEMO_TIME_OFF_REQUESTS.filter(r => r.user_id === user.id);
        setRequests(userRequests);
        setLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('time_off_requests')
          .select('*')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });

        if (error) {
          if (error.message.includes('relation "public.time_off_requests" does not exist')) {
            toast({
              title: 'Función no disponible',
              description: 'La gestión de ausencias no está habilitada todavía en tu plan.',
              variant: 'destructive',
            });
            setRequests([]);
          } else {
            throw error;
          }
        } else {
          setRequests(data);
        }
      } catch (error) {
        toast({
          title: 'Error al cargar solicitudes',
          description: 'No se pudieron obtener tus solicitudes de ausencia.',
          variant: 'destructive',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchRequests();
  }, [user, isDemo, toast]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!startDate || !endDate || !reason) {
      toast({ title: 'Campos requeridos', description: 'Por favor, completa todos los campos.', variant: 'destructive' });
      return;
    }
    setSubmitting(true);

    if (isDemo) {
      setTimeout(() => {
        toast({ title: 'Solicitud enviada (Demo)', description: 'Tu solicitud de ausencia ha sido registrada.' });
        setSubmitting(false);
        setStartDate('');
        setEndDate('');
        setReason('');
      }, 1000);
      return;
    }

    try {
      const { error } = await supabase.from('time_off_requests').insert([
        { user_id: user.id, start_date: startDate, end_date: endDate, reason, status: 'pending' },
      ]);

      if (error) throw error;

      toast({ title: 'Solicitud enviada', description: 'Tu solicitud de ausencia ha sido enviada para aprobación.' });
      setStartDate('');
      setEndDate('');
      setReason('');
      // Re-fetch requests
      const { data } = await supabase.from('time_off_requests').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
      setRequests(data || []);
    } catch (error) {
      toast({ title: 'Error al enviar solicitud', description: error.message, variant: 'destructive' });
    } finally {
      setSubmitting(false);
    }
  };

  const getStatusVariant = (status) => {
    switch (status) {
      case 'approved': return 'success';
      case 'rejected': return 'destructive';
      case 'pending': return 'secondary';
      default: return 'default';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CalendarPlus className="h-6 w-6" />
              Solicitar Ausencia
            </CardTitle>
            <CardDescription>Pide días libres, vacaciones o notifica ausencias. Tu manager recibirá la solicitud.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="start-date">Fecha de inicio</Label>
                  <Input id="start-date" type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="end-date">Fecha de fin</Label>
                  <Input id="end-date" type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="reason">Motivo</Label>
                <Textarea id="reason" placeholder="Ej: Vacaciones de verano, cita médica..." value={reason} onChange={(e) => setReason(e.target.value)} />
              </div>
              <Button type="submit" disabled={submitting}>
                {submitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Send className="mr-2 h-4 w-4" />}
                Enviar Solicitud
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: 0.1 }}>
        <Card>
          <CardHeader>
            <CardTitle>Mis Solicitudes</CardTitle>
            <CardDescription>Aquí puedes ver el historial de tus solicitudes de ausencia.</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : requests.length > 0 ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Fechas</TableHead>
                    <TableHead>Motivo</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Solicitado el</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {requests.map((req) => (
                    <TableRow key={req.id}>
                      <TableCell>{format(new Date(req.start_date), 'dd/MM/yy')} - {format(new Date(req.end_date), 'dd/MM/yy')}</TableCell>
                      <TableCell className="max-w-xs truncate">{req.reason}</TableCell>
                      <TableCell>
                        <Badge variant={getStatusVariant(req.status)} className="capitalize">{req.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">{format(new Date(req.created_at), 'dd MMM, yyyy', { locale: es })}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <div className="text-center py-10 text-muted-foreground">
                <p>No has realizado ninguna solicitud de ausencia todavía.</p>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default RequestTimeOff;