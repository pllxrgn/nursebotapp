import { Control, FieldErrors, UseFormGetValues, UseFormReturn, UseFormSetValue } from 'react-hook-form';
import { Medication } from './medication';

export interface FormContextType {
  form: UseFormReturn<Medication, any>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

export interface StepProps {
  control: Control<Medication>;
  errors: FieldErrors<Medication>;
  getValues: UseFormGetValues<Medication>;
  setValue: UseFormSetValue<Medication>;
  isLastStep: boolean;
}

export interface FormNavigationProps {
  currentStep: number;
  totalSteps: number;
  onBack: () => void;
  onNext: () => void;
  isLastStep: boolean;
  isNextDisabled: boolean;
}

export interface StepIndicatorProps {
  steps: typeof import('../constants/formConstants').FORM_STEPS;
  currentStep: number;
}