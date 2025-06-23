import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Clock } from 'lucide-react';
import { motion } from 'framer-motion';

const WorkingHoursCard = ({ filters, companyId }) => {
  const [totalHours, setTotalHours] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchWorkingHours = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockHours = Math.floor(Math.random() * 200) + 150;
        setTotalHours(`${mockHours}h`);
      } catch (error) {
        console.error("Error fetching working hours:", error);
        setTotalHours('N/A');
      } finally {
        setLoading(false);
      }
    };

    fetchWorkingHours();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Horas Trabajadas
        </CardTitle>
        <Clock className="h-5 w-5 text-blue-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-8 w-20 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            key={totalHours}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="text-3xl font-bold"
          >
            {totalHours}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Total de horas trabajadas.
        </p>
      </CardContent>
    </Card>
  );
};

export default WorkingHoursCard;