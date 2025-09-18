import { Stack } from "expo-router";
import { useState } from "react";
import LoginScreen from './LoginPage';
import './globals.css';
import ErrorBoundary from '../components/ui/ErrorBoundary';

export default function RootLayout() {
<<<<<<< HEAD
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
=======
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Pass a prop to LoginScreen to update login state
  if (!isLoggedIn) {
    return <LoginScreen onLogin={() => setIsLoggedIn(true)} />;
  }

  return (
    <Stack>
      <Stack.Screen
        name="(tabs)"
        options={{
          headerShown: false,
        }}
      />
    </Stack>
>>>>>>> 76ea5f1281d1a2f6a62cea2f76e61bfba5f7aa28
  );
}
