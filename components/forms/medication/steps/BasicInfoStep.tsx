import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { MEDICATION_FORMS } from '../../../../constants/medicationConstants';
import type { DosageInfo, Medication, MedicationForm } from '../../../../types/medication';
import Dropdown from '../../../ui/Dropdown';

// Define units for each medication form
const FORM_UNITS: { [key in MedicationForm]: string[] } = {
  tablet: ['tablet(s)'],
  capsule: ['capsule(s)'],
  liquid: ['mL', 'mg/mL'],
  injection: ['mL', 'mg', 'unit(s)'],
  syrup: ['mL', 'mg/5mL'],
  powder: ['g', 'mg'],
  inhaler: ['puff(s)'],
  drops: ['drop(s)'],
  spray: ['spray(s)'],
  cream: ['g'],
  patch: ['patch(es)'],
  other: ['mg', 'g', 'mcg', 'mL', 'unit(s)']
};

interface BasicInfoStepProps {
  onNext: (data: Partial<Medication>) => void;
  data: Partial<Medication> & {
    dosage?: Partial<DosageInfo>;
  };
}

const BasicInfoStep: React.FC<BasicInfoStepProps> = ({ onNext, data }) => {
  const [name, setName] = useState(data.name || '');
  const [dosage, setDosage] = useState<DosageInfo>({
    amount: data.dosage?.amount || '',
    unit: data.dosage?.unit || '',
    form: data.dosage?.form || MEDICATION_FORMS[0]
  });
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [formType, setFormType] = useState(data.dosage?.form || MEDICATION_FORMS[0]);

  // Update units when form type changes
  useEffect(() => {
    // Always update the unit when form type changes
    setDosage(prev => ({
      ...prev,
      unit: FORM_UNITS[formType][0],
      form: formType
    }));
    // Clear any existing unit-related errors
    setErrors(prev => ({ ...prev, unit: '' }));
  }, [formType]);

  const validate = (): boolean => {
    const newErrors: { [key: string]: string } = {};

    if (!name.trim()) {
      newErrors.name = 'Medication name is required';
    }
    if (!dosage.amount) {
      newErrors.amount = 'Dosage amount is required';
    } else if (isNaN(Number(dosage.amount)) || Number(dosage.amount) <= 0) {
      newErrors.amount = 'Please enter a valid amount';
    }
    if (!dosage.unit) {
      newErrors.unit = 'Please select a unit';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validate()) {
      onNext({
        name,
        dosage: {
          ...dosage,
          form: formType
        }
      });
    }
  };

  const isFormValid = name.trim() && dosage.amount && !isNaN(Number(dosage.amount)) && Number(dosage.amount) > 0 && dosage.unit;

  return (
    <View style={styles.container}>
      <View style={styles.formContent}>
        <View style={styles.field}>
          <Text style={styles.label}>Medication Name</Text>
          <TextInput
            style={[styles.input, errors.name && styles.inputError]}
            value={name}
            onChangeText={setName}
            placeholder="Enter medication name"
            placeholderTextColor={COLORS.secondary}
            returnKeyType="next"
          />
          {errors.name && <Text style={styles.errorText}>{errors.name}</Text>}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Medication Type</Text>
          <Dropdown<MedicationForm>
            value={formType}
            placeholder="Select medication type"
            options={MEDICATION_FORMS.map(form => ({
              label: form.charAt(0).toUpperCase() + form.slice(1),
              value: form
            }))}
            onChange={(value) => {
              setFormType(value);
              setDosage(prev => ({
                ...prev,
                unit: FORM_UNITS[value][0]
              }));
            }}
            error={!!errors.form}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Dosage</Text>
          <View style={styles.dosageContainer}>
            <TextInput
              style={[styles.dosageInput, errors.amount && styles.inputError]}
              value={dosage.amount}
              onChangeText={(value) => setDosage({ ...dosage, amount: value })}
              placeholder="Enter amount"
              keyboardType="decimal-pad"
              placeholderTextColor={COLORS.secondary}
              returnKeyType="next"
            />
            <View style={{ flex: 1.2 }}>
              <Dropdown<string>
                value={dosage.unit}
                placeholder="Select unit"
                options={FORM_UNITS[formType].map(unit => ({
                  label: unit,
                  value: unit
                }))}
                onChange={(value) => setDosage(prev => ({ ...prev, unit: value }))}
                error={!!errors.unit}
              />
            </View>
          </View>
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}
          {errors.unit && <Text style={styles.errorText}>{errors.unit}</Text>}
        </View>


      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  formContent: {
    padding: 16,
  },
  field: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.primary3,
    height: 50,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  errorText: {
    color: COLORS.error,
    fontSize: 12,
    marginTop: 4,
  },
  dosageContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  dosageInput: {
    flex: 2,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.primary3,
    height: 50,
  },

  helperText: {
    fontSize: 12,
    color: COLORS.secondary,
    marginTop: 4,
    marginBottom: 8,
  },
  nextButton: {
    marginTop: 24,
  },
});

export default BasicInfoStep;
