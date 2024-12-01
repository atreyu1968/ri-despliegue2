export interface ReportFilters {
  startDate: string;
  endDate: string;
  network?: string;
  center?: string;
  quarter?: string;
  department?: string;
  family?: string;
  objectives?: string[];
}

export interface ReportMetric {
  id: string;
  label: string;
  value: number;
  change?: number;
  trend?: 'up' | 'down' | 'neutral';
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ParticipationData {
  students: number;
  teachers: number;
  total: number;
  byDepartment: ChartData[];
  byFamily: ChartData[];
}

export interface RatingData {
  average: number;
  distribution: ChartData[];
  trend: ChartData[];
}

export interface NetworkReport {
  totalActions: number;
  participation: ParticipationData;
  ratings: RatingData;
  metrics: ReportMetric[];
}