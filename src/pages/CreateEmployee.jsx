import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { UserPlus, Briefcase, Store, Clock, Crown, Mail as MailIcon, Home } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';

const CreateEmployee = () => {
  const [employeeName, setEmployeeName] = useState('');
  const [services, setServices] = useState('');
  const [workHours, setWorkHours] = useState('');
  const [selectedSalon, setSelectedSalon] = useState('');
  const [isManager, setIsManager] = useState(false);
  const [employeeEmail, setEmployeeEmail] = useState('');
  const [salons, setSalons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingSalons, setLoadingSalons] = useState(true);
  const { user, company, userRole, managedSalon } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchSalons = async () => {
      if (!user) {
        setLoadingSalons(false);
        return;
      }
      try {
        setLoadingSalons(true);
        let query = supabase
          .from('salons')
          .select('id, name');

        if (userRole === 'admin' && company) {
          query = query.eq('company_id', company.id).eq('owner_id', user.id);
        } else if (userRole === 'manager' && managedSalon) {
          query = query.eq('id', managedSalon.id);
          setSelectedSalon(managedSalon.id);
        }

        const { data, error } = await query;
        if (error) throw error;
        setSalons(data || []);
      } catch (error) {
        toast({
          title: "Error al cargar salones",
          description: error.message,
          variant: "destructive",
        });
      } finally {
        setLoadingSalons(false);
      }
    };
    if (userRole) {
      fetchSalons();
    }
  }, [company, user, userRole, managedSalon]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedSalon) {
      toast({
        title: "Error",
        description: "Debes estar autenticado y seleccionar un salón.",
        variant: "destructive",
      });
      return;
    }

    if (isManager && !employeeEmail) {
      toast({
        title: "Email requerido",
        description: "Para designar un manager, necesitas proporcionar su email.",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      let managerUserId = null;
      if (isManager && employeeEmail) {
          const { data: managerUser, error: rpcError } = await supabase.rpc('get_user_id_by_email', {
              p_email: employeeEmail
          });

          if (rpcError || !managerUser) {
              toast({
                  title: "Usuario no encontrado",
                  description: "No se encontró un usuario con ese email. El empleado debe registrarse primero en Fedrita.",
                  variant: "destructive",
              });
              setLoading(false);
              return;
          }
          managerUserId = managerUser;
      }

      const employeeData = {
        name: employeeName,
        services: services.split(',').map(s => s.trim()),
        work_hours: workHours,
        salon_id: selectedSalon,
        owner_id: userRole === 'admin' ? user.id : managedSalon.owner_id,
        is_manager: isManager,
        user_id: managerUserId,
      };

      const { data: employee, error: employeeError } = await supabase
        .from('employees')
        .insert([employeeData])
        .select()
        .single();

      if (employeeError) throw employeeError;

      if (isManager && managerUserId) {
        const { error: salonUpdateError } = await supabase
          .from('salons')
          .update({ manager_id: managerUserId })
          .eq('id', selectedSalon);

        if (salonUpdateError) throw salonUpdateError;

        toast({
          title: "¡Empleado y Manager creados!",
          description: `${employeeName} ha sido añadido como manager del salón.`,
        });
      } else {
        toast({
          title: "¡Empleado creado exitosamente!",
          description: `${employeeName} ha sido añadido al salón.`,
        });
      }

      if (userRole === 'manager') {
        navigate('/empleados-salon');
      } else {
        navigate('/mis-empleados');
      }
    } catch (error) {
      toast({
        title: "Error al crear el empleado",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="w-full max-w-2xl"
      >
        <Card>
          <CardHeader className="text-center pb-8">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-xl bg-hub-coral flex items-center justify-center">
                <UserPlus className="w-8 h-8 text-white" />
              </div>
            </div>
            <CardTitle className="text-3xl">Añadir Nuevo Empleado</CardTitle>
            <CardDescription className="text-lg">
              Completa los datos del nuevo miembro de tu equipo.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="employeeName">Nombre del empleado *</Label>
                <div className="relative">
                  <UserPlus className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="employeeName" type="text" placeholder="Nombre Apellido" value={employeeName} onChange={(e) => setEmployeeName(e.target.value)} required className="h-12 pl-12" />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="services">Servicios (separados por comas) *</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                  <Input id="services" type="text" placeholder="Ej: Corte, Peinado, Manicura" value={services} onChange={(e) => setServices(e.target.value)} required className="h-12 pl-12" />
                </div>
              </div>
              
              {userRole === 'admin' && (
                <div className="space-y-2">
                  <Label htmlFor="salon">Salón al que pertenece *</Label>
                  <div className="relative">
                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground z-10" />
                    <Select onValueChange={setSelectedSalon} value={selectedSalon} disabled={loadingSalons}>
                      <SelectTrigger className="h-12 pl-12">
                        <SelectValue placeholder={loadingSalons ? "Cargando salones..." : "Selecciona un salón"} />
                      </SelectTrigger>
                      <SelectContent>
                        {salons.map((salon) => ( <SelectItem key={salon.id} value={salon.id}>{salon.name}</SelectItem> ))}
                        {salons.length === 0 && !loadingSalons && ( <div className="p-4 text-sm text-muted-foreground">No tienes salones creados.</div>)}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="workHours">Horarios de trabajo</Label>
                <div className="relative">
                  <Clock className="absolute left-3 top-4 transform -translate-y-0 w-5 h-5 text-muted-foreground" />
                  <Textarea id="workHours" placeholder="Ej: Lunes a Viernes: 10am - 6pm" value={workHours} onChange={(e) => setWorkHours(e.target.value)} className="h-24 pl-12 pt-3" />
                </div>
              </div>

              <div className="space-y-4 p-4 bg-secondary rounded-lg border">
                <div className="flex items-center space-x-3">
                  <Checkbox id="isManager" checked={isManager} onCheckedChange={setIsManager} />
                  <Label htmlFor="isManager" className="flex items-center space-x-2 cursor-pointer">
                    <Crown className="w-5 h-5 text-hub-coral" />
                    <span className="font-semibold text-foreground">Este empleado será manager del salón</span>
                  </Label>
                </div>
                
                {isManager && (
                  <div className="space-y-2">
                    <Label htmlFor="employeeEmail">Email del empleado (requerido para managers) *</Label>
                    <div className="relative">
                       <MailIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                      <Input id="employeeEmail" type="email" placeholder="manager@email.com" value={employeeEmail} onChange={(e) => setEmployeeEmail(e.target.value)} required={isManager} className="h-12 pl-12" />
                    </div>
                    <p className="text-sm text-muted-foreground">
                      El empleado debe tener una cuenta registrada en Fedrita para ser designado como manager.
                    </p>
                  </div>
                )}
              </div>
              
              <div className="pt-2 space-y-2">
                <Button type="submit" className="w-full h-12 btn-primary text-lg" disabled={loading || loadingSalons}>
                  {loading ? "Guardando..." : "Añadir Empleado"}
                </Button>
                <Button type="button" variant="outline" className="w-full h-12" onClick={() => navigate('/dashboard')}>
                  <Home className="mr-2 h-4 w-4" />
                  Volver al Panel
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
};

export default CreateEmployee;