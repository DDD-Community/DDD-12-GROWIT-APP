import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';

function RootLayoutNav() {
  // task 06 에서 구현예정
  return (
    <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack>
      <StatusBar style="auto" />
    </>
  );
}

export default function RootLayout() {
  return <RootLayoutNav />;
}
