'use client';

import { useEffect, useState } from 'react';
import { incidentApi } from '@/lib/api';
import { Incident } from '@/types/incident';
import IncidentCard from '@/components/IncidentCard';
import toast from 'react-hot-toast';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState({ status: '', severity: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchIncidents();
  }, [filter]);

  const fetchIncidents = async () => {
    setLoading(true);
    try {
      let data;
      if (filter.status || filter.severity) {
        data = await incidentApi.search(filter);
      } else {
        data = await incidentApi.getAll();
      }
      setIncidents(data || []); // Ensure it's always an array
    } catch (error) {
      toast.error('Failed to fetch incidents');
      setIncidents([]);
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (id: number) => {
    try {
      await incidentApi.resolve(id);
      toast.success('Incident resolved!');
      fetchIncidents();
    } catch (error) {
      toast.error('Failed to resolve incident');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure you want to delete this incident?')) {
      try {
        await incidentApi.delete(id);
        toast.success('Incident deleted');
        fetchIncidents();
      } catch (error) {
        toast.error('Failed to delete incident');
      }
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-900">Incidents</h1>
        <a
          href="/incidents/create"
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          + Create Incident
        </a>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-lg border p-4 mb-6">
        <div className="flex gap-4">
          <select
            className="border rounded-md px-3 py-2"
            value={filter.status}
            onChange={(e) => setFilter({ ...filter, status: e.target.value })}
          >
            <option value="">All Status</option>
            <option value="OPEN">Open</option>
            <option value="ACKNOWLEDGED">Acknowledged</option>
            <option value="RESOLVED">Resolved</option>
          </select>
          <select
            className="border rounded-md px-3 py-2"
            value={filter.severity}
            onChange={(e) => setFilter({ ...filter, severity: e.target.value })}
          >
            <option value="">All Severity</option>
            <option value="P0">P0 - Critical</option>
            <option value="P1">P1 - High</option>
            <option value="P2">P2 - Medium</option>
            <option value="P3">P3 - Low</option>
          </select>
          <button
            onClick={() => setFilter({ status: '', severity: '' })}
            className="text-gray-600 hover:text-gray-800"
          >
            Clear Filters
          </button>
        </div>
      </div>

      {/* Incidents List */}
      <div className="space-y-4">
        {incidents.length === 0 ? (
          <div className="bg-gray-50 rounded-lg border p-12 text-center">
            <p className="text-gray-500">No incidents found</p>
          </div>
        ) : (
          incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onUpdate={fetchIncidents}
              onResolve={handleResolve}
              onDelete={handleDelete}
            />
          ))
        )}
      </div>
    </div>
  );
}