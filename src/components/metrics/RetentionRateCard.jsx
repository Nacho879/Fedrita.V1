import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Repeat } from 'lucide-react';
import { motion } from 'framer-motion';

const RetentionRateCard = ({ filters, companyId }) => {
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRetentionRate = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockRate = Math.floor(Math.random() * 30) + 60;
        setRate(mockRate);
      } catch (error) {
        console.error("Error fetching retention rate:", error);
        setRate(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRetentionRate();
  }, [filters, companyId]);

  const getColorByRate = (rate) => {
    if (rate >= 80) return 'text-green-600';
    if (rate >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tasa de Retención
        </CardTitle>
        <Repeat className="h-5 w-5 text-purple-600" />
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
          Clientes que regresan.
        </p>
      </CardContent>
    </Card>
  );
};

export default RetentionRateCard;