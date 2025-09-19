import { Stack } from "expo-router";
import ErrorBoundary from '../components/ui/ErrorBoundary';
import './globals.css';

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <Stack>
        <Stack.Screen
          name="(tabs)"
          options={{
            headerShown: false,
          }}
        />
      </Stack>
    </ErrorBoundary>
  );
}
