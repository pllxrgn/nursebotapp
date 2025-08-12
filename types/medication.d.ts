export interface Medication {
  id: string;
  name: string;
  dosage: string;
  frequency: string;
  times: string[];
  startDate: Date;
  endDate?: Date;
  color: string;
  notes?: string;
}