'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { incidentApi } from '@/lib/api';
import { Incident } from '@/types/incident';
import toast from 'react-hot-toast';
import { format } from 'date-fns';

export default function IncidentDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [incident, setIncident] = useState<Incident | null>(null);
  const [loading, setLoading] = useState(true);
  const [acknowledging, setAcknowledging] = useState(false);
  const [resolving, setResolving] = useState(false);

  useEffect(() => {
    fetchIncident();
  }, [params.id]);

  const fetchIncident = async () => {
    try {
      const data = await incidentApi.getById(Number(params.id));
      setIncident(data);
    } catch (error) {
      toast.error('Incident not found');
      router.push('/incidents');
    } finally {
      setLoading(false);
    }
  };

  const handleAcknowledge = async () => {
    setAcknowledging(true);
    try {
      const updated = await incidentApi.acknowledge(Number(params.id), 'current-user');
      setIncident(updated);
      toast.success('Incident acknowledged');
    } catch (error) {
      toast.error('Failed to acknowledge');
    } finally {
      setAcknowledging(false);
    }
  };

  const handleResolve = async () => {
    setResolving(true);
    try {
      const updated = await incidentApi.resolve(Number(params.id));
      setIncident(updated);
      toast.success('Incident resolved!');
    } catch (error) {
      toast.error('Failed to resolve');
    } finally {
      setResolving(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <button
          onClick={() => router.back()}
          className="text-blue-600 hover:underline"
        >
          ← Back
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{incident.title}</h1>
          <div className="flex gap-3 mt-2">
            <span className="bg-white/20 text-white px-2 py-1 rounded text-sm">
              ID: {incident.id}
            </span>
            <span className="bg-white/20 text-white px-2 py-1 rounded text-sm">
              {incident.severity}
            </span>
            <span className="bg-white/20 text-white px-2 py-1 rounded text-sm">
              {incident.status}
            </span>
          </div>
        </div>

        <div className="p-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Created At</h3>
              <p>{format(new Date(incident.createdAt), 'PPPpp')}</p>
            </div>
            {incident.resolvedAt && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Resolved At</h3>
                <p>{format(new Date(incident.resolvedAt), 'PPPpp')}</p>
              </div>
            )}
            {incident.assignedTo && (
              <div>
                <h3 className="text-sm font-medium text-gray-500">Assigned To</h3>
                <p>{incident.assignedTo}</p>
              </div>
            )}
          </div>

          {incident.description && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Description</h3>
              <p className="text-gray-700">{incident.description}</p>
            </div>
          )}

          {incident.resolutionNotes && (
            <div className="mb-6">
              <h3 className="text-sm font-medium text-gray-500 mb-2">Resolution Notes</h3>
              <p className="text-gray-700">{incident.resolutionNotes}</p>
            </div>
          )}

          <div className="flex gap-3 mt-6 pt-6 border-t">
            {incident.status === 'OPEN' && (
              <button
                onClick={handleAcknowledge}
                disabled={acknowledging}
                className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 disabled:opacity-50"
              >
                {acknowledging ? 'Acknowledging...' : 'Acknowledge Incident'}
              </button>
            )}
            
            {(incident.status === 'OPEN' || incident.status === 'ACKNOWLEDGED') && (
              <button
                onClick={handleResolve}
                disabled={resolving}
                className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 disabled:opacity-50"
              >
                {resolving ? 'Resolving...' : 'Resolve Incident'}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}