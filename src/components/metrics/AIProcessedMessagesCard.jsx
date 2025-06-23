import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessagesSquare } from 'lucide-react';

const AIProcessedMessagesCard = ({ count }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Mensajes Procesados</CardTitle>
        <MessagesSquare className="h-4 w-4 text-muted-foreground" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">Total de mensajes analizados por la IA</p>
      </CardContent>
    </Card>
  );
};

export default AIProcessedMessagesCard;