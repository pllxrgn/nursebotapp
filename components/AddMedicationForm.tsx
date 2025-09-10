import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { FORM_STEPS, INPUT_VALIDATION, TIME_FORMAT } from '../constants/formConstants';
import { FREQUENCY_OPTIONS, MEDICATION_COLORS } from '../constants/medicationConstants';
import type { DosageInfo, FrequencyType, Medication, Schedule } from '../types/medication';
import { styles } from './AddMedicationForm.styles';
import { FormNavigation as FormNavigationBar, FrequencyDropdown, StepIndicator, TimeInputRow } from './forms/medication/components';
import { ColorPicker } from './ui';

interface AddMedicationFormProps {
  visible: boolean;
  onAddMedication: (medication: Medication) => void;
  onCancel: () => void;
}



const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ visible, onAddMedication, onCancel }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [medicationName, setMedicationName] = useState('');
  const [dosageAmount, setDosageAmount] = useState('');
  const [dosageUnit, setDosageUnit] = useState('mg');
  const [frequencyOption, setFrequencyOption] = useState<(typeof FREQUENCY_OPTIONS)[number]>('Daily');
  const [showFrequencyDropdown, setShowFrequencyDropdown] = useState(false);
  const [times, setTimes] = useState<string[]>(['']);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [selectedColor, setSelectedColor] = useState('#FF0000');
  const [notes, setNotes] = useState('');

  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [currentTimeIndex, setCurrentTimeIndex] = useState<number | null>(null);
  const [pickerValue, setPickerValue] = useState<Date | undefined>(undefined);

  const frequencyDropdownRef = useRef<View>(null);
  const [, setFrequencyDropdownPosition] = useState({ top: 0, left: 0, width: 0 });

  const dosageRef = useRef<TextInput>(null);
  const notesRef = useRef<TextInput>(null);

  useEffect(() => {
    if (times.length === 0) setTimes(['']);
  }, [times.length]);

  // Measure the position of the frequency dropdown input when it becomes visible
  useEffect(() => {
    if (showFrequencyDropdown && frequencyDropdownRef.current) {
      frequencyDropdownRef.current.measureInWindow((x, y, width, height) => {
        setFrequencyDropdownPosition({ top: y + height, left: x, width: width });
      });
    }
  }, [showFrequencyDropdown]);


  const closeAllPickers = () => {
    setShowFrequencyDropdown(false);
    setShowStartDatePicker(false);
    setShowEndDatePicker(false);
    if (showTimePicker) {
      setShowTimePicker(false);
      setCurrentTimeIndex(null);
      setPickerValue(undefined);
    }
  };

  const handleFrequencyPress = () => {
    closeAllPickers(); // Close other pickers first
    setShowFrequencyDropdown((prev) => !prev); // Then toggle frequency dropdown
  };

  const handleFrequencySelect = (option: (typeof FREQUENCY_OPTIONS)[number]) => {
    setFrequencyOption(option);
    setShowFrequencyDropdown(false); // Close after selection
  };

  const handleTimeInputPress = (index: number) => {
    closeAllPickers();

    setCurrentTimeIndex(index);
    setPickerValue(getCurrentTimePickerValue(index));
    setShowTimePicker(true);
  };

  const handleTimeInputConfirm = (index: number) => {
    if (showTimePicker && currentTimeIndex === index) {
      if (pickerValue !== undefined) {
        const newTimes = [...times];
        const formattedTime = pickerValue.toLocaleTimeString([], TIME_FORMAT.short);
        newTimes[index] = formattedTime;
        setTimes(newTimes);
      }
      setShowTimePicker(false);
      setCurrentTimeIndex(null);
      setPickerValue(undefined);
    } else {
      handleTimeInputPress(index);
    }
  };


  const handleStartDatePress = () => {
    closeAllPickers();
    setShowStartDatePicker((prev) => !prev);
  };
  const handleEndDatePress = () => {
    closeAllPickers();
    setShowEndDatePicker((prev) => !prev);
  };

  const handleAddTimeInput = () => setTimes([...times, '']);
  const handleRemoveTimeInput = (index: number) => {
    if (currentTimeIndex === index) {
      setShowTimePicker(false);
      setCurrentTimeIndex(null);
      setPickerValue(undefined);
    } else if (currentTimeIndex !== null && index < currentTimeIndex) {
      setCurrentTimeIndex(currentTimeIndex - 1);
    }
    setTimes(times.filter((_, i) => i !== index));
  };

  const onStartDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') setShowStartDatePicker(false);
    if (selectedDate) setStartDate(selectedDate);
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    if (Platform.OS !== 'ios') setShowEndDatePicker(false);
    if (selectedDate) setEndDate(selectedDate);
  };

  const onTimeChange = (event: any, selectedTime?: Date) => {
    if (event.type === 'set') {
      if (selectedTime !== undefined) {
        if (Platform.OS === 'ios') {
          setPickerValue(selectedTime);
        } else {
          if (currentTimeIndex !== null) {
            const newTimes = [...times];
            const formattedTime = selectedTime.toLocaleTimeString([], TIME_FORMAT.short);
            newTimes[currentTimeIndex] = formattedTime;
            setTimes(newTimes);
          }
          setShowTimePicker(false);
          setCurrentTimeIndex(null);
          setPickerValue(undefined);
        }
      }
    } else if (event.type === 'dismissed') {
      if (Platform.OS === 'ios' && pickerValue !== undefined && currentTimeIndex !== null) {
         const newTimes = [...times];
         const formattedTime = pickerValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
         newTimes[currentTimeIndex] = formattedTime;
         setTimes(newTimes);
      }
      setShowTimePicker(false);
      setCurrentTimeIndex(null);
      setPickerValue(undefined);
    }
  };

  const handleAddMedication = () => {
    const validTimes = times.filter(time => time.trim() !== '');
    if (!medicationName || !dosageAmount || validTimes.length === 0) {
      alert('Please fill in medication name, dosage, and at least one time.');
      return;
    }

    const dosageInfo: DosageInfo = {
      amount: dosageAmount,
      unit: dosageUnit,
    };

    const frequencyType: FrequencyType = frequencyOption.toLowerCase() as FrequencyType;
    
    const schedule: Schedule = {
      frequency: frequencyType,
      times: validTimes,
    };

    const newMedication: Medication = {
      id: Date.now().toString(),
      name: medicationName,
      dosage: dosageInfo,
      frequency: {
        type: frequencyType,
        schedule: schedule,
      },
      duration: {
        type: 'ongoing',
      },
      startDate: startDate,
      color: selectedColor,
      notes: notes,
    };

    onAddMedication(newMedication);
    setMedicationName('');
    setDosageAmount('');
    setDosageUnit('mg');
    setFrequencyOption('Daily');
    setTimes(['']);
    setStartDate(new Date());
    setEndDate(undefined);
    setSelectedColor('#FF0000');
    setNotes('');
    closeAllPickers();
  };

  const handleCancel = () => {
    setMedicationName('');
    setDosageAmount('');
    setDosageUnit('mg');
    setFrequencyOption('Daily');
    setTimes(['']);
    setStartDate(new Date());
    setEndDate(undefined);
    setSelectedColor('#FF0000');
    setNotes('');
    closeAllPickers();
    onCancel();
  };

  const handleOverlayPress = () => {
    closeAllPickers();
  };

  const getCurrentTimePickerValue = (index: number) => {
    if (times[index]) {
      try {
        const [time, period] = times[index].split(' ');
        let [hours, minutes] = time.split(':').map(Number);

        if (period && period.toUpperCase() === 'PM' && hours !== 12) {
          hours = (hours % 12) + 12;
        } else if (period && period.toUpperCase() === 'AM' && hours === 12) {
          hours = 0;
        } else if (!period && hours > 12) {
        } else if (!period && hours < 12) {
        } else if (!period && hours === 12) {
        }


        const date = new Date();
        date.setHours(hours, minutes, 0, 0);
        if (!isNaN(date.getTime())) {
          return date;
        }
      } catch (error) {
        console.error("Error parsing time string:", times[index], error);
      }
    }
    return new Date();
  };


  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        return medicationName.trim() !== '' && dosageAmount.trim() !== '';
      case 2:
        const validTimes = times.filter(time => time.trim() !== '');
        return validTimes.length > 0;
      case 3:
        return !!startDate && (!endDate || endDate >= startDate);
      case 4:
        // No required fields in step 4 (Additional Information)
        return true;
      default:
        return false;
    }
  };

  const isStepValid = validateStep(currentStep);

  const handleNext = () => {
    if (!isStepValid) {
      switch (currentStep) {
        case 1:
          alert(INPUT_VALIDATION.messages.required);
          break;
        case 2:
          alert(INPUT_VALIDATION.messages.atLeastOne);
          break;
        case 3:
          if (!startDate) {
            alert(INPUT_VALIDATION.messages.invalidDate);
          } else if (endDate && endDate < startDate) {
            alert('End date must be after start date');
          }
          break;
      }
      return;
    }

    if (currentStep < FORM_STEPS.length) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === FORM_STEPS.length) {
      handleAddMedication();
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      <Pressable style={styles.overlay} onPress={handleOverlayPress} />

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 0}
      >
        <View style={styles.modalContainer}>
          <View style={styles.contentContainer}>
            <TouchableOpacity
              style={styles.closeButton}
              onPress={handleCancel}
            >
              <Ionicons name="close" size={24} color={COLORS.text} />
            </TouchableOpacity>

            <StepIndicator
              currentStep={currentStep}
              steps={FORM_STEPS}
            />

            <ScrollView
              contentContainerStyle={styles.scrollViewContent}
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
            >
              {/* Step 1: Basic Information */}
              {currentStep === 1 && (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Medication Name <Text style={styles.required}>*</Text></Text>
                    <TextInput
                      style={[styles.input, !medicationName.trim() ? styles.inputError : null]}
                      placeholder="e.g., Vitamin D"
                      placeholderTextColor={COLORS.secondary}
                      value={medicationName}
                      onChangeText={setMedicationName}
                      autoFocus
                      returnKeyType="next"
                      onSubmitEditing={() => dosageRef.current?.focus()}
                      clearButtonMode="while-editing"
                    />
                  </View>
                  
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Dosage <Text style={styles.required}>*</Text></Text>
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <TextInput
                        ref={dosageRef}
                        style={[styles.input, { flex: 2 }, !dosageAmount.trim() ? styles.inputError : null]}
                        placeholder="e.g., 1000"
                        placeholderTextColor={COLORS.secondary}
                        value={dosageAmount}
                        onChangeText={setDosageAmount}
                        keyboardType="numeric"
                        returnKeyType="done"
                        clearButtonMode="while-editing"
                      />
                      <TextInput
                        style={[styles.input, { flex: 1 }]}
                        placeholder="mg"
                        placeholderTextColor={COLORS.secondary}
                        value={dosageUnit}
                        onChangeText={setDosageUnit}
                        returnKeyType="done"
                        clearButtonMode="while-editing"
                      />
                    </View>
                  </View>
                </>
              )}

              {/* Step 2: Schedule */}
              {currentStep === 2 && (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Frequency <Text style={styles.required}>*</Text></Text>
                    <View ref={frequencyDropdownRef} style={{ position: 'relative', zIndex: 1 }}>
                      <FrequencyDropdown<(typeof FREQUENCY_OPTIONS)[number]>
                        value={frequencyOption}
                        onPress={handleFrequencyPress}
                        options={FREQUENCY_OPTIONS.filter(option => option !== frequencyOption)}
                        visible={showFrequencyDropdown}
                        onSelect={handleFrequencySelect}
                      />
                    </View>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Times <Text style={styles.required}>*</Text></Text>
                    {times.map((time, index) => (
                      <TimeInputRow
                        key={index}
                        time={time}
                        index={index}
                        onTimeInputPress={handleTimeInputConfirm}
                        onAddTimeInput={handleAddTimeInput}
                        onRemoveTimeInput={handleRemoveTimeInput}
                        isFirst={index === 0}
                        showTimePicker={showTimePicker && currentTimeIndex === index}
                      />
                    ))}
                  </View>
                </>
              )}

              {/* Step 3: Duration */}
              {currentStep === 3 && (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Start Date <Text style={styles.required}>*</Text></Text>
                    <TouchableOpacity
                      onPress={handleStartDatePress}
                      style={[styles.inputRow, !startDate ? styles.inputError : null]}
                    >
                      <Text style={styles.inputText}>{startDate.toLocaleDateString()}</Text>
                      <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>End Date (Optional)</Text>
                    <TouchableOpacity
                      style={styles.inputRow}
                      onPress={handleEndDatePress}
                    >
                      <Text style={[styles.inputText, { color: endDate ? COLORS.text : COLORS.secondary }]}>
                        {endDate ? endDate.toLocaleDateString() : 'mm/dd/yyyy'}
                      </Text>
                      <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
                    </TouchableOpacity>
                  </View>
                </>
              )}

              {/* Step 4: Additional Information */}
              {currentStep === 4 && (
                <>
                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Color</Text>
                    <ColorPicker
                      colors={MEDICATION_COLORS}
                      selectedColor={selectedColor}
                      onSelect={setSelectedColor}
                    />
                  </View>

                  <View style={styles.fieldGroup}>
                    <Text style={styles.label}>Notes (Optional)</Text>
                    <TextInput
                      ref={notesRef}
                      style={[styles.input, { height: 60 }]}
                      placeholder="Any additional notes about this medication..."
                      placeholderTextColor={COLORS.secondary}
                      multiline
                      value={notes}
                      onChangeText={setNotes}
                      clearButtonMode="while-editing"
                    />
                  </View>
                </>
              )}

              {showTimePicker && currentTimeIndex !== null && (
                <DateTimePicker
                  testID="timePicker"
                  value={pickerValue !== undefined ? pickerValue : getCurrentTimePickerValue(currentTimeIndex)}
                  mode="time"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onTimeChange}
                  textColor={COLORS.text}
                  accentColor={COLORS.primary}
                />
              )}
              {showStartDatePicker && (
                <DateTimePicker
                  testID="startDatePicker"
                  value={startDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onStartDateChange}
                  textColor={COLORS.text}
                  accentColor={COLORS.primary}
                />
              )}
              {showEndDatePicker && (
                <DateTimePicker
                  testID="endDatePicker"
                  value={endDate || new Date()}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'spinner' : 'default'}
                  onChange={onEndDateChange}
                  textColor={COLORS.text}
                  accentColor={COLORS.primary}
                />
              )}

            </ScrollView>
            
            <FormNavigationBar 
              currentStep={currentStep}
              totalSteps={FORM_STEPS.length}
              onBack={handleBack}
              onNext={handleNext}
              isLastStep={currentStep === FORM_STEPS.length}
              isNextDisabled={!isStepValid}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMedicationForm;