import React, { useState } from 'react';
import { StyleSheet, View } from 'react-native';
import type { Medication } from '../../../types/medication';
import { FormNavigation, StepIndicator } from './components';
import { AdditionalInfoStep, BasicInfoStep, DurationStep, ScheduleStep } from './steps';

export const FORM_STEPS = [
  {
    id: 'basics',
    title: 'Basic Information',
    description: 'Enter medication name, dosage, and form'
  },
  {
    id: 'schedule',
    title: 'Schedule',
    description: 'Set when to take the medication'
  },
  {
    id: 'duration',
    title: 'Duration',
    description: 'Set how long to take the medication'
  },
  {
    id: 'additional',
    title: 'Additional Information',
    description: 'Add any other important details'
  }
] as const;

interface MedicationFormContainerProps {
  onSubmit: (medication: Medication) => void;
  onCancel: () => void;
  initialValues?: Partial<Medication>;
}

const MedicationFormContainer: React.FC<MedicationFormContainerProps> = ({
  onSubmit,
  onCancel,
  initialValues
}) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [formData, setFormData] = useState<Partial<Medication>>(initialValues || {});

  const handleStepComplete = (stepData?: Partial<Medication>) => {
    if (stepData) {
      setFormData(prev => ({ ...prev, ...stepData }));
    }
    if (currentStep < FORM_STEPS.length - 1) {
      setCurrentStep(prev => prev + 1);
    } else {
      onSubmit(formData as Medication);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return <BasicInfoStep onNext={handleStepComplete} data={formData} />;
      case 1:
        return <ScheduleStep onNext={handleStepComplete} data={formData} />;
      case 2:
        return <DurationStep onNext={handleStepComplete} data={formData} />;
      case 3:
        return <AdditionalInfoStep onNext={handleStepComplete} data={formData} />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StepIndicator 
        steps={FORM_STEPS} 
        currentStep={currentStep} 
      />
      {renderStep()}
      <FormNavigation
        currentStep={currentStep}
        totalSteps={FORM_STEPS.length}
        onBack={handleBack}
        onNext={handleStepComplete}
        isLastStep={currentStep === FORM_STEPS.length - 1}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  }
});

export default MedicationFormContainer;
