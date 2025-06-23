import React from 'react';
import { useNavigate } from 'react-router-dom';
import { CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';

const StepConfirmation = ({ clientName, salonName, selectedDate, selectedTime }) => {
    const navigate = useNavigate();
    return (
        <div className="text-center">
            <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <CardTitle>¡Reserva Confirmada!</CardTitle>
            <CardDescription className="mt-2">
                {clientName}, tu cita en {salonName} para el {format(new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`), "eeee dd 'de' MMMM 'a las' HH:mm", { locale: es })} ha sido confirmada.
            </CardDescription>
            <Button onClick={() => navigate('/')} className="mt-6">Volver al inicio</Button>
        </div>
    );
};

export default StepConfirmation;