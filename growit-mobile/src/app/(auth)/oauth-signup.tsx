import { useEffect, useRef } from 'react';
import { StyleSheet, View, StatusBar } from 'react-native';
import { WebView, type WebViewMessageEvent } from 'react-native-webview';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useAuth } from '@/lib/auth/useAuth';
import { WEB_URL } from '@/constants';
import { MESSAGE_TYPES, parseMessage, createMessage } from '@/lib/auth';

export default function OAuthSignupScreen() {
  const webViewRef = useRef<WebView>(null);
  const router = useRouter();
  const { oauthSignupData, login, clearOAuthSignupData } = useAuth();

  // WebView 로드 완료 시 회원가입 데이터 전달
  const handleWebViewLoad = () => {
    if (!oauthSignupData) return;

    const message = createMessage(MESSAGE_TYPES.OAUTH_SIGNUP, oauthSignupData);
    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: ${message}
      }));
      true;
    `);
  };

  // 웹에서 회원가입 완료 메시지 수신
  const handleMessage = async (event: WebViewMessageEvent) => {
    const message = parseMessage(event.nativeEvent.data);
    if (!message) return;

    switch (message.type) {
      case MESSAGE_TYPES.READY:
        handleWebViewLoad();
        break;

      case MESSAGE_TYPES.SYNC_TOKEN_TO_APP:
        // 회원가입 완료 후 토큰 수신
        const payload = message.payload as { accessToken: string; refreshToken: string };
        if (payload?.accessToken && payload?.refreshToken) {
          await login({
            accessToken: payload.accessToken,
            refreshToken: payload.refreshToken,
          });
          clearOAuthSignupData();
          // AuthProvider가 자동으로 메인으로 라우팅
        }
        break;

      case MESSAGE_TYPES.NAVIGATE_TO_NATIVE_LOGIN:
        // 회원가입 취소
        clearOAuthSignupData();
        router.dismissAll();
        break;
    }
  };

  useEffect(() => {
    // 회원가입 데이터 없이 접근 시 로그인 화면으로 리다이렉트
    if (!oauthSignupData) {
      router.replace('/(auth)/login');
    }
  }, [oauthSignupData, router]);

  const insets = useSafeAreaInsets();

  if (!oauthSignupData) return null;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      {/* 상단 safe area */}
      <View style={[styles.topSafeArea, { height: insets.top }]} />
      {/* WebView 콘텐츠 */}
      <WebView
        ref={webViewRef}
        source={{ uri: `${WEB_URL}/oauth/app` }}
        style={styles.webview}
        onMessage={handleMessage}
        javaScriptEnabled={true}
        domStorageEnabled={true}
        webviewDebuggingEnabled={__DEV__}
        bounces={false}
        overScrollMode="never"
      />
      {/* 하단 safe area */}
      <View style={[styles.bottomSafeArea, { height: insets.bottom }]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
  topSafeArea: {
    backgroundColor: '#0f0f10',
  },
  bottomSafeArea: {
    backgroundColor: '#0f0f10',
  },
  webview: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
});
