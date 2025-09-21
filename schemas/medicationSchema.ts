import { z } from 'zod';
import { MEDICATION_FORMS } from '../constants/medicationConstants';
import type { DayOfWeek } from '../types/medication';

const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
const daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'] as const;

const dosageSchema = z.object({
  amount: z.string()
    .min(1, 'Dosage amount is required')
    .refine((value) => !isNaN(Number(value)), 'Please enter a valid number')
    .refine((value) => Number(value) > 0, 'Amount must be greater than 0')
    .refine((value) => Number(value) <= 9999, 'Amount is too large'),
  unit: z.string().min(1, 'Please select a unit'),
  form: z.enum(MEDICATION_FORMS)
});

const mealRelationSchema = z.object({
  meal: z.enum(['breakfast', 'lunch', 'dinner']),
  timing: z.enum(['before', 'with', 'after']),
  offsetMinutes: z.number().optional()
}).array().optional();

const timePreferencesSchema = z.enum(['morning', 'afternoon', 'evening', 'bedtime']).array().optional();

const baseScheduleSchema = z.object({
  times: z.array(z.string().regex(timeRegex, 'Invalid time format')).min(1, 'At least one time is required'),
  mealRelation: mealRelationSchema,
  timePreferences: timePreferencesSchema
});

const dailyScheduleSchema = baseScheduleSchema.extend({ type: z.literal('daily') });
const weeklyScheduleSchema = baseScheduleSchema.extend({
  type: z.literal('weekly'),
  days: z.array(z.enum(daysOfWeek as unknown as [DayOfWeek, ...DayOfWeek[]])).min(1)
});
const monthlyScheduleSchema = baseScheduleSchema.extend({
  type: z.literal('monthly'),
  daysOfMonth: z.array(z.number().min(1).max(31)).min(1)
});
const customScheduleSchema = baseScheduleSchema.extend({
  type: z.literal('custom'),
  interval: z.number().min(1)
});

const scheduleSchema = z.discriminatedUnion('type', [
  dailyScheduleSchema,
  weeklyScheduleSchema,
  monthlyScheduleSchema,
  customScheduleSchema
]);

const durationSchema = z.discriminatedUnion('type', [
  z.object({ type: z.literal('ongoing') }),
  z.object({ type: z.literal('endDate'), end_date: z.date() }),
  z.object({ type: z.literal('numberOfDays'), value: z.number().int().positive() }),
  z.object({ type: z.literal('numberOfWeeks'), value: z.number().int().positive() })
]);

const storageSchema = z.object({
  temperature: z.string().optional(),
  light: z.string().optional(),
  special: z.string().optional()
}).optional();

const refill_reminderSchema = z.object({
  enabled: z.boolean(),
  threshold: z.number().positive(),
  unit: z.literal('days')
}).default({
  enabled: true,
  threshold: 7,
  unit: 'days'
});

export const medicationSchema = z.object({
  id: z.string().optional(),
  name: z.string().min(1, 'Medication name is required'),
  dosage: dosageSchema,
  schedule: scheduleSchema,
  duration: durationSchema,
  start_date: z.date().default(() => new Date()),
  color: z.string().default('#000000'),
  notes: z.string().optional(),
  status: z.array(
    z.object({
      taken: z.boolean(),
      date: z.date(),
      time: z.string()
    })
  ).default([]),
  refill_reminder: refill_reminderSchema,
  side_effects: z.array(z.string()).default([]),
  interactions: z.array(z.string()).default([]),
  storage: storageSchema
});
