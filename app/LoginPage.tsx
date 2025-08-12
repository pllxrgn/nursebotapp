import { FontAwesome, Ionicons, MaterialIcons } from '@expo/vector-icons';
import { Checkbox } from 'expo-checkbox';
import React, { useState } from 'react';
import { Text, TextInput, TouchableOpacity, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

const LoginScreen: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = () => {
    console.log('Login pressed', { email, password, rememberMe });
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <View className="flex-1 items-center justify-center p-6">
        <View className="items-center mb-8">
          <MaterialIcons name="medical-services" size={48} color="#000" />
          <Text className="text-3xl font-bold mt-2">NurseBot</Text>
          <Text className="text-gray-600 text-sm">Healthcare Assistant</Text>
        </View>

        <View className="w-full space-y-5">
          <View className="w-full">
            <Text className="text-base font-medium mb-1">Email</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-3">
              <MaterialIcons name="email" size={20} color="gray" className="mr-2" />
              <TextInput
                className="flex-1 text-secondary"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                value={email}
                onChangeText={setEmail}
                placeholderTextColor="#e5e7eb"
              />
            </View>
          </View>

          <View className="w-full">
            <Text className="text-base font-medium mb-1">Password</Text>
            <View className="flex-row items-center border border-gray-300 rounded-md px-3 py-3">
              <MaterialIcons name="lock" size={20} color="gray" className="mr-2" />
              <TextInput
                className="flex-1 text-base"
                placeholder="Enter your password"
                secureTextEntry={!showPassword}
                value={password}
                onChangeText={setPassword}
                placeholderTextColor="#e5e7eb"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Ionicons name={showPassword ? "eye-off" : "eye"} size={20} color="gray" />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between items-center w-full mt-4">
          <View className="flex-row items-center">
            <Checkbox
              value={rememberMe}
              onValueChange={setRememberMe}
              color={rememberMe ? '#000' : undefined}
            />
            <Text className="ml-2 text-sm">Remember me</Text>
          </View>
          <TouchableOpacity>
            <Text className="text-sm text-blue-600">Forgot password?</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          className="w-full bg-black rounded-md py-3 mt-6 items-center"
          onPress={handleLogin}
        >
          <Text className="text-white text-lg font-bold">Sign In</Text>
        </TouchableOpacity>

        <View className="w-full items-center mt-6">
          <TouchableOpacity>
            <Text className="text-sm text-gray-700">
              Don&apos;t have an account? <Text className="font-bold text-blue-600">Sign up</Text>
            </Text>
          </TouchableOpacity>

          <View className="w-full h-px bg-gray-300 my-6"></View>

          <View className="w-full space-y-4">
            <TouchableOpacity className="flex-row items-center justify-center w-full bg-white border border-gray-300 rounded-md px-4 py-3">
              <FontAwesome name="google" size={20} color="gray" className="mr-3" />
              <Text className="text-base text-gray-700">Continue with Google</Text>
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center justify-center w-full bg-white border border-gray-300 rounded-md px-4 py-3">
              <FontAwesome name="apple" size={20} color="gray" className="mr-3" />
              <Text className="text-base text-gray-700">Continue with Apple</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </SafeAreaView>
  );
};

export default LoginScreen;