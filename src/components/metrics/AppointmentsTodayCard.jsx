import React, { useState, useEffect } from "react";
import { supabase } from '@/lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CalendarCheck } from 'lucide-react';
import { motion } from 'framer-motion';
import { startOfDay, endOfDay, isToday, parseISO } from 'date-fns';
import { useDemo } from "@/hooks/useDemo.jsx";
import { DEMO_APPOINTMENTS } from "@/lib/demo-data";

const AppointmentsTodayCard = ({ filters, companyId }) => {
  const [count, setCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const { isDemo } = useDemo();

  useEffect(() => {
    const fetchAppointmentsToday = async () => {
      setLoading(true);
      try {
        if (isDemo) {
          const todaysAppointments = DEMO_APPOINTMENTS.filter(appt => {
            if (!isToday(parseISO(appt.appointment_time))) return false;
            if (filters.salonId && filters.salonId !== 'all' && appt.salon_id !== filters.salonId) return false;
            if (filters.employeeId && filters.employeeId !== 'all' && appt.employee_id !== filters.employeeId) return false;
            return true;
          });
          setCount(todaysAppointments.length);
        } else {
          if (!companyId) {
            setCount(0);
            return;
          }
          const todayStart = startOfDay(new Date()).toISOString();
          const todayEnd = endOfDay(new Date()).toISOString();

          let query = supabase
            .from('appointments')
            .select('id', { count: 'exact', head: true })
            .eq('company_id', companyId)
            .gte('appointment_time', todayStart)
            .lte('appointment_time', todayEnd);

          if (filters.salonId && filters.salonId !== 'all') {
            query = query.eq('salon_id', filters.salonId);
          }
          if (filters.employeeId && filters.employeeId !== 'all') {
            query = query.eq('employee_id', filters.employeeId);
          }

          const { count, error } = await query;

          if (error) throw error;
          setCount(count || 0);
        }
      } catch (error) {
        console.error("Error fetching appointments for today:", error);
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    if (!isDemo && !companyId) {
      setLoading(false);
      setCount(0);
    } else {
      fetchAppointmentsToday();
    }
  }, [filters, companyId, isDemo]);

  return (
    <Card className="shadow-hub hover:shadow-lg transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-foreground">
          Citas del Día
        </CardTitle>
        <CalendarCheck className="h-5 w-5 text-hub-sky" />
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
          Citas programadas para hoy.
        </p>
      </CardContent>
    </Card>
  );
};

export default AppointmentsTodayCard;