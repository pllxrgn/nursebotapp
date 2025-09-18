import { Ionicons } from '@expo/vector-icons';
import React from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';

import type { FormNavigationProps } from '../../../../types/form';

const FormNavigation: React.FC<FormNavigationProps> = ({
  currentStep,
  totalSteps,
  onBack,
  onNext,
  isLastStep,
  isNextDisabled = false
}: FormNavigationProps) => {
  const handleNext = () => {
    if (!isNextDisabled) {
      onNext();
    }
  };

  const handleBack = () => {
    if (currentStep > 1) {
      onBack();
    }
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={handleBack}
        disabled={currentStep === 1}
      >
        <Ionicons 
          name="chevron-back" 
          size={24} 
          color={currentStep === 1 ? COLORS.secondary : COLORS.text} 
        />
        <Text style={[
          styles.backButtonText,
          currentStep === 1 && { color: COLORS.secondary }
        ]}>Back</Text>
      </TouchableOpacity>

      <Text style={styles.stepIndicator}>
        Step {currentStep} of {totalSteps}
      </Text>

      <TouchableOpacity
        style={[
          styles.nextButton,
          isNextDisabled && styles.nextButtonDisabled
        ]}
        onPress={handleNext}
        disabled={isNextDisabled}
      >
        <Text style={styles.nextButtonText}>
          {isLastStep ? 'Submit' : 'Continue'}
        </Text>
        <Ionicons name="chevron-forward" size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: COLORS.primary2,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  nextButtonDisabled: {
    backgroundColor: COLORS.secondary,
    opacity: 0.5,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  backButtonText: {
    marginLeft: 4,
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  stepIndicator: {
    fontSize: 14,
    color: COLORS.secondary,
    fontWeight: '500',
  },
  nextButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.primary,
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 8,
    minWidth: 120,
    justifyContent: 'center',
  },
  nextButtonText: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '600',
    marginRight: 4,
  },
});

export default FormNavigation;
