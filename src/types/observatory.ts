export type ObservatoryItemType = 'practice' | 'research' | 'resource';

export interface ObservatoryItem {
  id: string;
  type: ObservatoryItemType;
  network: string;
  title: string;
  topic: string;
  description: string;
  resourceUrl: string;
  publishDate: string;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ObservatoryFormData extends Omit<ObservatoryItem, 'id' | 'createdAt' | 'updatedAt'> {}

export interface ObservatoryFilters {
  type?: ObservatoryItemType;
  network?: string;
  topic?: string;
  startDate?: string;
  endDate?: string;
  tags?: string[];
}

export interface CsvImportData {
  type: string;
  network: string;
  title: string;
  topic: string;
  description: string;
  resourceUrl: string;
  publishDate: string;
  tags: string;
}

export interface ImportError {
  row: number;
  field: string;
  message: string;
}