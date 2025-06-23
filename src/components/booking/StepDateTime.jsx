import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Button } from '@/components/ui/button';
import { format, startOfDay } from 'date-fns';
import { es } from 'date-fns/locale';
import { Loader2 } from 'lucide-react';

const StepDateTime = ({ selectedDate, onSelectDate, availableSlots, onSelectTime, loadingSlots }) => (
    <div>
        <CardTitle>Elige fecha y hora</CardTitle>
        <div className="flex flex-col md:flex-row gap-8 mt-4">
            <Calendar mode="single" selected={selectedDate} onSelect={onSelectDate} disabled={(date) => date < startOfDay(new Date())} locale={es} />
            <div className="flex-1">
                <h3 className="mb-4 font-semibold text-center">{format(selectedDate, 'PPP', { locale: es })}</h3>
                {loadingSlots ? (
                    <div className="flex justify-center items-center h-32"><Loader2 className="h-8 w-8 animate-spin" /></div>
                ) : (
                    <div className="grid grid-cols-3 gap-2">
                        {availableSlots.length > 0 ? availableSlots.map(slot => (
                            <Button key={slot.start_time} variant="outline" onClick={() => onSelectTime(slot.start_time)}>
                                {format(new Date(`1970-01-01T${slot.start_time}`), 'HH:mm')}
                            </Button>
                        )) : <p className="col-span-3 text-center text-muted-foreground">No hay horas disponibles para este día.</p>}
                    </div>
                )}
            </div>
        </div>
    </div>
);

export default StepDateTime;