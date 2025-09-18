import React, { createContext, ReactNode, useContext } from 'react';
import { UseFormReturn } from 'react-hook-form';
import type { Medication } from '../types/medication';

interface FormContextType {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  isLastStep: boolean;
  totalSteps: number;
  form: UseFormReturn<Medication>;
}

const FormContext = createContext<FormContextType | undefined>(undefined);

interface FormProviderProps {
  children: ReactNode;
  form: UseFormReturn<Medication>;
  currentStep: number;
  setCurrentStep: (step: number) => void;
  totalSteps: number;
}

export const FormProvider: React.FC<FormProviderProps> = ({
  children,
  form,
  currentStep,
  setCurrentStep,
  totalSteps,
}) => {
  const value = {
    form,
    currentStep,
    setCurrentStep,
    isLastStep: currentStep === totalSteps - 1,
    totalSteps,
  };

  return (
    <FormContext.Provider value={value}>
      {children}
    </FormContext.Provider>
  );
};

export const useFormContext = () => {
  const context = useContext(FormContext);
  if (context === undefined) {
    throw new Error('useFormContext must be used within a FormProvider');
  }
  return context;
};

export default FormContext;