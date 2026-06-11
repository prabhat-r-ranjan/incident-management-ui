import axios from 'axios';
import { Incident, CreateIncidentDTO, Statistics } from '@/types/incident';

const API_BASE_URL = 'http://localhost:8081/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

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
    const response = await api.post(`/incidents/${id}/acknowledge?acknowledgedBy=${assignedTo}`);
    return response.data;
  },

  // Resolve incident
  resolve: async (id: number): Promise<Incident> => {
    const response = await api.put(`/incidents/${id}/resolve`);
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
  search: async (params: { status?: string; severity?: string }): Promise<Incident[]> => {
    const queryParams = new URLSearchParams();
    if (params.status) queryParams.append('status', params.status);
    if (params.severity) queryParams.append('severity', params.severity);
    const response = await api.get(`/incidents/search?${queryParams.toString()}`);
    return response.data;
  },
};