import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'; // Removed Platform, DateTimePicker
import { COLORS } from '../constants/colors';

interface TimeInputRowProps {
  time: string;
  index: number;
  // Removed showTimePicker, isCurrent props as TimeInputRow doesn't render the picker
  onTimeInputPress: (index: number) => void;
  onAddTimeInput: () => void;
  onRemoveTimeInput: (index: number) => void;
  // Removed onTimeChange prop as TimeInputRow doesn't handle picker changes
  isFirst: boolean;
  showTimePicker: boolean; // Add this line
}

const TimeInputRow: React.FC<TimeInputRowProps> = ({
  time,
  index,
  onTimeInputPress,
  onAddTimeInput,
  onRemoveTimeInput,
  isFirst,
}) => (
  <View style={styles.timeRow}>
    <TouchableOpacity
      style={styles.timeInput}
      onPress={() => onTimeInputPress(index)} // This press triggers the picker in the parent
    >
      <Text style={styles.timeText}>
        {time || '--:--'}
      </Text>
      <Ionicons name="time-outline" size={22} color={COLORS.text} />
    </TouchableOpacity>
    {isFirst && (
      <TouchableOpacity onPress={onAddTimeInput} style={styles.timeAddBtn}>
        <Ionicons name="add-circle-outline" size={28} color={COLORS.primary} />
      </TouchableOpacity>
    )}
    {!isFirst && (
      <TouchableOpacity onPress={() => onRemoveTimeInput(index)} style={styles.timeRemoveBtn}>
        <Ionicons name="remove-circle-outline" size={22} color={COLORS.secondary} />
      </TouchableOpacity>
    )}
    {/* REMOVED DateTimePicker RENDERING FROM HERE */}
  </View>
);

export default TimeInputRow;

const styles = StyleSheet.create({
  timeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  timeInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    justifyContent: 'space-between',
  },
  timeText: {
    fontSize: 16,
    color: COLORS.text,
  },
  timeAddBtn: {
    marginLeft: 10,
  },
  timeRemoveBtn: {
    marginLeft: 10,
  },
});