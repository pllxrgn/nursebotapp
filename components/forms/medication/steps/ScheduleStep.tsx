import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { DAYS_OF_WEEK, TIME_PRESETS } from '../../../../constants/medicationConstants';
import type { StepProps } from '../../../../types/form';
import type { DayOfWeek } from '../../../../types/medication';
import TimeInputRow from '../components/TimeInputRow';

const ScheduleStep: React.FC<StepProps> = ({ 
  control,
  errors,
  getValues,
  setValue,
  isLastStep
}) => {
  const schedule = getValues('schedule');
  if (!schedule) return null;

  const toggleDay = (day: DayOfWeek) => {
    const currentSchedule = getValues('schedule');
    if (!currentSchedule) return;

    if (currentSchedule.type === 'weekly') {
      const days = currentSchedule.days || [];
      const newDays = days.includes(day)
        ? days.filter((d: DayOfWeek) => d !== day)
        : [...days, day];
      
      // If all days are selected, switch to daily schedule
      if (newDays.length === 7) {
        setValue('schedule', {
          ...currentSchedule,
          type: 'daily',
          mealRelation: currentSchedule.mealRelation || [],
          timePreferences: currentSchedule.timePreferences || [],
          times: currentSchedule.times || []
        });
      } else {
        setValue('schedule', {
          ...currentSchedule,
          days: newDays
        });
      }
    } else if (currentSchedule.type === 'daily') {
      // If in daily schedule and a day is deselected, switch to weekly with all days except the deselected one
      const allDays: DayOfWeek[] = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
      setValue('schedule', {
        ...currentSchedule,
        type: 'weekly',
        days: allDays.filter(d => d !== day),
        mealRelation: currentSchedule.mealRelation || [],
        timePreferences: currentSchedule.timePreferences || []
      });
    }
  };

  const handleTimeChange = (index: number, newTime?: string) => {
    if (newTime && schedule) {
      const currentTimes = [...(schedule.times || [])];
      if (index < currentTimes.length) {
        currentTimes[index] = newTime;
      } else {
        currentTimes.push(newTime);
      }
      
      setValue('schedule', {
        ...schedule,
        times: [...currentTimes].sort()
      });
    }
  };

  const removeTime = (index: number) => {
    if (!schedule) return;

    setValue('schedule', {
      ...schedule,
      times: schedule.times.filter((_: string, i: number) => i !== index)
    });
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Days</Text>
        <View style={styles.daysContainer}>
          {DAYS_OF_WEEK.map((day) => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                ((schedule.type === 'weekly' && schedule.days.includes(day)) || schedule.type === 'daily') && styles.dayButtonSelected
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[
                styles.dayButtonText,
                ((schedule.type === 'weekly' && schedule.days.includes(day)) || schedule.type === 'daily') && styles.dayButtonTextSelected
              ]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.schedule && (
          <Text style={styles.errorText}>
            {errors.schedule.type?.message || errors.schedule.message}
          </Text>
        )}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Times</Text>
        <View style={styles.presetContainer}>
          {TIME_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.label}
              style={styles.presetButton}
              onPress={() => {
                setValue('schedule.times', [...preset.times].sort());
              }}
            >
              <Text style={styles.presetButtonText}>{preset.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {(schedule.times || []).map((time: string, index: number) => (
          <TimeInputRow
            key={index}
            time={time}
            index={index}
            onTimeInputPress={handleTimeChange}
            onAddTimeInput={() => {
              const times = [...(schedule.times || []), ''];
              setValue('schedule.times', times);
            }}
            onRemoveTimeInput={(idx: number) => {
              const newTimes = schedule.times.filter((_: string, i: number) => i !== idx);
              setValue('schedule.times', newTimes);
            }}
            isFirst={index === 0}
          />
        ))}
        {errors.schedule?.times && (
          <Text style={styles.errorText}>{errors.schedule.times.message}</Text>
        )}

        <TouchableOpacity
          style={[styles.addTimeButton, (schedule.times || []).length === 0 && styles.firstTimeButton]}
          onPress={() => {
            const times = [...(schedule.times || []), ""];
            setValue('schedule.times', times);
          }}
        >
          <Text style={styles.addTimeButtonText}>+ Add Time</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#F3F4F6',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  daysContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 8,
  },
  dayButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary2,
  },
  dayButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  dayButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  dayButtonTextSelected: {
    color: COLORS.primary2,
  },
  presetContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  presetButton: {
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: COLORS.primary3,
  },
  presetButtonText: {
    color: COLORS.text,
    fontSize: 14,
  },
  addTimeButton: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary3,
    alignItems: 'center',
    marginTop: 12,
  },
  firstTimeButton: {
    marginTop: 0,
  },
  addTimeButtonText: {
    color: COLORS.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default ScheduleStep;
