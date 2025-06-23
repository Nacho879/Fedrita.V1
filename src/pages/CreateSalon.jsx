import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea'; 
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Clock, Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const CreateSalon = () => {
  const [salonName, setSalonName] = useState('');
  const [address, setAddress] = useState('');
  const [phone, setPhone] = useState('');
  const [openingHours, setOpeningHours] = useState('');
  const [loading, setLoading] = useState(false);
  const { company, user } = useAuth();
  const { isDemo } = useDemo();
  const navigate = useNavigate();

  const slugify = (text) => {
    return text
      .toString()
      .toLowerCase()
      .replace(/\s+/g, '-')
      .replace(/[^\w\-]+/g, '')
      .replace(/\-\-+/g, '-')
      .replace(/^-+/, '')
      .replace(/-+$/, '');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemo) {
      toast({
        title: "Modo Demostración",
        description: "No es posible crear locales en modo de demostración.",
      });
      return;
    }

    if (!company || !user) {
      toast({
        title: "Error",
        description: "Debes tener una empresa registrada y estar autenticado.",
        variant: "destructive",
      });
      navigate('/dashboard');
      return;
    }
    setLoading(true);

    try {
      const initialSlug = slugify(salonName);
      
      const { data: existingSalon, error: slugError } = await supabase
        .from('salons')
        .select('public_slug')
        .eq('public_slug', initialSlug)
        .single();

      if (slugError && slugError.code !== 'PGRST116') {
        throw slugError;
      }

      const finalSlug = existingSalon ? `${initialSlug}-${Math.random().toString(36).substring(2, 7)}` : initialSlug;

      const salonData = {
        name: salonName,
        address,
        phone,
        opening_hours: openingHours,
        company_id: company.id,
        owner_id: user.id,
        pago_estado: 'pendiente',
        public_slug: finalSlug,
        url_publica_activada: false,
      };

      const { data, error } = await supabase
        .from('salons')
        .insert([salonData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      toast({
        title: "¡Local creado!",
        description: `Ahora, elige un plan de suscripción para ${salonName}.`,
      });

      navigate(`/salon/${data.id}/suscripcion`);
    } catch (error) {
      toast({
        title: "Error al crear el local",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-hub-coral flex items-center justify-center">
                <Store className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Crear Nuevo Local</CardTitle>
            <CardDescription className="text-lg">
              Añade los detalles de tu nuevo local.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salonName">Nombre del local *</Label>
                <div className="relative">
                  <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="salonName"
                    type="text"
                    placeholder="Mi Local Principal"
                    value={salonName}
                    onChange={(e) => setSalonName(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">Dirección completa *</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="address"
                    type="text"
                    placeholder="Calle Falsa 123, Ciudad, País"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Teléfono *</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="phone"
                    type="tel"
                    placeholder="+1 234 567 8900"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="openingHours">Horarios de atención *</Label>
                <div className="relative">
                   <Clock className="absolute left-3 top-4 transform -translate-y-0 w-5 h-5 text-muted-foreground" />
                  <Textarea
                    id="openingHours"
                    placeholder="Ej: Lunes a Viernes: 9am - 7pm, Sábados: 10am - 5pm"
                    value={openingHours}
                    onChange={(e) => setOpeningHours(e.target.value)}
                    required
                    className="h-24 pl-12 pt-3"
                  />
                </div>
                 <p className="text-sm text-muted-foreground">
                  Puedes detallar los horarios por día.
                </p>
              </div>
              
              <div className="pt-2 space-y-2">
                <Button 
                  type="submit" 
                  className="w-full h-12 btn-primary text-lg"
                  disabled={loading}
                >
                  {loading ? "Guardando local..." : "Continuar a la Suscripción"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-12" onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Panel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateSalon;