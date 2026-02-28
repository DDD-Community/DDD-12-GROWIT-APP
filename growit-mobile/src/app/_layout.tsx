import { useEffect, useState } from 'react';
import { Stack, useRouter, useSegments } from 'expo-router';
import { View, Image, StyleSheet, Dimensions } from 'react-native';
import { StatusBar } from 'expo-status-bar';
import * as SplashScreen from 'expo-splash-screen';
import { useAuth, AuthProvider } from '@/lib/auth/useAuth';

// 앱 시작 시 네이티브 splash 화면 유지
SplashScreen.preventAutoHideAsync();

const screen = Dimensions.get('window');

function RootLayoutNav() {
  const { isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const segments = useSegments();
  const [nativeSplashHidden, setNativeSplashHidden] = useState(false);
  const [customSplashVisible, setCustomSplashVisible] = useState(true);
  const [appIsReady, setAppIsReady] = useState(false);

  // 1단계: 네이티브 splash 숨기고 커스텀 splash 표시
  useEffect(() => {
    async function hideNativeSplash() {
      if (!isLoading) {
        await SplashScreen.hideAsync();
        setNativeSplashHidden(true);
      }
    }
    hideNativeSplash();
  }, [isLoading]);

  // 2단계: 커스텀 splash 1초 후 숨기기
  useEffect(() => {
    if (nativeSplashHidden) {
      const timer = setTimeout(() => {
        setCustomSplashVisible(false);
        setAppIsReady(true);
      }, 1800);
      return () => clearTimeout(timer);
    }
  }, [nativeSplashHidden]);

  useEffect(() => {
    if (!appIsReady) return;

    const inAuthGroup = segments[0] === '(auth)';
    const inMainGroup = segments[0] === '(main)';

    if (!isAuthenticated && !inAuthGroup) {
      router.replace('/(auth)/login');
    } else if (isAuthenticated && !inMainGroup) {
      router.replace('/(main)');
    }
  }, [appIsReady, isAuthenticated, segments, router]);

  // 커스텀 splash 화면 (화면 꽉 채우는 이미지)
  if (customSplashVisible) {
    return (
      <View style={styles.splashContainer}>
        <Image
          source={require('../../assets/app/splash.png')}
          style={styles.splashImage}
          resizeMode="cover"
        />
      </View>
    );
  }

  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          contentStyle: { backgroundColor: '#0f0f10' },
        }}
      >
        <Stack.Screen name="(auth)" />
        <Stack.Screen name="(main)" />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <RootLayoutNav />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  splashContainer: {
    flex: 1,
    backgroundColor: '#000000',
  },
  splashImage: {
    width: screen.width,
    height: screen.height,
  },
});
