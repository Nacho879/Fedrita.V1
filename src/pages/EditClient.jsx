import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/components/ui/use-toast';
import { ArrowLeft, User, Mail, Phone, StickyNote } from 'lucide-react';
import { motion } from 'framer-motion';

const EditClient = () => {
  const { clientId } = useParams();
  const navigate = useNavigate();
  const { user, loading: authLoading } = useAuth();
  
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '', notes: '' });
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const fetchClient = async () => {
      if (!user || authLoading) return;
      setLoading(true);

      try {
        const { data, error } = await supabase
          .from('clients')
          .select('*')
          .eq('id', clientId)
          .single();

        if (error || !data) {
          toast({ title: "Error", description: "No se pudo encontrar el cliente.", variant: "destructive" });
          navigate(-1);
          return;
        }

        setClient(data);
        setFormData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          notes: data.notes || '',
        });
      } catch (error) {
        toast({ title: "Error", description: "No se pudo cargar la información del cliente.", variant: "destructive" });
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, user, authLoading, navigate]);

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData(prev => ({ ...prev, [id]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          notes: formData.notes,
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({ title: "¡Éxito!", description: "La información del cliente ha sido actualizada." });
      navigate(`/cliente/${clientId}`);
    } catch (error) {
      toast({ title: "Error", description: "No se pudo actualizar el cliente.", variant: "destructive" });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader>
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="icon" onClick={() => navigate(-1)}>
                <ArrowLeft className="h-4 w-4" />
              </Button>
              <div>
                <CardTitle className="text-3xl">Editar Cliente</CardTitle>
                <CardDescription className="text-lg">
                  Modifica los detalles de {client?.name}.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre Completo *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="name" value={formData.name} onChange={handleChange} required className="pl-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Correo Electrónico</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="email" type="email" value={formData.email} onChange={handleChange} className="pl-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="phone" type="tel" value={formData.phone} onChange={handleChange} className="pl-12" />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="notes">Notas del Cliente</Label>
                <div className="relative">
                  <StickyNote className="absolute left-3 top-4 w-5 h-5 text-muted-foreground" />
                  <Textarea id="notes" value={formData.notes} onChange={handleChange} placeholder="Preferencias, alergias, historial..." className="pl-12" rows={4} />
                </div>
              </div>
              <Button type="submit" className="w-full h-12 btn-primary text-lg" disabled={isSubmitting}>
                {isSubmitting ? "Guardando Cambios..." : "Guardar Cambios"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditClient;