import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/components/ui/use-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';
import { addDays } from 'date-fns';
import { Info, Store } from 'lucide-react';

const InviteEmployeeDialog = ({ open, onOpenChange, salonId, salons = [] }) => {
    const { toast } = useToast();
    const { company, userRole } = useAuth();
    const [email, setEmail] = useState('');
    const [role, setRole] = useState('employee');
    const [loading, setLoading] = useState(false);
    const [selectedSalonId, setSelectedSalonId] = useState(salonId || '');

    useEffect(() => {
        if (salonId) {
            setSelectedSalonId(salonId);
        }
    }, [salonId, open]);
    
    const resetForm = () => {
        setEmail('');
        setRole('employee');
        if (!salonId) {
            setSelectedSalonId('');
        }
    };

    const handleInvite = async () => {
        if (!email || !role || !selectedSalonId || !company) {
            toast({ title: 'Error', description: 'Por favor, completa todos los campos: email, rol y salón.', variant: 'destructive' });
            return;
        }

        setLoading(true);

        try {
            const expires_at = addDays(new Date(), 7).toISOString();

            const { data, error } = await supabase.from('invitation_links').insert({
                email,
                role,
                salon_id: selectedSalonId,
                company_id: company.id,
                expires_at,
            }).select().single();

            if (error) throw error;

            const invitationLink = `${window.location.origin}/invite/complete?token=${data.token}`;
            
            navigator.clipboard.writeText(invitationLink);

            toast({
                title: '¡Invitación creada y enlace copiado!',
                description: `Comparte este enlace con ${email}. Expira en 7 días.`,
                duration: 10000,
            });
            
            resetForm();
            onOpenChange(false);
        } catch (error) {
            toast({ title: 'Error al crear la invitación', description: error.message, variant: 'destructive' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onOpenChange={(isOpen) => {
            if (!isOpen) resetForm();
            onOpenChange(isOpen);
        }}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Invitar por Enlace</DialogTitle>
                    <DialogDescription>
                        Crea un enlace de invitación personal y con un rol asignado. El enlace será copiado a tu portapapeles.
                    </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                    {userRole === 'admin' && !salonId && (
                         <div className="space-y-2">
                             <Label htmlFor="salon">Seleccionar Salón</Label>
                             <Select onValueChange={setSelectedSalonId} value={selectedSalonId}>
                                 <SelectTrigger id="salon">
                                    <Store className="mr-2 h-4 w-4 text-muted-foreground" />
                                    <SelectValue placeholder="Elige un salón..." />
                                 </SelectTrigger>
                                 <SelectContent>
                                    {salons.map((s) => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)}
                                    {salons.length === 0 && <div className="p-4 text-sm text-muted-foreground">No tienes salones creados.</div>}
                                 </SelectContent>
                             </Select>
                         </div>
                    )}
                    <div className="space-y-2">
                        <Label htmlFor="email">Correo electrónico</Label>
                        <Input 
                            id="email" 
                            type="email" 
                            placeholder="empleado@email.com" 
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="role">Rol asignado</Label>
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

                <div className="mt-4 border-t pt-4 text-sm text-muted-foreground flex items-start gap-3 bg-secondary p-3 rounded-lg">
                    <Info className="h-5 w-5 text-hub-coral flex-shrink-0 mt-0.5" />
                    <div>
                        <p className="font-semibold text-foreground">¿Buscas el código de acceso general?</p>
                        <p>Encuentra el código de cada salón en la sección <span className="font-bold text-hub-anthracite">"Mis Salones"</span> para un registro rápido y sin rol predefinido.</p>
                    </div>
                </div>

                <DialogFooter className="mt-4">
                    <DialogClose asChild>
                        <Button variant="outline">Cancelar</Button>
                    </DialogClose>
                    <Button onClick={handleInvite} disabled={loading}>
                        {loading ? 'Creando...' : 'Crear Enlace de Invitación'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

export default InviteEmployeeDialog;