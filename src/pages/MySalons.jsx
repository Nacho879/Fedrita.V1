import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Building, Home, UserPlus, Info } from 'lucide-react';
import InviteEmployeeDialog from '@/components/InviteEmployeeDialog.jsx';
import SalonCard from '@/components/my-salons/SalonCard.jsx';
import { DEMO_SALONS } from '@/lib/demo-data';

const MySalons = () => {
  const { user, company, loading: authLoading } = useAuth();
  const { isDemo } = useDemo();
  const [salons, setSalons] = useState([]);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [generatingCodeFor, setGeneratingCodeFor] = useState(null);
  const navigate = useNavigate();
  
  useEffect(() => {
    const fetchSalons = async () => {
      if (isDemo) {
        setSalons(DEMO_SALONS);
        setLoadingSalons(false);
        return;
      }
      if (!company) {
        setLoadingSalons(false);
        return;
      }
      try {
        setLoadingSalons(true);
        const { data, error } = await supabase
          .from('salons')
          .select('*, plans(*)')
          .eq('company_id', company.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        toast({ title: 'Error al cargar los locales', description: error.message, variant: 'destructive' });
      } finally {
        setLoadingSalons(false);
      }
    };

    if (authLoading) return;

    fetchSalons();
  }, [company, authLoading, isDemo]);

  const handleDeleteSalon = async (salonId) => {
    if (isDemo) {
      toast({ title: 'Modo Demo', description: 'No se pueden eliminar locales de demostración.' });
      return;
    }
    try {
      const { error } = await supabase.from('salons').delete().eq('id', salonId);
      if (error) throw error;
      setSalons(salons.filter((salon) => salon.id !== salonId));
      toast({ title: 'Local eliminado', description: 'El local ha sido eliminado exitosamente.' });
    } catch (error) {
      toast({ title: 'Error al eliminar el local', description: error.message, variant: 'destructive' });
    }
  };

  const copyToClipboard = (text, salonName, type = 'code') => {
    if (!text) {
      toast({
        title: `No hay ${type === 'code' ? 'código' : 'URL'} que copiar`,
        description: `El local "${salonName}" aún no tiene un ${type === 'code' ? 'código de acceso' : 'URL pública'}.`,
        variant: 'destructive',
      });
      return;
    }
    
    const textToCopy = type === 'url' ? `${window.location.origin}/reservas/${text}` : text;

    navigator.clipboard.writeText(textToCopy).then(() => {
      toast({
        title: `¡${type === 'code' ? 'Código' : 'URL'} Copiado!`,
        description: `El ${type === 'code' ? 'código de acceso' : 'enlace de reservas'} para el local "${salonName}" ha sido copiado.`,
      });
    });
  };

  const handleGenerateCode = async (salonId) => {
    if (isDemo) {
      toast({ title: 'Modo Demo', description: 'No se pueden generar nuevos códigos en modo de demostración.' });
      return;
    }
    setGeneratingCodeFor(salonId);
    try {
      const newCode = Math.floor(100000 + Math.random() * 900000).toString();
      const { data: updatedSalon, error } = await supabase
        .from('salons')
        .update({ access_code: newCode })
        .eq('id', salonId)
        .select()
        .single();

      if (error) throw error;

      setSalons(currentSalons => 
        currentSalons.map(s => (s.id === salonId ? { ...s, access_code: newCode } : s))
      );
      
      toast({
        title: '¡Código generado!',
        description: `Se ha creado un nuevo código de acceso para ${updatedSalon.name}.`
      });

    } catch (error) {
      toast({
        title: 'Error al generar código',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setGeneratingCodeFor(null);
    }
  };
  
  if (authLoading || loadingSalons) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>
    );
  }

  if (!company && !isDemo) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
        <Building className="w-24 h-24 text-hub-coral opacity-50 mb-6" />
        <h1 className="text-3xl font-bold text-hub-anthracite mb-4">No se encontró información de la empresa</h1>
        <p className="text-foreground mb-8">
          Parece que aún no has registrado tu empresa. Por favor, completa el registro para poder administrar tus locales.
        </p>
        <Button onClick={() => navigate('/registro-empresa')} className="btn-primary">
          Registrar mi empresa
        </Button>
      </div>
    );
  }

  return (
    <>
      <div className="min-h-screen bg-background p-4 md:p-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="mb-4 md:mb-0 text-center md:text-left">
              <h1 className="text-4xl font-bold text-hub-anthracite">Mis Locales y Suscripciones</h1>
              <p className="text-foreground text-lg">Gestiona todos los locales y planes de {company.name}.</p>
            </div>
            <div className="flex flex-wrap gap-3 justify-center md:justify-end">
              <Button onClick={() => navigate('/dashboard')} variant="outline">
                <Home className="mr-2 h-4 w-4" /> Volver al Panel
              </Button>
               <Button onClick={() => setIsInviteDialogOpen(true)} variant="outline">
                <UserPlus className="mr-2 h-4 w-4" /> Invitar Empleado
              </Button>
              <Button onClick={() => navigate('/crear-salon')} className="btn-primary">
                <PlusCircle className="mr-2 h-5 w-5" /> Crear Nuevo Local
              </Button>
            </div>
          </div>

          <motion.div
            className="mb-8 p-4 bg-sky-50 border border-sky-200 rounded-lg flex items-start gap-4 text-sky-800"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
          >
            <Info className="h-5 w-5 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold">¿Buscas el código de acceso o la URL pública?</h3>
              <p className="text-sm text-sky-700">
                Encuentra el código y la URL de reservas de cada local en las tarjetas de abajo. El código permite un registro rápido a los empleados.
              </p>
            </div>
          </motion.div>

          {salons.length === 0 && !loadingSalons && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="text-center py-16 bg-card rounded-xl shadow-hub"
            >
              <Building className="w-24 h-24 text-hub-coral opacity-50 mx-auto mb-6" />
              <h2 className="text-2xl font-bold text-hub-anthracite mb-3">Aún no tienes locales registrados</h2>
              <p className="text-foreground mb-6">¡Empieza añadiendo tu primer local para administrarlo con Fedrita!</p>
              <Button onClick={() => navigate('/crear-salon')} className="btn-primary text-lg px-8 py-3">
                <PlusCircle className="mr-2 h-5 w-5" /> Añadir mi Primer Local
              </Button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
            {salons.map((salon) => (
              <SalonCard
                key={salon.id}
                salon={salon}
                isDemoMode={isDemo}
                generatingCodeFor={generatingCodeFor}
                onNavigate={navigate}
                onDelete={handleDeleteSalon}
                onGenerateCode={handleGenerateCode}
                onCopyToClipboard={copyToClipboard}
              />
            ))}
          </div>
        </motion.div>
      </div>
      <InviteEmployeeDialog
        open={isInviteDialogOpen}
        onOpenChange={setIsInviteDialogOpen}
        salons={salons}
      />
    </>
  );
};

export default MySalons;