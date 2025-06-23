import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AverageBookingTimeCard = ({ filters, companyId }) => {
  const [averageTime, setAverageTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAverageBookingTime = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockDays = Math.floor(Math.random() * 10) + 1;
        const mockHours = Math.floor(Math.random() * 24);
        setAverageTime(`${mockDays}d ${mockHours}h`);
      } catch (error) {
        console.error("Error fetching average booking time:", error);
        setAverageTime('N/A');
      } finally {
        setLoading(false);
      }
    };

    fetchAverageBookingTime();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tiempo Promedio Reserva
        </CardTitle>
        <Clock className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            key={averageTime}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            {averageTime}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Entre reserva y prestación.
        </p>
      </CardContent>
    </Card>
  );
};

export default AverageBookingTimeCard;