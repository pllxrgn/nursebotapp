import { DayOfWeek, TimeOfDay } from '../types/medication';

export const DAYS_OF_WEEK: DayOfWeek[] = [
  'monday',
  'tuesday',
  'wednesday',
  'thursday',
  'friday',
  'saturday',
  'sunday'
];

export const TIMES_OF_DAY: { [key in TimeOfDay]: string } = {
  morning: '8:00 AM',
  afternoon: '2:00 PM',
  evening: '8:00 PM',
  bedtime: '10:00 PM'
};

import { MedicationForm } from '../types/medication';

export const MEDICATION_FORMS = [
  'tablet',
  'capsule',
  'liquid',
  'injection',
  'syrup',
  'powder',
  'inhaler',
  'drops',
  'spray',
  'cream',
  'patch',
  'other'
] as const;


// Define units for each medication form
export const FORM_UNITS: { [key in MedicationForm]: string[] } = {
  tablet: ['tablet(s)'],
  capsule: ['capsule(s)'],
  liquid: ['mL', 'mg/mL'],
  injection: ['mL', 'mg', 'unit(s)'],
  syrup: ['mL', 'mg/5mL'],
  powder: ['g', 'mg'],
  inhaler: ['puff(s)'],
  drops: ['drop(s)'],
  spray: ['spray(s)'],
  cream: ['g'],
  patch: ['patch(es)'],
  other: ['mg', 'g', 'mcg', 'mL', 'unit(s)']
};

export const DOSAGE_UNITS = [
  'mg',
  'g',
  'mcg',
  'mL',
  'tablet(s)',
  'capsule(s)',
  'unit(s)',
  'drop(s)',
  'puff(s)',
  'spray(s)',
  'injection(s)'
] as const;

export const MEAL_TIMINGS = {
  breakfast: '8:00 AM',
  lunch: '12:00 PM',
  dinner: '6:00 PM'
};

export const DURATION_OPTIONS = [
  { label: 'Ongoing', value: 'ongoing' },
  { label: 'Until specific date', value: 'endDate' },
  { label: 'For number of days', value: 'numberOfDays' },
  { label: 'For number of weeks', value: 'numberOfWeeks' }
] as const;

export const FREQUENCY_PRESETS = [
  {
    label: 'Daily',
    type: 'daily',
    description: 'Take medication every day'
  },
  {
    label: 'Weekly',
    type: 'weekly',
    description: 'Take medication on specific days of the week'
  },
  {
    label: 'Monthly',
    type: 'monthly',
    description: 'Take medication on specific days of the month'
  },
  {
    label: 'Custom',
    type: 'custom',
    description: 'Set a custom interval'
  }
] as const;

export const FREQUENCY_OPTIONS = ['Daily', 'Weekly', 'Monthly', 'Custom'] as const;

export const STORAGE_CONDITIONS = {
  temperature: [
    'Room temperature',
    'Refrigerate',
    'Keep frozen',
    'See package'
  ],
  light: [
    'Keep in dark',
    'normal'
  ]
} as const;

export const REMINDER_UNITS = [
  { label: 'Days before empty', value: 'days' },
  { label: 'Doses remaining', value: 'doses' }
] as const;

export const MEDICATION_COLORS = [
  '#FF0000', // Red
  '#FF7F00', // Orange
  '#FFFF00', // Yellow
  '#00FF00', // Green
  '#0000FF', // Blue
  '#4B0082', // Indigo
  '#9400D3', // Violet
  '#FF69B4', // Pink
  '#8B4513', // Brown
  '#808080'  // Gray
] as const;

export const TIME_PRESETS = [
  {
    label: 'Morning',
    times: ['08:00']
  },
  {
    label: 'Morning & Evening',
    times: ['08:00', '20:00']
  },
  {
    label: 'Morning, Noon & Night',
    times: ['08:00', '12:00', '20:00']
  },
  {
    label: 'Every 6 hours',
    times: ['06:00', '12:00', '18:00', '00:00']
  }
] as const;

export const DEFAULT_REMINDER_SETTINGS = {
  enabled: true,
  threshold: 7,
  unit: 'days' as const
};