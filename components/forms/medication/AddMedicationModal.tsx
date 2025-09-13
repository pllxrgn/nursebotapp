import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { Modal, SafeAreaView, StyleSheet, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../constants/colors';
import type { Medication } from '../../../types/medication';
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
}) => {
  const handleSubmit = (medication: Partial<Medication>) => {
    // Generate a random ID and add current date as startDate if not provided
    const completeData: Medication = {
      ...medication,
      id: Math.random().toString(36).substring(2, 15),
      startDate: medication.startDate || new Date(),
    } as Medication;
    onSubmit(completeData);
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
    >
      <SafeAreaView style={styles.container}>
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
