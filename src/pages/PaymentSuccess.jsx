import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { CheckCircle, Home } from 'lucide-react';
import { addMonths, addYears } from 'date-fns';

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { updateUserContext } = useAuth();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const updateSubscription = async () => {
      const salonId = searchParams.get('salon_id');
      const planId = searchParams.get('plan_id');
      const modalidad = searchParams.get('modalidad');

      if (!salonId || !planId || !modalidad) {
        setError("Faltan parámetros en la URL para activar la suscripción.");
        setLoading(false);
        return;
      }

      try {
        const now = new Date();
        const subscriptionEndsAt = modalidad === 'anual' ? addYears(now, 1) : addMonths(now, 1);

        const { error: updateError } = await supabase
          .from('salons')
          .update({
            plan_id: planId,
            pago_estado: 'activo',
            modalidad_pago: modalidad,
            citas_consumidas_mes: 0,
            subscription_starts_at: now.toISOString(),
            subscription_ends_at: subscriptionEndsAt.toISOString(),
          })
          .eq('id', salonId);

        if (updateError) {
          throw updateError;
        }

        toast({
          title: "¡Suscripción Activada!",
          description: "Tu plan ha sido activado exitosamente. ¡Gracias!",
          className: "bg-green-100 text-green-800",
        });

        await updateUserContext();

      } catch (err) {
        console.error("Error al actualizar la suscripción:", err);
        setError(`Hubo un problema al activar tu plan: ${err.message}. Por favor, contacta a soporte.`);
        toast({
          title: "Error en la Activación",
          description: "No pudimos activar tu suscripción. Por favor, contacta a soporte con tu ID de salón.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    updateSubscription();
  }, [searchParams, navigate, updateUserContext]);

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary mb-4"></div>
        <p className="text-xl font-semibold">Activando tu suscripción, un momento...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <Card className="w-full max-w-lg text-center shadow-2xl">
          <CardHeader>
            {error ? (
              <>
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
                  <CheckCircle className="h-8 w-8 text-red-600" />
                </div>
                <CardTitle className="text-3xl mt-4 text-destructive">Error en la Activación</CardTitle>
                <CardDescription className="text-lg pt-2">{error}</CardDescription>
              </>
            ) : (
              <>
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
                  <CheckCircle className="h-10 w-10 text-green-600" />
                </div>
                <CardTitle className="text-4xl mt-4">¡Pago Exitoso!</CardTitle>
                <CardDescription className="text-xl pt-2">Tu suscripción ha sido activada correctamente.</CardDescription>
              </>
            )}
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              {error 
                ? "Si el problema persiste, nuestro equipo de soporte está aquí para ayudarte."
                : "Ya puedes disfrutar de todas las ventajas de tu nuevo plan. ¡A crecer!"}
            </p>
            <Button asChild size="lg" className="text-lg">
              <Link to="/mis-salones">
                <Home className="mr-2 h-5 w-5" />
                Ir a Mis Salones
              </Link>
            </Button>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentSuccess;