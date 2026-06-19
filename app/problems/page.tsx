'use client';

import { useEffect, useState } from 'react';
import { problemApi } from '@/lib/api';
import { Problem } from '@/types/problem';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { 
  AlertCircle, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  PlusCircle,
  ChevronRight,
  GitBranch,
  Search
} from 'lucide-react';

export default function ProblemsPage() {
  const [problems, setProblems] = useState<Problem[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState({ status: '', severity: '' });

  useEffect(() => {
    fetchProblems();
  }, [filter]);

  const fetchProblems = async () => {
    setLoading(true);
    try {
      const data = await problemApi.getAll();
      setProblems(data || []);
    } catch (error) {
      toast.error('Failed to fetch problems');
      setProblems([]);
    } finally {
      setLoading(false);
    }
  };

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      P0: 'bg-red-100 text-red-700',
      P1: 'bg-orange-100 text-orange-700',
      P2: 'bg-yellow-100 text-yellow-700',
      P3: 'bg-blue-100 text-blue-700',
      P4: 'bg-gray-100 text-gray-700',
    };
    return styles[severity] || styles.P4;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, { bg: string; color: string; icon: React.ReactNode }> = {
      OPEN: { bg: 'bg-red-100', color: 'text-red-700', icon: <AlertCircle className="w-3 h-3" /> },
      INVESTIGATING: { bg: 'bg-yellow-100', color: 'text-yellow-700', icon: <Clock className="w-3 h-3" /> },
      KNOWN_ERROR: { bg: 'bg-orange-100', color: 'text-orange-700', icon: <AlertTriangle className="w-3 h-3" /> },
      RESOLVED: { bg: 'bg-green-100', color: 'text-green-700', icon: <CheckCircle className="w-3 h-3" /> },
      CLOSED: { bg: 'bg-gray-100', color: 'text-gray-700', icon: <CheckCircle className="w-3 h-3" /> },
    };
    return styles[status] || styles.OPEN;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 text-sm">Loading problems...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-blue-600" />
            <h1 className="text-2xl font-bold text-gray-900">Problems</h1>
            <span className="text-sm text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">
              {problems.length}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Track root causes and recurring issues
          </p>
        </div>
        <Link
          href="/problems/create"
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
        >
          <PlusCircle className="w-4 h-4" />
          New Problem
        </Link>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6">
        <div className="flex flex-wrap gap-4">
          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="INVESTIGATING">Investigating</option>
            <option value="KNOWN_ERROR">Known Error</option>
            <option value="RESOLVED">Resolved</option>
            <option value="CLOSED">Closed</option>
          </select>

          <select
            className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
          >
            <option value="">All Severity</option>
            <option value="P0">P0 - Critical</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Medium</option>
            <option value="P3">P3 - Low</option>
            <option value="P4">P4 - Info</option>
          </select>

          <button
            onClick={() => setFilter({ status: '', severity: '' })}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Problems List */}
      {problems.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <GitBranch className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No problems found</h3>
            <p className="text-sm text-gray-500">
              {filter.status || filter.severity 
                ? 'Try adjusting your filters to see more results'
                : 'Create a problem to track recurring issues'}
            </p>
            {!filter.status && !filter.severity && (
              <Link
                href="/problems/create"
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create problem →
              </Link>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {problems.map((problem) => {
            const statusStyle = getStatusBadge(problem.status);
            return (
              <div
                key={problem.id}
                className="bg-white rounded-xl border border-gray-200 hover:border-gray-300 hover:shadow-md transition-all p-4"
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Left - Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-2 flex-wrap">
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSeverityBadge(problem.severity)}`}>
                        Severity {problem.severity}
                      </span>
                      <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${statusStyle.bg} ${statusStyle.color}`}>
                        {statusStyle.icon}
                        {problem.status}
                      </span>
                      <span className="text-xs text-gray-400">
                        {problem.incidentCount || 0} related incidents
                      </span>
                    </div>

                    <Link href={`/problems/${problem.id}`}>
                      <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-1">
                        {problem.title}
                      </h3>
                    </Link>

                    {problem.description && (
                      <p className="text-sm text-gray-500 line-clamp-2">{problem.description}</p>
                    )}

                    <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                      {problem.assignedTo && (
                        <span>Assigned to: {problem.assignedTo}</span>
                      )}
                      <span>
                        Created: {new Date(problem.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Right - Actions */}
                  <div className="flex items-center gap-1 flex-shrink-0">
                    <Link href={`/problems/${problem.id}`}>
                      <button 
                        className="p-1.5 text-gray-400 hover:text-blue-600 rounded-lg hover:bg-blue-50 transition-colors"
                        title="View details"
                      >
                        <ChevronRight className="w-5 h-5" />
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}