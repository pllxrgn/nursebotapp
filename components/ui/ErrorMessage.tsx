import React from 'react';
import { StyleSheet, Text, View, ViewStyle } from 'react-native';
import { theme } from './theme';

interface ErrorMessageProps {
  message: string;
  style?: ViewStyle;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, style }) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.text}>{message}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FEE2E2',
    padding: theme.spacing.sm,
    borderRadius: theme.borderRadius.md,
    borderLeftWidth: 4,
    borderLeftColor: '#DC2626',
  },
  text: {
    color: '#DC2626',
    fontSize: 14,
  },
});
