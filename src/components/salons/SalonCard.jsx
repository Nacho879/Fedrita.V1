import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Calendar, Clipboard, ExternalLink, KeyRound, Loader2, BarChart2, Settings, Trash2 } from 'lucide-react';
import { format, differenceInDays } from 'date-fns';
import { es } from 'date-fns/locale';

const SalonCard = ({ salon, generatingCodeFor, onDelete, onGenerateCode, onCopyToClipboard }) => {
  const navigate = useNavigate();
  const isDemo = salon.id.includes('demo');

  const planName = salon.plans?.name || 'Básico';
  const totalAppointments = salon.plans?.citas_mensuales || 50;
  const usedAppointments = salon.citas_consumidas_mes || 0;
  const usagePercentage = totalAppointments > 0 ? (usedAppointments / totalAppointments) * 100 : 0;
  const subscriptionEndDate = salon.subscription_ends_at ? new Date(salon.subscription_ends_at) : null;
  const daysRemaining = subscriptionEndDate ? differenceInDays(subscriptionEndDate, new Date()) : 0;

  const getStatusBadge = () => {
    if (salon.pago_estado === 'activo') {
      if (daysRemaining <= 7 && daysRemaining > 0) {
        return <Badge variant="warning">Expira pronto</Badge>;
      }
      return <Badge variant="success">Activo</Badge>;
    }
    return <Badge variant="destructive">Inactivo</Badge>;
  };

  const handleManageClick = () => {
    navigate(`/dashboard/salon/${salon.id}`);
  };

  const handleMetricsClick = () => {
    navigate(`/salon/${salon.id}/metricas`);
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9 }}
      transition={{ duration: 0.3 }}
    >
      <Card className="flex flex-col h-full shadow-hub hover:shadow-hub-lg transition-shadow duration-300">
        <CardHeader>
          <div className="flex justify-between items-start">
            <CardTitle className="text-xl font-bold text-hub-anthracite">{salon.name}</CardTitle>
            <Badge variant="outline">{planName}</Badge>
          </div>
          <CardDescription className="flex items-center gap-2">
            {getStatusBadge()}
          </CardDescription>
        </CardHeader>
        <CardContent className="flex-grow space-y-4">
          <div>
            <div className="flex justify-between items-center mb-1">
              <span className="text-sm font-medium">Uso de Citas</span>
              <span className="text-sm font-bold">{usedAppointments} / {totalAppointments}</span>
            </div>
            <Progress value={usagePercentage} className="h-2" />
          </div>
          {subscriptionEndDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="mr-2 h-4 w-4" />
              <span>
                {daysRemaining > 0 ? `Expira en ${daysRemaining} días` : 'Expirado'} ({format(subscriptionEndDate, 'dd MMM yyyy', { locale: es })})
              </span>
            </div>
          )}
          <div className="space-y-2 pt-2">
            <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center"><KeyRound className="mr-2 h-4 w-4 text-hub-coral"/> Código de Acceso</span>
                <div className="flex gap-2">
                    <Button variant="ghost" size="sm" onClick={() => onCopyToClipboard(salon.access_code, salon.name, 'code')}>
                        <Clipboard className="h-4 w-4"/>
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => onGenerateCode(salon.id)} disabled={generatingCodeFor === salon.id || isDemo}>
                        {generatingCodeFor === salon.id ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Generar'}
                    </Button>
                </div>
            </div>
             <div className="flex items-center justify-between">
                <span className="text-sm font-medium flex items-center"><ExternalLink className="mr-2 h-4 w-4 text-hub-coral"/> URL de Reservas</span>
                <Button variant="ghost" size="sm" onClick={() => onCopyToClipboard(salon.public_slug, salon.name, 'url')} disabled={!salon.url_publica_activada}>
                    <Clipboard className="h-4 w-4"/>
                </Button>
            </div>
          </div>
        </CardContent>
        <CardFooter className="flex justify-between gap-2">
          <Button onClick={handleManageClick} className="flex-1">
            <Settings className="mr-2 h-4 w-4" /> Gestionar
          </Button>
          <Button onClick={handleMetricsClick} variant="outline" className="flex-1">
            <BarChart2 className="mr-2 h-4 w-4" /> Métricas
          </Button>
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="destructive" size="icon" disabled={isDemo}>
                <Trash2 className="h-4 w-4" />
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Estás seguro de que quieres eliminar este salón?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. Se eliminarán permanentemente los datos del salón, incluyendo citas, empleados y servicios asociados.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                <AlertDialogAction onClick={() => onDelete(salon.id)}>
                  Sí, eliminar salón
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SalonCard;