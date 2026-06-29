'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { incidentApi } from '@/lib/api';
import { Statistics, Incident } from '@/types/incident';
import toast from 'react-hot-toast';
import { formatDistanceToNow } from 'date-fns';
import { 
  AlertCircle, 
  CheckCircle, 
  Clock, 
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  ChevronRight,
  Activity,
  Zap,
  Target,
  Users,
  PlusCircle
} from 'lucide-react';

export default function Dashboard() {
  const router = useRouter();
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

  const getSeverityColor = (severity: string) => {
    const colors = {
      P0: 'bg-red-500',
      P1: 'bg-orange-500',
      P2: 'bg-yellow-500',
      P3: 'bg-blue-500',
      P4: 'bg-gray-400',
    };
    return colors[severity as keyof typeof colors] || 'bg-gray-400';
  };

  const getSeverityIcon = (severity: string) => {
    const icons = {
      P0: <AlertCircle className="w-4 h-4 text-red-500" />,
      P1: <AlertTriangle className="w-4 h-4 text-orange-500" />,
      P2: <AlertTriangle className="w-4 h-4 text-yellow-500" />,
      P3: <Activity className="w-4 h-4 text-blue-500" />,
      P4: <Activity className="w-4 h-4 text-gray-400" />,
    };
    return icons[severity as keyof typeof icons] || icons.P4;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: 'bg-red-50 text-red-700 border-red-200',
      ACKNOWLEDGED: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      RESOLVED: 'bg-green-50 text-green-700 border-green-200',
      CLOSED: 'bg-gray-50 text-gray-700 border-gray-200',
    };
    return styles[status as keyof typeof styles] || styles.OPEN;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-96">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 text-sm">Loading dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Dashboard</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Overview of your incident management system</p>
          </div>
          <button 
            onClick={() => router.push('/incidents/new')}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Incident</span>
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      {statistics && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Incidents</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">{statistics.totalIncidents}</p>
              </div>
              <div className="bg-blue-50 dark:bg-blue-900/30 p-3 rounded-lg">
                <AlertCircle className="w-6 h-6 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-600">12%</span>
              <span className="text-xs text-gray-400">vs last 7 days</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Open Incidents</p>
                <p className="text-2xl font-bold text-orange-600 dark:text-orange-400 mt-1">{statistics.openIncidents}</p>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/30 p-3 rounded-lg">
                <AlertTriangle className="w-6 h-6 text-orange-600 dark:text-orange-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-orange-500" />
              <span className="text-xs font-medium text-orange-600">8%</span>
              <span className="text-xs text-gray-400">vs last 7 days</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Resolved</p>
                <p className="text-2xl font-bold text-green-600 dark:text-green-400 mt-1">{statistics.resolvedIncidents}</p>
              </div>
              <div className="bg-green-50 dark:bg-green-900/30 p-3 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600 dark:text-green-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingUp className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-600">16%</span>
              <span className="text-xs text-gray-400">vs last 7 days</span>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-lg transition-all hover:border-gray-300 dark:hover:border-gray-600">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Avg Resolution Time</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">
                  {Math.round(statistics.averageResolutionTimeMinutes)}<span className="text-sm font-normal ml-1 text-gray-500">min</span>
                </p>
              </div>
              <div className="bg-purple-50 dark:bg-purple-900/30 p-3 rounded-lg">
                <Clock className="w-6 h-6 text-purple-600 dark:text-purple-400" />
              </div>
            </div>
            <div className="flex items-center gap-1 mt-3">
              <TrendingDown className="w-4 h-4 text-green-500" />
              <span className="text-xs font-medium text-green-600">5%</span>
              <span className="text-xs text-gray-400">vs last 7 days</span>
            </div>
          </div>
        </div>
      )}

      {/* Two Column Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        {/* Severity Breakdown */}
        {statistics && (
          <div className="lg:col-span-1 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white mb-4">Incidents by Severity</h2>
            <div className="space-y-4">
              {Object.entries(statistics.bySeverity).map(([severity, count]) => {
                const total = statistics.totalIncidents || 1;
                const percentage = Math.round((count / total) * 100);
                const color = getSeverityColor(severity);
                const severityLabels = {
                  P0: 'Critical',
                  P1: 'High',
                  P2: 'Medium',
                  P3: 'Low',
                  P4: 'Info'
                };
                
                return (
                  <div key={severity}>
                    <div className="flex items-center justify-between text-sm mb-1">
                      <div className="flex items-center gap-2">
                        {getSeverityIcon(severity)}
                        <span className="font-medium text-gray-700 dark:text-gray-300">
                          {severity} - {severityLabels[severity as keyof typeof severityLabels]}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-semibold text-gray-900 dark:text-white">{count}</span>
                        <span className="text-xs text-gray-400">({percentage}%)</span>
                      </div>
                    </div>
                    <div className="h-1.5 bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                      <div
                        className={`h-full ${color} rounded-full transition-all duration-500`}
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
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-semibold text-gray-900 dark:text-white">Recent Incidents</h2>
            <a href="/incidents" className="text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 font-medium flex items-center gap-1">
              View all
              <ChevronRight className="w-4 h-4" />
            </a>
          </div>

          {recentIncidents.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400 text-sm">No incidents found</p>
            </div>
          ) : (
            <div className="space-y-3">
              {recentIncidents.map((incident) => (
                <div
                  key={incident.id}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors border border-transparent hover:border-gray-200 dark:hover:border-gray-600"
                >
                  <div className="flex items-center gap-3 flex-1 min-w-0">
                    <div className={`w-1.5 h-8 rounded-full ${getSeverityColor(incident.severity)}`} />
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className={`text-xs px-2 py-0.5 rounded border font-medium ${getStatusBadge(incident.status)}`}>
                          {incident.status}
                        </span>
                        <span className="text-xs text-gray-400">
                          {incident.createdAt ? formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true }) : 'Unknown'}
                        </span>
                      </div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white truncate mt-1">
                        {incident.title || 'Untitled'}
                      </p>
                      {incident.assignedTo && (
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Assigned to: {incident.assignedTo}</p>
                      )}
                    </div>
                  </div>
                  <button className="p-1.5 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded transition-colors ml-2">
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Pro Tip Section */}
      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-xl border border-blue-100 dark:border-blue-800/30 p-6">
        <div className="flex items-start gap-3">
          <div className="p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex-shrink-0">
            <Zap className="w-5 h-5 text-blue-600 dark:text-blue-400" />
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 dark:text-white">Pro Tip</h3>
            <p className="text-sm text-gray-600 dark:text-gray-300 mt-0.5">
              Create automation rules to streamline incident resolution and reduce response time.
            </p>
            <button className="mt-2 text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-medium">
              Explore automation →
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}