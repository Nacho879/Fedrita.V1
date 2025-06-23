import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { supabase } from '@/lib/supabaseClient';
import { toast } from '@/components/ui/use-toast';
import { Loader2, User, Briefcase, Clock, Store, Crown } from 'lucide-react';
import { useDemo } from '@/hooks/useDemo.jsx';
import { DEMO_EMPLOYEES } from '@/lib/demo-data';

const EditEmployeeModal = ({ employeeId, salons, onEmployeeUpdated }) => {
    const { isDemo } = useDemo();
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    const [name, setName] = useState('');
    const [services, setServices] = useState('');
    const [workHours, setWorkHours] = useState('');
    const [salonId, setSalonId] = useState('unassigned');
    const [isManager, setIsManager] = useState(false);

    useEffect(() => {
        const fetchEmployeeData = async () => {
            if (!employeeId) return;
            setLoading(true);

            if (isDemo) {
                const employeeData = DEMO_EMPLOYEES.find(e => e.id === employeeId);
                if (employeeData) {
                    setName(employeeData.name);
                    setServices(employeeData.services.join(', '));
                    setWorkHours(employeeData.work_hours || '');
                    setSalonId(employeeData.salon_id || 'unassigned');
                    setIsManager(employeeData.is_manager || false);
                }
                setLoading(false);
                return;
            }

            try {
                const { data: employeeData, error } = await supabase
                    .from('employees')
                    .select('*')
                    .eq('id', employeeId)
                    .single();

                if (error) throw error;

                setName(employeeData.name);
                setServices(employeeData.services.join(', '));
                setWorkHours(employeeData.work_hours || '');
                setSalonId(employeeData.salon_id || 'unassigned');
                setIsManager(employeeData.is_manager || false);

            } catch (error) {
                toast({ title: "Error", description: "No se pudo cargar la información del empleado.", variant: "destructive" });
            } finally {
                setLoading(false);
            }
        };

        fetchEmployeeData();
    }, [employeeId, isDemo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        if (isDemo) {
            toast({ title: "Modo Demo", description: "Los cambios no se guardarán, pero la lista se actualizará para simular la acción." });
            setIsSubmitting(false);
            onEmployeeUpdated();
            return;
        }

        try {
            const servicesArray = services.split(',').map(s => s.trim()).filter(s => s);

            const updatedData = {
                name,
                services: servicesArray,
                work_hours: workHours,
                salon_id: salonId === 'unassigned' ? null : salonId,
                is_manager: isManager,
            };

            const { error } = await supabase
                .from('employees')
                .update(updatedData)
                .eq('id', employeeId);

            if (error) throw error;
            
            toast({
                title: "¡Empleado actualizado!",
                description: "Los datos del empleado han sido modificados exitosamente.",
            });
            onEmployeeUpdated();

        } catch (error) {
            toast({
                title: "Error al actualizar",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <DialogContent className="sm:max-w-[600px]">
            <DialogHeader>
                <DialogTitle className="text-2xl">Editar Empleado</DialogTitle>
                <DialogDescription>
                    Modifica los detalles del empleado. Haz clic en guardar cuando termines.
                </DialogDescription>
            </DialogHeader>
            {loading ? (
                <div className="flex justify-center items-center h-64">
                    <Loader2 className="h-16 w-16 animate-spin text-primary" />
                </div>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4 py-4">
                    <div className="space-y-2">
                        <Label htmlFor="name">Nombre del Empleado *</Label>
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input id="name" value={name} onChange={(e) => setName(e.target.value)} required className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="services">Servicios (separados por comas)</Label>
                        <div className="relative">
                            <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Input id="services" value={services} onChange={(e) => setServices(e.target.value)} className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="workHours">Horario Laboral</Label>
                        <div className="relative">
                             <Clock className="absolute left-3 top-3 transform w-5 h-5 text-muted-foreground" />
                            <Textarea id="workHours" value={workHours} onChange={(e) => setWorkHours(e.target.value)} placeholder="Ej: Lunes a Viernes: 9:00 - 18:00" className="pl-10" />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="salonId">Salón Asignado</Label>
                        <div className="relative">
                            <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                            <Select value={salonId} onValueChange={setSalonId}>
                                <SelectTrigger className="w-full pl-10">
                                    <SelectValue placeholder="Selecciona un salón" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="unassigned">Sin asignar</SelectItem>
                                    {salons.map(s => (
                                        <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                    <div className="flex items-center space-x-2 pt-2">
                        <Switch id="isManager" checked={isManager} onCheckedChange={setIsManager} />
                        <Label htmlFor="isManager" className="flex items-center cursor-pointer">
                            <Crown className="mr-2 h-4 w-4 text-yellow-500" />
                            ¿Es Manager de este salón?
                        </Label>
                    </div>
                    <DialogFooter className="pt-4">
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">Cancelar</Button>
                        </DialogClose>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting ? <><Loader2 className="mr-2 h-4 w-4 animate-spin" /> Guardando...</> : "Guardar Cambios"}
                        </Button>
                    </DialogFooter>
                </form>
            )}
        </DialogContent>
    );
};

export default EditEmployeeModal;