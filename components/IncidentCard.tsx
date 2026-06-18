'use client';

import { Incident } from '@/types/incident';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { AlertCircle, AlertTriangle, CheckCircle, Clock, ChevronRight } from 'lucide-react';

interface Props {
  incident: Incident;
  onUpdate?: () => void;
  onResolve?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function IncidentCard({ incident, onUpdate, onResolve, onDelete }: Props) {
  if (!incident) return null;

  const getSeverityStyle = (severity: string) => {
    const styles: Record<string, { color: string; bg: string; icon: React.ReactNode }> = {
      P0: { 
        color: 'text-red-700', 
        bg: 'bg-red-50 border-red-200',
        icon: <AlertCircle className="w-4 h-4 text-red-500" />
      },
      P1: { 
        color: 'text-orange-700', 
        bg: 'bg-orange-50 border-orange-200',
        icon: <AlertTriangle className="w-4 h-4 text-orange-500" />
      },
      P2: { 
        color: 'text-yellow-700', 
        bg: 'bg-yellow-50 border-yellow-200',
        icon: <AlertTriangle className="w-4 h-4 text-yellow-500" />
      },
      P3: { 
        color: 'text-blue-700', 
        bg: 'bg-blue-50 border-blue-200',
        icon: <AlertCircle className="w-4 h-4 text-blue-500" />
      },
      P4: { 
        color: 'text-gray-700', 
        bg: 'bg-gray-50 border-gray-200',
        icon: <Clock className="w-4 h-4 text-gray-500" />
      },
    };
    return styles[severity] || styles.P4;
  };

  const getStatusStyle = (status: string) => {
    const styles: Record<string, { color: string; bg: string; label: string }> = {
      OPEN: { color: 'text-red-700', bg: 'bg-red-50', label: 'Open' },
      ACKNOWLEDGED: { color: 'text-yellow-700', bg: 'bg-yellow-50', label: 'Acknowledged' },
      RESOLVED: { color: 'text-green-700', bg: 'bg-green-50', label: 'Resolved' },
      CLOSED: { color: 'text-gray-700', bg: 'bg-gray-50', label: 'Closed' },
    };
    return styles[status] || styles.OPEN;
  };

  const severityStyle = getSeverityStyle(incident.severity);
  const statusStyle = getStatusStyle(incident.status);

  return (
    <div className="group bg-white rounded-lg border border-gray-200 hover:border-gray-300 transition-all hover:shadow-md p-4">
      <div className="flex items-start justify-between gap-4">
        {/* Left side - Main content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <div className={`flex items-center gap-1.5 text-xs px-2.5 py-1 rounded-full border font-medium ${severityStyle.bg}`}>
              {severityStyle.icon}
              <span className={severityStyle.color}>Severity {incident.severity}</span>
            </div>
            <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${statusStyle.bg} ${statusStyle.color}`}>
              {statusStyle.label}
            </span>
            <span className="text-xs text-gray-400">
              {incident.createdAt ? formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true }) : 'Unknown'}
            </span>
          </div>

          <Link href={`/incidents/${incident.id}`}>
            <h3 className="text-base font-medium text-gray-900 hover:text-blue-600 transition-colors cursor-pointer mb-1">
              {incident.title || 'Untitled Incident'}
            </h3>
          </Link>

          {incident.description && (
            <p className="text-sm text-gray-500 line-clamp-2">{incident.description}</p>
          )}

          {incident.assignedTo && (
            <div className="mt-2 flex items-center gap-1 text-xs text-gray-500">
              <span>Assigned to:</span>
              <span className="font-medium text-gray-700">{incident.assignedTo}</span>
            </div>
          )}
        </div>

        {/* Right side - Actions */}
        <div className="flex items-center gap-1 flex-shrink-0">
          <Link href={`/incidents/${incident.id}`}>
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
}