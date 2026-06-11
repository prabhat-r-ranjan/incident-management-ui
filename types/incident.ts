export interface Incident {
  id: number;
  title: string;
  description: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  status: 'OPEN' | 'ACKNOWLEDGED' | 'RESOLVED' | 'CLOSED';
  assignedTo?: string;
  createdAt: string;
  resolvedAt?: string;
  resolutionNotes?: string;
}

export interface CreateIncidentDTO {
  title: string;
  description: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  assignedTo?: string;
}

export interface Statistics {
  totalIncidents: number;
  openIncidents: number;
  resolvedIncidents: number;
  bySeverity: Record<string, number>;
  averageResolutionTimeMinutes: number;
}