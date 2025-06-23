import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MessageSquare } from 'lucide-react';
import { motion } from 'framer-motion';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';

const AppointmentsByChannelCard = ({ filters, companyId }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const channelColors = {
    'WhatsApp': '#25D366',
    'Web': '#4A90E2',
    'Manual': '#F5A623',
    'Instagram': '#E1306C'
  };

  useEffect(() => {
    const fetchChannelData = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockData = [
          { name: 'WhatsApp', value: Math.floor(Math.random() * 50) + 30, color: channelColors.WhatsApp },
          { name: 'Web', value: Math.floor(Math.random() * 30) + 20, color: channelColors.Web },
          { name: 'Manual', value: Math.floor(Math.random() * 40) + 25, color: channelColors.Manual },
          { name: 'Instagram', value: Math.floor(Math.random() * 20) + 10, color: channelColors.Instagram }
        ];
        setData(mockData);
      } catch (error) {
        console.error("Error fetching channel data:", error);
        setData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchChannelData();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Citas por Canal
        </CardTitle>
        <MessageSquare className="h-5 w-5 text-purple-600" />
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="h-48 bg-gray-200 rounded animate-pulse"></div>
        ) : (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="h-48"
          >
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  outerRadius={60}
                  dataKey="value"
                  nameKey="name"
                >
                  {data.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-1">
          Distribución de reservas por canal.
        </p>
      </CardContent>
    </Card>
  );
};

export default AppointmentsByChannelCard;