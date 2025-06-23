import React from 'react';
import AITotalAppointmentsCard from '@/components/metrics/AITotalAppointmentsCard';
import AIProcessedMessagesCard from '@/components/metrics/AIProcessedMessagesCard';
import AIErrorsCard from '@/components/metrics/AIErrorsCard';
import AIInteractionsByChannelCard from '@/components/metrics/AIInteractionsByChannelCard';

const DashboardTab = ({ stats }) => {
  if (!stats) {
    return (
      <div className="text-center p-8">
        <p>Cargando estadísticas...</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
      <AITotalAppointmentsCard count={stats.totalAppointments} />
      <AIProcessedMessagesCard count={stats.processedMessages} />
      <AIErrorsCard count={stats.errors} />
      <div className="md:col-span-2 xl:col-span-4">
        <AIInteractionsByChannelCard data={stats.interactionsByChannel} />
      </div>
    </div>
  );
};

export default DashboardTab;