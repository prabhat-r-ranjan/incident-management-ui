// types/problem.ts

export interface Problem {
  id: number;
  title: string;
  description?: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  status: 'OPEN' | 'INVESTIGATING' | 'KNOWN_ERROR' | 'RESOLVED' | 'CLOSED';
  rootCause?: string;
  workaround?: string;
  resolution?: string;
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
  relatedIncidents: IncidentSummary[];
  incidentCount: number;
}

export interface IncidentSummary {
  id: number;
  title: string;
  severity: string;
  status: string;
  createdAt: string;
}

export interface CreateProblemDTO {
  title: string;
  description?: string;
  severity: 'P0' | 'P1' | 'P2' | 'P3' | 'P4';
  rootCause?: string;
  workaround?: string;
  assignedTo?: string;
  relatedIncidentIds?: number[];
}

export interface ProblemStatistics {
  totalProblems: number;
  openProblems: number;
  investigatingProblems: number;
  knownErrorProblems: number;
  resolvedProblems: number;
  closedProblems: number;
  bySeverity: Record<string, number>;
  openBySeverity: Record<string, number>;
}