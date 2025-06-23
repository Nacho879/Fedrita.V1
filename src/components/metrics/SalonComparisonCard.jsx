import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const SalonComparisonCard = ({ filters, companyId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSalonComparison = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockData = [
          { name: 'Salón Centro', citas: Math.floor(Math.random() * 100) + 50 },
          { name: 'Salón Norte', citas: Math.floor(Math.random() * 80) + 40 },
          { name: 'Salón Sur', citas: Math.floor(Math.random() * 90) + 45 },
          { name: 'Salón Este', citas: Math.floor(Math.random() * 70) + 35 },
          { name: 'Salón Oeste', citas: Math.floor(Math.random() * 85) + 42 }
        ].sort((a, b) => b.citas - a.citas);
        setData(mockData);
      } catch (error) {
        console.error("Error fetching salon comparison:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchSalonComparison();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300 col-span-3">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Comparativa entre Salones
        </CardTitle>
        <TrendingUp className="h-5 w-5 text-green-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-64 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-64"
          >
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="citas" fill="#FF7A59" />
              </BarChart>
            </ResponsiveContainer>
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Rendimiento comparativo de todos los salones.
        </p>
      </CardContent>
    </Card>
  );
};

export default SalonComparisonCard;