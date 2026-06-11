'use client';

import { useEffect, useState } from 'react';
import { incidentApi } from '@/lib/api';
import { Statistics, Incident } from '@/types/incident';
import IncidentCard from '@/components/IncidentCard';  // ← ADD THIS LINE
import toast from 'react-hot-toast';

export default function Dashboard() {
  const [statistics, setStatistics] = useState<Statistics | null>(null);
  const [recentIncidents, setRecentIncidents] = useState<Incident[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const [stats, incidents] = await Promise.all([
        incidentApi.getStatistics(),
        incidentApi.getAll(),
      ]);
      setStatistics(stats);
      setRecentIncidents(incidents.slice(0, 5));
    } catch (error) {
      toast.error('Failed to fetch dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="text-gray-500">Loading...</div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Incident Dashboard</h1>
        <p className="text-gray-500 mt-1">Monitor and manage all incidents</p>
      </div>

      {/* Stats Grid */}
      {statistics && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg border p-6">
            <div className="text-gray-500 text-sm mb-1">Total Incidents</div>
            <div className="text-3xl font-bold text-gray-900">{statistics.totalIncidents}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-gray-500 text-sm mb-1">Open Incidents</div>
            <div className="text-3xl font-bold text-orange-600">{statistics.openIncidents}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-gray-500 text-sm mb-1">Resolved</div>
            <div className="text-3xl font-bold text-green-600">{statistics.resolvedIncidents}</div>
          </div>
          <div className="bg-white rounded-lg border p-6">
            <div className="text-gray-500 text-sm mb-1">Avg Resolution Time</div>
            <div className="text-3xl font-bold text-gray-900">
              {Math.round(statistics.averageResolutionTimeMinutes)} <span className="text-sm font-normal">min</span>
            </div>
          </div>
        </div>
      )}

      {/* Severity Breakdown */}
      {statistics && (
        <div className="bg-white rounded-lg border p-6 mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Incidents by Severity</h2>
          <div className="grid grid-cols-5 gap-4">
            {Object.entries(statistics.bySeverity).map(([severity, count]) => {
              const colors = {
                P0: 'bg-red-500',
                P1: 'bg-orange-500',
                P2: 'bg-yellow-500',
                P3: 'bg-blue-500',
                P4: 'bg-gray-500',
              };
              const maxCount = Math.max(...Object.values(statistics.bySeverity));
              const percentage = maxCount > 0 ? (count / maxCount) * 100 : 0;
              return (
                <div key={severity}>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="font-medium text-gray-700">Severity {severity}</span>
                    <span className="text-gray-500">{count}</span>
                  </div>
                  <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                    <div
                      className={`h-full ${colors[severity as keyof typeof colors]} rounded-full transition-all duration-500`}
                      style={{ width: `${percentage}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Recent Incidents */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Recent Incidents</h2>
          <a href="/incidents" className="text-blue-600 hover:text-blue-800 text-sm">
            View all →
          </a>
        </div>

        {recentIncidents.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border p-12 text-center">
            <p className="text-gray-500">No incidents found</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentIncidents.map((incident) => (
              <IncidentCard key={incident.id} incident={incident} onUpdate={fetchDashboardData} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}