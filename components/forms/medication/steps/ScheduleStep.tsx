import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { DAYS_OF_WEEK, TIME_PRESETS } from '../../../../constants/medicationConstants';
import type { DayOfWeek, Medication, Schedule } from '../../../../types/medication';
import { TimeInputRow } from '../components';

interface ScheduleStepProps {
  onNext: (data: Partial<Medication>) => void;
  data: Partial<Medication>;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ onNext, data }) => {
  const [schedule, setSchedule] = useState<Schedule>({
    frequency: 'daily',
    days: [],
    times: []
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const toggleDay = (day: DayOfWeek) => {
    const days = schedule.days || [];
    const newDays = days.includes(day)
      ? days.filter((d: DayOfWeek) => d !== day)
      : [...days, day];
    
    setSchedule({
      ...schedule,
      days: newDays,
      frequency: newDays.length === 7 ? 'daily' : 'weekly'
    });
  };

  const addTime = (time: string) => {
    const times = schedule.times || [];
    if (!times.includes(time)) {
      setSchedule({
        ...schedule,
        times: [...times, time].sort()
      });
    }
  };

  const removeTime = (time: string) => {
    const times = schedule.times || [];
    setSchedule({
      ...schedule,
      times: times.filter((t: string) => t !== time)
    });
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!schedule.times || schedule.times.length === 0) {
      newErrors.times = 'Please select at least one time';
    }

    if (schedule.frequency === 'weekly' && (!schedule.days || schedule.days.length === 0)) {
      newErrors.days = 'Please select at least one day';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        frequency: {
          type: schedule.frequency,
          schedule
        }
      });
    }
  };

  const handlePresetPress = (preset: (typeof TIME_PRESETS)[number]) => {
    preset.times.forEach(addTime);
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
                schedule.days?.includes(day) && styles.dayButtonSelected
              ]}
              onPress={() => toggleDay(day)}
            >
              <Text style={[
                styles.dayButtonText,
                schedule.days?.includes(day) && styles.dayButtonTextSelected
              ]}>
                {day.substring(0, 3)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        {errors.days && <Text style={styles.errorText}>{errors.days}</Text>}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Select Times</Text>
        <View style={styles.presetContainer}>
          {TIME_PRESETS.map((preset) => (
            <TouchableOpacity
              key={preset.label}
              style={styles.presetButton}
              onPress={() => handlePresetPress(preset)}
            >
              <Text style={styles.presetButtonText}>{preset.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {schedule.times.map((time, index) => (
          <TimeInputRow
            key={index}
            time={time}
            index={index}
            onTimeInputPress={(index) => addTime(`${index}:00`)}
            onAddTimeInput={() => addTime('')}
            onRemoveTimeInput={(index) => removeTime(schedule.times[index])}
            isFirst={index === 0}
            showTimePicker={false}
          />
        ))}
        {errors.times && <Text style={styles.errorText}>{errors.times}</Text>}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
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
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
});

export default ScheduleStep;
