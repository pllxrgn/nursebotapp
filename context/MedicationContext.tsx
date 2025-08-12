import React, { createContext, useContext, useState, ReactNode } from 'react';
import type { Medication } from '../types/medication'; // Assuming Medication type is defined here

interface MedicationContextType {
  medications: Medication[];
  addMedication: (medication: Medication) => void;
  deleteMedication: (id: string) => void;
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

  // You might add updateMedication, markAsTaken, markAsMissed functions here
  // const updateMedication = (updatedMed: Medication) => { ... }
  // const markAsTaken = (id: string) => { ... }
  // const markAsMissed = (id: string) => { ... }


  return (
    <MedicationContext.Provider value={{ medications, addMedication, deleteMedication }}>
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