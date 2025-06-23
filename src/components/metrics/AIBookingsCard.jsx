import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const AIBookingsCard = ({ filters, companyId }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIBookings = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockCount = Math.floor(Math.random() * 150) + 50;
        setCount(mockCount);
      } catch (error) {
        console.error("Error fetching AI bookings:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchAIBookings();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Citas Automáticas IA
        </CardTitle>
        <Zap className="h-5 w-5 text-yellow-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            key={count}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            {count}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Reservas creadas por IA.
        </p>
      </CardContent>
    </Card>
  );
};

export default AIBookingsCard;