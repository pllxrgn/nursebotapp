import { Redirect } from "expo-router";
import { useAuth } from "../context/AuthContext";
import LoginScreen from "./LoginPage";

export default function AppEntry() {
    const { user, loading } = useAuth();

    if (loading) return null;

    if (!user) {
        return <LoginScreen />;
    }

    return <Redirect href="/(tabs)" />;
}
