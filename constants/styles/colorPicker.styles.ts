import { StyleSheet } from 'react-native';
import { COLORS } from '../colors';
import { BORDER_RADIUS, SPACING } from '../styleConstants';

export const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: SPACING.sm,
    padding: SPACING.sm,
  },
  colorButton: {
    width: 30,
    height: 30,
    borderRadius: BORDER_RADIUS.full,
    margin: SPACING.xs,
  },
  selectedColor: {
    borderWidth: 2,
    borderColor: COLORS.primary,
  },
});
