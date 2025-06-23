import React from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
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
import { Calendar, CreditCard, AlertTriangle, Zap, CheckCircle, Edit, Trash2, KeyRound, RefreshCw, Copy, Link as LinkIcon } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const getStatusBadge = (status) => {
  switch (status) {
    case 'activo':
      return <Badge className="bg-green-100 text-green-800"><CheckCircle className="mr-1 h-3 w-3" /> Activo</Badge>;
    case 'vencido':
      return <Badge variant="destructive"><AlertTriangle className="mr-1 h-3 w-3" /> Vencido</Badge>;
    case 'pendiente':
    default:
      return <Badge variant="secondary"><CreditCard className="mr-1 h-3 w-3" /> Pendiente de Pago</Badge>;
  }
};

const SalonCard = ({ salon, isDemoMode, generatingCodeFor, onNavigate, onDelete, onGenerateCode, onCopyToClipboard }) => {
  const plan = salon.plans;
  const usage = plan && plan.citas_mensuales > 0 ? Math.min((salon.citas_consumidas_mes / plan.citas_mensuales) * 100, 100) : 0;
  const isExceeded = plan ? salon.citas_consumidas_mes > plan.citas_mensuales : false;

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
      <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
        <CardHeader className="p-6">
          <div className="flex justify-between items-start">
            <CardTitle className="text-2xl text-hub-anthracite">{salon.name}</CardTitle>
            {getStatusBadge(salon.pago_estado)}
          </div>
          <CardDescription>
            Plan actual: <span className="font-semibold text-primary">{plan?.name || 'Ninguno'}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-6 space-y-4 flex-grow">
          {plan ? (
            <>
              <div className="space-y-2">
                <div className="flex justify-between items-baseline">
                  <p className="text-sm text-muted-foreground">Consumo del mes</p>
                  <p className={`font-bold text-lg ${isExceeded ? 'text-destructive' : ''}`}>
                    {salon.citas_consumidas_mes} / {plan.citas_mensuales}
                    <span className="text-sm font-normal text-muted-foreground ml-1">citas</span>
                  </p>
                </div>
                <Progress value={usage} className={isExceeded ? '[&>div]:bg-destructive' : ''} />
              </div>
              {salon.subscription_ends_at && (
                <p className="text-xs text-muted-foreground flex items-center">
                  <Calendar className="h-3 w-3 mr-1.5" />
                  Renueva el: {format(new Date(salon.subscription_ends_at), "dd 'de' MMMM, yyyy", { locale: es })}
                </p>
              )}
            </>
          ) : (
            <div className="text-center p-4 bg-secondary rounded-lg">
              <AlertTriangle className="mx-auto h-8 w-8 text-yellow-500 mb-2" />
              <p className="font-semibold">Este local no tiene un plan activo.</p>
              <p className="text-sm text-muted-foreground">Selecciona un plan para empezar a agendar citas.</p>
            </div>
          )}
          <div className="border-t border-dashed pt-4 mt-4 space-y-4">
            <div>
              <div className="flex items-center justify-between gap-2 text-sm font-semibold text-muted-foreground mb-2">
                <div className='flex items-center gap-2'>
                  <KeyRound className="h-4 w-4" />
                  <span>Código de Acceso</span>
                </div>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button variant="ghost" size="sm" className="h-auto px-2 py-1 text-xs" disabled={isDemoMode}>
                      <RefreshCw className="h-3 w-3 mr-1" /> Nuevo
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>¿Generar un nuevo código?</AlertDialogTitle>
                      <AlertDialogDescription>Se creará un nuevo código de acceso y el anterior dejará de ser válido. ¿Estás seguro?</AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancelar</AlertDialogCancel>
                      <AlertDialogAction onClick={() => onGenerateCode(salon.id)}>Sí, generar nuevo</AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
              <div className="flex items-center justify-between gap-2">
                {salon.access_code ? (
                  <>
                    <span className="font-mono text-lg font-bold text-primary bg-secondary px-3 py-1 rounded-md flex-grow text-center">
                      {salon.access_code}
                    </span>
                    <Button variant="ghost" size="icon" onClick={() => onCopyToClipboard(salon.access_code, salon.name, 'code')} className="flex-shrink-0">
                      <Copy className="h-5 w-5" />
                    </Button>
                  </>
                ) : (
                  <Button className="w-full" onClick={() => onGenerateCode(salon.id)} disabled={generatingCodeFor === salon.id || isDemoMode}>
                    <KeyRound className="mr-2 h-4 w-4" />
                    {generatingCodeFor === salon.id ? 'Generando...' : 'Generar Código'}
                  </Button>
                )}
              </div>
            </div>
            <div>
              <div className="flex items-center justify-between gap-2 text-sm font-semibold text-muted-foreground mb-2">
                <div className='flex items-center gap-2'>
                  <LinkIcon className="h-4 w-4" />
                  <span>URL Pública de Reservas</span>
                </div>
              </div>
              {salon.url_publica_activada ? (
                <div className="flex items-center space-x-2">
                  <Input readOnly value={`${window.location.origin}/reservas/${salon.public_slug}`} className="h-9 text-xs" />
                  <Button variant="ghost" size="icon" onClick={() => onCopyToClipboard(salon.public_slug, salon.name, 'url')} className="flex-shrink-0 h-9 w-9">
                    <Copy className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="text-center text-sm text-muted-foreground p-2 bg-secondary rounded-md">
                  Desactivada. Actívala desde "Editar".
                </div>
              )}
            </div>
          </div>
        </CardContent>
        <CardFooter className="p-4 bg-background/50 border-t flex flex-col items-center gap-2 pt-4">
          <Button className="w-full" onClick={() => onNavigate(`/salon/${salon.id}/agenda`)}>
            <Calendar className="mr-2 h-4 w-4" /> Ver Agenda
          </Button>
          <div className="grid grid-cols-3 gap-2 w-full">
            <Button variant="secondary" size="sm" onClick={() => onNavigate(`/salon/${salon.id}/editar`)}>
              <Edit className="mr-2 h-4 w-4" /> Editar
            </Button>
            <Button variant="secondary" size="sm" onClick={() => onNavigate(`/salon/${salon.id}/suscripcion`)}>
              <Zap className="mr-2 h-4 w-4" /> Plan
            </Button>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive" size="sm" className="w-full" disabled={isDemoMode}>
                  <Trash2 className="mr-2 h-4 w-4" /> Eliminar
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>¿Eliminar este local?</AlertDialogTitle>
                  <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará "{salon.name}" y todos sus datos, incluyendo citas y empleados.</AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                  <AlertDialogAction onClick={() => onDelete(salon.id)} className="bg-destructive hover:bg-destructive/90">Sí, eliminar</AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardFooter>
      </Card>
    </motion.div>
  );
};

export default SalonCard;