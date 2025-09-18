import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Medication } from "../types/medication";
import { serializeMedications, deserializeMedications } from "../utils/serialization";

const STORAGE_KEY = "@nursebot:medications";

export interface MedicationStorageService {
  saveMedications(medications: Medication[]): Promise<void>;
  loadMedications(): Promise<Medication[]>;
  clearMedications(): Promise<void>;
  addMedication(medication: Medication): Promise<Medication[]>;
  deleteMedication(id: string): Promise<Medication[]>;
  updateMedication(id: string, updates: Partial<Medication>): Promise<Medication[]>;
}

class MedicationStorageServiceImpl implements MedicationStorageService {
  /**
   * Save medications to AsyncStorage
   */
  async saveMedications(medications: Medication[]): Promise<void> {
    try {
      console.log('[MedicationFlow] Serializing medications:', {
        count: medications.length,
        medications: medications.map(m => ({ id: m.id, name: m.name }))
      });
      const serialized = serializeMedications(medications);
      const jsonString = JSON.stringify(serialized);
      await AsyncStorage.setItem(STORAGE_KEY, jsonString);
      console.log('[MedicationFlow] Successfully saved medications to storage');
    } catch (error) {
      console.error("[MedicationFlow] Failed to save medications:", error);
      throw new Error("Failed to save medications to storage");
    }
  }

  /**
   * Load medications from AsyncStorage
   */
  async loadMedications(): Promise<Medication[]> {
    try {
      console.log('[MedicationFlow] Loading medications from AsyncStorage');
      const jsonString = await AsyncStorage.getItem(STORAGE_KEY);
      if (!jsonString) {
        console.log('[MedicationFlow] No medications found in storage');
        return [];
      }
      
      const serialized = JSON.parse(jsonString);
      
      // Validate that the parsed data is an array
      if (!Array.isArray(serialized)) {
        console.error('[MedicationFlow] Invalid data format in storage, expected array');
        // Clear corrupted data and return empty array
        await this.clearMedications();
        return [];
      }
      
      const medications = deserializeMedications(serialized);
      console.log('[MedicationFlow] Successfully loaded medications:', {
        count: medications.length,
        medications: medications.map(m => ({ id: m.id, name: m.name }))
      });
      return medications;
    } catch (error) {
      console.error("[MedicationFlow] Failed to load medications:", error);
      
      // If JSON parsing fails, clear corrupted data
      if (error instanceof SyntaxError) {
        console.log('[MedicationFlow] Clearing corrupted storage data');
        try {
          await this.clearMedications();
        } catch (clearError) {
          console.error('[MedicationFlow] Failed to clear corrupted data:', clearError);
        }
      }
      
      // Return empty array instead of throwing to prevent app crashes
      return [];
    }
  }

  /**
   * Clear all medications from storage
   */
  async clearMedications(): Promise<void> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear medications:", error);
      throw new Error("Failed to clear medications from storage");
    }
  }

  /**
   * Add a single medication and return updated list
   */
  async addMedication(medication: Medication): Promise<Medication[]> {
    try {
      const existingMedications = await this.loadMedications();
      const updatedMedications = [...existingMedications, medication];
      await this.saveMedications(updatedMedications);
      return updatedMedications;
    } catch (error) {
      console.error("Failed to add medication:", error);
      throw new Error("Failed to add medication to storage");
    }
  }

  /**
   * Delete a medication by ID and return updated list
   */
  async deleteMedication(id: string): Promise<Medication[]> {
    try {
      const existingMedications = await this.loadMedications();
      const updatedMedications = existingMedications.filter(med => med.id !== id);
      await this.saveMedications(updatedMedications);
      return updatedMedications;
    } catch (error) {
      console.error("Failed to delete medication:", error);
      throw new Error("Failed to delete medication from storage");
    }
  }

  /**
   * Update a medication by ID and return updated list
   */
  async updateMedication(id: string, updates: Partial<Medication>): Promise<Medication[]> {
    try {
      const existingMedications = await this.loadMedications();
      const updatedMedications = existingMedications.map(med => 
        med.id === id ? { ...med, ...updates } : med
      );
      await this.saveMedications(updatedMedications);
      return updatedMedications;
    } catch (error) {
      console.error("Failed to update medication:", error);
      throw new Error("Failed to update medication in storage");
    }
  }
}

// Export singleton instance
export const medicationStorage = new MedicationStorageServiceImpl();