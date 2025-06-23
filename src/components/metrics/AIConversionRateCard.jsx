import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Target } from 'lucide-react';
import { motion } from 'framer-motion';

const AIConversionRateCard = ({ filters, companyId }) => {
  const [rate, setRate] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIConversionRate = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockRate = (Math.random() * 15 + 5).toFixed(1);
        setRate(parseFloat(mockRate));
      } catch (error) {
        console.error("Error fetching AI conversion rate:", error);
        setRate(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAIConversionRate();
  }, [filters, companyId]);

  const getColorByRate = (rate) => {
    if (rate >= 15) return 'text-green-600';
    if (rate >= 10) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tasa Conversión IA
        </CardTitle>
        <Target className="h-5 w-5 text-green-600" />
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
          Mensajes que generan citas.
        </p>
      </CardContent>
    </Card>
  );
};

export default AIConversionRateCard;