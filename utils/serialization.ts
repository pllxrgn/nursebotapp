import type { Duration, Medication } from "../types/medication";

type ISODate = string;

// Serializable version of Duration with Date converted to string
type SerializableDuration = Omit<Duration, 'endDate'> & {
  endDate?: ISODate;
};

// Type for serializable medication (with Date objects converted to ISO strings)
type SerializableMedicationStatus = {
  taken: boolean;
  date: ISODate;
  time: string;
};

type SerializableMedication = Omit<Medication, "startDate" | "duration" | "status"> & {
  startDate?: ISODate;
  duration: SerializableDuration;
  status?: SerializableMedicationStatus[];
};

/**
 * Converts a Medication object to a serializable format for storage
 * Converts Date objects to ISO strings
 */
export const serializeMedication = (medication: Medication): SerializableMedication => {
  const serializedDuration: SerializableDuration = {
    ...medication.duration,
    endDate: medication.duration.endDate ? medication.duration.endDate.toISOString() : undefined
  };

  const serializedStatus = medication.status?.map(status => ({
    ...status,
    date: status.date.toISOString()
  }));

  return {
    ...medication,
    startDate: medication.startDate?.toISOString(),
    duration: serializedDuration,
    status: serializedStatus
  };
};

/**
 * Converts a serializable medication back to a Medication object
 * Converts ISO strings back to Date objects
 */
export const deserializeMedication = (serialized: SerializableMedication): Medication => {
  try {
    const duration: Duration = {
      ...serialized.duration,
      endDate: serialized.duration.endDate ? new Date(serialized.duration.endDate) : undefined
    };

    // Validate that endDate is a valid date if it exists
    if (duration.endDate && isNaN(duration.endDate.getTime())) {
      console.warn('[Serialization] Invalid endDate found, setting to undefined');
      duration.endDate = undefined;
    }

    const status = serialized.status?.map(status => {
      const date = new Date(status.date);
      // Validate that the date is valid
      if (isNaN(date.getTime())) {
        console.warn('[Serialization] Invalid status date found, using current date');
        return { ...status, date: new Date() };
      }
      return { ...status, date };
    });

    const startDate = serialized.startDate ? new Date(serialized.startDate) : undefined;
    // Validate startDate if it exists
    if (startDate && isNaN(startDate.getTime())) {
      console.warn('[Serialization] Invalid startDate found, setting to undefined');
    }

    return {
      ...serialized,
      startDate: startDate && !isNaN(startDate.getTime()) ? startDate : undefined,
      duration: duration,
      status: status
    };
  } catch (error) {
    console.error('[Serialization] Failed to deserialize medication:', error);
    throw new Error('Failed to deserialize medication data');
  }
};

/**
 * Serializes an array of medications for storage
 */
export const serializeMedications = (medications: Medication[]): SerializableMedication[] => {
  return medications.map(serializeMedication);
};

/**
 * Deserializes an array of medications from storage
 */
export const deserializeMedications = (serialized: SerializableMedication[]): Medication[] => {
  return serialized.map(deserializeMedication);
};