'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { incidentApi } from '@/lib/api';
import { CreateIncidentDTO } from '@/types/incident';
import toast from 'react-hot-toast';
import { ArrowLeft, Save, X, AlertCircle } from 'lucide-react';

export default function CreateIncidentPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<CreateIncidentDTO>({
    title: '',
    description: '',
    severity: 'P3',
    assignedTo: '',
  });
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    
    try {
      await incidentApi.create(formData);
      toast.success('Incident created successfully!');
      router.push('/incidents');
    } catch (error: any) {
      toast.error(error.response?.data?.message || 'Failed to create incident');
    } finally {
      setSubmitting(false);
    }
  };

  const severityOptions = [
    { value: 'P0', label: 'P0 - Critical', color: 'text-red-600', bg: 'bg-red-50' },
    { value: 'P1', label: 'P1 - High', color: 'text-orange-600', bg: 'bg-orange-50' },
    { value: 'P2', label: 'P2 - Medium', color: 'text-yellow-600', bg: 'bg-yellow-50' },
    { value: 'P3', label: 'P3 - Low', color: 'text-blue-600', bg: 'bg-blue-50' },
    { value: 'P4', label: 'P4 - Info', color: 'text-gray-600', bg: 'bg-gray-50' },
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
          <h1 className="text-2xl font-bold text-gray-900">Create New Incident</h1>
          <p className="text-sm text-gray-500 mt-0.5">Fill in the details below to create a new incident</p>
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
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Database Connection Failed"
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
                  px-3 py-2 text-sm font-medium rounded-lg border transition-all
                  ${formData.severity === opt.value 
                    ? `${opt.bg} ${opt.color} border-current shadow-sm` 
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
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the issue in detail..."
          />
        </div>

        {/* Assigned To */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1.5">
            Assigned To <span className="text-xs text-gray-400">(Optional)</span>
          </label>
          <input
            type="text"
            className="w-full border border-gray-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-6 py-2.5 rounded-lg text-sm font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {submitting ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent" />
                Creating...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Create Incident
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
        <div className="mt-4 p-3 bg-blue-50 rounded-lg flex items-start gap-2">
          <AlertCircle className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-blue-700">
            All incidents are created with <span className="font-medium">OPEN</span> status by default.
            You can assign and resolve them later from the incidents list.
          </p>
        </div>
      </form>
    </div>
  );
}