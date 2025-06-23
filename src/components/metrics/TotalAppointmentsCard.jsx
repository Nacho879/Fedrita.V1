import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from 'lucide-react';
import { motion } from 'framer-motion';
import { useDemo } from "@/hooks/useDemo.jsx";
import { DEMO_APPOINTMENTS } from "@/lib/demo-data";
import { isWithinInterval, parseISO } from 'date-fns';

const TotalAppointmentsCard = ({ filters, companyId }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isDemo } = useDemo();

  useEffect(() => {
    const fetchTotalAppointments = async () => {
      setLoading(true);
      try {
        if (isDemo) {
          const filteredAppointments = DEMO_APPOINTMENTS.filter(appt => {
            if (filters.salonId && filters.salonId !== 'all' && appt.salon_id !== filters.salonId) return false;
            if (filters.employeeId && filters.employeeId !== 'all' && appt.employee_id !== filters.employeeId) return false;
            if (filters.serviceId && filters.serviceId !== 'all' && appt.service_id !== filters.serviceId) return false;
            if (filters.channel && filters.channel !== 'all' && appt.channel !== filters.channel) return false;
            if (filters.status && filters.status !== 'all' && appt.status !== filters.status) return false;
            if (filters.dateRange?.from && filters.dateRange?.to) {
              const toDate = new Date(filters.dateRange.to);
              toDate.setHours(23, 59, 59, 999);
              if (!isWithinInterval(parseISO(appt.appointment_time), { start: filters.dateRange.from, end: toDate })) {
                return false;
              }
            }
            return true;
          });
          setCount(filteredAppointments.length);
        } else {
          if (!companyId) {
            setCount(0);
            return;
          }
          let query = supabase
            .from('appointments')
            .select('id', { count: 'exact', head: true })
            .eq('company_id', companyId);

          if (filters.salonId && filters.salonId !== 'all') {
            query = query.eq('salon_id', filters.salonId);
          }
          if (filters.employeeId && filters.employeeId !== 'all') {
            query = query.eq('employee_id', filters.employeeId);
          }
          if (filters.dateRange?.from) {
            query = query.gte('appointment_time', filters.dateRange.from.toISOString());
          }
          if (filters.dateRange?.to) {
            const toDate = new Date(filters.dateRange.to);
            toDate.setHours(23, 59, 59, 999);
            query = query.lte('appointment_time', toDate.toISOString());
          }
          if (filters.serviceId && filters.serviceId !== 'all') {
              query = query.eq('service_id', filters.serviceId);
          }
          if (filters.channel && filters.channel !== 'all') {
              query = query.eq('channel', filters.channel);
          }
          if (filters.status && filters.status !== 'all') {
              query = query.eq('status', filters.status);
          }

          const { count, error } = await query;

          if (error) throw error;
          setCount(count || 0);
        }
      } catch (error) {
        console.error("Error fetching total appointments:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchTotalAppointments();
  }, [filters, companyId, isDemo]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Total de Citas
        </CardTitle>
        <Calendar className="h-5 w-5 text-hub-coral" />
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
          Citas que coinciden con los filtros.
        </p>
      </CardContent>
    </Card>
  );
};

export default TotalAppointmentsCard;