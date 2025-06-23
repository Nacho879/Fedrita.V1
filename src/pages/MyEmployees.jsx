
import React, { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Dialog } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Mail, Users, Home, Edit3, Trash2, Crown, Briefcase, Clock, Store, PlusCircle } from 'lucide-react';
import InviteEmployeeDialog from '@/components/InviteEmployeeDialog';
import EditEmployeeModal from '@/components/EditEmployeeModal';
import { DEMO_EMPLOYEES, DEMO_SALONS } from '@/lib/demo-data';

const MyEmployees = () => {
    const { user, company, loading: authLoading, userRole } = useAuth();
    const { isDemo } = useDemo();
    const [employees, setEmployees] = useState([]);
    const [salons, setSalons] = useState([]);
    const [loadingData, setLoadingData] = useState(true);
    const navigate = useNavigate();
    const [isInviteDialogOpen, setIsInviteDialogOpen] = useState(false);
    const [editingEmployeeId, setEditingEmployeeId] = useState(null);

    const fetchData = useCallback(async () => {
        if (authLoading) return;

        if (isDemo) {
            setEmployees(DEMO_EMPLOYEES);
            setSalons(DEMO_SALONS);
            setLoadingData(false);
            return;
        }

        if (!user || !company || userRole !== 'admin') {
            if (!authLoading) setLoadingData(false);
            return;
        }

        try {
            setLoadingData(true);
            const { data: salonsData, error: salonsError } = await supabase
                .from('salons')
                .select('*')
                .eq('company_id', company.id);

            if (salonsError) throw salonsError;
            setSalons(salonsData || []);
            
            const salonIds = salonsData.map(s => s.id);
            if (salonIds.length === 0) {
                setEmployees([]);
                setLoadingData(false);
                return;
            }

            const { data: employeesData, error: employeesError } = await supabase
                .from('employees')
                .select(`
                    *,
                    salons (
                        name
                    )
                `)
                .in('salon_id', salonIds)
                .order('created_at', { ascending: false });

            if (employeesError) throw employeesError;
            setEmployees(employeesData || []);
        } catch (error) {
            toast({
                title: 'Error al cargar los datos',
                description: error.message,
                variant: 'destructive',
            });
        } finally {
            setLoadingData(false);
        }
    }, [user, company, authLoading, isDemo, userRole]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleDeleteEmployee = async (employeeId) => {
        if (isDemo) {
            toast({
                title: 'Modo Demo',
                description: 'No se pueden eliminar empleados en modo demostración.',
            });
            return;
        }
        try {
            const { error } = await supabase
                .from('employees')
                .delete()
                .eq('id', employeeId);

            if (error) throw error;
            setEmployees(employees.filter(employee => employee.id !== employeeId));
            toast({
                title: 'Empleado eliminado',
                description: 'El empleado ha sido eliminado exitosamente.',
            });
        } catch (error) {
            toast({
                title: 'Error al eliminar el empleado',
                description: error.message,
                variant: 'destructive',
            });
        }
    };
    
    const handleEmployeeUpdated = () => {
        setEditingEmployeeId(null);
        fetchData(); 
    };

    if (authLoading || loadingData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div>
            </div>
        );
    }

    if (!company && !isDemo) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
                <Users className="w-24 h-24 text-hub-coral opacity-50 mb-6" />
                <h1 className="text-3xl font-bold text-hub-anthracite mb-4">No se encontró información de la empresa</h1>
                <p className="text-foreground mb-8">Por favor, asegúrate de haber completado el registro de tu empresa.</p>
                <Button onClick={() => navigate('/dashboard')} className="btn-primary">Volver al Panel</Button>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background p-4 md:p-8">
            <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="max-w-7xl mx-auto"
            >
                <div className="flex flex-col md:flex-row justify-between items-center mb-8">
                    <div className="mb-4 md:mb-0 text-center md:text-left">
                        <h1 className="text-4xl font-bold text-hub-anthracite">Mis Empleados</h1>
                        <p className="text-foreground text-lg">Gestiona todos los empleados de tus salones.</p>
                    </div>
                    <div className="flex space-x-3">
                         <Button onClick={() => navigate('/dashboard')} variant="outline"><Home className="mr-2 h-4 w-4" /> Volver al Panel</Button>
                        <Button onClick={() => setIsInviteDialogOpen(true)} className="btn-primary">
                            <PlusCircle className="mr-2 h-5 w-5" /> Invitar Empleado
                        </Button>
                    </div>
                </div>

                {employees.length === 0 && !loadingData ? (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5 }}
                        className="text-center py-16 bg-card rounded-xl shadow-hub"
                    >
                        <Users className="w-24 h-24 text-hub-coral opacity-50 mx-auto mb-6" />
                        <h2 className="text-2xl font-bold text-hub-anthracite mb-3">Aún no tienes empleados</h2>
                        <p className="text-foreground mb-6">¡Invita a tu equipo para empezar a gestionar sus horarios y citas!</p>
                        <Button onClick={() => setIsInviteDialogOpen(true)} className="btn-primary text-lg px-8 py-3">
                            <Mail className="mr-2 h-5 w-5" /> Invitar Primer Empleado
                        </Button>
                    </motion.div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {employees.map((employee, index) => (
                            <motion.div
                                key={employee.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.5, delay: index * 0.05 }}
                            >
                                <Card className="hover:shadow-lg transition-shadow duration-300 overflow-hidden flex flex-col h-full">
                                    <CardHeader className="bg-secondary p-4">
                                        <div className="flex items-center justify-between">
                                            <CardTitle className="text-xl text-hub-anthracite">{employee.name}</CardTitle>
                                            {employee.is_manager && (
                                                <Crown className="w-5 h-5 text-yellow-500" title="Manager" />
                                            )}
                                        </div>
                                        <CardDescription className="flex items-center pt-1 text-foreground">
                                            <Store className="mr-2 h-4 w-4 text-hub-coral flex-shrink-0" /> 
                                            {employee.salons?.name || (employee.salon_id ? 'Salón no encontrado' : 'Sin asignar')}
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent className="p-4 space-y-3 flex-grow">
                                        {employee.services && employee.services.length > 0 && (
                                            <div className="flex items-start text-sm text-foreground">
                                                <Briefcase className="mr-3 h-4 w-4 text-hub-coral mt-0.5 flex-shrink-0" />
                                                <span>{employee.services.join(', ')}</span>
                                            </div>
                                        )}
                                        {employee.work_hours && (
                                            <div className="flex items-start text-sm text-foreground">
                                                <Clock className="mr-3 h-4 w-4 text-hub-coral mt-0.5 flex-shrink-0" />
                                                <span className="whitespace-pre-wrap text-xs">{employee.work_hours}</span>
                                            </div>
                                        )}
                                    </CardContent>
                                    <CardFooter className="p-3 bg-background/50 border-t flex justify-end space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => setEditingEmployeeId(employee.id)}>
                                            <Edit3 className="mr-1 h-4 w-4" /> Editar
                                        </Button>
                                        <AlertDialog>
                                            <AlertDialogTrigger asChild>
                                                <Button variant="destructive" size="sm">
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </AlertDialogTrigger>
                                            <AlertDialogContent>
                                                <AlertDialogHeader>
                                                    <AlertDialogTitle>¿Eliminar a este empleado?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        Esta acción no se puede deshacer. Se eliminará permanentemente a "{employee.name}".
                                                    </AlertDialogDescription>
                                                </AlertDialogHeader>
                                                <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                    <AlertDialogAction
                                                        onClick={() => handleDeleteEmployee(employee.id)}
                                                        className="bg-red-600 hover:bg-red-700"
                                                    >
                                                        Sí, eliminar
                                                    </AlertDialogAction>
                                                </AlertDialogFooter>
                                            </AlertDialogContent>
                                        </AlertDialog>
                                    </CardFooter>
                                </Card>
                            </motion.div>
                        ))}
                    </div>
                )}
            </motion.div>

            <InviteEmployeeDialog 
                open={isInviteDialogOpen} 
                onOpenChange={setIsInviteDialogOpen}
                salons={salons}
            />

            <Dialog open={!!editingEmployeeId} onOpenChange={(isOpen) => !isOpen && setEditingEmployeeId(null)}>
                {editingEmployeeId && (
                    <EditEmployeeModal 
                        employeeId={editingEmployeeId} 
                        salons={salons}
                        onEmployeeUpdated={handleEmployeeUpdated}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default MyEmployees;
