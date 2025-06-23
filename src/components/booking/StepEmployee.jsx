import React from 'react';
import { CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User } from 'lucide-react';

const StepEmployee = ({ employees, onSelectEmployee }) => (
    <div>
        <CardTitle>Elige un profesional</CardTitle>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
            {employees.map(e => (
                <Button key={e.id} variant="outline" className="h-auto p-4 justify-start" onClick={() => onSelectEmployee(e)}>
                    <User className="mr-4 h-6 w-6" />
                    <p className="font-semibold">{e.name}</p>
                </Button>
            ))}
        </div>
    </div>
);

export default StepEmployee;