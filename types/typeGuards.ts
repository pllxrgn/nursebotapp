import type { CustomSchedule, DailySchedule, MonthlySchedule, Schedule, WeeklySchedule } from './medication';

export const isDailySchedule = (schedule: Schedule): schedule is DailySchedule => schedule.type === 'daily';
export const isWeeklySchedule = (schedule: Schedule): schedule is WeeklySchedule => schedule.type === 'weekly';
export const isMonthlySchedule = (schedule: Schedule): schedule is MonthlySchedule => schedule.type === 'monthly';
export const isCustomSchedule = (schedule: Schedule): schedule is CustomSchedule => schedule.type === 'custom';