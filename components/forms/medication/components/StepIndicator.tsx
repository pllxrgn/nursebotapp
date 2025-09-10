import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import { COLORS } from '../../../../constants/colors';

interface StepIndicatorProps {
  steps: readonly {
    readonly id: string;
    readonly title: string;
    readonly description: string;
  }[];
  currentStep: number;
}

const StepIndicator: React.FC<StepIndicatorProps> = ({ steps, currentStep }) => {
  return (
    <View style={styles.container}>
      <View style={styles.stepsContainer}>
        {steps.map((step, index) => (
          <React.Fragment key={step.id}>
            <View style={styles.stepContainer}>
              <View style={[
                styles.stepCircle,
                index <= currentStep && styles.activeStepCircle
              ]}>
                <Text style={[
                  styles.stepNumber,
                  index <= currentStep && styles.activeStepNumber
                ]}>
                  {index + 1}
                </Text>
              </View>
              <View style={styles.stepTextContainer}>
                <Text style={[
                  styles.stepTitle,
                  index === currentStep && styles.activeStepTitle
                ]}>
                  {step.title}
                </Text>
                {index === currentStep && (
                  <Text style={styles.stepDescription}>
                    {step.description}
                  </Text>
                )}
              </View>
            </View>
            {index < steps.length - 1 && (
              <View style={[
                styles.stepConnector,
                index < currentStep && styles.activeStepConnector
              ]} />
            )}
          </React.Fragment>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.primary2,
  },
  stepsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  stepContainer: {
    alignItems: 'center',
    flex: 1,
  },
  stepCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary3,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  activeStepCircle: {
    backgroundColor: COLORS.primary,
  },
  stepNumber: {
    color: COLORS.secondary,
    fontSize: 14,
    fontWeight: '600',
  },
  activeStepNumber: {
    color: COLORS.primary2,
  },
  stepTextContainer: {
    alignItems: 'center',
    maxWidth: '100%',
  },
  stepTitle: {
    fontSize: 12,
    color: COLORS.secondary,
    textAlign: 'center',
    fontWeight: '500',
  },
  activeStepTitle: {
    color: COLORS.primary,
    fontWeight: '600',
  },
  stepDescription: {
    fontSize: 10,
    color: COLORS.secondary,
    textAlign: 'center',
    marginTop: 4,
  },
  stepConnector: {
    flex: 1,
    height: 2,
    backgroundColor: COLORS.primary3,
    position: 'absolute',
    top: 16,
    left: '60%',
    right: '40%',
    zIndex: -1,
  },
  activeStepConnector: {
    backgroundColor: COLORS.primary,
  },
});

export default StepIndicator;
