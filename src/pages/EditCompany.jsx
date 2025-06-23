import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Link as LinkIcon, Save, ArrowLeft, Loader2 } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const EditCompany = () => {
  const { user, company, fetchUserData, loading: authLoading } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    contact_email: '',
    whatsapp_url: '',
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    if (!authLoading) {
      if (!user || !company) {
        toast({ title: 'Acceso denegado', description: 'No tienes permiso para editar esta empresa.', variant: 'destructive' });
        navigate('/dashboard');
        return;
      }
      setFormData({
        name: company.name || '',
        phone: company.phone || '',
        contact_email: company.contact_email || '',
        whatsapp_url: company.whatsapp_url || '',
      });
      setInitialLoading(false);
    }
  }, [user, company, navigate, authLoading]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !company) return;

    setIsSubmitting(true);

    try {
      const { error } = await supabase
        .from('companies')
        .update(formData)
        .eq('id', company.id);

      if (error) throw error;
      
      await fetchUserData(user);

      toast({ title: '¡Éxito!', description: 'Los datos de la empresa han sido actualizados.' });
      navigate('/dashboard');

    } catch (error) {
      toast({ title: 'Error al actualizar', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (initialLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="w-16 h-16 animate-spin text-hub-coral" />
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
            <CardTitle className="text-3xl">Editar Empresa</CardTitle>
            <CardDescription>Actualiza los detalles de tu empresa.</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre de la empresa *</Label>
                <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <Input id="phone" name="phone" type="tel" value={formData.phone} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact_email">Email de contacto *</Label>
                <Input id="contact_email" name="contact_email" type="email" value={formData.contact_email} onChange={handleInputChange} required />
              </div>
              <div className="space-y-2">
                <Label htmlFor="whatsapp_url">URL de WhatsApp (opcional)</Label>
                <Input id="whatsapp_url" name="whatsapp_url" type="url" value={formData.whatsapp_url} onChange={handleInputChange} />
              </div>
              <div className="flex justify-between items-center pt-4">
                <Button type="button" variant="outline" onClick={() => navigate('/dashboard')}>
                    <ArrowLeft className="mr-2 h-4 w-4" /> Cancelar
                </Button>
                <Button type="submit" className="btn-primary" disabled={isSubmitting}>
                    {isSubmitting ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                    Guardar Cambios
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default EditCompany;