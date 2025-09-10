import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';

interface FrequencyDropdownProps<T extends string> {
  value: T;
  onPress: () => void;
  options: T[];
  visible: boolean;
  onSelect: (option: T) => void;
}

export const FrequencyDropdown = <T extends string>({
  value,
  onPress,
  options,
  visible,
  onSelect,
}: FrequencyDropdownProps<T>): React.ReactElement => {
  return (
    <>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={onPress}
        activeOpacity={0.7}
      >
        <Text style={styles.selectedText}>{value}</Text>
        <Ionicons
          name={visible ? "chevron-up" : "chevron-down"}
          size={20}
          color={COLORS.text}
          style={styles.icon}
        />
      </TouchableOpacity>

      {visible && (
        <View style={styles.dropdown}>
          {options.map((option, index) => (
            <TouchableOpacity
              key={option}
              style={[
                styles.option,
                index === options.length - 1 && styles.lastOption
              ]}
              onPress={() => onSelect(option)}
            >
              <Text style={styles.optionText}>{option}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    backgroundColor: COLORS.primary3,
    minHeight: 50,
    paddingHorizontal: 12,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  icon: {
    marginLeft: 8,
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: COLORS.primary3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
    marginTop: 4,
    zIndex: 1000,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  option: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  lastOption: {
    borderBottomWidth: 0,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
});
