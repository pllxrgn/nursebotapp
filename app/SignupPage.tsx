import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Redirect, router } from 'expo-router';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../context/AuthContext';

const SignupScreen: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);
    const [shouldRedirect, setShouldRedirect] = useState(false);
    const { signUp, user } = useAuth();

    const [loading, setLoading] = useState(false);

    const handleSignup = async () => {
        setError('');
        setLoading(true);
        try {
            const { data, error } = await signUp(email, password);
            if (error) {
                setError(error.message);
                return;
            }
            setSuccess(true);
            setTimeout(() => router.push("/LoginPage"), 1500);
        } catch (err: any) {
            setError(err.message || "Signup failed");
        } finally {
            setLoading(false);
        }
    };


    if (shouldRedirect || user) {
        return <Redirect href="/(tabs)" />;
    }

    return (
        <SafeAreaView className="flex-1 bg-white">
            <View className="flex-1 items-center justify-center p-6">
                <View className="items-center mb-8">
                    <MaterialIcons name="medical-services" size={48} color="#000" />
                    <Text className="text-3xl font-bold mt-2">NurseBot</Text>
                    <Text className="text-gray-600 text-sm">Create your account</Text>
                </View>

                <View className="w-full space-y-5">
                    <View className="w-full">
                        <Text className="text-base font-medium mb-1">Email</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-3">
                            <MaterialIcons name="email" size={20} color="gray" />
                            <TextInput
                                className="flex-1 text-secondary ml-2"
                                placeholder="Enter your email"
                                keyboardType="email-address"
                                autoCapitalize="none"
                                value={email}
                                onChangeText={setEmail}
                                placeholderTextColor="#969696ff"
                            />
                        </View>
                    </View>

                    <View className="w-full">
                        <Text className="text-base font-medium mb-1">Password</Text>
                        <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-3">
                            <MaterialIcons name="lock" size={20} color="gray" />
                            <TextInput
                                className="flex-1 text-base ml-2"
                                placeholder="Enter your password"
                                secureTextEntry={!showPassword}
                                value={password}
                                onChangeText={setPassword}
                                placeholderTextColor="#969696ff"
                            />
                            <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>

                <TouchableOpacity
                    className="w-full bg-black rounded-md py-3 mt-6 items-center"
                    onPress={handleSignup}
                    disabled={loading}
                >
                    <Text className="text-white text-lg font-bold">
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </Text>
                </TouchableOpacity>

                {error ? (
                    <View className="w-full items-center mt-2">
                        <Text style={{ color: 'red' }}>{error}</Text>
                    </View>
                ) : null}

                {success ? (
                    <View className="w-full items-center mt-2">
                        <Text style={{ color: 'green' }}>Account created successfully!</Text>
                    </View>
                ) : null}

                <View className="w-full items-center mt-6">
                    <TouchableOpacity onPress={() => setShouldRedirect(true)}>
                        <Text className="text-sm text-gray-700">
                            Already have an account? <Text className="font-bold text-blue-600">Sign in</Text>
                        </Text>
                    </TouchableOpacity>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default SignupScreen;
