import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: '#0f0f10' },
      }}
    >
      <Stack.Screen name="login" />
      <Stack.Screen name="email-login" />
      <Stack.Screen name="signup" />
      <Stack.Screen name="oauth-signup" />
    </Stack>
  );
}
