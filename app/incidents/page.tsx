'use client';

import { useEffect, useState } from 'react';
import { incidentApi } from '@/lib/api';
import { Incident } from '@/types/incident';
import IncidentCard from '@/components/IncidentCard';
import toast from 'react-hot-toast';
import { PlusCircle, Filter, X, Search, SlidersHorizontal } from 'lucide-react';

export default function IncidentsPage() {
  const [incidents, setIncidents] = useState<Incident[]>([]);
  const [filter, setFilter] = useState({ status: '', severity: '' });
  const [loading, setLoading] = useState(true);
  const [showFilters, setShowFilters] = useState(false);

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
      setIncidents(data || []);
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

  const clearFilters = () => {
    setFilter({ status: '', severity: '' });
    setShowFilters(false);
  };

  const getFilterCount = () => {
    let count = 0;
    if (filter.status) count++;
    if (filter.severity) count++;
    return count;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 text-sm">Loading incidents...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 lg:p-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Incidents</h1>
          <p className="text-sm text-gray-500 mt-1">
            {incidents.length} {incidents.length === 1 ? 'incident' : 'incidents'} found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className="relative px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors flex items-center gap-2"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span className="hidden sm:inline">Filters</span>
            {getFilterCount() > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-blue-600 text-white text-[10px] rounded-full flex items-center justify-center">
                {getFilterCount()}
              </span>
            )}
          </button>
          <a
            href="/incidents/create"
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <PlusCircle className="w-4 h-4" />
            <span>New Incident</span>
          </a>
        </div>
      </div>

      {/* Filters */}
      {showFilters && (
        <div className="bg-white rounded-xl border border-gray-200 p-4 mb-6 shadow-sm animate-in slide-in-from-top-2 duration-200">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                value={filter.status}
                onChange={(e) => setFilter({ ...filter, status: e.target.value })}
              >
                <option value="">All Status</option>
                <option value="OPEN">Open</option>
                <option value="ACKNOWLEDGED">Acknowledged</option>
                <option value="RESOLVED">Resolved</option>
                <option value="CLOSED">Closed</option>
              </select>
            </div>
            <div className="flex-1">
              <label className="block text-xs font-medium text-gray-700 mb-1">Severity</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
            </div>
            <div className="flex items-end gap-2">
              <button
                onClick={clearFilters}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-lg transition-colors flex items-center gap-1"
              >
                <X className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Incidents List */}
      {incidents.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-200 p-12 text-center">
          <div className="flex flex-col items-center gap-3">
            <div className="p-3 bg-gray-100 rounded-full">
              <Search className="w-6 h-6 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900">No incidents found</h3>
            <p className="text-sm text-gray-500">
              {filter.status || filter.severity 
                ? 'Try adjusting your filters to see more results'
                : 'Create your first incident to get started'}
            </p>
            {!filter.status && !filter.severity && (
              <a
                href="/incidents/create"
                className="mt-2 text-sm text-blue-600 hover:text-blue-700 font-medium"
              >
                Create incident →
              </a>
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3">
          {incidents.map((incident) => (
            <IncidentCard
              key={incident.id}
              incident={incident}
              onUpdate={fetchIncidents}
              onResolve={handleResolve}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}
    </div>
  );
}