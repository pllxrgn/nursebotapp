import { Ionicons } from '@expo/vector-icons';
import React, { useEffect, useState } from 'react';
import {
  Dimensions,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View
} from 'react-native';
import { COLORS } from '../../constants/colors';

interface Option<T extends string | number> {
  label: string;
  value: T;
}

interface DropdownProps<T extends string | number> {
  placeholder?: string;
  value: T;
  options: Option<T>[] | T[];
  onChange: (value: T) => void;
  error?: boolean;
  style?: any;
  mode?: 'modal' | 'inline';
  customTrigger?: React.ReactNode;
  formatOption?: (option: T) => string;
}

const isOption = <T extends string | number>(
  option: Option<T> | T
): option is Option<T> => {
  return typeof option === 'object' && 'value' in option && 'label' in option;
};

const Dropdown = <T extends string | number>({
  placeholder = 'Select an option',
  value,
  options,
  onChange,
  error,
  style,
  mode = 'modal',
  customTrigger,
  formatOption
}: DropdownProps<T>): React.ReactElement => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState('');

  useEffect(() => {
    const selected = options.find(opt => 
      isOption(opt) ? opt.value === value : opt === value
    );
    setSelectedLabel(
      selected
        ? isOption(selected)
          ? selected.label
          : formatOption
            ? formatOption(selected)
            : String(selected)
        : ''
    );
  }, [value, options, formatOption]);

  const handleSelect = (option: Option<T> | T) => {
    const optionValue = isOption(option) ? option.value : option;
    onChange(optionValue);
    setIsOpen(false);
  };

  const renderOption = (option: Option<T> | T) => {
    const optionValue = isOption(option) ? option.value : option;
    const optionLabel = isOption(option) ? option.label : formatOption ? formatOption(option) : String(option);
    const isSelected = optionValue === value;

    return (
      <TouchableOpacity
        key={String(optionValue)}
        style={[
          styles.option,
          isSelected && styles.selectedOption
        ]}
        onPress={() => handleSelect(option)}
      >
        <Text style={[
          styles.optionText,
          isSelected && styles.selectedOptionText
        ]}>
          {optionLabel}
        </Text>
        {isSelected && (
          <Ionicons name="checkmark" size={20} color={COLORS.primary} />
        )}
      </TouchableOpacity>
    );
  };

  if (mode === 'inline') {
    return (
      <View>
        {customTrigger || (
          <TouchableOpacity
            style={[styles.dropdownButton, error && styles.error, style]}
            onPress={() => setIsOpen(!isOpen)}
            activeOpacity={0.7}
          >
            <Text style={[styles.selectedText, !value && styles.placeholder]}>
              {selectedLabel || placeholder}
            </Text>
            <Ionicons
              name={isOpen ? "chevron-up" : "chevron-down"}
              size={20}
              color={COLORS.text}
              style={styles.icon}
            />
          </TouchableOpacity>
        )}
        {isOpen && (
          <View style={styles.inlineDropdown}>
            {options.map(renderOption)}
          </View>
        )}
      </View>
    );
  }

  return (
    <View>
      {customTrigger || (
        <TouchableOpacity
          style={[styles.dropdownButton, error && styles.error, style]}
          onPress={() => setIsOpen(true)}
          activeOpacity={0.7}
        >
          <Text style={[styles.selectedText, !value && styles.placeholder]}>
            {selectedLabel || placeholder}
          </Text>
          <Ionicons
            name="chevron-down"
            size={20}
            color={COLORS.text}
            style={styles.icon}
          />
        </TouchableOpacity>
      )}

      <Modal
        visible={isOpen}
        transparent
        animationType="fade"
        onRequestClose={() => setIsOpen(false)}
      >
        <TouchableOpacity
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
          activeOpacity={1}
        >
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>{placeholder}</Text>
              <TouchableOpacity onPress={() => setIsOpen(false)}>
                <Ionicons name="close" size={24} color={COLORS.text} />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.optionsList}>
              {options.map(renderOption)}
            </ScrollView>
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
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
  error: {
    borderColor: COLORS.error,
  },
  selectedText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1,
  },
  placeholder: {
    color: COLORS.secondary,
  },
  icon: {
    marginLeft: 8,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: COLORS.primary2,
    borderRadius: 12,
    width: Dimensions.get('window').width * 0.9,
    maxHeight: Dimensions.get('window').height * 0.7,
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 4,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  selectedOption: {
    backgroundColor: COLORS.primary3,
  },
  optionText: {
    fontSize: 16,
    color: COLORS.text,
  },
  selectedOptionText: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  inlineDropdown: {
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
    ...Platform.select({
      ios: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
});

export default Dropdown;
