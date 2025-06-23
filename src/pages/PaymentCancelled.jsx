import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { XCircle, ArrowLeft } from 'lucide-react';

const PaymentCancelled = () => {
  const [searchParams] = useSearchParams();
  const salonId = searchParams.get('salon_id');

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: 'spring' }}
      >
        <Card className="w-full max-w-lg text-center shadow-2xl">
          <CardHeader>
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-red-100">
              <XCircle className="h-10 w-10 text-red-600" />
            </div>
            <CardTitle className="text-4xl mt-4">Pago Cancelado</CardTitle>
            <CardDescription className="text-xl pt-2">
              El proceso de pago fue cancelado.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="mb-6">
              No se ha realizado ningún cargo. Puedes volver a intentarlo cuando quieras.
            </p>
            {salonId ? (
              <Button asChild size="lg" className="text-lg">
                <Link to={`/salon/${salonId}/suscripcion`}>
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Volver a Elegir Plan
                </Link>
              </Button>
            ) : (
               <Button asChild size="lg" className="text-lg">
                <Link to="/dashboard">
                  <ArrowLeft className="mr-2 h-5 w-5" />
                  Volver al Panel
                </Link>
              </Button>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default PaymentCancelled;