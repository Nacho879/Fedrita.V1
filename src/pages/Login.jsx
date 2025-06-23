
import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/hooks/useAuth.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { LogIn, User, Lock, ArrowLeft } from 'lucide-react';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const { login } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        const { success, error, user } = await login(email, password);
        if (success) {
            toast({
                title: "¡Bienvenido de nuevo!",
                description: `Has iniciado sesión correctamente.`,
            });
            if (user?.needsCompanySetup) {
                navigate('/registro-empresa');
            } else {
                navigate('/dashboard');
            }
        } else {
            toast({
                title: "Error al iniciar sesión",
                description: error,
                variant: "destructive",
            });
        }
        setLoading(false);
    };

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
                            <CardTitle className="text-2xl mt-2">Bienvenido de nuevo</CardTitle>
                            <CardDescription>Inicia sesión para gestionar tu negocio</CardDescription>
                        </motion.div>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-4">
                            <div className="space-y-2">
                                <Label htmlFor="email">Correo electrónico</Label>
                                <div className="relative">
                                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="email" type="email" placeholder="tu@email.com" value={email} onChange={(e) => setEmail(e.target.value)} required className="pl-10" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                    <Label htmlFor="password">Contraseña</Label>
                                    <Link to="/recuperar-contrasena" className="text-sm text-primary hover:underline font-medium">
                                        Recuperar contraseña
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required className="pl-10" />
                                </div>
                            </div>
                            <Button type="submit" className="w-full btn-primary" disabled={loading}>
                                {loading ? "Iniciando sesión..." : <><LogIn className="mr-2 h-4 w-4" /> Iniciar Sesión</>}
                            </Button>
                        </form>
                        <div className="mt-6 text-center text-sm">
                            ¿No tienes una cuenta? <Link to="/registro" className="underline text-primary">Regístrate</Link>
                        </div>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default Login;
