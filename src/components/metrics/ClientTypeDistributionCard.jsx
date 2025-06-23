import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { UserCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const ClientTypeDistributionCard = ({ filters, companyId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ['#4A90E2', '#50E3C2'];

  useEffect(() => {
    const fetchClientTypeData = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const frequentClients = Math.floor(Math.random() * 100) + 50;
        const newClients = Math.floor(Math.random() * 80) + 30;
        
        const mockData = [
          { name: 'Clientes Frecuentes', value: frequentClients, color: colors[0] },
          { name: 'Clientes Nuevos', value: newClients, color: colors[1] }
        ];
        setData(mockData);
      } catch (error) {
        console.error("Error fetching client type data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchClientTypeData();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Clientes Frecuentes vs Nuevos
        </CardTitle>
        <UserCheck className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-48"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Distribución de tipos de clientes.
        </p>
      </CardContent>
    </Card>
  );
};

export default ClientTypeDistributionCard;