
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

export const TIME_FORMAT = {
  short: { hour: '2-digit', minute: '2-digit', hour12: true } as const,
  long: { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: true } as const
};

export const DATE_FORMAT = {
  short: { month: 'numeric', day: 'numeric', year: 'numeric' } as const,
  long: { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' } as const
};

export const INPUT_VALIDATION = {
  messages: {
    required: 'This field is required',
    invalidTime: 'Please enter a valid time',
    invalidDate: 'Please enter a valid date',
    endDateBeforeStart: 'End date must be after start date',
    atLeastOne: 'Please add at least one item'
  },
  patterns: {
    timeFormat: /^(0?[1-9]|1[0-2]):[0-5][0-9]\s?([AaPp][Mm])?$/,
    dosage: /^\d+\.?\d*$/
  }
};

export const FORM_DEFAULTS = {
  dosageUnit: 'mg',
  color: '#FF0000',
  frequency: 'Daily' as const
};