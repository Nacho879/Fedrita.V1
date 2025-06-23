import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';
import { format, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { PlusCircle, Lock } from 'lucide-react';

const DetailDialog = ({ isOpen, onClose, data, onReleaseSlot, canEdit }) => {
    const { toast } = useToast();
    if (!data) return null;
    
    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Detalles del Slot</DialogTitle>
                    <DialogDescription>
                        {data.startStr && format(parseISO(data.startStr), "eeee, d 'de' MMMM, HH:mm", { locale: es })}
                    </DialogDescription>
                </DialogHeader>
                {data.extendedProps && (
                    <div className="space-y-3 py-4 text-sm">
                        <p><strong>Estado:</strong> <span className="capitalize">{data.extendedProps.estado}</span></p>
                        {data.extendedProps.estado === 'reservado' && (
                            <>
                                <p><strong>Cliente:</strong> {data.extendedProps.cliente_nombre}</p>
                                <p><strong>Servicio:</strong> {data.extendedProps.serviceName}</p>
                            </>
                        )}
                        {data.extendedProps.employeeName && (
                            <p><strong>Empleado:</strong> {data.extendedProps.employeeName}</p>
                        )}
                        {data.extendedProps.estado === 'bloqueado' && data.extendedProps.motivo && (
                            <p><strong>Motivo:</strong> {data.extendedProps.motivo}</p>
                        )}
                    </div>
                )}
                <DialogFooter>
                    {canEdit && <Button variant="destructive" onClick={onReleaseSlot}>Liberar Slot</Button>}
                    {canEdit && <Button onClick={() => toast({ title: 'Función no disponible', description: 'La edición de citas se implementará próximamente.' })}>Editar</Button>}
                    <DialogClose asChild><Button variant="outline">Cerrar</Button></DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
};

const ActionDialog = ({ isOpen, onClose, data, onCreateAppointment, onBlockClick }) => {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>¿Qué deseas hacer?</DialogTitle>
                    <DialogDescription>
                        Has seleccionado el horario de {data.start && format(data.start, "HH:mm")} a {data.end && format(data.end, "HH:mm")}.
                    </DialogDescription>
                </DialogHeader>
                <div className="py-4 flex flex-col sm:flex-row gap-4">
                    <Button className="w-full" onClick={onCreateAppointment}>
                        <PlusCircle className="mr-2 h-4 w-4"/> Crear Cita
                    </Button>
                    <Button className="w-full" variant="secondary" onClick={onBlockClick}>
                        <Lock className="mr-2 h-4 w-4"/> Bloquear Horario
                    </Button>
                </div>
            </DialogContent>
        </Dialog>
    );
};

const BlockTimeDialog = ({ isOpen, onClose, data, onSubmit }) => {
    if (!data) return null;

    return (
        <Dialog open={isOpen} onOpenChange={onClose}>
            <DialogContent>
                <form onSubmit={onSubmit}>
                    <DialogHeader>
                        <DialogTitle>Bloquear Horario</DialogTitle>
                        <DialogDescription>Marca este tiempo como no disponible.</DialogDescription>
                    </DialogHeader>
                    <div className="py-4 space-y-4">
                        <div>
                            <p className="text-sm font-medium">Desde: {data.start && format(data.start, "HH:mm")}</p>
                            <p className="text-sm font-medium">Hasta: {data.end && format(data.end, "HH:mm")}</p>
                        </div>
                        <div>
                            <Label htmlFor="motivo">Motivo (opcional)</Label>
                            <Textarea id="motivo" name="motivo" placeholder="Ej: Pausa para comer, Reunión de equipo..." />
                        </div>
                    </div>
                    <DialogFooter>
                        <DialogClose asChild><Button type="button" variant="outline">Cancelar</Button></DialogClose>
                        <Button type="submit">Confirmar Bloqueo</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

const AgendaDialogs = ({ dialogState, closeDialog, onCreateAppointment, onBlockTime, onReleaseSlot, canEdit, onSetDialogState }) => {
    return (
        <>
            <DetailDialog 
                isOpen={dialogState.open && dialogState.type === 'detail'}
                onClose={closeDialog}
                data={dialogState.data}
                onReleaseSlot={onReleaseSlot}
                canEdit={canEdit}
            />
            <ActionDialog
                isOpen={dialogState.open && dialogState.type === 'action'}
                onClose={closeDialog}
                data={dialogState.data}
                onCreateAppointment={onCreateAppointment}
                onBlockClick={() => onSetDialogState(prev => ({ ...prev, type: 'block' }))}
            />
            <BlockTimeDialog
                isOpen={dialogState.open && dialogState.type === 'block'}
                onClose={closeDialog}
                data={dialogState.data}
                onSubmit={onBlockTime}
            />
        </>
    );
};

export default AgendaDialogs;