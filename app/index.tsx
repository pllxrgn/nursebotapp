import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";

export default function AppEntry() {
    const { user, loading } = useAuth();

    if (loading) {
        // Show a splash or loader while checking auth state
        return null;
    }

    if (!user) {
        // Not logged in → go to login page
        return <Redirect href="/LoginPage" />;
    }

    // Logged in → go to main tabs
    return <Redirect href="/(tabs)" />;
}
