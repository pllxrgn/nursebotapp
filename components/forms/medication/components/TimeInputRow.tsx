import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
const { useState } = React;

interface TimeInputRowProps {
  time: string;
  index: number;
  onTimeInputPress: (index: number, time?: string) => void;
  onAddTimeInput: () => void;
  onRemoveTimeInput: (index: number) => void;
  isFirst: boolean;
}

const TimeInputRow: React.FC<TimeInputRowProps> = ({
  time,
  index,
  onTimeInputPress,
  onAddTimeInput,
  onRemoveTimeInput,
  isFirst
}: TimeInputRowProps) => {

  const formatTime = (timeString: string) => {
    if (!timeString) return 'Select time';
    try {
      const [hours, minutes] = timeString.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return 'Invalid time';
    }
  };

  const [inputTime, setInputTime] = useState(time);
  const [isEditing, setIsEditing] = useState(false);

  const formatTimeInput = (text: string) => {
    // Remove any non-digit characters
    const digitsOnly = text.replace(/\D/g, '');
    
    if (digitsOnly.length <= 2) {
      return digitsOnly;
    } else if (digitsOnly.length <= 4) {
      return `${digitsOnly.slice(0, 2)}:${digitsOnly.slice(2)}`;
    }
    return text;
  };

  const validateAndFormatTime = (timeStr: string) => {
    const [hoursStr, minutesStr] = timeStr.split(':');
    const hours = parseInt(hoursStr || '0');
    const minutes = parseInt(minutesStr || '0');

    if (!isNaN(hours) && !isNaN(minutes) && 
        hours >= 0 && hours < 24 && 
        minutes >= 0 && minutes < 60) {
      const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
      onTimeInputPress(index, formattedTime);
      return formattedTime;
    }
    return time || '';
  };

  const handleBlur = () => {
    setIsEditing(false);
    const formattedTime = validateAndFormatTime(inputTime);
    setInputTime(formattedTime);
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeInputContainer}>
        <TextInput
          style={[
            styles.timeInput,
            !time && styles.emptyTimeInput,
            isEditing && styles.activeTimeInput
          ]}
          value={inputTime}
          onChangeText={(text: string) => {
            const formatted = formatTimeInput(text);
            setInputTime(formatted);
            if (text.length >= 4) {
              validateAndFormatTime(formatted);
            }
          }}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          placeholder="HH:mm"
          keyboardType="numeric"
          maxLength={5}
        />

        {!isFirst && (
          <TouchableOpacity
            onPress={() => onRemoveTimeInput(index)}
            style={styles.removeButton}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
          >
            <Ionicons name="close-circle" size={20} color={COLORS.text} />
          </TouchableOpacity>
        )}
      </View>
      
      {isFirst && (
        <TouchableOpacity
          style={styles.addButton}
          onPress={onAddTimeInput}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Ionicons name="add-circle-outline" size={24} color={COLORS.primary} />
          <Text style={styles.addButtonText}>Add Time</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 8,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  timeInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  timeInput: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 120,
    borderWidth: 1,
    borderColor: 'transparent',
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
  },
  emptyTimeInput: {
    borderColor: COLORS.chatbot,
    borderStyle: 'dashed',
    color: COLORS.secondary,
  },
  activeTimeInput: {
    borderColor: COLORS.primary,
    borderStyle: 'solid',
  },
  removeButton: {
    marginLeft: 12,
    padding: 4,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
    marginLeft: 16,
  },
  addButtonText: {
    marginLeft: 8,
    fontSize: 16,
    color: COLORS.primary,
    fontWeight: '500',
  },
});

export default TimeInputRow;
