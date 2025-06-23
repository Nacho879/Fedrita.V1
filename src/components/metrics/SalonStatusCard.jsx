import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Building } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const SalonStatusCard = ({ filters, companyId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const colors = ['#28a745', '#dc3545'];

  useEffect(() => {
    const fetchSalonStatus = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const activeSalons = Math.floor(Math.random() * 8) + 5;
        const inactiveSalons = Math.floor(Math.random() * 3) + 1;
        
        const mockData = [
          { name: 'Activos', value: activeSalons, color: colors[0] },
          { name: 'Inactivos', value: inactiveSalons, color: colors[1] }
        ];
        setData(mockData);
      } catch (error) {
        console.error("Error fetching salon status:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonStatus();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Estado de Salones
        </CardTitle>
        <Building className="h-5 w-5 text-blue-600" />
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
          Salones activos vs inactivos.
        </p>
      </CardContent>
    </Card>
  );
};

export default SalonStatusCard;