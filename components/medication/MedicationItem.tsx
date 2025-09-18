import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../constants/colors';
import type { DayOfWeek, Medication } from '../../types/medication';
import { isCustomSchedule, isMonthlySchedule, isWeeklySchedule } from '../../types/typeGuards';
import { Button } from '../ui';
const { useState } = React;

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
}: MedicationItemProps) => {
  const [showOptions, setShowOptions] = useState(false);

  const handleOptionsPress = () => {
    setShowOptions((prev: boolean) => !prev);
  };

  const handleEditPress = () => {
    setShowOptions(false);
    onEdit();
  };

  const handleDeletePress = () => {
    setShowOptions(false);
    // Only call delete if we have an id
    if (medication.id) {
      onDelete();
    }
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

      <Text style={styles.dosage}>
        {medication.dosage.amount} {medication.dosage.unit}
        {medication.dosage.form && ` (${medication.dosage.form})`}
      </Text>

      {/* Schedule Information */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.detailsRow}>
          <Ionicons name="time-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>
            {medication.schedule.type.charAt(0).toUpperCase() + medication.schedule.type.slice(1)}
            {isCustomSchedule(medication.schedule) && 
              ` (Every ${medication.schedule.interval} days)`}
            {isWeeklySchedule(medication.schedule) && 
              ` (${medication.schedule.days.map((day: DayOfWeek) => 
                day.charAt(0).toUpperCase() + day.slice(1)
              ).join(', ')})`}
            {isMonthlySchedule(medication.schedule) && 
              ` (Days: ${medication.schedule.daysOfMonth.join(', ')})`}
          </Text>
        </View>

        <View style={styles.detailsRow}>
          <Ionicons name="alarm-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>
            Times: {medication.schedule.times.join(', ')}
          </Text>
        </View>

        {medication.schedule.mealRelation && medication.schedule.mealRelation.length > 0 && (
          <View style={styles.detailsRow}>
            <Ionicons name="restaurant-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
            <Text style={styles.detailText}>
              {medication.schedule.mealRelation.map((rel: NonNullable<Medication['schedule']['mealRelation']>[number]) => 
                `${rel.timing} ${rel.meal}${rel.offsetMinutes ? ` (${rel.offsetMinutes} mins)` : ''}`
              ).join(', ')}
            </Text>
          </View>
        )}
      </View>

      {/* Duration Information */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Duration</Text>
        <View style={styles.detailsRow}>
          <Ionicons name="calendar-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
          <Text style={styles.detailText}>
            Started: {medication.startDate ? medication.startDate.toLocaleDateString() : 'Not set'}
            {medication.duration.type === 'endDate' && medication.duration.endDate && 
              ` → ${medication.duration.endDate.toLocaleDateString()}`}
            {medication.duration.type === 'numberOfDays' && medication.duration.value && 
              ` (${medication.duration.value} days)`}
            {medication.duration.type === 'numberOfWeeks' && medication.duration.value && 
              ` (${medication.duration.value} weeks)`}
            {medication.duration.type === 'ongoing' && 
              ' (Ongoing)'}
          </Text>
        </View>
      </View>

      {/* Additional Information */}
      {(medication.notes || 
        (medication.sideEffects && medication.sideEffects.length > 0) || 
        (medication.interactions && medication.interactions.length > 0) || 
        medication.storage) && (
        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Additional Information</Text>
          {medication.notes && (
            <View style={styles.detailsRow}>
              <Ionicons name="document-text-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>{medication.notes}</Text>
            </View>
          )}
          
          {medication.sideEffects && medication.sideEffects.length > 0 && (
            <View style={styles.detailsRow}>
              <Ionicons name="warning-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>Side Effects: {medication.sideEffects.join(', ')}</Text>
            </View>
          )}

          {medication.interactions && medication.interactions.length > 0 && (
            <View style={styles.detailsRow}>
              <Ionicons name="alert-circle-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>Interactions: {medication.interactions.join(', ')}</Text>
            </View>
          )}

          {medication.storage && (
            <View style={styles.detailsRow}>
              <Ionicons name="thermometer-outline" size={16} color={COLORS.secondary} style={styles.detailIcon} />
              <Text style={styles.detailText}>
                Storage: {[
                  medication.storage.temperature,
                  medication.storage.light,
                  medication.storage.special
                ].filter(Boolean).join(', ')}
              </Text>
            </View>
          )}
        </View>
      )}

      <View style={styles.buttonRow}>
        <Button
          title="Missed"
          variant="outline"
          onPress={handleMissedPress}
          style={styles.actionButton}
        />
        <Button
          title="Taken"
          variant="primary"
          onPress={handleTakenPress}
          style={styles.actionButton}
        />
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
    borderColor: '#1a202c',
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 3,
  },
  actionButton: {
    flex: 1,
    marginHorizontal: 4,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
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
  sectionContainer: {
    marginTop: 12,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.primary,
    marginBottom: 8,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    paddingRight: 8,
  },
  detailIcon: {
    marginRight: 8,
    marginTop: 2,
  },
  detailText: {
    fontSize: 14,
    color: COLORS.text,
    flex: 1,
    lineHeight: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    marginTop: 16,
    justifyContent: 'space-between',
  },
});
