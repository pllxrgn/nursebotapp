import React from 'react';
import { View, TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS } from '../constants/colors';

interface ColorPickerProps {
  colors: string[];
  selectedColor: string;
  onSelect: (color: string) => void;
}

const ColorPicker: React.FC<ColorPickerProps> = ({ colors, selectedColor, onSelect }) => (
  <View style={styles.colorRow}>
    {colors.map((color) => (
      <TouchableOpacity
        key={color}
        style={[
          styles.colorCircle,
          { backgroundColor: color },
          selectedColor === color && styles.colorCircleSelected,
        ]}
        onPress={() => onSelect(color)}
      >
        {selectedColor === color && (
          <Ionicons name="checkmark-circle-outline" size={18} color="#fff" />
        )}
      </TouchableOpacity>
    ))}
  </View>
); 

export default ColorPicker;

const styles = StyleSheet.create({
  colorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  colorCircle: {
    width: 26,
    height: 26,
    borderRadius: 13,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorCircleSelected: {
    borderColor: COLORS.primary,
  },
});