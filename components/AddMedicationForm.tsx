import { Ionicons } from '@expo/vector-icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import React, { useEffect, useRef, useState } from 'react';
import { KeyboardAvoidingView, Modal, Platform, Pressable, ScrollView, Text, TextInput, TouchableOpacity, View } from 'react-native';
import { COLORS } from '../constants/colors';
import { FREQUENCY_OPTIONS, MEDICATION_COLORS } from '../constants/medicationConstants';
import type { Medication } from '../types/medication';
import { styles } from './AddMedicationForm.styles'; // Make sure you import styles
import ColorPicker from './ColorPicker';
import FrequencyDropdown from './FrequencyDropdown';
import TimeInputRow from './TimeInputRow';

interface AddMedicationFormProps {
  visible: boolean;
  onAddMedication: (medication: Medication) => void;
  onCancel: () => void;
}

const AddMedicationForm: React.FC<AddMedicationFormProps> = ({ visible, onAddMedication, onCancel }) => {
  const [medicationName, setMedicationName] = useState('');
  const [dosage, setDosage] = useState('');
  const [frequency, setFrequency] = useState('Daily');
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

  const handleFrequencySelect = (option: string) => {
    setFrequency(option);
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
        const formattedTime = pickerValue.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
            const formattedTime = selectedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: true });
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
    if (!medicationName || !dosage || validTimes.length === 0) {
      alert('Please fill in medication name, dosage, and at least one time.');
      return;
    }
    const newMedication: Medication = {
      id: Date.now().toString(),
      name: medicationName,
      dosage: dosage,
      frequency: frequency,
      times: validTimes,
      startDate: startDate,
      endDate: endDate,
      color: selectedColor,
      notes: notes,
    };
    onAddMedication(newMedication);
    setMedicationName('');
    setDosage('');
    setFrequency('Daily');
    setTimes(['']);
    setStartDate(new Date());
    setEndDate(undefined);
    setSelectedColor('#FF0000');
    setNotes('');
    closeAllPickers();
  };

  const handleCancel = () => {
    setMedicationName('');
    setDosage('');
    setFrequency('Daily');
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


  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={handleCancel}
    >
      {/* This overlay handles taps outside the modal */}
      {/* Keep this main overlay */}
      <Pressable style={styles.overlay} onPress={handleOverlayPress} />

      {/* Pressable overlay to close frequency dropdown when tapping outside it */}
      {/* REMOVED this Pressable as it might be interfering */}
      {/* {showFrequencyDropdown && (
        <Pressable
          style={styles.frequencyDropdownOverlay} // Use the imported style
          onPress={() => setShowFrequencyDropdown(false)}
        />
      )} */}

      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 150 : 0}
      >
        {/* Pressable overlay to close frequency dropdown when tapping outside it */}
        {/* Temporarily removed for debugging */}
        {/* {showFrequencyDropdown && (
          <Pressable
            style={styles.frequencyDropdownOverlay} // Use the imported style
            onPress={() => setShowFrequencyDropdown(false)}
          />
        )} */}

        <View style={styles.modalContainer}>
          <ScrollView
            contentContainerStyle={styles.scrollViewContent}
            showsVerticalScrollIndicator={false}
            keyboardShouldPersistTaps="handled" // Keep this as "handled" for now
          >
            <Text style={styles.title}>Add New Medication</Text>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Medication Name</Text>
              <TextInput
                style={styles.input}
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
              <Text style={styles.label}>Dosage</Text>
              <TextInput
                ref={dosageRef}
                style={styles.input}
                placeholder="e.g., 1000mg, 2 tablets"
                placeholderTextColor={COLORS.secondary}
                value={dosage}
                onChangeText={setDosage}
                returnKeyType="done"
                clearButtonMode="while-editing"
              />
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Frequency</Text>
              {/* Add ref to measure position */}
              {/* Add position: 'relative' and zIndex to this View */}
              <View ref={frequencyDropdownRef} onLayout={() => {}} style={{ position: 'relative', zIndex: 1 }}>
                <FrequencyDropdown
                  value={frequency}
                  onPress={handleFrequencyPress}
                  // Filter out the currently selected frequency from the options
                  options={FREQUENCY_OPTIONS.filter(option => option !== frequency)}
                  visible={showFrequencyDropdown} // Add visible prop
                  onSelect={handleFrequencySelect} // Add onSelect prop
                />
              </View>
            </View>


            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Times</Text>
              {times.map((time, index) => (
                <TimeInputRow
                  key={index}
                  time={time}
                  index={index}
                  onTimeInputPress={handleTimeInputConfirm}
                  onAddTimeInput={handleAddTimeInput}
                  onRemoveTimeInput={handleRemoveTimeInput}
                  isFirst={index === 0}
                  showTimePicker={showTimePicker}
                />
              ))}
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
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Start Date</Text>
              <TouchableOpacity
                onPress={handleStartDatePress}
                style={styles.inputRow}
              >
                <Text style={styles.inputText}>{startDate.toLocaleDateString()}</Text>
                <Ionicons name="calendar-outline" size={18} color={COLORS.primary} />
              </TouchableOpacity>
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
            </View>

            <View style={styles.fieldGroup}>
              <Text style={styles.label}>Color</Text>
              <ColorPicker
                colors={MEDICATION_COLORS} // Use the imported constant
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

            <View style={styles.buttonRow}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={handleCancel}
              >
                <Text style={styles.cancelBtnText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.addBtn}
                onPress={handleAddMedication}
              >
                <Text style={styles.addBtnText}>Add Medication</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

export default AddMedicationForm;