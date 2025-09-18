# Medication Form Documentation

## Overview
A multi-step form for adding and editing medications. Uses React Hook Form for form management and validation.

## Form Steps

### 1. Basic Information Step
- **Component**: `BasicInfoStep.tsx`
- **Fields**:
  - `name` (string): Medication name
    - Required
    - Must not be empty
  - `dosage.form` (MedicationForm): Type of medication (tablet, liquid, etc.)
    - Required
    - Selected from predefined list in `MEDICATION_FORMS`
  - `dosage.amount` (string): Dosage quantity
    - Required
    - Must be a positive number
  - `dosage.unit` (string): Unit of measurement
    - Required
    - Units depend on selected form type (from `FORM_UNITS`)
    - Auto-updates when form type changes

### 2. Schedule Step
- **Component**: `ScheduleStep.tsx`
- **Fields**:
  - `schedule.times` (string[]): Array of times to take medication
    - At least one time required
    - Can add multiple times
    - Includes preset time options
  - `schedule.type` (string): Type of schedule
    - Options: 'daily' or 'weekly'
  - `schedule.days` (string[]): For weekly schedule
    - Required if type is 'weekly'
    - Days convert between daily/weekly automatically:
      - If all days selected in weekly → converts to daily
      - If deselecting a day in daily → converts to weekly with all days except deselected
  - Validation:
    - At least one time required
    - At least one day required for weekly schedule

### 3. Duration Step
- **Component**: `DurationStep.tsx`
- **Fields**:
  - `duration.type` (string): Duration type
    - Options from `DURATION_OPTIONS`
    - Types: 'ongoing', 'numberOfDays', 'numberOfWeeks', 'endDate'
  - `duration.value` (number): Duration value
    - Required for 'numberOfDays' and 'numberOfWeeks'
    - Must be a positive number
  - `duration.endDate` (Date): End date for medication
    - Required if type is 'endDate'
    - Must be a future date
  - `startDate` (Date): When to start medication
    - Auto-set to current date on completion

### 4. Additional Information Step
- **Component**: `AdditionalInfoStep.tsx`
- **Fields**:
  - `color` (string): Color tag for medication
    - Selected from `MEDICATION_COLORS`
    - Required, defaults to first color
  - `storage` (object): Storage instructions
    - `temperature`: Selected from predefined options
    - `light`: Light condition requirements
    - `special`: Free text special instructions
  - `sideEffects` (string[]): Possible side effects
    - Dynamic list with add/remove functionality
  - `interactions` (string[]): Medication/food interactions
    - Dynamic list with add/remove functionality
  - `notes` (string): Additional notes
    - Optional free text field
  - `refillReminder` (object):
    - `enabled` (boolean): Whether reminders are enabled
    - `threshold` (number): When to remind
    - `unit` ('days'): Unit for threshold
  - All fields optional, no validation required

## Form Container (`MedicationFormContainer.tsx`)
- Manages form state across all steps using React Hook Form
- Handles step navigation and state persistence
- Features:
  - Step validation before proceeding
  - Back/Next navigation
  - Cancel functionality
  - Final data transformation before submission

## Data Flow
1. Form initialized with default values or initial data for editing
2. Each step validates independently
3. Data accumulates as user progresses
4. Final submit transforms data:
   - Generates ID if new medication
   - Converts date strings to Date objects
   - Sets default color if none selected
   - Initializes empty status array

## Type Definitions
```typescript
interface Medication {
  id: string;
  name: string;
  dosage: {
    amount: string;
    unit: string;
    form: MedicationForm;
  };
  schedule: {
    type: 'daily' | 'weekly';
    times: string[];
    days?: string[]; // For weekly schedule
  };
  duration: {
    type: 'ongoing' | 'numberOfDays' | 'numberOfWeeks' | 'endDate';
    value?: number;
    endDate?: Date;
  };
  startDate: Date;
  storage?: {
    temperature?: string;
    light?: string;
    special?: string;
  };
  sideEffects?: string[];
  interactions?: string[];
  notes?: string;
  color: string;
  refillReminder: {
    enabled: boolean;
    threshold: number;
    unit: 'days';
  };
  status: any[]; // Tracks medication taken/missed status
}
```