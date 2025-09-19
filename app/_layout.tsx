import { Stack } from "expo-router";
import ErrorBoundary from "../components/ui/ErrorBoundary";
import { AuthProvider } from "../context/AuthContext";
import "./globals.css";

export default function RootLayout() {
  return (
    <ErrorBoundary>
      <AuthProvider>
        <Stack screenOptions={{ headerShown: false }}>
          { }
        </Stack>
      </AuthProvider>
    </ErrorBoundary>
  );
}
