import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import { Medication } from '../../types/medication';

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
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.name}>{medication.name}</Text>
        <View style={[styles.colorDot, { backgroundColor: medication.color }]} />
      </View>

      {/* Dosage */}
      <Text style={styles.detailText}>
        {medication.dosage.amount} {medication.dosage.unit} ({medication.dosage.form})
      </Text>

      {/* Notes */}
      {medication.notes && (
        <Text style={styles.notes}>Notes: {medication.notes}</Text>
      )}

      {/* Side Effects */}
      {medication.side_effects && medication.side_effects.length > 0 && (
        <View style={styles.detailsRow}>
          <Ionicons
            name="warning-outline"
            size={16}
            color={COLORS.secondary}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            Side Effects: {medication.side_effects.join(', ')}
          </Text>
        </View>
      )}

      {/* Interactions */}
      {medication.interactions && medication.interactions.length > 0 && (
        <View style={styles.detailsRow}>
          <Ionicons
            name="alert-circle-outline"
            size={16}
            color={COLORS.secondary}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            Interactions: {medication.interactions.join(', ')}
          </Text>
        </View>
      )}

      {/* Refill Reminder */}
      {medication.refillreminder?.enabled && (
        <View style={styles.detailsRow}>
          <Ionicons
            name="refresh-outline"
            size={16}
            color={COLORS.secondary}
            style={styles.detailIcon}
          />
          <Text style={styles.detailText}>
            Refill Reminder: {medication.refillreminder.threshold}{' '}
            {medication.refillreminder.unit} left
          </Text>
        </View>
      )}

      {/* Action buttons */}
      <View style={styles.actions}>
        <TouchableOpacity onPress={onTaken} style={styles.actionButton}>
          <Ionicons name="checkmark-circle-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onMissed} style={styles.actionButton}>
          <Ionicons name="close-circle-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onEdit} style={styles.actionButton}>
          <Ionicons name="create-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
        <TouchableOpacity onPress={onDelete} style={styles.actionButton}>
          <Ionicons name="trash-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.primary2,
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  name: {
    fontSize: 16,
    fontWeight: 'bold',
    color: COLORS.text,
  },
  colorDot: {
    width: 14,
    height: 14,
    borderRadius: 7,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.secondary,
    marginBottom: 4,
  },
  notes: {
    fontSize: 13,
    color: COLORS.secondary,
    fontStyle: 'italic',
    marginBottom: 6,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  detailIcon: {
    marginRight: 6,
  },
  actions: {
    flexDirection: 'row',
    marginTop: 10,
    justifyContent: 'flex-end',
  },
  actionButton: {
    marginLeft: 12,
  },
});

export default MedicationItem;
