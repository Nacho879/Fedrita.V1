import React from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, XCircle, MessageSquare, Instagram, Facebook } from 'lucide-react';

const ChannelIcon = ({ channel }) => {
    switch (channel.toLowerCase()) {
        case 'whatsapp': return <MessageSquare className="w-4 h-4 text-green-500" />;
        case 'instagram': return <Instagram className="w-4 h-4 text-pink-500" />;
        case 'facebook': return <Facebook className="w-4 h-4 text-blue-500" />;
        default: return null;
    }
}

const HistoryTab = ({ logs }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Historial de Interacciones</CardTitle>
        <CardDescription>Revisa los logs de las conversaciones del asistente con los clientes.</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="border rounded-lg overflow-hidden">
            <div className="max-h-[30rem] overflow-auto relative">
                <Table>
                <TableHeader className="sticky top-0 bg-secondary z-10">
                    <TableRow>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Canal</TableHead>
                    <TableHead>Mensaje</TableHead>
                    <TableHead>Acción IA</TableHead>
                    <TableHead>Resultado</TableHead>
                    <TableHead>Fecha</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {logs.length > 0 ? logs.map(log => (
                    <TableRow key={log.id}>
                        <TableCell className="font-medium">{log.client}</TableCell>
                        <TableCell>
                            <div className="flex items-center gap-2">
                                <ChannelIcon channel={log.channel} />
                                <span className="hidden md:inline">{log.channel}</span>
                            </div>
                        </TableCell>
                        <TableCell className="max-w-xs truncate" title={log.message}>{log.message}</TableCell>
                        <TableCell>{log.action}</TableCell>
                        <TableCell>
                        <Badge variant={log.result === 'success' ? 'default' : 'destructive'} className={log.result === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}>
                            {log.result === 'success' ? <CheckCircle className="w-3 h-3 mr-1" /> : <XCircle className="w-3 h-3 mr-1" />}
                            {log.result === 'success' ? 'Éxito' : 'Fallo'}
                        </Badge>
                        </TableCell>
                        <TableCell>{new Date(log.timestamp).toLocaleDateString()} {new Date(log.timestamp).toLocaleTimeString()}</TableCell>
                    </TableRow>
                    )) : (
                        <TableRow>
                            <TableCell colSpan={6} className="text-center h-24">No hay logs disponibles.</TableCell>
                        </TableRow>
                    )}
                </TableBody>
                </Table>
            </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default HistoryTab;