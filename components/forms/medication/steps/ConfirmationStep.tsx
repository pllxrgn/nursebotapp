import React from 'react';
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import type { Medication } from '../../../../types/medication';

interface ConfirmationStepProps {
  onSubmit: (data: Partial<Medication>) => void;
  onBack: () => void;
  data: Partial<Medication>;
}

const ConfirmationStep: React.FC<ConfirmationStepProps> = ({ onSubmit, onBack, data }) => {
  const formatTime = (time: string) => {
    try {
      const [hours, minutes] = time.split(':');
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    } catch {
      return time;
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Medication Name:</Text>
          <Text style={styles.value}>{data.name}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Dosage:</Text>
          <Text style={styles.value}>
            {data.dosage?.amount} {data.dosage?.unit}
            {data.dosage?.form && ` (${data.dosage.form})`}
          </Text>
        </View>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Schedule</Text>
        <View style={styles.infoRow}>
          <Text style={styles.label}>Frequency:</Text>
          <Text style={styles.value}>
            {data.frequency?.type === 'daily' ? 'Daily' : 'Weekly'}
          </Text>
        </View>
        {data.frequency?.type === 'weekly' && data.frequency.schedule.days && (
          <View style={styles.infoRow}>
            <Text style={styles.label}>Days:</Text>
            <Text style={styles.value}>
              {data.frequency.schedule.days
                .map(day => day.charAt(0).toUpperCase() + day.slice(1))
                .join(', ')}
            </Text>
          </View>
        )}
        <View style={styles.infoRow}>
          <Text style={styles.label}>Times:</Text>
          <Text style={styles.value}>
            {data.frequency?.schedule.times
              .map(time => formatTime(time))
              .join(', ')}
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onBack}>
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.submitButton}
          onPress={() => onSubmit(data)}
        >
          <Text style={[styles.buttonText, styles.submitButtonText]}>
            Add Medication
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: COLORS.primary2,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  label: {
    flex: 1,
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  value: {
    flex: 2,
    fontSize: 14,
    color: COLORS.text,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 24,
    marginBottom: 32,
  },
  backButton: {
    flex: 1,
    marginRight: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.primary3,
    alignItems: 'center',
  },
  submitButton: {
    flex: 1,
    marginLeft: 8,
    padding: 16,
    borderRadius: 8,
    backgroundColor: COLORS.green[300],
    alignItems: 'center',
  },
  buttonText: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  submitButtonText: {
    color: COLORS.primary2,
  },
});

export default ConfirmationStep;
