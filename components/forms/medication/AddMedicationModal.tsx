import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, StyleSheet, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { COLORS } from '../../../constants/colors';
import type { Medication } from '../../../types/medication';
import { generateId } from '../../../utils/uuid';
import MedicationFormContainer from './MedicationFormContainer';

interface AddMedicationModalProps {
  visible: boolean;
  onSubmit: (medication: Medication) => void;
  onCancel: () => void;
}

const AddMedicationModal: React.FC<AddMedicationModalProps> = ({
  visible,
  onSubmit,
  onCancel
}: AddMedicationModalProps) => {
  const handleSubmit = (medication: Partial<Medication>) => {
    // Detailed validation with logging
    const missingFields = [];

    if (!medication.name) missingFields.push('name');
    if (!medication.dosage?.amount || !medication.dosage?.unit) missingFields.push('dosage');
    if (!medication.schedule?.type || !medication.schedule?.times?.length) missingFields.push('schedule');
    if (!medication.duration?.type) missingFields.push('duration');

    if (missingFields.length > 0) {
      console.error('Missing required medication fields:', missingFields);
      console.log('Current medication data:', JSON.stringify(medication, null, 2));
      return;
    }

    // At this point, we know these fields exist because of the validation above
    const completeData: Medication = {
      id: generateId(),
      name: medication.name!,
      dosage: medication.dosage!,
      schedule: medication.schedule!,
      duration: medication.duration!,
      start_date: medication.start_date || new Date(),  // ✅ snake_case
      color: medication.color || '#64748b',
      notes: medication.notes || '',
      refillreminder: medication.refillreminder || {
        enabled: false,
        threshold: 7,
        unit: 'days'
      },
      side_effects: medication.side_effects || [],
      interactions: medication.interactions || [],
      storage: medication.storage || {},
    };

    onSubmit(completeData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container} edges={['top', 'left', 'right']}>
        <View style={styles.header}>
          <TouchableOpacity
            onPress={onCancel}
            style={styles.closeButton}
          >
            <Ionicons name="close" size={24} color={COLORS.text} />
          </TouchableOpacity>
        </View>
        <MedicationFormContainer
          onSubmit={handleSubmit}
          onCancel={onCancel}
        />
      </SafeAreaView>
    </Modal>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.primary3,
  },
  closeButton: {
    padding: 8,
  },
});

export default AddMedicationModal;
