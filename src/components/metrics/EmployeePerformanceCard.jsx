import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award } from 'lucide-react';
import { motion } from 'framer-motion';

const EmployeePerformanceCard = ({ filters, companyId }) => {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployeePerformance = async () => {
      if (!companyId) return;
      setLoading(true);
      try {
        const mockEmployees = [
          { name: 'María García', appointments: Math.floor(Math.random() * 50) + 30 },
          { name: 'Ana López', appointments: Math.floor(Math.random() * 45) + 25 },
          { name: 'Carmen Ruiz', appointments: Math.floor(Math.random() * 40) + 20 },
          { name: 'Laura Martín', appointments: Math.floor(Math.random() * 35) + 15 },
          { name: 'Sofia Torres', appointments: Math.floor(Math.random() * 30) + 10 }
        ].sort((a, b) => b.appointments - a.appointments);
        setEmployees(mockEmployees);
      } catch (error) {
        console.error("Error fetching employee performance:", error);
        setEmployees([]);
      } finally {
        setLoading(false);
      }
    };

    fetchEmployeePerformance();
  }, [filters, companyId]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300 col-span-2">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Ranking de Empleados
        </CardTitle>
        <Award className="h-5 w-5 text-yellow-600" />
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
            {employees.map((employee, index) => (
              <div key={index} className="flex justify-between items-center">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-bold text-hub-coral">#{index + 1}</span>
                  <span className="text-sm font-medium">{employee.name}</span>
                </div>
                <span className="text-sm font-bold text-hub-coral">{employee.appointments} citas</span>
              </div>
            ))}
          </motion.div>
        )}
        <p className="text-xs text-muted-foreground pt-3">
          Empleados ordenados por rendimiento.
        </p>
      </CardContent>
    </Card>
  );
};

export default EmployeePerformanceCard;