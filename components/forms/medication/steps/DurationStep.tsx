import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { DURATION_OPTIONS } from '../../../../constants/medicationConstants';
import type { Duration } from '../../../../types/medication';
const { useState } = React;

import { StepProps } from '../../../../types/form';

const DurationStep: React.FC<StepProps> = ({ 
  control,
  errors,
  getValues,
  setValue,
  isLastStep
}) => {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const duration = getValues('duration');

  const handleTypeChange = (type: Duration['type']) => {
    const newDuration: Duration = { type };
    
    // Set default values based on type
    if (type === 'ongoing') {
      // No additional values needed for ongoing
    } else if (type === 'endDate') {
      newDuration.endDate = new Date();
    } else {
      // For numberOfDays and numberOfWeeks
      newDuration.value = 1;
    }
    
    setValue('duration', newDuration, { shouldValidate: true });
  };

  const handleValueChange = (value: string) => {
    const numValue = parseInt(value, 10);
    if (!isNaN(numValue)) {
      setValue('duration', {
        ...duration,
        value: numValue
      });
    }
  };

  const handleDateChange = (_event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
      setValue('duration', {
        ...duration,
        endDate: selectedDate
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
            style={[styles.input, errors.duration?.value && styles.inputError]}
            value={duration.value?.toString() || ''}
            onChangeText={handleValueChange}
            keyboardType="numeric"
            placeholder="Enter number"
            placeholderTextColor={COLORS.secondary}
          />
          {errors.duration?.value && <Text style={styles.errorText}>{errors.duration.value.message}</Text>}
        </View>
      )}

      {duration.type === 'endDate' && (
        <View style={styles.inputContainer}>
          <Text style={styles.label}>End Date:</Text>
          <TouchableOpacity
            style={[styles.dateButton, errors.duration?.endDate && styles.inputError]}
            onPress={() => setShowDatePicker(true)}
          >
            <Text style={styles.dateButtonText}>
              {duration.endDate ? formatDate(duration.endDate) : 'Select date'}
            </Text>
            <Ionicons name="calendar" size={24} color={COLORS.primary} />
          </TouchableOpacity>
          {errors.duration?.endDate && <Text style={styles.errorText}>{errors.duration.endDate.message}</Text>}
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
    backgroundColor: '#F3F4F6',
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
