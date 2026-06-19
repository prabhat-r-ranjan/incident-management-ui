'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { problemApi } from '@/lib/api';
import { Problem } from '@/types/problem';
import toast from 'react-hot-toast';
import { format } from 'date-fns';
import Link from 'next/link';
import { 
  ArrowLeft, 
  Calendar, 
  User, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  GitBranch,
  ChevronRight,
  FileText,
  AlertTriangle
} from 'lucide-react';

export default function ProblemDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [problem, setProblem] = useState<Problem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProblem();
  }, [params.id]);

  const fetchProblem = async () => {
    try {
      const data = await problemApi.getById(Number(params.id));
      setProblem(data);
    } catch (error) {
      toast.error('Problem not found');
      router.push('/problems');
    } finally {
      setLoading(false);
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
      INVESTIGATING: 'bg-yellow-100 text-yellow-700',
      KNOWN_ERROR: 'bg-orange-100 text-orange-700',
      RESOLVED: 'bg-green-100 text-green-700',
      CLOSED: 'bg-gray-100 text-gray-700',
    };
    return colors[status as keyof typeof colors] || colors.OPEN;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <div className="text-gray-500 text-sm">Loading problem details...</div>
        </div>
      </div>
    );
  }

  if (!problem) return null;

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-4xl">
      {/* Back Button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors group"
      >
        <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        <span className="text-sm font-medium">Back to Problems</span>
      </button>

      {/* Main Card */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-sm">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 px-6 py-5">
          <div className="flex items-start justify-between">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <GitBranch className="w-5 h-5 text-white/80" />
                <h1 className="text-xl font-bold text-white truncate">
                  {problem.title}
                </h1>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white font-medium">
                  #{problem.id}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getSeverityColor(problem.severity)}`}>
                  {problem.severity}
                </span>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${getStatusColor(problem.status)}`}>
                  {problem.status}
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-white/20 text-white">
                  {problem.incidentCount || 0} related incidents
                </span>
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
                  {format(new Date(problem.createdAt), 'PPP p')}
                </p>
              </div>
            </div>
            
            {problem.resolvedAt && (
              <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                <CheckCircle className="w-4 h-4 text-green-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-green-600">Resolved At</p>
                  <p className="text-sm text-gray-900">
                    {format(new Date(problem.resolvedAt), 'PPP p')}
                  </p>
                </div>
              </div>
            )}

            {problem.assignedTo && (
              <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg sm:col-span-2">
                <User className="w-4 h-4 text-blue-500 mt-0.5" />
                <div>
                  <p className="text-xs font-medium text-blue-600">Assigned To</p>
                  <p className="text-sm text-gray-900">{problem.assignedTo}</p>
                </div>
              </div>
            )}
          </div>

          {/* Description */}
          {problem.description && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <FileText className="w-4 h-4 text-gray-400" />
                <h3 className="text-sm font-medium text-gray-700">Description</h3>
              </div>
              <div className="bg-gray-50 rounded-lg p-4">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {problem.description}
                </p>
              </div>
            </div>
          )}

          {/* Root Cause */}
          {problem.rootCause && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <AlertTriangle className="w-4 h-4 text-orange-500" />
                <h3 className="text-sm font-medium text-gray-700">Root Cause</h3>
              </div>
              <div className="bg-orange-50 rounded-lg p-4 border border-orange-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {problem.rootCause}
                </p>
              </div>
            </div>
          )}

          {/* Workaround */}
          {problem.workaround && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="w-4 h-4 text-yellow-500" />
                <h3 className="text-sm font-medium text-gray-700">Workaround</h3>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {problem.workaround}
                </p>
              </div>
            </div>
          )}

          {/* Resolution */}
          {problem.resolution && (
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-2">
                <CheckCircle className="w-4 h-4 text-green-500" />
                <h3 className="text-sm font-medium text-gray-700">Resolution</h3>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <p className="text-sm text-gray-700 whitespace-pre-wrap">
                  {problem.resolution}
                </p>
              </div>
            </div>
          )}

          {/* Actions */}
          <div className="flex flex-wrap gap-3 mt-6 pt-6 border-t border-gray-200">
            <Link href={`/problems/${problem.id}/edit`}>
              <button className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <FileText className="w-4 h-4" />
                Edit Problem
              </button>
            </Link>

            <Link href={`/problems/${problem.id}/link-incident`}>
              <button className="flex items-center gap-2 bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
                <GitBranch className="w-4 h-4" />
                Link Incident
              </button>
            </Link>

            <button
              onClick={() => router.push('/problems')}
              className="flex items-center gap-2 bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors ml-auto"
            >
              <ChevronRight className="w-4 h-4" />
              All Problems
            </button>
          </div>

          {/* Status Info */}
          <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
            <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
            <p className="text-xs text-blue-700">
              {problem.status === 'OPEN' && 'This problem is open and awaiting investigation.'}
              {problem.status === 'INVESTIGATING' && 'This problem is under investigation.'}
              {problem.status === 'KNOWN_ERROR' && 'Root cause identified. Working on permanent fix.'}
              {problem.status === 'RESOLVED' && 'This problem has been resolved. Root cause fixed.'}
              {problem.status === 'CLOSED' && 'This problem has been closed.'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}