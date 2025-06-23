import React from 'react';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar } from 'lucide-react';

const AgendaHeader = ({ salonName, onBack, calendarApi }) => {
    return (
        <header className="mb-6 flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
                <Button variant="outline" size="icon" onClick={onBack}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h1 className="text-2xl sm:text-3xl font-bold text-hub-anthracite flex items-center gap-3">
                        <Calendar className="h-7 w-7 text-hub-anthracite" />
                        <span>Agenda de {salonName}</span>
                    </h1>
                    <p className="text-muted-foreground pl-10">Gestiona la disponibilidad y las citas del salón.</p>
                </div>
            </div>
            <div className="flex items-center gap-2">
                <Button variant="outline" onClick={() => calendarApi?.changeView('timeGridDay')}>Día</Button>
                <Button variant="outline" onClick={() => calendarApi?.changeView('timeGridWeek')}>Semana</Button>
                <Button variant="outline" onClick={() => calendarApi?.changeView('dayGridMonth')}>Mes</Button>
            </div>
        </header>
    );
};

export default AgendaHeader;