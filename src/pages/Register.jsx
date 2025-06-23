
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Building, User, KeyRound, Lock, UserPlus, UserCheck, ArrowLeft } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Register = () => {
    const navigate = useNavigate();
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-lg"
      >
        <Card className="relative">
          <Button variant="ghost" size="icon" className="absolute top-4 left-4" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <CardHeader className="text-center pt-12">
            <motion.div initial={{ y: -20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.2 }}>
              <h1 className="font-poppins text-4xl font-bold text-hub-coral">Fedrita</h1>
              <CardTitle className="text-2xl mt-2">Crea tu cuenta</CardTitle>
              <CardDescription>Únete para empezar a gestionar tu negocio</CardDescription>
            </motion.div>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="company" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="company"><Building className="mr-2 h-4 w-4"/>Para Empresas</TabsTrigger>
                <TabsTrigger value="employee"><User className="mr-2 h-4 w-4"/>Para Empleados</TabsTrigger>
              </TabsList>
              <TabsContent value="company">
                <CompanyRegisterForm />
              </TabsContent>
              <TabsContent value="employee">
                <EmployeeRegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-center">
             <p className="text-sm text-muted-foreground">
                ¿Ya tienes cuenta?{' '}
                <Link to="/login" className="underline text-primary font-medium">
                  Inicia sesión
                </Link>
              </p>
          </CardFooter>
        </Card>
      </motion.div>
    </div>
  );
};

const CompanyRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast({ title: "Error", description: "Las contraseñas no coinciden", variant: "destructive" });
      return;
    }
    if (!acceptTerms) {
      toast({ title: "Error", description: "Debes aceptar los términos y condiciones", variant: "destructive" });
      return;
    }
    setLoading(true);
    try {
      const result = await register(email, password);
      if (result.success) {
        toast({ title: "¡Cuenta creada exitosamente!", description: "Ahora configura los datos de tu empresa." });
        navigate('/registro-empresa');
      } else {
        toast({ title: "Error al crear cuenta", description: result.error || "Ocurrió un error inesperado", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error inesperado", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="email-company">Email de la empresa</Label>
        <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="email-company" type="email" placeholder="admin@miempresa.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-company">Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input id="password-company" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="pl-10 pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="confirmPassword-company">Confirmar contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input id="confirmPassword-company" type={showConfirmPassword ? "text" : "password"} placeholder="Repite tu contraseña" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="pl-10 pr-10" />
          <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="flex items-start space-x-3 pt-2">
        <Checkbox id="acceptTerms-company" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
        <Label htmlFor="acceptTerms-company" className="text-sm text-muted-foreground leading-relaxed">
          Acepto los <Link to="/terms" className="underline text-primary">términos</Link> y la <Link to="/privacy" className="underline text-primary">política de privacidad</Link>.
        </Label>
      </div>
      <Button type="submit" className="w-full btn-primary" disabled={loading}>
        {loading ? "Creando cuenta..." : <><UserPlus className="mr-2 h-4 w-4" />Crear cuenta</>}
      </Button>
    </form>
  );
};

const EmployeeRegisterForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [accessCode, setAccessCode] = useState('');
  const [role, setRole] = useState('employee');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const { registerWithCode } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const result = await registerWithCode(email, password, accessCode, role);
      if (result.success) {
        toast({ title: "¡Bienvenido/a a Fedrita!", description: "Has sido añadido/a al salón correctamente." });
        const dashboardPath = result.role === 'manager' ? '/dashboard-manager' : '/dashboard-empleado';
        navigate(dashboardPath);
      } else {
        toast({ title: "Error en el registro", description: result.error || "Ocurrió un error inesperado.", variant: "destructive" });
      }
    } catch (error) {
      toast({ title: "Error", description: "Ocurrió un error inesperado.", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 pt-4">
      <div className="space-y-2">
        <Label htmlFor="email-employee">Tu Email</Label>
        <div className="relative">
            <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="email-employee" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
        </div>
      </div>
      <div className="space-y-2">
        <Label htmlFor="password-employee">Crea una Contraseña</Label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <Input id="password-employee" type={showPassword ? "text" : "password"} placeholder="Mínimo 8 caracteres" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="pl-10 pr-10" />
          <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
            {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
          </button>
        </div>
      </div>
      <div className="flex gap-4">
        <div className="space-y-2 flex-grow">
          <Label htmlFor="accessCode">Código de Acceso del Salón</Label>
          <div className="relative">
            <KeyRound className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <Input id="accessCode" type="text" placeholder="Pega el código aquí" value={accessCode} onChange={(e) => setAccessCode(e.target.value)} required className="pl-10" />
          </div>
        </div>
        <div className="space-y-2">
          <Label htmlFor="role">Tu Rol</Label>
          <Select onValueChange={setRole} defaultValue="employee">
            <SelectTrigger id="role">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="employee">Empleado/a</SelectItem>
              <SelectItem value="manager">Manager</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
      <Button type="submit" className="w-full btn-primary" disabled={loading}>
        {loading ? "Uniéndome..." : <><UserCheck className="mr-2 h-4 w-4" />Unirme al equipo</>}
      </Button>
    </form>
  );
};


export default Register;
