import { Ionicons } from '@expo/vector-icons';
import React, { useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import type { Medication } from '../types/medication';

interface MedicationItemProps {
  medication: Medication;
  onTaken: () => void;
  onMissed: () => void;
  onEdit: () => void;
  onDelete: () => void;
}

const MedicationItem: React.FC<MedicationItemProps> = ({
  medication,
  onTaken,
  onMissed,
  onEdit,
  onDelete,
}) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsPress = () => {
    setShowOptions((prev) => !prev);
  };

  const handleEditPress = () => {
    setShowOptions(false);
    onEdit();
  };

  const handleDeletePress = () => {
    setShowOptions(false);
    onDelete();
  };

  const handleTakenPress = () => {
    onTaken();
  };

  const handleMissedPress = () => {
    onMissed();
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        {/* Colored circle next to the name */}
        <View style={[styles.colorCircle, { backgroundColor: medication.color }]} />
        <Text style={styles.medicationName}>{medication.name}</Text>
        <TouchableOpacity onPress={handleOptionsPress} style={styles.optionsButton}>
          <Ionicons name="ellipsis-vertical" size={20} color={COLORS.secondary} />
        </TouchableOpacity>
        {showOptions && (
          <View style={styles.optionsMenu}>
            <TouchableOpacity onPress={handleEditPress} style={styles.optionItem}>
              <Ionicons name="create-outline" size={18} color={COLORS.text} style={styles.optionIcon} />
              <Text style={styles.optionText}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={handleDeletePress} style={styles.optionItem}>
              <Ionicons name="trash-outline" size={18} color={COLORS.text} style={styles.optionIcon} />
              <Text style={styles.optionText}>Delete</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>

      <Text style={styles.dosage}>{medication.dosage}</Text>

      <View style={styles.detailsRow}>
        <Ionicons name="time-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
        <Text style={styles.detailText}>{medication.frequency}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Ionicons name="alarm-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
        <Text style={styles.detailText}>{medication.times.join(', ')}</Text>
      </View>

      <View style={styles.detailsRow}>
        <Ionicons name="calendar-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
        <Text style={styles.detailText}>Since {medication.startDate.toLocaleDateString()}</Text>
      </View>

      {medication.notes && (
        <View style={styles.detailsRow}>
          <Ionicons name="document-text-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>{medication.notes}</Text>
        </View>
      )}

      <View style={styles.buttonRow}>
        <TouchableOpacity style={styles.missedButton} onPress={handleMissedPress}>
          <Text style={styles.missedButtonText}>Missed</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.takenButton} onPress={handleTakenPress}>
          <Text style={styles.takenButtonText}>Taken</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MedicationItem;

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#1a202c', // Fixed border color as requested
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  colorCircle: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  medicationName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: COLORS.primary,
    flex: 1,
    marginRight: 8,
  },
  optionsButton: {
    padding: 4,
  },
  optionsMenu: {
    position: 'absolute',
    top: 24,
    right: 0,
    backgroundColor: COLORS.primary3,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10,
    minWidth: 120,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chatbot,
  },
  optionIcon: {
    marginRight: 8,
  },
  optionText: {
    fontSize: 15,
    color: COLORS.text,
  },
  dosage: {
    fontSize: 15,
    color: COLORS.secondary,
    marginBottom: 12,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailIcon: {
    marginRight: 8,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
  takenButton: {
    flex: 1,
    backgroundColor: COLORS.green[300],
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginRight: 8,
  },
  takenButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
  missedButton: {
    flex: 1,
    backgroundColor: COLORS.chatbot,
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
    marginLeft: 8,
  },
  missedButtonText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 16,
  },
});