import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Building2, Phone, Mail, Link as LinkIcon } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const CompanyRegistration = () => {
  const [companyName, setCompanyName] = useState('');
  const [phone, setPhone] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [whatsappUrl, setWhatsappUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const { user, updateUserContext, company } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (company) {
      navigate('/dashboard');
    }
  }, [company, navigate]);
  
  useEffect(() => {
     if (user && user.email) {
      setContactEmail(user.email);
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user) {
      toast({
        title: "Error",
        description: "Debes estar autenticado para registrar una empresa.",
        variant: "destructive",
      });
      navigate('/login');
      return;
    }
    setLoading(true);

    try {
      const companyData = {
        name: companyName,
        phone,
        contact_email: contactEmail,
        whatsapp_url: whatsappUrl,
        owner_id: user.id
      };

      const { data, error } = await supabase
        .from('companies')
        .insert([companyData])
        .select()
        .single();

      if (error) {
        throw error;
      }

      await updateUserContext(user.id);

      toast({
        title: "¡Empresa registrada exitosamente!",
        description: "Tu salón ha sido configurado correctamente.",
      });

      navigate('/dashboard');
    } catch (error) {
      toast({
        title: "Error al registrar la empresa",
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
                <Building2 className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Registra tu empresa</CardTitle>
            <CardDescription className="text-lg">
              Configura los datos de tu salón para comenzar a usar Fedrita
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="companyName">Nombre de la empresa *</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                    <Input
                      id="companyName"
                      type="text"
                      placeholder="Salón Belleza Total"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
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
              </div>

              <div className="space-y-2">
                <Label htmlFor="contactEmail">Email de contacto *</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="contactEmail"
                    type="email"
                    placeholder="contacto@tusalon.com"
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    required
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="whatsappUrl">URL de WhatsApp (opcional)</Label>
                <div className="relative">
                  <LinkIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input
                    id="whatsappUrl"
                    type="url"
                    placeholder="https://wa.me/1234567890"
                    value={whatsappUrl}
                    onChange={(e) => setWhatsappUrl(e.target.value)}
                    className="h-12 pl-12"
                  />
                </div>
              </div>

              <Button 
                type="submit" 
                className="w-full h-12 btn-primary text-lg"
                disabled={loading}
              >
                {loading ? "Creando empresa..." : "Crear mi empresa"}
              </Button>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CompanyRegistration;