import Constants from 'expo-constants';
import React, { useState } from 'react';
import { Image, Platform, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

import PillIcon from '../../assets/images/pill.png';

import AddMedicationForm from '../../components/AddMedicationForm';
import MedicationItem from '../../components/MedicationItem';
import { useMedicationContext } from '../../context/MedicationContext';
import type { Medication } from '../../types/medication';

const MedicationReminderScreen: React.FC = () => {
  const statusBarHeight = Constants.statusBarHeight;
  const { medications, addMedication, deleteMedication } = useMedicationContext();
  const [showAddForm, setShowAddForm] = useState(false);

  const handleAddMedication = (newMedication: Medication) => {
    addMedication(newMedication);
    setShowAddForm(false);
  };

  const handleCancelAdd = () => {
    setShowAddForm(false);
  };

  const handleTaken = (medicationId: string) => {
    console.log(`Medication ${medicationId} marked as taken`);
  };

  const handleMissed = (medicationId: string) => {
    console.log(`Medication ${medicationId} marked as missed`);
  };

  const handleEdit = (medicationId: string) => {
    console.log(`Edit medication ${medicationId}`);
  };

  const handleDelete = (medicationId: string) => {
    console.log(`Delete medication ${medicationId}`);
    deleteMedication(medicationId);
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
        <Text className="text-xl font-bold text-text mb-4">My Medications</Text>
        {medications.length === 0 ? (
          <View style={styles.noMedicationsContainer}>
            <Text style={styles.noMedicationsText}>
              no medicines has been added yet. ;)
            </Text>
          </View>
        ) : (
          <ScrollView contentContainerStyle={styles.medicationsList} showsVerticalScrollIndicator={false}>
            {medications.map((med) => (
              <MedicationItem
                key={med.id}
                medication={med}
                onTaken={() => handleTaken(med.id)}
                onMissed={() => handleMissed(med.id)}
                onEdit={() => handleEdit(med.id)}
                onDelete={() => handleDelete(med.id)}
              />
            ))}
          </ScrollView>
        )}
      </View>


      {showAddForm && (
        <AddMedicationForm
          visible={showAddForm}
          onAddMedication={handleAddMedication}
          onCancel={handleCancelAdd}
        />
      )}
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
  noMedicationsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  noMedicationsText: {
    fontSize: 18,
    color: '#64748b',
    textAlign: 'center',
  },
  medicationsList: {
    paddingBottom: 20,
  },
});

export default MedicationReminderScreen;