import { Stack } from "expo-router";
import { useState } from "react";
import LoginScreen from './LoginPage';
import './globals.css';

export default function RootLayout() {
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
  );
}
