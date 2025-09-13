import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { ColorPicker } from '../../../../components/ui';
import { COLORS } from '../../../../constants/colors';
import { MEDICATION_COLORS, STORAGE_CONDITIONS } from '../../../../constants/medicationConstants';
import type { Medication } from '../../../../types/medication';

interface AdditionalInfoStepProps {
  onNext: (data: Partial<Medication>) => void;
  data: Partial<Medication>;
}

const AdditionalInfoStep: React.FC<AdditionalInfoStepProps> = ({ onNext, data }) => {
  const [additionalInfo, setAdditionalInfo] = useState({
    color: data.color || MEDICATION_COLORS[0],
    notes: data.notes || '',
    refillReminder: data.refillReminder || {
      enabled: true,
      threshold: 7,
      unit: 'days' as const
    },
    storage: data.storage || {},
    sideEffects: data.sideEffects || [],
    interactions: data.interactions || []
  });

  const [newSideEffect, setNewSideEffect] = useState('');
  const [newInteraction, setNewInteraction] = useState('');

  const handleColorSelect = (color: string) => {
    setAdditionalInfo(prev => ({ ...prev, color }));
  };

  type StorageKey = keyof NonNullable<Medication['storage']>;

  const handleStorageChange = (key: StorageKey, value: string) => {
    setAdditionalInfo(prev => ({
      ...prev,
      storage: {
        ...prev.storage,
        [key]: value
      }
    }));
  };

  const addSideEffect = () => {
    if (newSideEffect.trim()) {
      setAdditionalInfo(prev => ({
        ...prev,
        sideEffects: [...prev.sideEffects, newSideEffect.trim()]
      }));
      setNewSideEffect('');
    }
  };

  const removeSideEffect = (index: number) => {
    setAdditionalInfo(prev => ({
      ...prev,
      sideEffects: prev.sideEffects.filter((_, i) => i !== index)
    }));
  };

  const addInteraction = () => {
    if (newInteraction.trim()) {
      setAdditionalInfo(prev => ({
        ...prev,
        interactions: [...prev.interactions, newInteraction.trim()]
      }));
      setNewInteraction('');
    }
  };

  const removeInteraction = (index: number) => {
    setAdditionalInfo(prev => ({
      ...prev,
      interactions: prev.interactions.filter((_, i) => i !== index)
    }));
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Color Tag</Text>
        <ColorPicker
          colors={MEDICATION_COLORS}
          selectedColor={additionalInfo.color}
          onSelect={handleColorSelect}
        />
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Storage Instructions</Text>
        
        <View style={styles.storageOption}>
          <Text style={styles.label}>Temperature:</Text>
          <View style={styles.buttonGroup}>
            {STORAGE_CONDITIONS.temperature.map((temp) => (
              <TouchableOpacity
                key={temp}
                style={[
                  styles.optionButton,
                  additionalInfo.storage?.temperature === temp && styles.optionButtonSelected
                ]}
                onPress={() => handleStorageChange('temperature', temp)}
              >
                <Text style={[
                  styles.optionText,
                  additionalInfo.storage?.temperature === temp && styles.optionTextSelected
                ]}>
                  {temp}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.storageOption}>
          <Text style={styles.label}>Light Conditions:</Text>
          <View style={styles.buttonGroup}>
            {STORAGE_CONDITIONS.light.map((light) => (
              <TouchableOpacity
                key={light}
                style={[
                  styles.optionButton,
                  additionalInfo.storage?.light === light && styles.optionButtonSelected
                ]}
                onPress={() => handleStorageChange('light', light)}
              >
                <Text style={[
                  styles.optionText,
                  additionalInfo.storage?.light === light && styles.optionTextSelected
                ]}>
                  {light}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.storageOption}>
          <Text style={styles.label}>Special Instructions:</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            value={additionalInfo.storage?.special || ''}
            onChangeText={(value) => handleStorageChange('special', value)}
            placeholder="Enter any special storage instructions"
            placeholderTextColor={COLORS.secondary}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
          />
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Side Effects</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newSideEffect}
            onChangeText={setNewSideEffect}
            placeholder="Enter possible side effect"
            placeholderTextColor={COLORS.secondary}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addSideEffect}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {additionalInfo.sideEffects.map((effect, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{effect}</Text>
            <TouchableOpacity onPress={() => removeSideEffect(index)}>
              <Ionicons name="close-circle" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Interactions</Text>
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            value={newInteraction}
            onChangeText={setNewInteraction}
            placeholder="Enter medication or food interactions"
            placeholderTextColor={COLORS.secondary}
          />
          <TouchableOpacity
            style={styles.addButton}
            onPress={addInteraction}
          >
            <Ionicons name="add-circle" size={24} color={COLORS.primary} />
          </TouchableOpacity>
        </View>
        {additionalInfo.interactions.map((interaction, index) => (
          <View key={index} style={styles.chip}>
            <Text style={styles.chipText}>{interaction}</Text>
            <TouchableOpacity onPress={() => removeInteraction(index)}>
              <Ionicons name="close-circle" size={20} color={COLORS.text} />
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Notes</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={additionalInfo.notes}
          onChangeText={(notes) => setAdditionalInfo(prev => ({ ...prev, notes }))}
          placeholder="Add any additional notes or instructions"
          placeholderTextColor={COLORS.secondary}
          multiline
          numberOfLines={4}
          textAlignVertical="top"
        />
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

  storageOption: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    color: COLORS.text,
    marginBottom: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
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
    fontSize: 14,
    color: COLORS.text,
  },
  optionTextSelected: {
    color: COLORS.primary2,
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  addButton: {
    padding: 8,
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary3,
    borderRadius: 16,
    paddingVertical: 6,
    paddingHorizontal: 12,
    marginBottom: 8,
  },
  chipText: {
    flex: 1,
    fontSize: 14,
    color: COLORS.text,
    marginRight: 8,
  },
});

export default AdditionalInfoStep;
