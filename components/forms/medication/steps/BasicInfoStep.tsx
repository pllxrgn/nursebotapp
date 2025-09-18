import React from 'react';
import { Controller } from 'react-hook-form';
import { StyleSheet, Text, TextInput, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';
import { FORM_UNITS, MEDICATION_FORMS } from '../../../../constants/medicationConstants';
import { MedicationForm } from '../../../../types/medication.d';
import Dropdown from '../../../ui/Dropdown';

import type { StepProps } from '../../../../types/form';

const BasicInfoStep: React.FC<StepProps> = ({ control, errors, getValues, setValue }) => {
  const formType = getValues('dosage.form') as MedicationForm || MEDICATION_FORMS[0];
  
  // Update unit when form type changes
  React.useEffect(() => {
    const currentUnit = getValues('dosage.unit');
    const availableUnits = FORM_UNITS[formType];
    if (!availableUnits.includes(currentUnit)) {
      setValue('dosage.unit', availableUnits[0], { shouldValidate: true });
    }
  }, [formType, setValue, getValues]);

  return (
    <View style={styles.container}>
      <View style={styles.formContent}>
        <View style={styles.field}>
          <Text style={styles.label}>Medication Name</Text>
          <Controller
            control={control}
            name="name"

            render={({ field: { onChange, value } }) => (
              <TextInput
                style={[styles.input, errors.name && styles.inputError]}
                value={value}
                onChangeText={onChange}
                placeholder="Enter medication name"
                placeholderTextColor={COLORS.secondary}
                returnKeyType="next"
              />
            )}
          />
          {errors.name && (
            <Text style={styles.errorText}>{errors.name.message}</Text>
          )}
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Medication Type</Text>
          <Controller
            control={control}
            name="dosage.form"
            render={({ field: { onChange, value } }) => (
              <Dropdown<MedicationForm>
                value={value || MEDICATION_FORMS[0]}
                placeholder="Select medication type"
                options={MEDICATION_FORMS.map(form => ({
                  label: form.charAt(0).toUpperCase() + form.slice(1),
                  value: form
                }))}
                onChange={(value: MedicationForm) => {
                  onChange(value);
                  setValue('dosage.unit', FORM_UNITS[value][0]);
                }}
                error={!!errors.dosage?.form}
              />
            )}
          />
        </View>

        <View style={styles.field}>
          <Text style={styles.label}>Dosage</Text>
          <View style={styles.dosageContainer}>
            <Controller
              control={control}
              name="dosage.amount"
              render={({ field: { onChange, value, onBlur } }) => (
                <TextInput
                  style={[
                    styles.dosageInput, 
                    errors.dosage?.amount && styles.inputError
                  ]}
                  value={value}
                  onChangeText={(text) => {
                    // Remove any non-numeric characters except decimal point
                    const sanitizedText = text.replace(/[^0-9.]/g, '');
                    // Ensure only one decimal point
                    const parts = sanitizedText.split('.');
                    const cleanedText = parts.length > 2 
                      ? `${parts[0]}.${parts.slice(1).join('')}`
                      : sanitizedText;
                    onChange(cleanedText);
                  }}
                  onBlur={() => {
                    // Format the number on blur
                    if (value) {
                      const num = parseFloat(value);
                      if (!isNaN(num)) {
                        onChange(num.toString());
                      }
                    }
                    onBlur();
                  }}
                  placeholder="Enter amount"
                  keyboardType="decimal-pad"
                  placeholderTextColor={COLORS.secondary}
                  returnKeyType="next"
                />
              )}
            />
            <View style={{ flex: 1.5 }}>
              <Controller
                control={control}
                name="dosage.unit"

                render={({ field: { onChange, value } }) => (
                  <Dropdown<string>
                    value={value}
                    placeholder="Select unit"
                    options={FORM_UNITS[formType].map((unit: string) => ({
                      label: unit,
                      value: unit
                    }))}
                    onChange={onChange}
                    error={!!errors.dosage?.unit}
                  />
                )}
              />
            </View>
          </View>
          <View style={styles.validationContainer}>
            {errors.dosage?.amount && (
              <Text style={styles.errorText}>{errors.dosage.amount.message}</Text>
            )}
            {errors.dosage?.unit && (
              <Text style={styles.errorText}>{errors.dosage.unit.message}</Text>
            )}
            {!errors.dosage?.amount && !errors.dosage?.unit && (
              <Text style={styles.helperText}>
                Enter the amount and select the appropriate unit
              </Text>
            )}
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F3F4F6',
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
  validationContainer: {
    marginTop: 4,
    minHeight: 20,
  },
});

export default BasicInfoStep;