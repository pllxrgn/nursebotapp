import React from 'react';
import { Dropdown } from '../../../ui';

interface FrequencyDropdownProps<T extends string> {
  value: T;
  onPress?: () => void;
  options: T[];
  visible?: boolean;
  onSelect: (option: T) => void;
}

export const FrequencyDropdown = <T extends string>({
  value,
  options,
  onSelect,
}: FrequencyDropdownProps<T>): React.ReactElement => {
  return (
    <Dropdown<T>
      value={value}
      options={options}
      onChange={onSelect}
      mode="inline"
      placeholder="Select frequency"
    />
  );
};
