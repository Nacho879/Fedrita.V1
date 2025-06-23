import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const AIResponseTimeCard = ({ filters, companyId }) => {
  const [responseTime, setResponseTime] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAIResponseTime = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockSeconds = (Math.random() * 5 + 1).toFixed(1);
        setResponseTime(`${mockSeconds}s`);
      } catch (error) {
        console.error("Error fetching AI response time:", error);
        setResponseTime('N/A');
      } finally {
        setLoading(false);
      }
    };

    fetchAIResponseTime();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Tiempo Respuesta IA
        </CardTitle>
        <Clock className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            key={responseTime}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            {responseTime}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Tiempo promedio de respuesta.
        </p>
      </CardContent>
    </Card>
  );
};

export default AIResponseTimeCard;