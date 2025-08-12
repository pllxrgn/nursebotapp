import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native'; // Import ScrollView
import { COLORS } from '../constants/colors';

interface FrequencyDropdownProps {
  value: string;
  options: string[];
  visible: boolean;
  onPress: () => void; // To toggle visibility
  onSelect: (option: string) => void; // To select an option and close
}

const FrequencyDropdown: React.FC<FrequencyDropdownProps> = ({
  value,
  options,
  visible,
  onPress,
  onSelect,
}) => {
  return (
    <View style={styles.container}>
      <Pressable style={styles.inputRow} onPress={onPress}>
        <Text style={styles.inputText}>{value}</Text>
        <Ionicons name={visible ? 'chevron-up' : 'chevron-down'} size={18} color={COLORS.primary} />
      </Pressable>

      {visible && (
        // Wrap the options list in a ScrollView
        // Add keyboardShouldPersistTaps="always" here
        <ScrollView style={styles.dropdown} keyboardShouldPersistTaps="always">
          {options.map((option, index) => (
            <Pressable
              key={index}
              style={[
                styles.option,
                index === options.length - 1 && styles.lastOption,
              ]}
              onPress={(event) => {
                event.stopPropagation(); // Add this line to stop event propagation
                onSelect(option);
              }}
            >
              <Text style={styles.optionText}>{option}</Text>
            </Pressable>
          ))}
        </ScrollView>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    zIndex: 1, // Ensure dropdown is above other elements
  },
  inputRow: {
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
  inputText: {
    fontSize: 16,
    color: COLORS.text,
  },
  dropdown: {
    backgroundColor: COLORS.primary3,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    overflow: 'hidden', // Clip options to border radius
    position: 'absolute', // Position dropdown absolutely
    top: '100%', // Position below the input row
    left: 0,
    right: 0,
    zIndex: 10, // Ensure dropdown is above other form elements
    maxHeight: 200, // Set a max height to enable scrolling
  },
  option: {
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chatbot,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});

export default FrequencyDropdown;