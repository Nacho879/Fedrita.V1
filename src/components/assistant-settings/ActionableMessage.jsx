import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Bot, Check, Edit, CalendarDays, Clock, User, Scissors } from 'lucide-react';
import { useToast } from '@/components/ui/use-toast';
import { motion } from 'framer-motion';

const ActionableMessage = ({ message, onConfirm }) => {
    const { toast } = useToast();
    const { actionDetails } = message;

    const handleEdit = () => {
        toast({
            title: "🚧 Función en desarrollo",
            description: "Pronto podrás editar las respuestas de la IA antes de enviarlas.",
        });
    };

    return (
        <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="flex items-start gap-2.5"
        >
            <Bot className="w-6 h-6 text-primary flex-shrink-0 mt-2" />
            <div className="p-3 rounded-lg bg-muted max-w-md w-full">
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
                <Card className="mt-3 bg-background/70 shadow-inner">
                    <CardHeader className="p-4">
                        <CardTitle className="text-base flex items-center">
                            <Check className="w-4 h-4 mr-2 text-green-500" />
                            Propuesta de Cita
                        </CardTitle>
                    </CardHeader>
                    <CardContent className="p-4 pt-0 space-y-2 text-sm">
                        <div className="flex items-center"><User className="w-4 h-4 mr-2 text-muted-foreground"/> <strong>Cliente:</strong><span className="ml-2">{actionDetails.client}</span></div>
                        <div className="flex items-center"><Scissors className="w-4 h-4 mr-2 text-muted-foreground"/> <strong>Servicio:</strong><span className="ml-2">{actionDetails.service}</span></div>
                        <div className="flex items-center"><CalendarDays className="w-4 h-4 mr-2 text-muted-foreground"/> <strong>Fecha:</strong><span className="ml-2">{actionDetails.date}</span></div>
                        <div className="flex items-center"><Clock className="w-4 h-4 mr-2 text-muted-foreground"/> <strong>Hora:</strong><span className="ml-2">{actionDetails.time}</span></div>
                        <div className="flex items-center"><User className="w-4 h-4 mr-2 text-muted-foreground"/> <strong>Con:</strong><span className="ml-2">{actionDetails.employee}</span></div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0 flex flex-wrap justify-end gap-2">
                        <Button variant="ghost" size="sm" onClick={handleEdit}>
                            <Edit className="w-3 h-3 mr-1.5" /> Editar
                        </Button>
                        <Button size="sm" onClick={() => onConfirm(actionDetails)} className="bg-green-600 hover:bg-green-700">
                            <Check className="w-3 h-3 mr-1.5" /> Confirmar y Agendar
                        </Button>
                    </CardFooter>
                </Card>
            </div>
        </motion.div>
    );
}

export default ActionableMessage;