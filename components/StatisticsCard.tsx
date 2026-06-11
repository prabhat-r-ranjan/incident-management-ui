'use client';

import { Statistics } from '@/types/incident';

interface Props {
  statistics: Statistics;
}

export default function StatisticsCard({ statistics }: Props) {
  const stats = [
    { label: 'Total Incidents', value: statistics.totalIncidents, color: 'text-gray-900' },
    { label: 'Open Incidents', value: statistics.openIncidents, color: 'text-orange-600' },
    { label: 'Resolved', value: statistics.resolvedIncidents, color: 'text-green-600' },
    { 
      label: 'Avg Resolution', 
      value: Math.round(statistics.averageResolutionTimeMinutes), 
      unit: 'min',
      color: 'text-gray-900'
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-white border rounded-lg p-5">
          <div className="text-sm text-gray-500 mb-1">{stat.label}</div>
          <div className={`text-3xl font-bold ${stat.color}`}>
            {stat.value}
            {stat.unit && <span className="text-sm font-normal text-gray-500 ml-1">{stat.unit}</span>}
          </div>
        </div>
      ))}
    </div>
  );
}