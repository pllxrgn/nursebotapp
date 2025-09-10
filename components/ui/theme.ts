import { StyleSheet } from 'react-native';
import { COLORS } from '../../constants/colors';

export const theme = {
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
  },
  borderRadius: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
  },
  typography: {
    h1: {
      fontSize: 28,
      fontWeight: '700',
      color: COLORS.primary,
    } as const,
    h2: {
      fontSize: 24,
      fontWeight: '700',
      color: COLORS.primary,
    } as const,
    h3: {
      fontSize: 20,
      fontWeight: '700',
      color: COLORS.primary,
    } as const,
    body: {
      fontSize: 16,
      fontWeight: '400',
      color: COLORS.text,
    } as const,
    caption: {
      fontSize: 14,
      fontWeight: '400',
      color: COLORS.secondary,
    } as const,
  } as const,
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 1,
      },
      shadowOpacity: 0.18,
      shadowRadius: 1.0,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
      elevation: 5,
    },
  },
};

export const commonStyles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.primary3,
  },
  screenHeader: {
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.md,
    backgroundColor: COLORS.primary2,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.chatbot,
  },
  screenTitle: {
    ...theme.typography.h1,
  },
  card: {
    backgroundColor: COLORS.primary2,
    borderRadius: theme.borderRadius.lg,
    padding: theme.spacing.md,
    marginBottom: theme.spacing.md,
    ...theme.shadows.md,
  },
  input: {
    borderWidth: 1,
    borderColor: COLORS.chatbot,
    borderRadius: theme.borderRadius.md,
    paddingHorizontal: theme.spacing.md,
    paddingVertical: theme.spacing.sm,
    fontSize: 16,
    color: COLORS.text,
    backgroundColor: COLORS.primary2,
  },
  button: {
    borderRadius: theme.borderRadius.md,
    paddingVertical: theme.spacing.sm,
    paddingHorizontal: theme.spacing.md,
    backgroundColor: COLORS.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: COLORS.primary2,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorContainer: {
    padding: theme.spacing.md,
    backgroundColor: '#FEE2E2',
    borderRadius: theme.borderRadius.md,
    marginBottom: theme.spacing.md,
  },
  errorText: {
    color: '#DC2626',
    fontSize: 14,
  },
});
