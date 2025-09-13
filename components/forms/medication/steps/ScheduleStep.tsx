import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { DAYS_OF_WEEK, TIME_PRESETS } from '../../../../constants/medicationConstants';
import type { DayOfWeek, Medication, Schedule } from '../../../../types/medication';
import TimeInputRow from '../components/TimeInputRow';

interface ScheduleStepProps {
  onNext: (data: Partial<Medication>) => void;
  onBack: () => void;
  data: Partial<Medication>;
}

const ScheduleStep: React.FC<ScheduleStepProps> = ({ onNext, onBack, data }) => {
  const [schedule, setSchedule] = useState<Schedule>({
    frequency: 'daily',
    times: data.frequency?.schedule.times || [],
    days: data.frequency?.schedule.days || []
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const toggleDay = (day: DayOfWeek) => {
    const days = schedule.days || [];
    const newDays = days.includes(day)
      ? days.filter(d => d !== day)
      : [...days, day];
    
    setSchedule({
      ...schedule,
      days: newDays,
      frequency: newDays.length === 7 ? 'daily' : 'weekly'
    });

    // Validate after selection
    validateSchedule();
  };

  const handleTimeChange = (index: number, newTime?: string) => {
    if (newTime) {
      const times = [...(schedule.times || [])];
      if (index < times.length) {
        times[index] = newTime;
      } else {
        times.push(newTime);
      }
      
      setSchedule({
        ...schedule,
        times: times.sort()
      });
      // Only validate to show/hide errors
      validateSchedule();
    }
  };

  const removeTime = (time: string) => {
    const times = schedule.times || [];
    setSchedule({
      ...schedule,
      times: times.filter(t => t !== time)
    });
  };

  const validateSchedule = () => {
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

  // Function to handle the Continue button press
  const handleContinue = () => {
    if (validateSchedule()) {
      onNext({
        frequency: {
          type: schedule.frequency,
          schedule
        }
      });
    }
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
              onPress={() => {
                setSchedule({
                  ...schedule,
                  times: [...preset.times].sort()
                });
                // Only validate to show/hide errors
                validateSchedule();
              }}
            >
              <Text style={styles.presetButtonText}>{preset.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {(schedule.times || []).map((time, index) => (
          <TimeInputRow
            key={index}
            time={time}
            index={index}
            onTimeInputPress={handleTimeChange}
            onAddTimeInput={() => {
              const times = [...(schedule.times || []), ''];
              setSchedule({
                ...schedule,
                times
              });
            }}
            onRemoveTimeInput={(idx) => {
              const newTimes = schedule.times.filter((_, i) => i !== idx);
              setSchedule({
                ...schedule,
                times: newTimes
              });
              validateSchedule();
            }}
            isFirst={index === 0}
          />
        ))}
        {errors.times && <Text style={styles.errorText}>{errors.times}</Text>}

        <TouchableOpacity
          style={[styles.addTimeButton, (schedule.times || []).length === 0 && styles.firstTimeButton]}
          onPress={() => {
            const times = [...(schedule.times || []), ""];
            setSchedule({
              ...schedule,
              times
            });
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
