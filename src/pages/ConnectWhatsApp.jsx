import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Zap, MessageSquare, KeyRound, Briefcase, CheckCircle, AlertTriangle, Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const ConnectWhatsApp = () => {
  const navigate = useNavigate();
  const { user, company, loading: authLoading } = useAuth();

  const [selectedSalon, setSelectedSalon] = useState('');
  const [phoneNumberId, setPhoneNumberId] = useState('');
  const [accessToken, setAccessToken] = useState('');
  const [businessId, setBusinessId] = useState('');
  
  const [salons, setSalons] = useState([]);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const [loadingSubmit, setLoadingSubmit] = useState(false);
  const [connectionStatus, setConnectionStatus] = useState(null); // null, 'success', 'error'
  const [existingIntegration, setExistingIntegration] = useState(null);

  useEffect(() => {
    const fetchSalons = async () => {
      if (!company || !user) {
        if (!authLoading) setLoadingSalons(false);
        return;
      }
      try {
        setLoadingSalons(true);
        const { data, error } = await supabase
          .from('salons')
          .select('id, name, owner_id')
          .eq('company_id', company.id)
          .eq('owner_id', user.id);
        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        toast({ title: "Error al cargar salones", description: error.message, variant: "destructive" });
      } finally {
        setLoadingSalons(false);
      }
    };
    if (!authLoading) {
      fetchSalons();
    }
  }, [company, user, authLoading]);

  useEffect(() => {
    const fetchIntegrationDetails = async () => {
      if (!selectedSalon || !user || selectedSalon === 'placeholder-disabled-value') {
        setPhoneNumberId('');
        setAccessToken('');
        setBusinessId('');
        setConnectionStatus(null);
        setExistingIntegration(null);
        return;
      }
      try {
        const { data, error } = await supabase
          .from('whatsapp_integrations')
          .select('*')
          .eq('salon_id', selectedSalon)
          .eq('owner_id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') throw error; 

        if (data) {
          setPhoneNumberId(data.phone_number_id);
          setAccessToken(data.access_token);
          setBusinessId(data.business_id || '');
          setConnectionStatus('success');
          setExistingIntegration(data);
          toast({ title: "Integración existente cargada", description: "Puedes actualizar los datos si es necesario." });
        } else {
          setPhoneNumberId('');
          setAccessToken('');
          setBusinessId('');
          setConnectionStatus(null);
          setExistingIntegration(null);
        }
      } catch (error) {
        toast({ title: "Error al cargar integración", description: error.message, variant: "destructive" });
        setConnectionStatus('error');
      }
    };
    if (selectedSalon && selectedSalon !== 'placeholder-disabled-value') { 
      fetchIntegrationDetails();
    }
  }, [selectedSalon, user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedSalon || selectedSalon === 'placeholder-disabled-value' || !phoneNumberId || !accessToken) {
      toast({ title: "Campos incompletos", description: "Por favor, selecciona un salón e ingresa el ID del número y el token de acceso.", variant: "destructive" });
      return;
    }
    setLoadingSubmit(true);
    setConnectionStatus(null);

    const selectedSalonData = salons.find(s => s.id === selectedSalon);
    if (!selectedSalonData || selectedSalonData.owner_id !== user.id) {
        toast({ title: "Error de permisos", description: "No tienes permiso para configurar este salón.", variant: "destructive" });
        setLoadingSubmit(false);
        return;
    }

    try {
      const integrationData = {
        salon_id: selectedSalon,
        owner_id: user.id,
        phone_number_id: phoneNumberId,
        access_token: accessToken,
        business_id: businessId || null,
      };

      let data, error;

      if (existingIntegration) {
        ({ data, error } = await supabase
          .from('whatsapp_integrations')
          .update(integrationData)
          .eq('id', existingIntegration.id)
          .select()
          .single());
      } else {
        ({ data, error } = await supabase
          .from('whatsapp_integrations')
          .insert([integrationData])
          .select()
          .single());
      }

      if (error) throw error;

      setExistingIntegration(data);
      setConnectionStatus('success');
      toast({ title: "¡Conexión Exitosa!", description: `WhatsApp Business API conectado para el salón seleccionado.` });
    } catch (error) {
      setConnectionStatus('error');
      toast({ title: "Error en la conexión", description: error.message, variant: "destructive" });
    } finally {
      setLoadingSubmit(false);
    }
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 via-white to-purple-50">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-purple-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-100 via-indigo-50 to-pink-100 flex items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 30 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.8 }} 
        className="w-full max-w-lg"
      >
        <Card className="shadow-2xl border-0">
          <CardHeader className="text-center pb-6 bg-gradient-to-r from-purple-600 to-indigo-700 rounded-t-lg">
            <div className="flex justify-center mb-3">
              <div className="w-16 h-16 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                <Zap className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-white">Conectar WhatsApp Business</CardTitle>
            <CardDescription className="text-lg text-purple-200">Integra la API de WhatsApp para automatizar mensajes.</CardDescription>
          </CardHeader>
          <CardContent className="p-6 md:p-8">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="salon" className="text-gray-700 font-semibold">Salón a Conectar *</Label>
                <Select 
                  onValueChange={(value) => setSelectedSalon(value === 'placeholder-disabled-value' ? '' : value)} 
                  value={selectedSalon || 'placeholder-disabled-value'} 
                  disabled={loadingSalons}
                >
                  <SelectTrigger className="h-12 text-base">
                    <SelectValue placeholder={loadingSalons ? "Cargando salones..." : "Selecciona un salón"} />
                  </SelectTrigger>
                  <SelectContent>
                     <SelectItem value="placeholder-disabled-value" disabled className="text-base">
                       {loadingSalons ? "Cargando salones..." : "Selecciona un salón"}
                     </SelectItem>
                    {salons.filter(s => s.id && s.id !== '').map(s => <SelectItem key={s.id} value={s.id} className="text-base">{s.name}</SelectItem>)}
                    {salons.length === 0 && !loadingSalons && <div className="p-4 text-sm text-gray-500">No hay salones disponibles. <a href="/crear-salon" className="underline text-purple-600">Crea uno primero</a>.</div>}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phoneNumberId" className="text-gray-700 font-semibold">ID del Número de Teléfono (de Meta) *</Label>
                <div className="relative">
                  <MessageSquare className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="phoneNumberId" placeholder="Ej: 10001234567890" value={phoneNumberId} onChange={(e) => setPhoneNumberId(e.target.value)} required className="h-12 pl-10 text-base" disabled={!selectedSalon || selectedSalon === 'placeholder-disabled-value'}/>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="accessToken" className="text-gray-700 font-semibold">Token de Acceso (de Meta API) *</Label>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="accessToken" type="password" placeholder="Pega aquí tu token largo" value={accessToken} onChange={(e) => setAccessToken(e.target.value)} required className="h-12 pl-10 text-base" disabled={!selectedSalon || selectedSalon === 'placeholder-disabled-value'}/>
                </div>
                 <p className="text-xs text-gray-500">Este token es sensible y se guardará de forma segura.</p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="businessId" className="text-gray-700 font-semibold">ID del Negocio en Meta (Opcional)</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                  <Input id="businessId" placeholder="Ej: 20009876543210" value={businessId} onChange={(e) => setBusinessId(e.target.value)} className="h-12 pl-10 text-base" disabled={!selectedSalon || selectedSalon === 'placeholder-disabled-value'}/>
                </div>
              </div>

              <Button type="submit" className="w-full h-12 gradient-bg hover:opacity-90 text-lg font-semibold" disabled={loadingSubmit || !selectedSalon || selectedSalon === 'placeholder-disabled-value' || loadingSalons}>
                {loadingSubmit ? "Guardando..." : (existingIntegration ? "Actualizar Conexión" : "Guardar Conexión")}
              </Button>
            </form>
            
            {connectionStatus === 'success' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="mt-6 p-4 bg-green-50 border border-green-300 rounded-lg flex items-center space-x-3"
              >
                <CheckCircle className="w-6 h-6 text-green-600" />
                <p className="text-green-700 font-medium">¡WhatsApp conectado correctamente para este salón! ✅</p>
              </motion.div>
            )}
            {connectionStatus === 'error' && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.8 }} 
                animate={{ opacity: 1, scale: 1 }} 
                className="mt-6 p-4 bg-red-50 border border-red-300 rounded-lg flex items-center space-x-3"
              >
                <AlertTriangle className="w-6 h-6 text-red-600" />
                <p className="text-red-700 font-medium">Hubo un error al guardar la conexión. Inténtalo de nuevo.</p>
              </motion.div>
            )}
          </CardContent>
          <CardFooter className="p-6 border-t">
            <Button variant="outline" onClick={() => navigate('/dashboard')} className="w-full">
              <Home className="mr-2 h-4 w-4" /> Volver al Panel Principal
            </Button>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

export default ConnectWhatsApp;