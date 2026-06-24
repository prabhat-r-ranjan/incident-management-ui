import axios from 'axios';
import { Incident, CreateIncidentDTO, Statistics } from '@/types/incident';
import { Problem, CreateProblemDTO, ProblemStatistics } from '@/types/problem';

const API_BASE_URL = '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// ============ INCIDENT API ============
export const incidentApi = {
  // Get all incidents
  getAll: async (): Promise<Incident[]> => {
    const response = await api.get('/incidents');
    return response.data;
  },

  // Get single incident
  getById: async (id: number): Promise<Incident> => {
    const response = await api.get(`/incidents/${id}`);
    return response.data;
  },

  // Create incident
  create: async (data: CreateIncidentDTO): Promise<Incident> => {
    const response = await api.post('/incidents', data);
    return response.data;
  },

  // Acknowledge incident
  acknowledge: async (id: number, assignedTo: string): Promise<Incident> => {
    const response = await api.put(`/incidents/${id}/acknowledge?assignedTo=${assignedTo}`);
    return response.data;
  },

  // Resolve incident
  resolve: async (id: number): Promise<Incident> => {
    const response = await api.put(`/incidents/${id}/resolve`);
    return response.data;
  },

  // Update incident
  update: async (id: number, data: Partial<Incident>): Promise<Incident> => {
    const response = await api.put(`/incidents/${id}`, data);
    return response.data;
  },

  // Delete incident
  delete: async (id: number): Promise<void> => {
    await api.delete(`/incidents/${id}`);
  },

  // Get statistics
  getStatistics: async (): Promise<Statistics> => {
    const response = await api.get('/incidents/stats');
    return response.data;
  },

  // Search incidents
  search: async (params: { status?: string; severity?: string; title?: string }): Promise<Incident[]> => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.title) queryParams.append('title', params.title);
    const response = await api.get(`/incidents/search?${queryParams.toString()}`);
    return response.data;
  },
};

// ============ PROBLEM API ============
export const problemApi = {
  // Get all problems
  getAll: async (): Promise<Problem[]> => {
    const response = await api.get('/problems');
    return response.data;
  },

  // Get single problem
  getById: async (id: number): Promise<Problem> => {
    const response = await api.get(`/problems/${id}`);
    return response.data;
  },

  // Create problem
  create: async (data: CreateProblemDTO): Promise<Problem> => {
    const response = await api.post('/problems', data);
    return response.data;
  },

  // Convert incident to problem
  convertFromIncident: async (incidentId: number): Promise<Problem> => {
    const response = await api.post(`/problems/convert/${incidentId}`);
    return response.data;
  },

  // Update problem
  update: async (id: number, data: CreateProblemDTO): Promise<Problem> => {
    const response = await api.put(`/problems/${id}`, data);
    return response.data;
  },

  // Update problem status
  updateStatus: async (id: number, status: string): Promise<Problem> => {
    const response = await api.patch(`/problems/${id}/status?status=${status}`);
    return response.data;
  },

  // Resolve problem
  resolve: async (id: number, resolution: string): Promise<Problem> => {
    const response = await api.patch(`/problems/${id}/resolve?resolution=${encodeURIComponent(resolution)}`);
    return response.data;
  },

  // Link incident to problem
  linkIncident: async (problemId: number, incidentId: number): Promise<Problem> => {
    const response = await api.post(`/problems/${problemId}/link/${incidentId}`);
    return response.data;
  },

  // Unlink incident from problem
  unlinkIncident: async (problemId: number, incidentId: number): Promise<Problem> => {
    const response = await api.delete(`/problems/${problemId}/unlink/${incidentId}`);
    return response.data;
  },

  // Get related incidents for a problem
  getRelatedIncidents: async (problemId: number): Promise<Incident[]> => {
    const response = await api.get(`/problems/${problemId}/incidents`);
    return response.data;
  },

  // Delete problem
  delete: async (id: number): Promise<void> => {
    await api.delete(`/problems/${id}`);
  },

  // Get problem statistics
  getStatistics: async (): Promise<ProblemStatistics> => {
    const response = await api.get('/problems/stats');
    return response.data;
  },

  // Search problems
  search: async (params: { status?: string; severity?: string; title?: string; assignedTo?: string }): Promise<Problem[]> => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    if (params.title) queryParams.append('title', params.title);
    if (params.assignedTo) queryParams.append('assignedTo', params.assignedTo);
    const response = await api.get(`/problems/search?${queryParams.toString()}`);
    return response.data;
  },
};

export default api;