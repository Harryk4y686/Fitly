import React from 'react';
import { Stack } from 'expo-router';
import { CalorieProvider } from '../contexts/CalorieContext';
import { UserProvider } from '../contexts/UserContext';
import { AuthProvider } from '../contexts/AuthContext';
import { SafeAreaProvider } from 'react-native-safe-area-context';

export default function RootLayout() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <UserProvider>
          <CalorieProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" options={{ title: 'Welcome' }} />
              <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
              <Stack.Screen name="auth/signup" options={{ title: 'Sign Up' }} />
              <Stack.Screen name="auth/forgot-password" options={{ title: 'Forgot Password' }} />
              <Stack.Screen name="gender" options={{ title: 'Gender Selection' }} />
              <Stack.Screen name="workout" options={{ title: 'Workout Frequency' }} />
              <Stack.Screen name="birthdate" options={{ title: 'Birth Date' }} />
              <Stack.Screen name="measurements" options={{ title: 'Height & Weight' }} />
              <Stack.Screen name="diet" options={{ title: 'Diet Preference' }} />
              <Stack.Screen name="goals" options={{ title: 'Goals Selection' }} />
              <Stack.Screen name="complete" options={{ title: 'Onboarding Complete' }} />
              <Stack.Screen name="loading" options={{ title: 'Setting Up' }} />
              <Stack.Screen name="results" options={{ title: 'Your Plan' }} />
              <Stack.Screen name="camera" options={{ title: 'Camera' }} />
              <Stack.Screen name="(tabs)" options={{ title: 'Main App' }} />
            </Stack>
          </CalorieProvider>
        </UserProvider>
      </AuthProvider>
    </SafeAreaProvider>
  );
}
