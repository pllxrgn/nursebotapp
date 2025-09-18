import { Stack } from "expo-router";
import './globals.css';
import ErrorBoundary from '../components/ui/ErrorBoundary';

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
