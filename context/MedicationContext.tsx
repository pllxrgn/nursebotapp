import React from 'react';
import { medicationStorage } from '../services/medicationStorage';
import type { Medication } from '../types/medication';
const { createContext, useContext, useState, useEffect } = React;
type ReactNode = React.ReactNode;

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => Promise<void>;
  deleteMedication: (id: string) => Promise<void>;
  updateMedication: (id: string, updates: Partial<Medication>) => Promise<void>;
  refreshMedications: () => Promise<void>;
  recordDose: (medicationId: string, taken: boolean, time?: string) => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

type MedicationProviderProps = {
  children?: React.ReactNode;
};

export const MedicationProvider: React.FC<MedicationProviderProps> = ({ children }: MedicationProviderProps) => {
  const [medications, setMedications] = useState<Medication[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Load medications from storage on app start
  useEffect(() => {
    loadMedicationsFromStorage();
  }, []);

  const loadMedicationsFromStorage = async () => {
    try {
      console.log('[MedicationFlow] Loading medications from storage');
      setIsLoading(true);
      setError(null);
      const storedMedications = await medicationStorage.loadMedications();
      console.log('[MedicationFlow] Successfully loaded medications:', {
        count: storedMedications.length,
        medications: storedMedications.map(m => ({ id: m.id, name: m.name }))
      });
      setMedications(storedMedications);
    } catch (err) {
      console.error('[MedicationFlow] Failed to load medications:', err);
      setError('Failed to load medications');
    } finally {
      setIsLoading(false);
    }
  };

  const addMedication = async (medication: Medication) => {
    try {
      console.log('[MedicationFlow] Adding medication to context:', {
        id: medication.id,
        name: medication.name,
        schedule: medication.schedule.type
      });
      setError(null);
      const updatedMedications = await medicationStorage.addMedication(medication);
      console.log('[MedicationFlow] Successfully updated medications list:', {
        count: updatedMedications.length,
        newMedication: { id: medication.id, name: medication.name }
      });
      setMedications(updatedMedications);
    } catch (err) {
      console.error('[MedicationFlow] Failed to add medication:', err);
      setError('Failed to add medication');
      throw err;
    }
  };

  const deleteMedication = async (id: string) => {
    try {
      setError(null);
      const updatedMedications = await medicationStorage.deleteMedication(id);
      setMedications(updatedMedications);
    } catch (err) {
      console.error('Failed to delete medication:', err);
      setError('Failed to delete medication');
      throw err;
    }
  };

  const updateMedication = async (id: string, updates: Partial<Medication>) => {
    try {
      setError(null);
      const updatedMedications = await medicationStorage.updateMedication(id, updates);
      setMedications(updatedMedications);
    } catch (err) {
      console.error('Failed to update medication:', err);
      setError('Failed to update medication');
      throw err;
    }
  };

  const refreshMedications = async () => {
    await loadMedicationsFromStorage();
  };

  const recordDose = async (medicationId: string, taken: boolean, time?: string) => {
    try {
      console.log('[MedicationFlow] Recording dose:', { medicationId, taken, time });
      setError(null);
      
      const currentTime = time || new Date().toLocaleTimeString('en-US', { 
        hour: '2-digit', 
        minute: '2-digit',
        hour12: true 
      });
      
      const doseRecord = {
        taken,
        date: new Date(),
        time: currentTime
      };

      // Find the medication and update its status
      const medication = medications.find(med => med.id === medicationId);
      if (!medication) {
        throw new Error('Medication not found');
      }

      const currentStatus = medication.status || [];
      const updatedStatus = [...currentStatus, doseRecord];

      await updateMedication(medicationId, { status: updatedStatus });
      
      console.log('[MedicationFlow] Successfully recorded dose:', { medicationId, taken });
    } catch (err) {
      console.error('[MedicationFlow] Failed to record dose:', err);
      setError('Failed to record dose');
      throw err;
    }
  };

  return (
    <MedicationContext.Provider value={{ 
      medications, 
      addMedication, 
      deleteMedication,
      updateMedication,
      refreshMedications,
      recordDose,
      isLoading,
      error
    }}>
      {children}
    </MedicationContext.Provider>
  );
};

export const useMedicationContext = () => {
  const context = useContext(MedicationContext);
  if (context === undefined) {
    throw new Error('useMedicationContext must be used within a MedicationProvider');
  }
  return context;
};