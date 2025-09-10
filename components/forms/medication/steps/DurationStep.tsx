import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useState } from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { DURATION_OPTIONS } from '../../../../constants/medicationConstants';
import type { Duration, Medication } from '../../../../types/medication';

interface DurationStepProps {
  onNext: (data: Partial<Medication>) => void;
  data: Partial<Medication>;
}

const DurationStep: React.FC<DurationStepProps> = ({ onNext, data }) => {
  const [duration, setDuration] = useState<Duration>({
    type: 'ongoing',
    value: undefined,
    endDate: undefined
  });
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});

  const handleTypeChange = (type: Duration['type']) => {
    setDuration({ type, value: undefined, endDate: undefined });
    setErrors({});
  };

  const handleValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    setDuration(prev => ({
      ...prev,
      value: isNaN(numValue) ? undefined : numValue
    }));
    setErrors({});
  };

  const handleDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setDuration(prev => ({ ...prev, endDate: selectedDate }));
      setErrors({});
    }
  };

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (duration.type === 'numberOfDays' || duration.type === 'numberOfWeeks') {
      if (!duration.value || duration.value <= 0) {
        newErrors.value = 'Please enter a valid number';
      }
    } else if (duration.type === 'endDate' && !duration.endDate) {
      newErrors.endDate = 'Please select an end date';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        duration,
        startDate: new Date()
      });
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>How long will you take this medication?</Text>

      <View style={styles.optionsContainer}>
        {DURATION_OPTIONS.map((option) => (
          <TouchableOpacity
            key={option.value}
            style={[
              styles.optionButton,
              duration.type === option.value && styles.optionButtonSelected
            ]}
            onPress={() => handleTypeChange(option.value)}
          >
            <Text style={[
              styles.optionText,
              duration.type === option.value && styles.optionTextSelected
            ]}>
              {option.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {(duration.type === 'numberOfDays' || duration.type === 'numberOfWeeks') && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Number of {duration.type === 'numberOfDays' ? 'days' : 'weeks'}:
          </Text>
          <TextInput
            style={[styles.input, errors.value && styles.inputError]}
            value={duration.value?.toString() || ''}
            onChangeText={handleValueChange}
            keyboardType="numeric"
            placeholder="Enter number"
            placeholderTextColor={COLORS.secondary}
          />
          {errors.value && <Text style={styles.errorText}>{errors.value}</Text>}
        </View>
      )}

      {duration.type === 'endDate' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date:</Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.endDate && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {duration.endDate ? formatDate(duration.endDate) : 'Select date'}
            </Text>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          {errors.endDate && <Text style={styles.errorText}>{errors.endDate}</Text>}
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          value={duration.endDate || new Date()}
          mode="date"
          minimumDate={new Date()}
          onChange={handleDateChange}
        />
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
    marginBottom: 24,
  },
  optionButton: {
    padding: 16,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    backgroundColor: COLORS.primary2,
  },
  optionButtonSelected: {
    backgroundColor: COLORS.primary,
    borderColor: COLORS.primary,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary2,
  },
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
  },
  dateButtonText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default DurationStep;
