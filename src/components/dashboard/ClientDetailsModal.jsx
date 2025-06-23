import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useDemo } from '@/hooks/useDemo.jsx';
import { DEMO_CLIENTS } from '@/lib/demo-data';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Mail, Phone, History, Calendar } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

const ClientDetailsModal = ({ clientId }) => {
  const [client, setClient] = useState(null);
  const [loading, setLoading] = useState(true);
  const { isDemo } = useDemo();

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) {
        setLoading(false);
        return;
      }
      setLoading(true);
      try {
        if (isDemo) {
          const demoClient = DEMO_CLIENTS.find(c => c.id === clientId);
          setClient(demoClient);
        } else {
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();
          if (error) throw error;
          setClient(data);
        }
      } catch (error) {
        toast({
          title: 'Error al cargar el cliente',
          description: 'No se pudo obtener la información del cliente.',
          variant: 'destructive',
        });
        setClient(null);
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, isDemo]);

  if (loading) {
    return (
      <DialogContent>
        <div className="flex items-center justify-center p-8">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-primary"></div>
        </div>
      </DialogContent>
    );
  }

  if (!client) {
    return (
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Error</DialogTitle>
          <DialogDescription>No se encontró la información del cliente.</DialogDescription>
        </DialogHeader>
      </DialogContent>
    );
  }

  return (
    <DialogContent className="sm:max-w-[425px]">
      <DialogHeader>
        <div className="flex items-center space-x-4">
          <Avatar className="h-16 w-16">
            <AvatarFallback className="text-2xl">{client.name.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <DialogTitle className="text-2xl">{client.name}</DialogTitle>
            <DialogDescription>Ficha del Cliente</DialogDescription>
          </div>
        </div>
      </DialogHeader>
      <div className="py-4">
        <Card>
          <CardContent className="pt-6 space-y-4">
            <div className="flex items-center">
              <Mail className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{client.email || 'No proporcionado'}</span>
            </div>
            <div className="flex items-center">
              <Phone className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="text-sm">{client.phone || 'No proporcionado'}</span>
            </div>
            <div className="flex items-center">
              <Calendar className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                {client.appointments_count || 0} citas en total
              </span>
            </div>
            <div className="flex items-center">
              <History className="mr-3 h-5 w-5 text-muted-foreground" />
              <span className="text-sm">
                Última visita: {client.last_appointment ? formatDistanceToNow(new Date(client.last_appointment), { addSuffix: true, locale: es }) : 'N/A'}
              </span>
            </div>
          </CardContent>
        </Card>
      </div>
    </DialogContent>
  );
};

export default ClientDetailsModal;