import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth.jsx';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Loader2, AlertTriangle, PartyPopper } from 'lucide-react';

const CompleteInvitation = () => {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const { login } = useAuth();
    const token = searchParams.get('token');

    const [invitation, setInvitation] = useState(null);
    const [status, setStatus] = useState('loading'); // loading, invalid, valid
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    useEffect(() => {
        const validateToken = async () => {
            if (!token) {
                setStatus('invalid');
                return;
            }

            try {
                const { data, error } = await supabase
                    .from('invitation_links')
                    .select('*, salons(name, company_id)')
                    .eq('token', token)
                    .single();
                
                if (error || !data) {
                    setStatus('invalid');
                    toast({ title: 'Enlace inválido', description: 'El enlace de invitación no es correcto.', variant: 'destructive' });
                    return;
                }

                if (data.is_used) {
                    setStatus('invalid');
                    toast({ title: 'Enlace ya utilizado', description: 'Esta invitación ya ha sido aceptada.', variant: 'destructive' });
                    return;
                }

                if (new Date(data.expires_at) < new Date()) {
                    setStatus('invalid');
                    toast({ title: 'Enlace expirado', description: 'Esta invitación ha caducado. Pide una nueva.', variant: 'destructive' });
                    return;
                }
                
                setInvitation(data);
                setStatus('valid');

            } catch (err) {
                setStatus('invalid');
            }
        };

        validateToken();
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            toast({ title: 'Error', description: 'Las contraseñas no coinciden.', variant: 'destructive' });
            return;
        }
        setIsSubmitting(true);

        try {
            // 1. Sign up the user
            const { data: authData, error: authError } = await supabase.auth.signUp({
                email: invitation.email,
                password: password,
            });

            if (authError && authError.message.includes('User already registered')) {
                // User exists, just log them in to confirm identity
                const loginResult = await login(invitation.email, password);
                if (!loginResult.success) {
                    throw new Error("La contraseña es incorrecta. Si ya tienes una cuenta, por favor usa tu contraseña actual.");
                }
            } else if (authError) {
                throw authError;
            }
            
            const userId = authData?.user?.id || (await supabase.auth.getUser()).data.user.id;

            // 2. Create employee record
            const { error: employeeError } = await supabase.from('employees').insert([{
                salon_id: invitation.salon_id,
                company_id: invitation.salons.company_id,
                name: invitation.email.split('@')[0],
                is_manager: invitation.role === 'manager',
                owner_id: userId,
                services: [],
                work_hours: ''
            }]);
            if (employeeError) throw employeeError;

            // 3. Assign as manager if needed
            if (invitation.role === 'manager') {
                const { error: salonUpdateError } = await supabase.from('salons').update({ manager_id: userId }).eq('id', invitation.salon_id);
                if (salonUpdateError) throw salonUpdateError;
            }

            // 4. Mark invitation as used
            const { error: updateError } = await supabase.from('invitation_links').update({ is_used: true }).eq('token', token);
            if (updateError) throw updateError;
            
            // Log in again to refresh context
            await login(invitation.email, password);

            toast({ title: '¡Bienvenido/a al equipo!', description: 'Tu cuenta ha sido creada y asignada al salón.' });
            
            const dashboardPath = invitation.role === 'manager' ? '/dashboard-manager' : '/dashboard-empleado';
            navigate(dashboardPath);

        } catch (error) {
            toast({ title: 'Error al completar el registro', description: error.message, variant: 'destructive' });
        } finally {
            setIsSubmitting(false);
        }
    };

    if (status === 'loading') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background">
                <Loader2 className="w-16 h-16 animate-spin text-hub-coral" />
            </div>
        );
    }

    if (status === 'invalid') {
        return (
            <div className="min-h-screen flex items-center justify-center bg-background p-4">
                <Card className="w-full max-w-md text-center">
                    <CardHeader>
                        <AlertTriangle className="w-16 h-16 mx-auto text-destructive" />
                        <CardTitle className="mt-4">Enlace de Invitación Inválido</CardTitle>
                        <CardDescription>
                            El enlace que has usado no es correcto, ya fue utilizado o ha expirado. Por favor, solicita una nueva invitación.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <Button asChild><Link to="/">Volver al Inicio</Link></Button>
                    </CardContent>
                </Card>
            </div>
        );
    }
    
    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8 }} className="w-full max-w-md">
                <Card>
                    <CardHeader className="text-center pb-8">
                        <PartyPopper className="w-16 h-16 mx-auto text-hub-coral" />
                        <CardTitle className="mt-4">¡Casi estás dentro!</CardTitle>
                        <CardDescription>
                            Estás a un paso de unirte a <span className="font-bold">{invitation.salons.name}</span> como <span className="font-bold">{invitation.role}</span>. Completa tu registro para continuar.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="email">Email</Label>
                                <Input id="email" type="email" value={invitation.email} readOnly disabled className="h-12 bg-secondary" />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="password">Elige una contraseña</Label>
                                <div className="relative">
                                    <Input id="password" type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} required minLength={8} className="h-12 pr-12" />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground">
                                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                    </button>
                                </div>
                            </div>
                             <div className="space-y-2">
                                <Label htmlFor="confirmPassword">Confirma tu contraseña</Label>
                                <Input id="confirmPassword" type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required className="h-12" />
                            </div>
                            <Button type="submit" className="w-full h-12 btn-primary text-lg" disabled={isSubmitting}>
                                {isSubmitting ? <Loader2 className="animate-spin" /> : 'Completar Registro y Unirme'}
                            </Button>
                        </form>
                    </CardContent>
                </Card>
            </motion.div>
        </div>
    );
};

export default CompleteInvitation;