export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export type MealTiming = 'before' | 'with' | 'after';

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface BaseSchedule {
  times: string[];
  mealRelation?: {
    meal: 'breakfast' | 'lunch' | 'dinner';
    timing: MealTiming;
    offsetMinutes?: number;
  }[];
  timePreferences?: TimeOfDay[];
}

export interface DailySchedule extends BaseSchedule {
  type: 'daily';
}

export interface WeeklySchedule extends BaseSchedule {
  type: 'weekly';
  days: DayOfWeek[];
}

export interface MonthlySchedule extends BaseSchedule {
  type: 'monthly';
  daysOfMonth: number[];
}

export interface CustomSchedule extends BaseSchedule {
  type: 'custom';
  interval: number; // every X days
}

export type Schedule = DailySchedule | WeeklySchedule | MonthlySchedule | CustomSchedule;

export interface Duration {
  type: 'ongoing' | 'endDate' | 'numberOfDays' | 'numberOfWeeks';
  value?: number;
  endDate?: Date;
}

export type MedicationForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'syrup' | 'powder' | 'inhaler' | 'drops' | 'spray' | 'cream' | 'patch' | 'other';

export interface DosageInfo {
  amount: string;
  unit: string;
  form: MedicationForm;
}

export interface Storage {
  temperature?: string;
  light?: string;
  special?: string;
}

export interface RefillReminder {
  enabled: boolean;
  threshold: number;
  unit: 'days';
}

export interface Medication {
  id?: string;
  name: string;
  dosage: DosageInfo;
  schedule: Schedule;
  duration: Duration;
  startDate?: Date;
  color: string;
  notes?: string;
  status?: { taken: boolean; date: Date; time: string }[];
  refillReminder: RefillReminder;
  sideEffects: string[];
  interactions: string[];
  storage?: Storage;
}

