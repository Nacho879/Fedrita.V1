import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';

const StepService = ({ services, onSelectService }) => (
    <div>
        <CardTitle>Elige un servicio</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {services.map(s => (
                <Button key={s.id} variant="outline" className="h-auto p-4 justify-start text-left" onClick={() => onSelectService(s)}>
                    <div>
                        <p className="font-semibold">{s.name}</p>
                        <p className="text-sm text-muted-foreground">{s.duracion_minutos} min - ${s.precio}</p>
                    </div>
                </Button>
            ))}
        </div>
    </div>
);

export default StepService;