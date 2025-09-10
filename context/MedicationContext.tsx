import React, { createContext, ReactNode, useContext, useState } from 'react';
import type { Medication } from '../types/medication'; // Assuming Medication type is defined here

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => void;
  deleteMedication: (id: string) => void;
  refreshMedications: () => Promise<void>;
  // Add other actions like updateMedication, markAsTaken/Missed if needed globally
}

const MedicationContext = createContext<MedicationContextType | undefined>(undefined);

export const MedicationProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [medications, setMedications] = useState<Medication[]>([]);

  const addMedication = (medication: Medication) => {
    setMedications((prevMeds) => [...prevMeds, medication]);
  };

  const deleteMedication = (id: string) => {
    setMedications((prevMeds) => prevMeds.filter((med) => med.id !== id));
  };

  const refreshMedications = async () => {
    // In a real app, this would fetch from an API
    // For now, we'll just simulate a delay
    await new Promise(resolve => setTimeout(resolve, 1000));
    return Promise.resolve();
  };

  return (
    <MedicationContext.Provider value={{ 
      medications, 
      addMedication, 
      deleteMedication,
      refreshMedications 
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