'use client';

import { Incident } from '@/types/incident';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';

interface Props {
  incident: Incident;
  onUpdate?: () => void;
  onResolve?: (id: number) => void;
  onDelete?: (id: number) => void;
}

export default function IncidentCard({ incident, onUpdate, onResolve, onDelete }: Props) {
  // Safety check - if incident is undefined, don't render
  if (!incident) {
    return null;
  }

  const getSeverityBadge = (severity: string) => {
    const styles: Record<string, string> = {
      P0: 'bg-red-100 text-red-800',
      P1: 'bg-orange-100 text-orange-800',
      P2: 'bg-yellow-100 text-yellow-800',
      P3: 'bg-blue-100 text-blue-800',
      P4: 'bg-gray-100 text-gray-800',
    };
    return styles[severity] || styles.P4;
  };

  const getStatusBadge = (status: string) => {
    const styles: Record<string, string> = {
      OPEN: 'bg-red-100 text-red-800',
      ACKNOWLEDGED: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return styles[status] || styles.OPEN;
  };

  const handleResolve = () => {
    if (onResolve && incident.id) {
      onResolve(incident.id);
    }
  };

  const handleDelete = () => {
    if (onDelete && incident.id) {
      onDelete(incident.id);
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded font-medium ${getSeverityBadge(incident.severity)}`}>
              {incident.severity || 'N/A'}
            </span>
            <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusBadge(incident.status)}`}>
              {incident.status || 'N/A'}
            </span>
            <span className="text-xs text-gray-400">
              {incident.createdAt ? formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true }) : 'Unknown'}
            </span>
          </div>

          <Link href={`/incidents/${incident.id}`}>
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer mb-1">
              {incident.title || 'Untitled'}
            </h3>
          </Link>

          {incident.description && (
            <p className="text-gray-600 text-sm line-clamp-2">{incident.description}</p>
          )}

          {incident.assignedTo && (
            <div className="mt-2 text-xs text-gray-500">Assigned to: {incident.assignedTo}</div>
          )}
        </div>

        <div className="flex gap-1 ml-4">
          <Link href={`/incidents/${incident.id}`}>
            <button className="p-2 text-gray-500 hover:text-blue-600 rounded" title="View">
              👁️
            </button>
          </Link>

          {incident.status !== 'RESOLVED' && onResolve && (
            <button
              onClick={handleResolve}
              className="p-2 text-gray-500 hover:text-green-600 rounded"
              title="Resolve"
            >
              ✅
            </button>
          )}

          {onDelete && (
            <button
              onClick={handleDelete}
              className="p-2 text-gray-500 hover:text-red-600 rounded"
              title="Delete"
            >
              🗑️
            </button>
          )}
        </div>
      </div>
    </div>
  );
}