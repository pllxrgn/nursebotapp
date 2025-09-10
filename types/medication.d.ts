export type DayOfWeek = 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';

export type TimeOfDay = 'morning' | 'afternoon' | 'evening' | 'bedtime';

export type MealTiming = 'before' | 'with' | 'after';

export type FrequencyType = 'daily' | 'weekly' | 'monthly' | 'custom';

export interface Schedule {
  frequency: FrequencyType;
  days?: DayOfWeek[];
  frequency: FrequencyType;
  times: string[];
  mealRelation?: {
    meal: 'breakfast' | 'lunch' | 'dinner';
    timing: MealTiming;
    offsetMinutes?: number;
  }[];
  timePreferences?: TimeOfDay[];
}

export interface Duration {
  type: 'ongoing' | 'endDate' | 'numberOfDays' | 'numberOfWeeks';
  value?: number;
  endDate?: Date;
}

export type MedicationForm = 'tablet' | 'capsule' | 'liquid' | 'injection' | 'syrup' | 'powder' | 'inhaler' | 'drops' | 'spray' | 'cream' | 'patch' | 'other';

export interface DosageInfo {
  amount: string;
  unit: string;
  form?: MedicationForm;
  instructions?: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: DosageInfo;
  frequency: {
    type: FrequencyType;
    interval?: number; // For custom frequency (every X days)
    schedule: Schedule;
  };
  duration: Duration;
  startDate: Date;
  color: string;
  notes?: string;
  refillReminder?: {
    enabled: boolean;
    threshold: number;
    unit: 'days' | 'doses';
  };
  sideEffects?: string[];
  interactions?: string[];
  storage?: {
    temperature?: string;
    light?: 'keep in dark' | 'normal';
    special?: string;
  };
}