import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';

interface TimeInputRowProps {
  time: string;
  index: number;
  onTimeInputPress: (index: number) => void;
  onAddTimeInput: () => void;
  onRemoveTimeInput: (index: number) => void;
  isFirst: boolean;
  showTimePicker: boolean;
}

const TimeInputRow: React.FC<TimeInputRowProps> = ({
  time,
  index,
  onTimeInputPress,
  onAddTimeInput,
  onRemoveTimeInput,
  isFirst,
  showTimePicker
}) => {

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

  const handleTimeChange = (event: any, selectedDate?: Date) => {
    if (event.type === 'set' && selectedDate) {
      onTimeInputPress(index);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.timeInputContainer}>
        <TouchableOpacity 
          style={[
            styles.timeChip,
            !time && styles.emptyTimeChip,
            showTimePicker && styles.activeTimeChip
          ]}
          onPress={() => onTimeInputPress(index)}
        >
          <Text style={[
            styles.timeText,
            !time && styles.placeholderText
          ]}>
            {formatTime(time)}
          </Text>
        </TouchableOpacity>

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
  timeChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    borderRadius: 16,
    paddingVertical: 8,
    paddingHorizontal: 16,
    minWidth: 120,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  emptyTimeChip: {
    borderColor: COLORS.chatbot,
    borderStyle: 'dashed',
  },
  activeTimeChip: {
    borderColor: COLORS.primary,
    borderStyle: 'solid',
  },
  timeText: {
    fontSize: 16,
    color: COLORS.text,
    textAlign: 'center',
    flex: 1,
  },
  placeholderText: {
    color: COLORS.secondary,
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
