// ✅ keep your enums/types the same
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
  endDate?: Date | string; // ✅ allow string (from DB JSON)
}

export type MedicationForm =
  | 'tablet'
  | 'capsule'
  | 'liquid'
  | 'injection'
  | 'syrup'
  | 'powder'
  | 'inhaler'
  | 'drops'
  | 'spray'
  | 'cream'
  | 'patch'
  | 'other';

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

// ✅ make status optional but typed correctly
export interface MedicationStatus {
  taken: boolean;
  date: Date | string; // ✅ allow string from DB
  time: string;
}

export interface Medication {
  id: string;
  name: string;
  dosage: DosageInfo;
  schedule: Schedule;
  duration: Duration;
  start_date: Date | string;
  color: string;
  notes?: string;
  status?: MedicationStatus[];
  refillreminder?: RefillReminder;   // ✅ lowercase to match DB
  side_effects?: string[];            // ✅ snake_case to match DB
  interactions?: string[];            // already matches DB
  storage?: Storage;
  medication_doses?: {
    id: string;
    medication_id: string;
    dose_time: string;
    status: "taken" | "missed";
    marked_at: string;
  }[];
}