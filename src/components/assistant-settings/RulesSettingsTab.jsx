import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';

const RulesSettingsTab = ({ config, handleConfigChange }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Reglas de Funcionamiento</CardTitle>
        <CardDescription>Establece los límites y comportamientos del asistente.</CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <Label>Horario Activo</Label>
          <p className="text-sm text-muted-foreground">Define los días y horas en que el asistente estará activo. (Próximamente)</p>
          <Button variant="outline" disabled>Configurar Horario</Button>
        </div>
        <div className="space-y-4">
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="can-cancel">¿Puede cancelar citas?</Label>
            <Switch id="can-cancel" checked={config.rules.canCancel} onCheckedChange={(v) => handleConfigChange('rules.canCancel', v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="can-reschedule">¿Puede reprogramar citas?</Label>
            <Switch id="can-reschedule" checked={config.rules.canReschedule} onCheckedChange={(v) => handleConfigChange('rules.canReschedule', v)} />
          </div>
          <div className="flex items-center justify-between rounded-lg border p-4">
            <Label htmlFor="escalate-to-human">¿Deriva a humano si no entiende?</Label>
            <Switch id="escalate-to-human" checked={config.rules.escalateToHuman} onCheckedChange={(v) => handleConfigChange('rules.escalateToHuman', v)} />
          </div>
        </div>
        <div>
          <Label htmlFor="assignment-logic">Lógica de Asignación de Empleados</Label>
          <Select value={config.rules.assignmentLogic} onValueChange={(v) => handleConfigChange('rules.assignmentLogic', v)}>
            <SelectTrigger id="assignment-logic"><SelectValue placeholder="Selecciona una lógica" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="client_preference">Empleado habitual del cliente</SelectItem>
              <SelectItem value="first_available">Primer empleado disponible</SelectItem>
              <SelectItem value="ask_client">Preguntar al cliente</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardContent>
    </Card>
  );
};

export default RulesSettingsTab;