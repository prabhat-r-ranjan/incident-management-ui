'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { incidentApi } from '@/lib/api';
import { Incident } from '@/types/incident';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  FileText,
  ChevronRight,
  Send,
  Check
} from 'lucide-react';

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

  const getSeverityColor = (severity: string) => {
    const colors = {
      P0: 'bg-red-500 text-white',
      P1: 'bg-orange-500 text-white',
      P2: 'bg-yellow-500 text-white',
      P3: 'bg-blue-500 text-white',
      P4: 'bg-gray-500 text-white',
    };
    return colors[severity as keyof typeof colors] || colors.P4;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      OPEN: 'bg-red-100 text-red-700',
      ACKNOWLEDGED: 'bg-yellow-100 text-yellow-700',
      RESOLVED: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || colors.OPEN;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      OPEN: <AlertCircle className="w-4 h-4" />,
      ACKNOWLEDGED: <Clock className="w-4 h-4" />,
      RESOLVED: <CheckCircle className="w-4 h-4" />,
      CLOSED: <Check className="w-4 h-4" />,
    };
    return icons[status as keyof typeof icons] || icons.OPEN;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 text-sm">Loading incident details...</div>
        </div>
      </div>
    );
  }

  if (!incident) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Back to Incidents</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold text-white truncate">
                {incident.title}
              </h1>
              <div className="flex items-center gap-2 mt-2 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-medium">
                  #{incident.id}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSeverityColor(incident.severity)}`}>
                  {incident.severity}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium flex items-center gap-1 ${getStatusColor(incident.status)}`}>
                  {getStatusIcon(incident.status)}
                  {incident.status}
                </span>
              </div>
            </div>
            <div className="flex-shrink-0 ml-4">
              <div className="w-10 h-10 bg-white/20 rounded-lg flex items-center justify-center">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* Body */}
        <div className="p-6">
          {/* Meta Information */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <div className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg">
              <Calendar className="w-4 h-4 text-gray-400 mt-0.5" />
              <div>
                <p className="text-xs font-medium text-gray-500">Created At</p>
                <p className="text-sm text-gray-900">
                  {format(new Date(incident.createdAt), 'PPP p')}
                </p>
              </div>
            </div>
            
            {incident.resolvedAt && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-green-600">Resolved At</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(incident.resolvedAt), 'PPP p')}
                  </p>
                </div>
              </div>
            )}

            {incident.assignedTo && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg sm:col-span-2">
                <User className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-600">Assigned To</p>
                  <p className="text-sm text-gray-900">{incident.assignedTo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {incident.description && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {incident.description}
                </p>
              </div>
            </div>
          )}

          {/* Resolution Notes */}
          {incident.resolutionNotes && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-medium text-gray-700">Resolution Notes</h3>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {incident.resolutionNotes}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            {incident.status === 'OPEN' && (
              <button
                onClick={handleAcknowledge}
                disabled={acknowledging}
                className="flex items-center gap-2 bg-yellow-500 hover:bg-yellow-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {acknowledging ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Acknowledging...
                  </>
                ) : (
                  <>
                    <Clock className="w-4 h-4" />
                    Acknowledge Incident
                  </>
                )}
              </button>
            )}
            
            {(incident.status === 'OPEN' || incident.status === 'ACKNOWLEDGED') && (
              <button
                onClick={handleResolve}
                disabled={resolving}
                className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {resolving ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                    Resolving...
                  </>
                ) : (
                  <>
                    <CheckCircle className="w-4 h-4" />
                    Resolve Incident
                  </>
                )}
              </button>
            )}

            <button
              onClick={() => router.push('/incidents')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto"
            >
              <ChevronRight className="w-4 h-4" />
              View All Incidents
            </button>
          </div>

          {/* Status Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              {incident.status === 'OPEN' && 'This incident is currently open and awaiting acknowledgment.'}
              {incident.status === 'ACKNOWLEDGED' && 'This incident has been acknowledged and is being investigated.'}
              {incident.status === 'RESOLVED' && 'This incident has been resolved. The resolution notes provide details.'}
              {incident.status === 'CLOSED' && 'This incident has been closed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}