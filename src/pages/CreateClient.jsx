import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth.jsx';
import { useDemo } from '@/hooks/useDemo.jsx';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from '@/components/ui/use-toast';
import { Loader2, UserPlus, ArrowLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { createClient } from '../api/supabase/clients';

const CreateClient = () => {
  const navigate = useNavigate();
  const { user, managedSalon, isAdmin } = useAuth();
  const { isDemo } = useDemo();
  const [form, setForm] = useState({ name: '', email: '', phone: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);
    setError(null);
    const { error } = await createClient(form);
    if (error) {
      setError('Error al crear el cliente.');
    } else {
      setMessage('Cliente creado exitosamente.');
      setForm({ name: '', email: '', phone: '' });
    }
    setLoading(false);
  };

  const handleCancel = () => {
    navigate(isAdmin ? '/mis-clientes' : '/clientes-salon');
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <form onSubmit={handleSubmit} className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6 text-center">Crear Cliente</h2>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="name">Nombre</label>
          <input
            type="text"
            id="name"
            name="name"
            value={form.name}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block mb-1 font-medium" htmlFor="phone">Teléfono</label>
          <input
            type="text"
            id="phone"
            name="phone"
            value={form.phone}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
          disabled={loading}
        >
          {loading ? 'Creando...' : 'Crear Cliente'}
        </button>
        {message && <div className="mt-4 text-green-600 text-center">{message}</div>}
        {error && <div className="mt-4 text-red-600 text-center">{error}</div>}
      </form>
    </div>
  );
};

export default CreateClient;