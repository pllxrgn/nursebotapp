import { zodResolver } from '@hookform/resolvers/zod';
import React, { useState } from 'react';
import { Resolver, useForm } from 'react-hook-form';
import { StyleSheet, View } from 'react-native';
import { FORM_STEPS } from '../../../constants/formConstants';
import { FormProvider } from '../../../context/FormContext';
import { medicationSchema } from '../../../schemas/medicationSchema';
import type { Duration, Medication } from '../../../types/medication';
import { FormNavigation, StepIndicator } from './components';
import { AdditionalInfoStep, BasicInfoStep, DurationStep, ScheduleStep } from './steps';

interface MedicationFormContainerProps {
  onSubmit: (medication: Medication) => void;
  onCancel: () => void;
  initialValues?: Partial<Medication>;
}

// ✅ Fixed property names to match Medication interface
const defaultValues: Partial<Medication> = {
  dosage: {
    form: 'tablet',
    amount: '',
    unit: 'tablet(s)'
  },
  schedule: {
    type: 'daily',
    times: [],
    mealRelation: [],
    timePreferences: []
  },
  duration: {
    type: 'ongoing'
  } as Duration,
  storage: {},
  side_effects: [],
  interactions: [],
  refillreminder: {
    enabled: true,
    threshold: 7,
    unit: 'days'
  },
  color: '#000000'
};

const MedicationFormContainer: React.FC<MedicationFormContainerProps> = ({
  onSubmit,
  onCancel,
  initialValues = {}
}: MedicationFormContainerProps) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [isCurrentStepValid, setIsCurrentStepValid] = useState(false);
  const form = useForm<Medication>({
    defaultValues: {
      ...defaultValues,
      ...initialValues
    } as Medication,
    mode: 'onTouched',
    reValidateMode: 'onChange',
    resolver: zodResolver(medicationSchema) as Resolver<Medication>
  });

  const { formState: { isValid, errors }, handleSubmit, control, getValues, setValue, trigger } = form;

  React.useEffect(() => {
    const validateAndUpdate = async () => {
      const isStepValid = await validateCurrentStepFields();
      console.log('Step validation result:', isStepValid, 'Current errors:', form.formState.errors);
      setIsCurrentStepValid(isStepValid);
    };

    const subscription = form.watch(() => {
      validateAndUpdate();
    });

    validateAndUpdate();

    return () => subscription.unsubscribe();
  }, [currentStep, form]);

  React.useEffect(() => {
    validateCurrentStepFields().then(isValid => setIsCurrentStepValid(isValid));
  }, [currentStep]);

  const handleStepComplete = async () => {
    try {
      const fields = getStepFields(currentStep);
      const isStepValid = await form.trigger(fields);

      if (!isStepValid) {
        console.log('Step validation failed:', { step: currentStep, errors: form.formState.errors });
        return;
      }

      if (currentStep === FORM_STEPS.length - 1) {
        handleSubmit(async (data: Medication) => {
          try {
            const finalData = {
              ...data,
              id: data.id || Date.now().toString(),
              start_date: data.start_date ? new Date(data.start_date) : new Date(),
              color: data.color || '#000000',
              status: data.status || []
            } satisfies Medication;

            const isValid = await form.trigger();
            if (!isValid) {
              console.error('Final validation failed:', form.formState.errors);
              return;
            }

            await onSubmit(finalData);
          } catch (error) {
            console.error('Form submission error:', error);
          }
        })();
      } else {
        setCurrentStep(prev => prev + 1);
      }
    } catch (error) {
      console.error('Step completion error:', error);
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(prev => prev - 1);
    } else {
      onCancel();
    }
  };

  // ✅ Updated field names to match Medication type
  const getStepFields = (step: number): Array<keyof Medication> => {
    switch (step) {
      case 0:
        return ['name', 'dosage'];
      case 1:
        return ['schedule'];
      case 2:
        return ['duration', 'start_date']; // ✅ was startDate
      case 3:
        return ['color', 'storage', 'side_effects', 'interactions', 'notes', 'refillreminder'];
      default:
        return [];
    }
  };

  const validateCurrentStepFields = async () => {
    try {
      const fields = getStepFields(currentStep);
      let isValid = true;

      for (const field of fields) {
        if (field === 'dosage') {
          isValid = isValid && await form.trigger('dosage.amount');
          isValid = isValid && await form.trigger('dosage.unit');
          isValid = isValid && await form.trigger('dosage.form');
        } else {
          isValid = isValid && await form.trigger(field);
        }
      }

      return isValid;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  };

  const renderStep = () => {
    const stepProps = {
      control,
      errors,
      getValues,
      setValue,
      isLastStep: currentStep === FORM_STEPS.length - 1
    };

    switch (currentStep) {
      case 0:
        return <BasicInfoStep {...stepProps} />;
      case 1:
        return <ScheduleStep {...stepProps} />;
      case 2:
        return <DurationStep {...stepProps} />;
      case 3:
        return <AdditionalInfoStep {...stepProps} />;
      default:
        return null;
    }
  };

  return (
    <FormProvider
      form={form}
      currentStep={currentStep}
      setCurrentStep={setCurrentStep}
      totalSteps={FORM_STEPS.length}
    >
      <View style={styles.container}>
        <View style={styles.content}>
          <StepIndicator
            steps={FORM_STEPS}
            currentStep={currentStep}
          />
          {renderStep()}
        </View>
        <FormNavigation
          currentStep={currentStep + 1}
          totalSteps={FORM_STEPS.length}
          onBack={handleBack}
          onNext={() => handleStepComplete()}
          isLastStep={currentStep === FORM_STEPS.length - 1}
          isNextDisabled={!isCurrentStepValid}
        />
      </View>
    </FormProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  content: {
    flex: 1,
    paddingBottom: 80,
  }
});

export default MedicationFormContainer;
