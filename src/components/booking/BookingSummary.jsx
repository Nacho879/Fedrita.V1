import React from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Scissors, User, Calendar as CalendarIcon } from 'lucide-react';

const BookingSummary = ({ selectedService, selectedEmployee, selectedDate, selectedTime }) => {
    const summary = [
        { label: 'Servicio', value: selectedService?.name, icon: Scissors },
        { label: 'Profesional', value: selectedEmployee?.name, icon: User },
        { label: 'Fecha y Hora', value: selectedTime ? format(new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}`), "dd/MM/yy HH:mm", { locale: es }) : null, icon: CalendarIcon },
    ];

    return (
        <aside className="md:col-span-1 bg-secondary p-4 rounded-lg space-y-4">
            <h3 className="font-bold text-lg">Tu Reserva</h3>
            {summary.map(item => item.value && (
                <div key={item.label} className="flex items-start text-sm">
                    <item.icon className="h-4 w-4 mr-3 mt-0.5 text-muted-foreground" />
                    <div>
                        <p className="text-muted-foreground">{item.label}</p>
                        <p className="font-semibold">{item.value}</p>
                    </div>
                </div>
            ))}
        </aside>
    );
};

export default BookingSummary;