import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { AlertTriangle } from 'lucide-react';

const BookingError = ({ message }) => {
    const navigate = useNavigate();
    return (
        <div className="min-h-screen flex items-center justify-center bg-background p-4">
            <Card className="w-full max-w-md text-center">
                <CardHeader>
                    <AlertTriangle className="h-12 w-12 text-destructive mx-auto mb-4" />
                    <CardTitle>Página no disponible</CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-muted-foreground">{message}</p>
                    <Button onClick={() => navigate('/')} className="mt-6">Volver al inicio</Button>
                </CardContent>
            </Card>
        </div>
    );
};

export default BookingError;