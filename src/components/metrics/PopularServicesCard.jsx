import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { TrendingUp } from 'lucide-react';
import { motion } from 'framer-motion';

const PopularServicesCard = ({ filters, companyId }) => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPopularServices = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockServices = [
          { name: 'Corte de Cabello', count: Math.floor(Math.random() * 50) + 30 },
          { name: 'Manicura', count: Math.floor(Math.random() * 40) + 25 },
          { name: 'Tinte', count: Math.floor(Math.random() * 30) + 20 },
          { name: 'Pedicura', count: Math.floor(Math.random() * 25) + 15 },
          { name: 'Peinado', count: Math.floor(Math.random() * 20) + 10 }
        ].sort((a, b) => b.count - a.count);
        setServices(mockServices);
      } catch (error) {
        console.error("Error fetching popular services:", error);
        setServices([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPopularServices();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Servicios Más Populares
        </CardTitle>
        <TrendingUp className="h-5 w-5 text-green-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="space-y-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-6 bg-gray-200 rounded animate-pulse"></div>
            ))}
          </div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="space-y-3"
          >
            {services.map((service, index) => (
              <div key={index} className="flex justify-between items-center">
                <span className="text-sm font-medium">{service.name}</span>
                <span className="text-sm font-bold text-hub-coral">{service.count}</span>
              </div>
            ))}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-3">
          Ranking de servicios más solicitados.
        </p>
      </CardContent>
    </Card>
  );
};

export default PopularServicesCard;