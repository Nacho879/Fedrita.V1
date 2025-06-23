import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Timer } from 'lucide-react';
import { motion } from 'framer-motion';

const AverageServiceDurationCard = ({ filters, companyId }) => {
  const [duration, setDuration] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageServiceDuration = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockMinutes = Math.floor(Math.random() * 60) + 30;
        setDuration(`${mockMinutes} min`);
      } catch (error) {
        console.error("Error fetching average service duration:", error);
        setDuration('N/A');
      } finally {
        setLoading(false);
      }
    };

    fetchAverageServiceDuration();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Duración Promedio
        </CardTitle>
        <Timer className="h-5 w-5 text-orange-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            key={duration}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            {duration}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Tiempo promedio por servicio.
        </p>
      </CardContent>
    </Card>
  );
};

export default AverageServiceDurationCard;