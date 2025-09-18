import { Ionicons } from '@expo/vector-icons';
import Constants from 'expo-constants';
import React from 'react';
import { Alert, Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
const { useState } = React;

import PillIcon from '../../assets/images/pill.png';

import AddMedicationModal from '../../components/forms/medication/AddMedicationModal';
import MedicationItem from '../../components/medication/MedicationItem';
import { LoadingSpinner } from '../../components/ui/LoadingSpinner';
import { useMedicationContext } from '../../context/MedicationContext';
import type { Medication } from '../../types/medication';

const MedicationReminderScreen: React.FC = () => {
  const statusBarHeight = Constants.statusBarHeight;
  const { medications, addMedication, deleteMedication, recordDose, isLoading, error } = useMedicationContext();
  const [showAddForm, setShowAddForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAddMedication = async (newMedication: Medication) => {
    try {
      console.log('[MedicationFlow] Starting medication add:', { 
        id: newMedication.id,
        name: newMedication.name,
        hasSchedule: !!newMedication.schedule,
        hasDosage: !!newMedication.dosage
      });
      setIsSubmitting(true);
      await addMedication(newMedication);
      console.log('[MedicationFlow] Successfully added medication:', newMedication.id);
      setShowAddForm(false);
      // Here we could add a Toast notification: "Medication added successfully"
    } catch (error) {
      console.error('[MedicationFlow] Failed to add medication:', error);
      Alert.alert(
        'Error',
        'Failed to add medication. Please try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleTaken = async (medicationId: string) => {
    try {
      console.log(`Medication ${medicationId} marked as taken`);
      await recordDose(medicationId, true);
      Alert.alert(
        'Dose Recorded',
        'Medication marked as taken successfully.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to record dose as taken:', error);
      Alert.alert(
        'Error',
        'Failed to record dose. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleMissed = async (medicationId: string) => {
    try {
      console.log(`Medication ${medicationId} marked as missed`);
      await recordDose(medicationId, false);
      Alert.alert(
        'Dose Recorded',
        'Medication marked as missed.',
        [{ text: 'OK' }]
      );
    } catch (error) {
      console.error('Failed to record dose as missed:', error);
      Alert.alert(
        'Error',
        'Failed to record dose. Please try again.',
        [{ text: 'OK' }]
      );
    }
  };

  const handleEdit = (medicationId: string) => {
    console.log(`Edit medication ${medicationId}`);
    Alert.alert(
      'Feature Coming Soon',
      'Medication editing will be available in a future update.',
      [{ text: 'OK' }]
    );
  };

  const handleDelete = async (medicationId: string) => {
    try {
      await deleteMedication(medicationId);
    } catch (error) {
      console.error('Failed to delete medication:', error);
      // You could show a toast or alert here
    }
  };


  return (
    <View style={styles.container}>
      <View
        style={{
          paddingTop: Platform.OS === 'android' ? 16 : statusBarHeight + 8,
          backgroundColor: '#fff',
          borderBottomWidth: 1,
          borderBottomColor: '#64748b',
        }}
      >
        <Text className="text-3xl font-bold text-primary px-4 pb-4">Medications</Text>
      </View>

      <View className="px-4 bg-light-background">
        <TouchableOpacity
          className="bg-[#1e293b] rounded-md px-6 py-4 mt-4 mb-4 flex-row items-center justify-center"
          onPress={() => setShowAddForm(!showAddForm)}
        >
          <Image
            source={PillIcon}
            style={{ width: 24, height: 24, tintColor: 'white', marginRight: 8 }}
          />
          <Text className="text-white font-semibold text-base">Add New Medication</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.mainContentArea}>
        <View style={styles.headerSection}>
          <Text style={styles.sectionTitle}>My Medications</Text>
          <Text style={styles.sectionSubtitle}>
            {medications.length} {medications.length === 1 ? 'medication' : 'medications'} scheduled
          </Text>
        </View>
        
        {isLoading ? (
          <View style={styles.centerContainer}>
            <LoadingSpinner />
          </View>
        ) : error ? (
          <View style={styles.errorContainer}>
            <Ionicons name="alert-circle-outline" size={32} color="#dc2626" />
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : medications.length === 0 ? (
          <View style={styles.noMedicationsContainer}>
            <Image
              source={PillIcon}
              style={styles.emptyIcon}
            />
            <Text style={styles.noMedicationsText}>
              No medications have been added yet
            </Text>
            <Text style={styles.noMedicationsSubtext}>
              Tap the "Add New Medication" button to get started
            </Text>
          </View>
        ) : (
          <ScrollView 
            contentContainerStyle={styles.medicationsList} 
            showsVerticalScrollIndicator={false}
          >
            {medications.map((med: Medication) => {
              // Skip medications without IDs - should never happen in practice
              // since we generate IDs on creation
              if (!med.id) {
                console.error('[MedicationFlow] Invalid medication found:', {
                  name: med.name,
                  hasSchedule: !!med.schedule,
                  hasDosage: !!med.dosage,
                  medication: med
                });
                return null;
              }
              
              // Store the id to ensure it's defined in the callbacks
              const id: string = med.id;
              return (
                <MedicationItem
                  key={id}
                  medication={med}
                  onTaken={() => handleTaken(id)}
                  onMissed={() => handleMissed(id)}
                  onEdit={() => handleEdit(id)}
                  onDelete={() => handleDelete(id)}
                />
              );
            })}
          </ScrollView>
        )}
      </View>


      <AddMedicationModal
        visible={showAddForm}
        onSubmit={handleAddMedication}
        onCancel={handleCancelAdd}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  mainContentArea: {
    flex: 1,
    paddingHorizontal: 16,
  },
  headerSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1a202c',
  },
  sectionSubtitle: {
    fontSize: 16,
    color: '#64748b',
    marginTop: 4,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMedicationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
  },
  emptyIcon: {
    width: 64,
    height: 64,
    tintColor: '#64748b',
    marginBottom: 16,
  },
  noMedicationsText: {
    fontSize: 20,
    fontWeight: '600',
    color: '#1a202c',
    textAlign: 'center',
    marginBottom: 8,
  },
  noMedicationsSubtext: {
    fontSize: 16,
    color: '#64748b',
    textAlign: 'center',
  },
  medicationsList: {
    paddingBottom: 20,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    fontSize: 16,
    color: '#dc2626',
    textAlign: 'center',
    marginTop: 8,
  },
});

export default MedicationReminderScreen;