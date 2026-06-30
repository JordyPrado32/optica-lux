import { DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import 'react-native-reanimated';

import { AuthProvider } from '@/providers/auth-provider';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ThemeProvider value={DefaultTheme}>
        <Stack screenOptions={{ headerShown: false, animation: 'fade' }}>
          <Stack.Screen name="index" />
          <Stack.Screen name="login" />
          <Stack.Screen name="register" />
          <Stack.Screen name="forgot-password" />
          <Stack.Screen name="reset-password" />
          <Stack.Screen name="mfa" />
          <Stack.Screen name="(tabs)" />
        </Stack>
        <StatusBar style="light" />
      </ThemeProvider>
    </AuthProvider>
  );
}
