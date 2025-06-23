import React, { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useDemo } from '@/hooks/useDemo.jsx';
import { DEMO_CLIENTS } from '@/lib/demo-data';
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2 } from 'lucide-react';

const EditClientModal = ({ clientId, onClientUpdated, onClose }) => {
  const [client, setClient] = useState(null);
  const [formData, setFormData] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { isDemo } = useDemo();

  useEffect(() => {
    const fetchClient = async () => {
      if (!clientId) return;
      setLoading(true);
      try {
        if (isDemo) {
          const demoClient = DEMO_CLIENTS.find(c => c.id === clientId);
          setClient(demoClient);
          setFormData({
            name: demoClient.name,
            email: demoClient.email,
            phone: demoClient.phone,
          });
        } else {
          const { data, error } = await supabase
            .from('clients')
            .select('*')
            .eq('id', clientId)
            .single();
          if (error) throw error;
          setClient(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
          });
        }
      } catch (error) {
        toast({
          title: 'Error al cargar el cliente',
          description: 'No se pudo obtener la información del cliente.',
          variant: 'destructive',
        });
        onClose();
      } finally {
        setLoading(false);
      }
    };

    fetchClient();
  }, [clientId, isDemo, onClose]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);

    if (isDemo) {
      toast({
        title: 'Cliente actualizado (Demo)',
        description: `${formData.name} ha sido actualizado en modo demostración.`,
      });
      onClientUpdated();
      setSaving(false);
      return;
    }

    try {
      const { error } = await supabase
        .from('clients')
        .update({
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
        })
        .eq('id', clientId);

      if (error) throw error;

      toast({
        title: 'Cliente actualizado',
        description: 'La información del cliente ha sido guardada.',
      });
      onClientUpdated();
    } catch (error) {
      toast({
        title: 'Error al guardar',
        description: 'No se pudo actualizar la información del cliente.',
        variant: 'destructive',
      });
    } finally {
      setSaving(false);
    }
  };

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Editar Cliente</DialogTitle>
        <DialogDescription>
          Modifica la información del cliente. Haz clic en guardar cuando termines.
        </DialogDescription>
      </DialogHeader>
      {loading ? (
        <div className="flex items-center justify-center p-8">
          <Loader2 className="h-16 w-16 animate-spin text-primary" />
        </div>
      ) : (
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Nombre
              </Label>
              <Input
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="col-span-3"
                required
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="email" className="text-right">
                Email
              </Label>
              <Input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="phone" className="text-right">
                Teléfono
              </Label>
              <Input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={onClose} disabled={saving}>
              Cancelar
            </Button>
            <Button type="submit" disabled={saving}>
              {saving ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : null}
              Guardar Cambios
            </Button>
          </DialogFooter>
        </form>
      )}
    </DialogContent>
  );
};

export default EditClientModal;