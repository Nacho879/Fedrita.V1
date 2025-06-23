import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { stripePromise } from '@/lib/stripe.js';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { ArrowLeft, Star, HelpCircle } from 'lucide-react';
import { addYears } from 'date-fns';

const PlanCard = ({ plan, isAnnual, onSelectPlan, isCurrentPlan }) => {
  const isCustom = plan.es_personalizado;
  const isFree = plan.precio_mensual_usd === 0;

  let price = isAnnual ? plan.precio_anual_usd : plan.precio_mensual_usd;
  const period = isAnnual ? '/año' : '/mes';

  const handleSelect = () => {
    if (isCustom) {
      window.location.href = "mailto:soporte@fedrita.com?subject=Consulta%20sobre%20plan%20personalizado";
    } else {
      onSelectPlan(plan, isAnnual);
    }
  };

  return (
    <motion.div
      whileHover={{ y: -5, scale: 1.02 }}
      transition={{ type: 'spring', stiffness: 300 }}
    >
      <Card className={`flex flex-col h-full overflow-hidden transition-all duration-300 ${isCurrentPlan ? 'border-primary border-2 shadow-lg' : plan.name === 'Crecimiento' ? 'border-primary/50' : ''}`}>
        <CardHeader className="bg-secondary/50">
          <div className="flex justify-between items-center">
            <CardTitle className="text-2xl text-hub-anthracite">{plan.name}</CardTitle>
            {plan.name === 'Crecimiento' && !isCurrentPlan && <Star className="h-6 w-6 text-yellow-500 fill-yellow-500" />}
            {isCurrentPlan && <div className="text-xs font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">PLAN ACTUAL</div>}
          </div>
          <CardDescription>
            {isCustom ? '¿Mas de 500 citas al mes?' : `${plan.citas_mensuales} citas por mes`}
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 flex-grow">
          {!isCustom && !isFree && (
            <div className="mb-6">
              <p className="text-5xl font-bold text-hub-anthracite">${price}</p>
              <p className="text-muted-foreground">{period}</p>
              {isAnnual && <p className="text-green-600 font-semibold text-sm mt-1">¡Ahorras 2 meses!</p>}
            </div>
          )}
          {isFree && (
             <div className="mb-6">
              <p className="text-5xl font-bold text-hub-anthracite">Gratis</p>
              <p className="text-muted-foreground">Para siempre</p>
            </div>
          )}
          {isCustom && (
            <div className="mb-6 text-center py-4">
              <HelpCircle className="h-12 w-12 mx-auto text-hub-coral mb-2" />
              <p className="text-lg font-semibold">¿Necesitas más?</p>
              <p className="text-muted-foreground">Hablemos para crear un plan a tu medida.</p>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 bg-background/30 mt-auto">
          <Button onClick={handleSelect} className="w-full text-lg h-12" disabled={isCurrentPlan}>
            {isCustom ? 'Contactar' : isCurrentPlan ? 'Plan Actual' : 'Elegir Plan'}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
};


const SalonSubscription = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const { user, updateUserContext } = useAuth();
  const [salon, setSalon] = useState(null);
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isAnnual, setIsAnnual] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!salonId) return;
      setLoading(true);

      const isDemo = salonId === 'salon-demo' || salonId === 'salon-demostracion';
      if (isDemo) {
        const demoSalonName = salonId === 'salon-demo' ? 'Salón Principal Demo' : 'Salón Demostración';
        const mockPlans = [
            { id: 'plan-free-id', name: 'Gratuito', citas_mensuales: 50, precio_mensual_usd: 0, precio_anual_usd: 0, es_personalizado: false, stripe_monthly_price_id: null, stripe_annual_price_id: null },
            { id: 'plan-growth-id', name: 'Crecimiento', citas_mensuales: 200, precio_mensual_usd: 29, precio_anual_usd: 290, es_personalizado: false, stripe_monthly_price_id: 'price_demo_monthly', stripe_annual_price_id: 'price_demo_annual' },
            { id: 'plan-pro-id', name: 'Pro', citas_mensuales: 500, precio_mensual_usd: 59, precio_anual_usd: 590, es_personalizado: false, stripe_monthly_price_id: 'price_demo_pro_monthly', stripe_annual_price_id: 'price_demo_pro_annual' },
            { id: 'plan-custom-id', name: 'Personalizado', citas_mensuales: 9999, precio_mensual_usd: null, precio_anual_usd: null, es_personalizado: true },
        ];
        setSalon({ id: salonId, name: demoSalonName, plan_id: 'plan-growth-id' });
        setPlans(mockPlans);
        setLoading(false);
        return;
      }
      
      try {
        const [salonRes, plansRes] = await Promise.all([
          supabase.from('salons').select('*').eq('id', salonId).single(),
          supabase.from('plans').select('*').order('citas_mensuales'),
        ]);

        if (salonRes.error) throw new Error(`Salón no encontrado: ${salonRes.error.message}`);
        if (plansRes.error) throw new Error(`Error al cargar planes: ${plansRes.error.message}`);
        
        setSalon(salonRes.data);
        setPlans(plansRes.data);
      } catch (error) {
        toast({ title: "Error", description: error.message, variant: "destructive" });
        navigate('/mis-salones');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [salonId, navigate]);

  const handleSelectPlan = async (plan, annual) => {
    const isDemo = salonId === 'salon-demo' || salonId === 'salon-demostracion';
    if (isDemo) {
      toast({ title: "Modo Demostración", description: "No se pueden cambiar los planes en el modo de demostración." });
      return;
    }

    setIsProcessing(true);
    if (!user) {
      toast({ title: "Error", description: "Debes estar autenticado para seleccionar un plan.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }

    if (plan.precio_mensual_usd === 0) {
      try {
        const now = new Date();
        const subscriptionEndsAt = addYears(now, 100);

        const { error: updateError } = await supabase
          .from('salons')
          .update({
            plan_id: plan.id,
            pago_estado: 'activo',
            modalidad_pago: 'gratuito',
            citas_consumidas_mes: 0,
            subscription_starts_at: now.toISOString(),
            subscription_ends_at: subscriptionEndsAt.toISOString(),
          })
          .eq('id', salonId);

        if (updateError) throw updateError;
        
        await updateUserContext(user.id);

        toast({
          title: "¡Plan Gratuito Activado!",
          description: `El plan ${plan.name} ha sido activado para tu salón.`,
          className: "bg-green-100 text-green-800",
        });
        navigate('/mis-salones');

      } catch (error) {
        toast({ title: "Error al activar el plan gratuito", description: error.message, variant: "destructive" });
      } finally {
        setIsProcessing(false);
      }
      return;
    }

    const priceId = annual ? plan.stripe_annual_price_id : plan.stripe_monthly_price_id;

    if (!priceId) {
      toast({ title: "Error de configuración", description: "Este plan no tiene un precio de Stripe configurado. Contacta a soporte.", variant: "destructive" });
      setIsProcessing(false);
      return;
    }
    
    try {
      const stripe = await stripePromise;
      const successUrl = `${window.location.origin}/pago-exitoso?salon_id=${salonId}&plan_id=${plan.id}&modalidad=${annual ? 'anual' : 'mensual'}`;
      const cancelUrl = `${window.location.origin}/pago-cancelado?salon_id=${salonId}`;
      
      const { error } = await stripe.redirectToCheckout({
        lineItems: [{ price: priceId, quantity: 1 }],
        mode: 'subscription',
        successUrl,
        cancelUrl,
        customerEmail: user.email,
        clientReferenceId: salonId,
      });

      if (error) {
        throw new Error(error.message);
      }
    } catch (error) {
      toast({ title: "Error al procesar el pago", description: error.message, variant: "destructive" });
      setIsProcessing(false);
    }
  };

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div></div>;
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="max-w-7xl mx-auto">
        <div className="flex items-center mb-6">
          <Button variant="ghost" size="icon" onClick={() => navigate('/mis-salones')}><ArrowLeft className="h-6 w-6" /></Button>
          <div className="ml-4">
            <h1 className="text-3xl md:text-4xl font-bold text-hub-anthracite">Elige un Plan para {salon?.name}</h1>
            <p className="text-lg text-foreground">Selecciona la suscripción que mejor se adapte a tu volumen de citas.</p>
          </div>
        </div>

        <div className="flex items-center justify-center gap-4 my-8">
          <Label htmlFor="payment-period" className="text-lg font-medium">Pago Mensual</Label>
          <Switch id="payment-period" checked={isAnnual} onCheckedChange={setIsAnnual} />
          <Label htmlFor="payment-period" className="text-lg font-medium">Pago Anual <span className="text-sm font-bold text-green-600">(2 meses GRATIS)</span></Label>
        </div>

        {isProcessing && (
            <div className="fixed inset-0 bg-black/50 z-50 flex flex-col items-center justify-center">
                <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-white"></div>
                <p className="text-white mt-4 text-xl">Procesando...</p>
            </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {plans.map(plan => (
            <PlanCard key={plan.id} plan={plan} isAnnual={isAnnual} onSelectPlan={handleSelectPlan} isCurrentPlan={salon?.plan_id === plan.id} />
          ))}
        </div>
      </motion.div>
    </div>
  );
};

export default SalonSubscription;