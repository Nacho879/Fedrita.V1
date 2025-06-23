import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { DEMO_CLIENTS, DEMO_APPOINTMENTS } from '@/lib/demo-data';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { toast } from '@/components/ui/use-toast';
import { PlusCircle, Search, Edit, Trash2, Loader2, Users } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Dialog } from '@/components/ui/dialog';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import EditClientModal from '@/components/dashboard/EditClientModal.jsx';

const ClientsSalon = () => {
    const { managedSalon } = useAuth();
    const { isDemo } = useDemo();
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [editingClientId, setEditingClientId] = useState(null);

    const fetchClients = useCallback(async () => {
        setLoading(true);
        try {
            if (isDemo) {
                if (managedSalon?.id) {
                    const salonClientIds = [...new Set(DEMO_APPOINTMENTS
                        .filter(app => app.salon_id === managedSalon.id)
                        .map(app => app.client_id))];
                    const salonClients = DEMO_CLIENTS.filter(client => salonClientIds.includes(client.id));
                    setClients(salonClients);
                } else {
                    setClients([]);
                }
            } else {
                if (!managedSalon?.id) {
                    setClients([]);
                    return;
                }

                const { data: appointments, error: appointmentsError } = await supabase
                    .from('appointments')
                    .select('client_id')
                    .eq('salon_id', managedSalon.id);

                if (appointmentsError) throw appointmentsError;

                const clientIds = [...new Set(appointments.map(a => a.client_id).filter(Boolean))];

                if (clientIds.length === 0) {
                    setClients([]);
                    return;
                }

                const { data: clientsData, error: clientsError } = await supabase
                    .from('clients')
                    .select('id, name, email, phone')
                    .in('id', clientIds);

                if (clientsError) throw clientsError;

                setClients(clientsData || []);
            }
        } catch (error) {
            console.error('Error fetching clients:', error);
            toast({
                title: 'Error al cargar clientes',
                description: 'No se pudieron obtener los datos de los clientes.',
                variant: 'destructive',
            });
            setClients([]);
        } finally {
            setLoading(false);
        }
    }, [isDemo, managedSalon]);

    useEffect(() => {
        fetchClients();
    }, [fetchClients]);

    const handleDeleteClient = async (clientId) => {
        if (isDemo) {
            toast({ title: "Modo Demo", description: "La eliminación no está permitida en el modo de demostración." });
            return;
        }

        try {
            const { error } = await supabase.from('clients').delete().eq('id', clientId);
            if (error) throw error;
            setClients(clients.filter(client => client.id !== clientId));
            toast({ title: 'Cliente eliminado', description: 'El cliente ha sido eliminado exitosamente.' });
        } catch (error) {
            toast({
                title: 'Error al eliminar cliente',
                description: error.message,
                variant: 'destructive',
            });
        }
    };

    const handleClientUpdated = () => {
        setEditingClientId(null);
        fetchClients();
    };

    const filteredClients = useMemo(() => {
        return clients.filter(client =>
            (client.name && client.name.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (client.email && client.email.toLowerCase().includes(searchTerm.toLowerCase()))
        );
    }, [clients, searchTerm]);

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-gray-900">Clientes del Negocio</h1>
                    <p className="mt-1 text-sm text-gray-600">Gestiona los clientes de tu negocio.</p>
                </div>
                 <Button asChild className="mt-4 sm:mt-0">
                    <Link to="/crear-cliente">
                        <PlusCircle className="mr-2 h-4 w-4" />
                        Nuevo Cliente
                    </Link>
                </Button>
            </header>

            <Card>
                <CardHeader>
                    <div className="flex flex-col sm:flex-row items-center gap-4">
                        <div className="relative flex-grow w-full">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-500" />
                            <Input
                                placeholder="Buscar por nombre o email..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 w-full"
                            />
                        </div>
                    </div>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="flex justify-center items-center py-10">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : filteredClients.length === 0 ? (
                        <div className="text-center py-10">
                           <Users className="mx-auto h-12 w-12 text-gray-400" />
                           <p className="mt-4 font-semibold text-gray-600">No se encontraron clientes</p>
                           <p className="text-sm text-gray-500">
                             {searchTerm ? 'Prueba con otro término de búsqueda.' : 'Añade tu primer cliente para empezar.'}
                           </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead>Nombre</TableHead>
                                        <TableHead className="hidden md:table-cell">Email</TableHead>
                                        <TableHead className="hidden sm:table-cell">Teléfono</TableHead>
                                        <TableHead className="text-right">Acciones</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredClients.map((client) => (
                                        <TableRow key={client.id}>
                                            <TableCell className="font-medium">{client.name}</TableCell>
                                            <TableCell className="hidden md:table-cell">{client.email}</TableCell>
                                            <TableCell className="hidden sm:table-cell">{client.phone || '-'}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end items-center gap-2">
                                                    <Button variant="ghost" size="icon" onClick={() => setEditingClientId(client.id)}>
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <AlertDialog>
                                                        <AlertDialogTrigger asChild>
                                                            <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </AlertDialogTrigger>
                                                        <AlertDialogContent>
                                                            <AlertDialogHeader>
                                                                <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
                                                                <AlertDialogDescription>
                                                                    Esta acción no se puede deshacer. Se eliminará permanentemente al cliente <strong>{client.name}</strong>.
                                                                </AlertDialogDescription>
                                                            </AlertDialogHeader>
                                                            <AlertDialogFooter>
                                                                <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                                                <AlertDialogAction onClick={() => handleDeleteClient(client.id)} className="bg-destructive hover:bg-destructive/90">
                                                                    Sí, eliminar
                                                                </AlertDialogAction>
                                                            </AlertDialogFooter>
                                                        </AlertDialogContent>
                                                    </AlertDialog>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>

            <Dialog open={!!editingClientId} onOpenChange={(isOpen) => !isOpen && setEditingClientId(null)}>
                {editingClientId && (
                    <EditClientModal
                        clientId={editingClientId}
                        onClientUpdated={handleClientUpdated}
                        onClose={() => setEditingClientId(null)}
                    />
                )}
            </Dialog>
        </div>
    );
};

export default ClientsSalon;