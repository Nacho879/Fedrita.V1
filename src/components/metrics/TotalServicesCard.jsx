import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Scissors } from 'lucide-react';
import { motion } from 'framer-motion';

const TotalServicesCard = ({ filters, companyId }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchTotalServices = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockCount = Math.floor(Math.random() * 200) + 100;
        setCount(mockCount);
      } catch (error) {
        console.error("Error fetching total services:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalServices();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Servicios Realizados
        </CardTitle>
        <Scissors className="h-5 w-5 text-purple-600" />
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
          Total de servicios completados.
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalServicesCard;