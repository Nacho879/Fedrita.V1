import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { toast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';
import { Store, MapPin, Phone, Clock, ArrowLeft, Link as LinkIcon, Copy, Check, AlertCircle } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { DEMO_SALONS } from '@/lib/demo-data';

const EditSalon = () => {
    const { salonId } = useParams();
    const navigate = useNavigate();
    const { user, company, managedSalon, userRole, loading: authLoading } = useAuth();
    const { isDemo } = useDemo();

    const [salonName, setSalonName] = useState('');
    const [address, setAddress] = useState('');
    const [phone, setPhone] = useState('');
    const [openingHours, setOpeningHours] = useState('');
    const [publicSlug, setPublicSlug] = useState('');
    const [isPublicUrlActive, setIsPublicUrlActive] = useState(false);
    const [slugError, setSlugError] = useState('');
    const [loading, setLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const [originalSalonName, setOriginalSalonName] = useState('');

    const slugify = (text) => {
        if (!text) return '';
        return text
            .toString()
            .toLowerCase()
            .normalize('NFD')
            .replace(/[\u0300-\u036f]/g, '')
            .replace(/\s+/g, '-')
            .replace(/[^\w\-]+/g, '')
            .replace(/\-\-+/g, '-')
            .replace(/^-+/, '')
            .replace(/-+$/, '');
    };

    const checkSlugUniqueness = useCallback(async (slug) => {
        if (!slug || isDemo) return true;
        try {
            const { data, error } = await supabase
                .from('salons')
                .select('id')
                .eq('public_slug', slug)
                .neq('id', salonId)
                .single();
            
            if (error && error.code !== 'PGRST116') throw error;

            if (data) {
                setSlugError('Esta URL ya está en uso. Por favor, elige otra.');
                return false;
            }
            
            setSlugError('');
            return true;
        } catch (error) {
            toast({ title: "Error", description: "No se pudo validar la URL pública.", variant: "destructive" });
            return false;
        }
    }, [salonId, isDemo]);

    const handleSlugChange = (e) => {
        const newSlug = slugify(e.target.value);
        setPublicSlug(newSlug);
        if (slugError) {
            checkSlugUniqueness(newSlug);
        }
    };

    useEffect(() => {
        if (authLoading) return;

        const fetchSalonAndCheckPermission = async () => {
            setLoading(true);
            if (isDemo) {
                const demoSalon = DEMO_SALONS.find(s => s.id === salonId);
                if (demoSalon) {
                    setHasPermission(true);
                    setSalonName(demoSalon.name);
                    setOriginalSalonName(demoSalon.name);
                    setAddress(demoSalon.address);
                    setPhone(demoSalon.phone);
                    setOpeningHours(demoSalon.opening_hours);
                    setPublicSlug(demoSalon.public_slug);
                    setIsPublicUrlActive(demoSalon.url_publica_activada);
                } else {
                    setHasPermission(false);
                    toast({ title: "Salón no encontrado", description: "El salón de demostración no existe.", variant: "destructive" });
                    navigate('/dashboard');
                }
                setLoading(false);
                return;
            }

            try {
                const { data: salonData, error: salonError } = await supabase
                    .from('salons')
                    .select('*')
                    .eq('id', salonId)
                    .single();
                
                if (salonError) throw salonError;

                let canEdit = false;
                if (userRole === 'admin' && salonData.company_id === company?.id) {
                    canEdit = true;
                } else if (userRole === 'manager' && salonData.id === managedSalon?.id) {
                    canEdit = true;
                }

                if (canEdit) {
                    setHasPermission(true);
                    setSalonName(salonData.name);
                    setOriginalSalonName(salonData.name);
                    setAddress(salonData.address || '');
                    setPhone(salonData.phone || '');
                    setOpeningHours(salonData.opening_hours || '');
                    setPublicSlug(salonData.public_slug || slugify(salonData.name));
                    setIsPublicUrlActive(salonData.url_publica_activada || false);
                } else {
                    setHasPermission(false);
                    toast({ title: "Acceso denegado", description: "No tienes permiso para editar este negocio.", variant: "destructive" });
                    navigate('/dashboard');
                }
            } catch (error) {
                toast({ title: "Error", description: "No se pudo cargar la información del negocio.", variant: "destructive" });
                navigate('/dashboard');
            } finally {
                setLoading(false);
            }
        };
        fetchSalonAndCheckPermission();
    }, [salonId, user, company, managedSalon, userRole, authLoading, navigate, isDemo]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isDemo) {
            toast({ title: "Modo Demostración", description: "Los cambios no se guardan en el modo de demostración." });
            navigate(-1);
            return;
        }

        const isSlugValid = await checkSlugUniqueness(publicSlug);
        if (!isSlugValid) return;

        setIsSubmitting(true);
        try {
            const updatedData = {
                name: salonName,
                address,
                phone,
                opening_hours: openingHours,
                public_slug: publicSlug,
                url_publica_activada: isPublicUrlActive,
            };

            const { error } = await supabase
                .from('salons')
                .update(updatedData)
                .eq('id', salonId);
            
            if (error) throw error;
            
            toast({
                title: "¡Negocio actualizado!",
                description: `Los datos de ${salonName} se han guardado correctamente.`,
            });
            navigate(-1);
        } catch (error) {
            toast({
                title: "Error al actualizar el negocio",
                description: error.message,
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    const copyPublicUrlToClipboard = () => {
        const url = `${window.location.origin}/reservas/${publicSlug}`;
        navigator.clipboard.writeText(url).then(() => {
            toast({
                title: '¡URL Copiada!',
                description: 'La URL pública de reservas ha sido copiada.',
            });
        });
    };

    if (loading || authLoading) {
        return <div className="min-h-screen flex items-center justify-center bg-background"><div className="animate-spin rounded-full h-32 w-32 border-b-4 border-primary"></div></div>;
    }

    if (!hasPermission) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center bg-secondary p-4 text-center">
                <h1 className="text-3xl font-bold text-hub-anthracite mb-4">Acceso Denegado</h1>
                <p className="text-foreground mb-8">Redirigiendo...</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex items-center justify-center p-4">
            <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8 }}
                className="w-full max-w-3xl"
            >
                <form onSubmit={handleSubmit}>
                    <Card className="mb-6">
                        <CardHeader>
                            <div className="flex items-center space-x-4">
                                <Button variant="outline" size="icon" onClick={() => navigate(-1)} type="button">
                                    <ArrowLeft className="h-4 w-4" />
                                </Button>
                                <div>
                                    <CardTitle className="text-3xl">Editar Negocio</CardTitle>
                                    <CardDescription className="text-lg">
                                        Actualiza los detalles de {originalSalonName}.
                                    </CardDescription>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="space-y-2">
                                <Label htmlFor="salonName">Nombre del negocio *</Label>
                                <div className="relative">
                                    <Store className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="salonName" value={salonName} onChange={(e) => setSalonName(e.target.value)} required className="h-12 pl-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="address">Dirección completa *</Label>
                                <div className="relative">
                                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="address" value={address} onChange={(e) => setAddress(e.target.value)} required className="h-12 pl-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="phone">Teléfono *</Label>
                                <div className="relative">
                                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-muted-foreground" />
                                    <Input id="phone" type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} required className="h-12 pl-12" />
                                </div>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="openingHours">Horarios de atención *</Label>
                                <div className="relative">
                                    <Clock className="absolute left-3 top-4 transform -translate-y-0 w-5 h-5 text-muted-foreground" />
                                    <Textarea id="openingHours" value={openingHours} onChange={(e) => setOpeningHours(e.target.value)} required className="h-24 pl-12 pt-3" />
                                </div>
                                <p className="text-sm text-muted-foreground">Puedes detallar los horarios por día.</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle className="text-2xl flex items-center"><LinkIcon className="mr-3 h-6 w-6 text-primary" /> Reservas Online</CardTitle>
                            <CardDescription>Gestiona la página pública de reservas de tu negocio.</CardDescription>
                        </CardHeader>
                        <CardContent className="space-y-6">
                            <div className="flex items-center justify-between rounded-lg border p-4">
                                <div>
                                    <Label htmlFor="public-url-switch" className="font-semibold">Activar página de reservas pública</Label>
                                    <p className="text-sm text-muted-foreground">Permite que los clientes reserven a través de una URL única.</p>
                                </div>
                                <Switch id="public-url-switch" checked={isPublicUrlActive} onCheckedChange={setIsPublicUrlActive} />
                            </div>

                            {isPublicUrlActive && (
                                <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="space-y-2">
                                    <Label htmlFor="publicSlug">URL Pública Personalizada</Label>
                                    <div className="flex items-center space-x-2">
                                        <span className="text-sm text-muted-foreground p-2 bg-secondary rounded-l-md border border-r-0">{window.location.origin}/reservas/</span>
                                        <Input id="publicSlug" value={publicSlug} onChange={handleSlugChange} onBlur={() => checkSlugUniqueness(publicSlug)} required className="h-10 rounded-l-none" />
                                        <Button type="button" variant="ghost" size="icon" onClick={copyPublicUrlToClipboard}><Copy className="h-5 w-5" /></Button>
                                    </div>
                                    {slugError && <p className="text-sm text-destructive flex items-center"><AlertCircle className="h-4 w-4 mr-1" /> {slugError}</p>}
                                    {!slugError && publicSlug && <p className="text-sm text-green-600 flex items-center"><Check className="h-4 w-4 mr-1" /> URL disponible</p>}
                                </motion.div>
                            )}
                        </CardContent>
                    </Card>

                    <div className="mt-6">
                        <Button type="submit" className="w-full h-12 btn-primary text-lg" disabled={isSubmitting || !!slugError}>
                            {isSubmitting ? "Guardando cambios..." : "Guardar Cambios"}
                        </Button>
                    </div>
                </form>
            </motion.div>
        </div>
    );
};

export default EditSalon;