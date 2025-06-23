import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle } from 'lucide-react';

const AIErrorsCard = ({ count }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Errores de IA</CardTitle>
        <AlertTriangle className="h-4 w-4 text-destructive" />
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold">{count}</div>
        <p className="text-xs text-muted-foreground">Interacciones que resultaron en error</p>
      </CardContent>
    </Card>
  );
};

export default AIErrorsCard;