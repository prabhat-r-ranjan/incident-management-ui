'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { incidentApi } from '@/lib/api';
import { CreateIncidentDTO } from '@/types/incident';
import toast from 'react-hot-toast';

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
    { value: 'P0', label: 'P0 - Critical', color: 'text-red-600' },
    { value: 'P1', label: 'P1 - High', color: 'text-orange-600' },
    { value: 'P2', label: 'P2 - Medium', color: 'text-yellow-600' },
    { value: 'P3', label: 'P3 - Low', color: 'text-blue-600' },
    { value: 'P4', label: 'P4 - Info', color: 'text-gray-600' },
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Create New Incident</h1>
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Title *</label>
          <input
            type="text"
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.title}
            onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            placeholder="e.g., Database Connection Failed"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Severity *</label>
          <select
            required
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.severity}
            onChange={(e) => setFormData({ ...formData, severity: e.target.value as any })}
          >
            {severityOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className={opt.color}>
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Description</label>
          <textarea
            rows={4}
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.description}
            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            placeholder="Describe the issue in detail..."
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium mb-2">Assigned To (Optional)</label>
          <input
            type="text"
            className="w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            value={formData.assignedTo}
            onChange={(e) => setFormData({ ...formData, assignedTo: e.target.value })}
            placeholder="Team member name"
          />
        </div>

        <div className="flex gap-3">
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 transition-colors"
          >
            {submitting ? 'Creating...' : 'Create Incident'}
          </button>
          <button
            type="button"
            onClick={() => router.back()}
            className="bg-gray-500 text-white px-6 py-2 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}