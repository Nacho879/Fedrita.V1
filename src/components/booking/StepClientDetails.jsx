import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Loader2 } from 'lucide-react';

const StepClientDetails = ({ clientDetails, onDetailsChange, onSubmit, isSubmitting }) => (
    <div>
        <CardTitle>Tus datos</CardTitle>
        <form onSubmit={onSubmit} className="space-y-4 mt-4">
            <div className="space-y-2">
                <Label htmlFor="name">Nombre completo</Label>
                <Input id="name" value={clientDetails.name} onChange={onDetailsChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" value={clientDetails.email} onChange={onDetailsChange} required />
            </div>
            <div className="space-y-2">
                <Label htmlFor="phone">Teléfono</Label>
                <Input id="phone" type="tel" value={clientDetails.phone} onChange={onDetailsChange} required />
            </div>
            <Button type="submit" className="w-full" disabled={isSubmitting}>
                {isSubmitting && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Confirmar Reserva
            </Button>
        </form>
    </div>
);

export default StepClientDetails;