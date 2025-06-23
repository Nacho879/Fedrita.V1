import React from 'react';

const BookingHeader = ({ salonName }) => (
    <header className="text-center mb-8">
        <h1 className="text-4xl font-bold text-hub-anthracite">{salonName}</h1>
        <p className="text-lg text-muted-foreground">Reservas Online</p>
    </header>
);

export default BookingHeader;