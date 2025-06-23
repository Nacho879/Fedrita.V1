import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';

const AttendanceRateCard = ({ filters, companyId }) => {
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAttendanceRate = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockRate = Math.floor(Math.random() * 20) + 75;
        setRate(mockRate);
      } catch (error) {
        console.error("Error fetching attendance rate:", error);
        setRate(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAttendanceRate();
  }, [filters, companyId]);

  const getColorByRate = (rate) => {
    if (rate >= 90) return 'text-green-600';
    if (rate >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tasa de Asistencia
        </CardTitle>
        <CheckCircle className="h-5 w-5 text-green-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            key={rate}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className={`text-3xl font-bold ${getColorByRate(rate)}`}
          >
            {rate}%
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Porcentaje de citas asistidas.
        </p>
      </CardContent>
    </Card>
  );
};

export default AttendanceRateCard;