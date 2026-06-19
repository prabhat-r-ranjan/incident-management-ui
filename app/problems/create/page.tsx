'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { problemApi } from '@/lib/api';
import { CreateProblemDTO } from '@/types/problem';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, AlertCircle, GitBranch } from 'lucide-react';

export default function CreateProblemPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateProblemDTO>({
    title: '',
    description: '',
    severity: 'P3',
    rootCause: '',
    workaround: '',
    assignedTo: '',
    relatedIncidentIds: [],
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate title
    if (!formData.title.trim()) {
      toast.error('Title is required');
      return;
    }

    setSubmitting(true);
    
    try {
      await problemApi.create(formData);
      toast.success('Problem created successfully!');
      router.push('/problems');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create problem');
    } finally {
      setSubmitting(false);
    }
  };

  const severityOptions = [
    { value: 'P0', label: 'P0 - Critical', color: 'text-red-600', bg: 'bg-red-50', border: 'border-red-200' },
    { value: 'P1', label: 'P1 - High', color: 'text-orange-600', bg: 'bg-orange-50', border: 'border-orange-200' },
    { value: 'P2', label: 'P2 - Medium', color: 'text-yellow-600', bg: 'bg-yellow-50', border: 'border-yellow-200' },
    { value: 'P3', label: 'P3 - Low', color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-200' },
    { value: 'P4', label: 'P4 - Info', color: 'text-gray-600', bg: 'bg-gray-50', border: 'border-gray-200' },
  ];

  return (
    <div className="p-4 sm:p-6 lg:p-8 max-w-3xl">
      {/* Header with Back Button */}
      <div className="flex items-center gap-4 mb-6">
        <button
          onClick={() => router.back()}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-5 h-5 text-gray-600" />
        </button>
        <div>
          <div className="flex items-center gap-2">
            <GitBranch className="w-6 h-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Create New Problem</h1>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">
            Track root causes and recurring issues
          </p>
        </div>
      </div>
      
      {/* Form */}
      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-200 p-6 shadow-sm">
        {/* Title */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            required
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Database Connection Pool Exhaustion"
          />
        </div>

        {/* Severity */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Severity <span className="text-red-500">*</span>
          </label>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {severityOptions.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData({ ...formData, severity: opt.value as any })}
                className={`
                  px-3 py-2 text-sm font-medium rounded-lg border-2 transition-all
                  ${formData.severity === opt.value 
                    ? `${opt.bg} ${opt.color} ${opt.border} shadow-sm` 
                    : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
                  }
                `}
              >
                {opt.value}
              </button>
            ))}
          </div>
          <p className="text-xs text-gray-500 mt-1.5">
            Selected: <span className="font-medium">
              {severityOptions.find(opt => opt.value === formData.severity)?.label}
            </span>
          </p>
        </div>

        {/* Description */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Description
          </label>
          <textarea
            rows={3}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the problem in detail..."
          />
        </div>

        {/* Root Cause */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Root Cause
          </label>
          <textarea
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            value={formData.rootCause}
            onChange={(e) => setFormData({ ...formData, rootCause: e.target.value })}
            placeholder="What is the underlying cause of this problem?"
          />
        </div>

        {/* Workaround */}
        <div className="mb-5">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Workaround
          </label>
          <textarea
            rows={2}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all resize-none"
            value={formData.workaround}
            onChange={(e) => setFormData({ ...formData, workaround: e.target.value })}
            placeholder="Temporary workaround (if any)..."
          />
        </div>

        {/* Assigned To */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assigned To <span className="text-xs text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Team member name"
          />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 bg-purple-600 hover:bg-purple-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Problem
              </>
            )}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="flex-1 bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2"
          >
            <X className="w-4 h-4" />
            Cancel
          </button>
        </div>

        {/* Info Note */}
        <div className="mt-4 p-3 bg-purple-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-purple-600 mt-0.5 flex-shrink-0" />
          <div className="text-xs text-purple-700">
            <p className="font-medium mb-0.5">What is a Problem?</p>
            <p>
              Problems track root causes of recurring incidents. 
              When you find a permanent fix, you can resolve the problem.
              Related incidents can be linked to this problem.
            </p>
          </div>
        </div>
      </form>
    </div>
  );
}