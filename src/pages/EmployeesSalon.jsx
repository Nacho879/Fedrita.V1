import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { v4 as uuidv4 } from 'uuid';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Edit3, Trash2, Briefcase, Clock, Users, Home, Crown, Mail, Key, ClipboardCopy, RefreshCw, Loader2 } from 'lucide-react';
import InviteEmployeeDialog from '@/components/InviteEmployeeDialog';
import EditEmployeeModal from '@/components/EditEmployeeModal';
import { DEMO_EMPLOYEES } from '@/lib/demo-data';
const EmployeesSalon = () => {
  const {
    user,
    managedSalon,
    loading: authLoading,
    updateUserContext
  } = useAuth();
  const {
    isDemo
  } = useDemo();
  const [employees, setEmployees] = useState([]);
  const [loadingData, setLoadingData] = useState(true);
  const navigate = useNavigate();
  const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
  const [editingEmployeeId, setEditingEmployeeId] = useState(null);
  const [isGeneratingCode, setIsGeneratingCode] = useState(false);
  const fetchData = useCallback(async () => {
    if (authLoading) return;
    if (isDemo) {
      if (managedSalon) {
        setEmployees(DEMO_EMPLOYEES.filter(e => e.salon_id === managedSalon.id));
      }
      setLoadingData(false);
      return;
    }
    if (!user || !managedSalon) {
      if (!authLoading) setLoadingData(false);
      return;
    }
    try {
      setLoadingData(true);
      const {
        data,
        error
      } = await supabase.from('employees').select(`*`).eq('salon_id', managedSalon.id).order('created_at', {
        ascending: false
      });
      if (error) throw error;
      setEmployees(data || []);
    } catch (error) {
      toast({
        title: 'Error al cargar el equipo',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setLoadingData(false);
    }
  }, [user, managedSalon, authLoading, isDemo]);
  useEffect(() => {
    fetchData();
  }, [fetchData]);
  const handleDeleteEmployee = async employeeId => {
    if (isDemo) {
      toast({
        title: 'Modo Demo',
        description: 'No se pueden eliminar empleados en modo demostración.'
      });
      return;
    }
    try {
      const {
        error
      } = await supabase.from('employees').delete().eq('id', employeeId).eq('salon_id', managedSalon.id);
      if (error) throw error;
      setEmployees(employees.filter(employee => employee.id !== employeeId));
      toast({
        title: 'Empleado eliminado',
        description: 'El empleado ha sido eliminado exitosamente.'
      });
    } catch (error) {
      toast({
        title: 'Error al eliminar el empleado',
        description: error.message,
        variant: 'destructive'
      });
    }
  };
  const handleCopyCode = () => {
    if (!managedSalon?.access_code) {
      toast({
        title: 'Error',
        description: 'No se encontró un código de acceso para este salón.',
        variant: 'destructive'
      });
      return;
    }
    navigator.clipboard.writeText(managedSalon.access_code);
    toast({
      title: '¡Código Copiado!',
      description: 'El código de invitación ha sido copiado a tu portapapeles.'
    });
  };
  const handleGenerateCode = async () => {
    if (isDemo) {
      toast({
        title: 'Modo Demo',
        description: 'No se puede generar un nuevo código en modo demostración.'
      });
      return;
    }
    if (!managedSalon?.id || !user?.id) return;
    setIsGeneratingCode(true);
    const newCode = uuidv4().substring(0, 6).toUpperCase();
    const expirationDate = new Date();
    expirationDate.setDate(expirationDate.getDate() + 7);
    try {
      const {
        error
      } = await supabase.from('salons').update({
        access_code: newCode,
        access_code_expires_at: expirationDate.toISOString()
      }).eq('id', managedSalon.id);
      if (error) throw error;
      await updateUserContext(user.id);
      toast({
        title: '¡Código Generado!',
        description: `El nuevo código de acceso es ${newCode}. Expira en 7 días.`
      });
    } catch (error) {
      toast({
        title: 'Error al generar código',
        description: error.message,
        variant: 'destructive'
      });
    } finally {
      setIsGeneratingCode(false);
    }
  };
  const handleEmployeeUpdated = () => {
    setEditingEmployeeId(null);
    fetchData();
  };
  if (authLoading || loadingData) {
    return <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
      </div>;
  }
  if (!managedSalon) {
    return <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
        <Users className="w-24 h-24 text-hub-coral opacity-50 mb-6" />
        <h1 className="text-3xl font-bold text-hub-anthracite mb-4">No tienes un salón asignado</h1>
        <p className="text-foreground mb-8">Contacta con el administrador para que te asigne como manager de un salón.</p>
        <Button onClick={() => navigate('/dashboard-manager')} className="btn-primary">Volver al Panel</Button>
      </div>;
  }
  return <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div initial={{
      opacity: 0,
      y: -20
    }} animate={{
      opacity: 1,
      y: 0
    }} transition={{
      duration: 0.5
    }} className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-bold text-hub-anthracite">Equipo de {managedSalon.name}</h1>
            <p className="text-foreground text-lg">Gestiona los empleados de tu negocio.</p>
          </div>
          <div className="flex space-x-3">
            <Button onClick={() => navigate('/dashboard-manager')} variant="outline"><Home className="mr-2 h-4 w-4" /> Volver al Panel</Button>
            <Button onClick={() => setIsInviteDialogOpen(true)} className="btn-primary"><Mail className="mr-2 h-5 w-5" /> Invitar por Email</Button>
          </div>
        </div>

        <motion.div initial={{
        opacity: 0,
        y: -10
      }} animate={{
        opacity: 1,
        y: 0
      }} transition={{
        duration: 0.5,
        delay: 0.2
      }} className="mb-8">
            <Card>
                <CardHeader>
                    <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 bg-primary/10 text-primary p-3 rounded-lg">
                            <Key className="w-6 h-6" />
                        </div>
                        <div>
                            <CardTitle>Código de Acceso</CardTitle>
                            <CardDescription>Comparte este código para que los empleados se unan a "{managedSalon.name}" al registrarse.</CardDescription>
                        </div>
                    </div>
                </CardHeader>
                <CardContent className="flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-2xl sm:text-3xl font-mono tracking-widest bg-muted text-muted-foreground p-3 rounded-md w-full sm:w-auto text-center">
                        {managedSalon.access_code || 'N/A'}
                    </p>
                    <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                        <Button onClick={handleCopyCode} className="w-full" disabled={!managedSalon?.access_code}>
                            <ClipboardCopy className="mr-2 h-4 w-4" />
                            Copiar Código
                        </Button>
                        <Button onClick={handleGenerateCode} variant="secondary" className="w-full" disabled={isGeneratingCode}>
                            {isGeneratingCode ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <RefreshCw className="mr-2 h-4 w-4" />}
                            {managedSalon.access_code ? 'Generar Nuevo' : 'Generar Código'}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </motion.div>

        {employees.length === 0 && !loadingData && <motion.div initial={{
        opacity: 0,
        scale: 0.9
      }} animate={{
        opacity: 1,
        scale: 1
      }} transition={{
        duration: 0.5
      }} className="text-center py-16 bg-card rounded-xl shadow-hub">
            <Users className="w-24 h-24 text-hub-coral opacity-50 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-hub-anthracite mb-3">Aún no tienes empleados en este salón</h2>
            <p className="text-foreground mb-6">¡Invita a tu equipo para empezar a gestionar sus horarios y citas!</p>
            <Button onClick={() => setIsInviteDialogOpen(true)} className="btn-primary text-lg px-8 py-3"><Mail className="mr-2 h-5 w-5" /> Invitar Primer Empleado</Button>
          </motion.div>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {employees.map((employee, index) => <motion.div key={employee.id} initial={{
          opacity: 0,
          y: 20
        }} animate={{
          opacity: 1,
          y: 0
        }} transition={{
          duration: 0.5,
          delay: index * 0.1
        }}>
              <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                <CardHeader className="bg-secondary p-6">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-2xl text-hub-anthracite">{employee.name}</CardTitle>
                    {employee.is_manager && <Crown className="w-6 h-6 text-yellow-500" title="Manager de Salón" />}
                  </div>
                  <CardDescription className="flex items-center pt-1 text-foreground"><Briefcase className="mr-2 h-4 w-4 text-hub-coral" /> {employee.services?.join(', ') || 'Sin servicios'}</CardDescription>
                </CardHeader>
                <CardContent className="p-6 space-y-3 flex-grow">
                  {employee.work_hours && <div className="flex items-start text-foreground"><Clock className="mr-3 h-5 w-5 text-hub-coral mt-1 flex-shrink-0" /><span className="whitespace-pre-wrap">{employee.work_hours}</span></div>}
                </CardContent>
                <CardFooter className="p-4 bg-background/50 border-t flex justify-end space-x-3">
                  <Button variant="outline" size="sm" onClick={() => setEditingEmployeeId(employee.id)}><Edit3 className="mr-2 h-4 w-4" /> Editar</Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button variant="destructive" size="sm"><Trash2 className="mr-2 h-4 w-4" /></Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>¿Eliminar a este empleado?</AlertDialogTitle>
                        <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará a "{employee.name}".</AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancelar</AlertDialogCancel>
                        <AlertDialogAction onClick={() => handleDeleteEmployee(employee.id)} className="bg-red-600 hover:bg-red-700">Sí, eliminar</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardFooter>
              </Card>
            </motion.div>)}
        </div>
      </motion.div>
      
      <InviteEmployeeDialog open={isInviteDialogOpen} onOpenChange={setIsInviteDialogOpen} salonId={managedSalon?.id} salons={managedSalon ? [managedSalon] : []} />

      <Dialog open={!!editingEmployeeId} onOpenChange={isOpen => !isOpen && setEditingEmployeeId(null)}>
        {editingEmployeeId && <EditEmployeeModal employeeId={editingEmployeeId} salons={managedSalon ? [managedSalon] : []} onEmployeeUpdated={handleEmployeeUpdated} />}
      </Dialog>
    </div>;
};
export default EmployeesSalon;