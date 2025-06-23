import React from 'react';
import { Loader2 } from 'lucide-react';

const BookingLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-background">
        <Loader2 className="h-16 w-16 animate-spin text-primary" />
    </div>
);

export default BookingLoader;