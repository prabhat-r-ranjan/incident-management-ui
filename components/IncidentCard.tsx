'use client';

import { Incident } from '@/types/incident';
import { formatDistanceToNow } from 'date-fns';
import Link from 'next/link';
import { incidentApi } from '@/lib/api';
import toast from 'react-hot-toast';

interface Props {
  incident: Incident;
  onUpdate?: () => void;
}

export default function IncidentCard({ incident, onUpdate }: Props) {
  const getSeverityBadge = (severity: string) => {
    const styles = {
      P0: 'bg-red-100 text-red-800',
      P1: 'bg-orange-100 text-orange-800',
      P2: 'bg-yellow-100 text-yellow-800',
      P3: 'bg-blue-100 text-blue-800',
      P4: 'bg-gray-100 text-gray-800',
    };
    return styles[severity as keyof typeof styles] || styles.P4;
  };

  const getStatusBadge = (status: string) => {
    const styles = {
      OPEN: 'bg-red-100 text-red-800',
      ACKNOWLEDGED: 'bg-yellow-100 text-yellow-800',
      RESOLVED: 'bg-green-100 text-green-800',
      CLOSED: 'bg-gray-100 text-gray-800',
    };
    return styles[status as keyof typeof styles] || styles.OPEN;
  };

  const handleResolve = async () => {
    if (confirm('Resolve this incident?')) {
      try {
        await incidentApi.resolve(incident.id);
        toast.success('Incident resolved');
        onUpdate?.();
      } catch {
        toast.error('Failed to resolve');
      }
    }
  };

  const handleDelete = async () => {
    if (confirm('Delete this incident?')) {
      try {
        await incidentApi.delete(incident.id);
        toast.success('Incident deleted');
        onUpdate?.();
      } catch {
        toast.error('Failed to delete');
      }
    }
  };

  return (
    <div className="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2 mb-2">
            <span className={`text-xs px-2 py-1 rounded font-medium ${getSeverityBadge(incident.severity)}`}>
              {incident.severity}
            </span>
            <span className={`text-xs px-2 py-1 rounded font-medium ${getStatusBadge(incident.status)}`}>
              {incident.status}
            </span>
            <span className="text-xs text-gray-400">
              {formatDistanceToNow(new Date(incident.createdAt), { addSuffix: true })}
            </span>
          </div>

          <Link href={`/incidents/${incident.id}`}>
            <h3 className="text-lg font-medium text-gray-900 hover:text-blue-600 cursor-pointer mb-1">
              {incident.title}
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

          {incident.status !== 'RESOLVED' && (
            <button
              onClick={handleResolve}
              className="p-2 text-gray-500 hover:text-green-600 rounded"
              title="Resolve"
            >
              ✅
            </button>
          )}

          <button
            onClick={handleDelete}
            className="p-2 text-gray-500 hover:text-red-600 rounded"
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>
    </div>
  );
}