import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { DEMO_SALONS, DEMO_SERVICES, DEMO_EMPLOYEES } from '@/lib/demo-data';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogTrigger, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { PlusCircle, Edit, Trash2, Loader2, Home, Users, Scissors, Tag, Clock, Info, CheckCircle, XCircle } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem } from '@/components/ui/command';
import { Checkbox } from '@/components/ui/checkbox';
import { Badge } from '@/components/ui/badge';

const ManageServices = () => {
  const { salonId } = useParams();
  const navigate = useNavigate();
  const { user, userRole, loading: authLoading } = useAuth();
  const { isDemo } = useDemo();

  const [services, setServices] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [salon, setSalon] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [currentService, setCurrentService] = useState(null);

  const fetchSalonData = useCallback(async () => {
    if (!salonId) return;
    setLoading(true);

    if (isDemo) {
        const demoSalon = DEMO_SALONS.find(s => s.id === salonId);
        setSalon(demoSalon);
        
        const demoServices = DEMO_SERVICES
            .filter(s => s.salon_id === salonId)
            .map(s => ({ 
                ...s, 
                price: s.precio,
                duration_minutes: s.duracion_minutos,
                assigned_employees: s.assigned_employees || [], 
                employee_services: (s.assigned_employees || []).map(e_id => ({employee_id: e_id})) 
            }));
        setServices(demoServices);

        const demoEmployees = DEMO_EMPLOYEES.filter(e => e.salon_id === salonId);
        setEmployees(demoEmployees);
        
        setLoading(false);
        return;
    }

    try {
      const { data: salonData, error: salonError } = await supabase
        .from('salons')
        .select('name')
        .eq('id', salonId)
        .single();
      if (salonError) throw salonError;
      setSalon(salonData);

      const { data: servicesData, error: servicesError } = await supabase
        .from('services')
        .select('*, employee_services(employee_id)')
        .eq('salon_id', salonId)
        .order('created_at', { ascending: false });
      
      if (servicesError) {
        if (servicesError.message.includes('relation "public.services" does not exist')) {
            toast({
                title: 'Función no disponible',
                description: 'La gestión de servicios no está habilitada todavía en tu plan.',
                variant: 'destructive',
            });
            setServices([]);
        } else {
            throw servicesError;
        }
      } else {
        setServices(servicesData.map(s => ({ ...s, assigned_employees: s.employee_services.map(es => es.employee_id) })));
      }

      const { data: employeesData, error: employeesError } = await supabase
        .from('employees')
        .select('id, name')
        .eq('salon_id', salonId);
      if (employeesError) throw employeesError;
      setEmployees(employeesData);

    } catch (error) {
      toast({ title: 'Error al cargar datos', description: error.message, variant: 'destructive' });
    } finally {
      setLoading(false);
    }
  }, [salonId, isDemo]);

  useEffect(() => {
    if (authLoading) return;
    fetchSalonData();
  }, [fetchSalonData, authLoading]);

  const handleOpenDialog = (service = null) => {
    setCurrentService(service ? { ...service } : {
      name: '',
      description: '',
      price: '',
      duration_minutes: '',
      activo: true,
      assigned_employees: []
    });
    setIsDialogOpen(true);
  };

  const handleServiceChange = (field, value) => {
    setCurrentService(prev => ({ ...prev, [field]: value }));
  };

  const handleEmployeeAssignment = (employeeId) => {
    setCurrentService(prev => {
      const assigned = prev.assigned_employees || [];
      const newAssigned = assigned.includes(employeeId)
        ? assigned.filter(id => id !== employeeId)
        : [...assigned, employeeId];
      return { ...prev, assigned_employees: newAssigned };
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDemo) {
        toast({ title: "Modo Demostración", description: "Los cambios no se guardan en el modo de demostración." });
        setIsDialogOpen(false);
        return;
    }
    
    setIsSubmitting(true);

    const serviceData = {
      salon_id: salonId,
      name: currentService.name,
      description: currentService.description,
      price: parseFloat(currentService.price),
      duration_minutes: parseInt(currentService.duration_minutes, 10),
      activo: currentService.activo,
    };

    try {
      let savedService;
      if (currentService.id) {
        const { data, error } = await supabase
          .from('services')
          .update(serviceData)
          .eq('id', currentService.id)
          .select()
          .single();
        if (error) throw error;
        savedService = data;
      } else {
        const { data, error } = await supabase
          .from('services')
          .insert(serviceData)
          .select()
          .single();
        if (error) throw error;
        savedService = data;
      }

      await supabase.from('employee_services').delete().eq('service_id', savedService.id);
      if (currentService.assigned_employees.length > 0) {
        const assignments = currentService.assigned_employees.map(empId => ({
          service_id: savedService.id,
          employee_id: empId,
        }));
        const { error: assignmentError } = await supabase.from('employee_services').insert(assignments);
        if (assignmentError) throw assignmentError;
      }

      toast({ title: `Servicio ${currentService.id ? 'actualizado' : 'creado'}`, description: 'El servicio se ha guardado correctamente.' });
      setIsDialogOpen(false);
      fetchSalonData();
    } catch (error) {
      toast({ title: 'Error al guardar el servicio', description: error.message, variant: 'destructive' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async (serviceId) => {
    if (isDemo) {
        toast({ title: 'Modo Demostración', description: 'No se puede eliminar en el modo de demostración.' });
        return;
    }
    
    try {
      await supabase.from('employee_services').delete().eq('service_id', serviceId);
      const { error } = await supabase.from('services').delete().eq('id', serviceId);
      if (error) throw error;
      toast({ title: 'Servicio eliminado', description: 'El servicio ha sido eliminado permanentemente.' });
      fetchSalonData();
    } catch (error) {
      toast({ title: 'Error al eliminar', description: error.message, variant: 'destructive' });
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="h-16 w-16 animate-spin" /></div>;
  }

  return (
    <div className="min-h-screen bg-background p-4 md:p-8">
      <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-center mb-8">
          <div className="mb-4 md:mb-0 text-center md:text-left">
            <h1 className="text-4xl font-bold text-hub-anthracite">Gestionar Servicios</h1>
            <p className="text-foreground text-lg">Servicios para {salon?.name || 'el salón'}</p>
          </div>
          <div className="flex gap-3">
            <Button onClick={() => navigate(userRole === 'admin' ? '/dashboard' : '/dashboard-manager')} variant="outline"><Home className="mr-2 h-4 w-4" /> Volver</Button>
            <Button onClick={() => handleOpenDialog()}><PlusCircle className="mr-2 h-5 w-5" /> Crear Servicio</Button>
          </div>
        </div>

        {services.length === 0 ? (
          <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-16 bg-card rounded-xl shadow-hub">
            <Scissors className="w-24 h-24 text-hub-coral opacity-50 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-hub-anthracite mb-3">No hay servicios creados</h2>
            <p className="text-foreground mb-6">Empieza a añadir los servicios que ofreces en tu salón.</p>
            <Button onClick={() => handleOpenDialog()} className="text-lg px-8 py-3"><PlusCircle className="mr-2 h-5 w-5" /> Crear mi primer servicio</Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
            {services.map((service, index) => (
              <motion.div key={service.id} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: index * 0.05 }}>
                <Card className="hover:shadow-lg transition-shadow duration-300 flex flex-col h-full">
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <CardTitle className="text-xl text-hub-anthracite">{service.name}</CardTitle>
                      <Badge variant={service.activo ? 'default' : 'secondary'} className={service.activo ? 'bg-green-100 text-green-800' : ''}>
                        {service.activo ? <CheckCircle className="mr-1 h-3 w-3" /> : <XCircle className="mr-1 h-3 w-3" />}
                        {service.activo ? 'Activo' : 'Inactivo'}
                      </Badge>
                    </div>
                    <CardDescription className="line-clamp-2">{service.description || 'Sin descripción'}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow space-y-3">
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground"><Tag className="mr-2 h-4 w-4" /> Precio</span>
                      <span className="font-semibold">${service.price}</span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-muted-foreground"><Clock className="mr-2 h-4 w-4" /> Duración</span>
                      <span className="font-semibold">{service.duration_minutes} min</span>
                    </div>
                    <div className="pt-2">
                      <h4 className="text-sm font-semibold mb-2 flex items-center"><Users className="mr-2 h-4 w-4 text-muted-foreground" /> Empleados Asignados</h4>
                      <div className="flex flex-wrap gap-2">
                        {service.assigned_employees.length > 0 ? service.assigned_employees.map(empId => {
                          const employee = employees.find(e => e.id === empId);
                          return employee ? <Badge key={empId} variant="secondary">{employee.name}</Badge> : null;
                        }) : <p className="text-xs text-muted-foreground">Ninguno</p>}
                      </div>
                    </div>
                  </CardContent>
                  <CardFooter className="p-4 bg-background/50 border-t flex gap-2">
                    <Button variant="outline" size="sm" className="w-full" onClick={() => handleOpenDialog(service)}><Edit className="mr-2 h-4 w-4" /> Editar</Button>
                    <Button variant="destructive" size="sm" className="w-full" onClick={() => handleDelete(service.id)}><Trash2 className="mr-2 h-4 w-4" /> Eliminar</Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </div>
        )}
      </motion.div>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>{currentService?.id ? 'Editar Servicio' : 'Crear Nuevo Servicio'}</DialogTitle>
            <DialogDescription>Completa los detalles del servicio. Estos datos se usarán para las reservas online.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmit} className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">Nombre</Label>
              <Input id="name" value={currentService?.name || ''} onChange={(e) => handleServiceChange('name', e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="description" className="text-right">Descripción</Label>
              <Textarea id="description" value={currentService?.description || ''} onChange={(e) => handleServiceChange('description', e.target.value)} className="col-span-3" />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="price" className="text-right">Precio ($)</Label>
              <Input id="price" type="number" value={currentService?.price || ''} onChange={(e) => handleServiceChange('price', e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="duration_minutes" className="text-right">Duración (min)</Label>
              <Input id="duration_minutes" type="number" value={currentService?.duration_minutes || ''} onChange={(e) => handleServiceChange('duration_minutes', e.target.value)} className="col-span-3" required />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="employees" className="text-right">Empleados</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button variant="outline" className="col-span-3 justify-start">
                    <Users className="mr-2 h-4 w-4" />
                    {currentService?.assigned_employees?.length > 0 ? `${currentService.assigned_employees.length} seleccionados` : 'Asignar empleados'}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-[300px] p-0">
                  <Command>
                    <CommandInput placeholder="Buscar empleado..." />
                    <CommandEmpty>No se encontraron empleados.</CommandEmpty>
                    <CommandGroup>
                      {employees.map((employee) => (
                        <CommandItem key={employee.id} onSelect={() => handleEmployeeAssignment(employee.id)}>
                          <Checkbox className="mr-2" checked={currentService?.assigned_employees?.includes(employee.id)} />
                          <span>{employee.name}</span>
                        </CommandItem>
                      ))}
                    </CommandGroup>
                  </Command>
                </PopoverContent>
              </Popover>
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="activo" className="text-right">Activo</Label>
              <Switch id="activo" checked={currentService?.activo} onCheckedChange={(checked) => handleServiceChange('activo', checked)} />
            </div>
            <DialogFooter>
              <DialogClose asChild><Button type="button" variant="secondary">Cancelar</Button></DialogClose>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Guardar Cambios
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ManageServices;