import { useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAuth, type Tokens } from '@/lib/auth/useAuth';
import { MESSAGE_TYPES, parseMessage, type SyncTokenToAppPayload } from '@/lib/auth/webviewBridge';

interface Props {
  uri: string;
}

export const AuthWebView = ({ uri }: Props) => {
  const webViewRef = useRef<WebView>(null);
  const router = useRouter();
  const { login } = useAuth();

  // 웹에서 메시지 수신
  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      const message = parseMessage(event.nativeEvent.data);

      console.log('message', message);
      if (!message) return;

      switch (message.type) {
        case MESSAGE_TYPES.SYNC_TOKEN_TO_APP:
          const payload = message.payload as SyncTokenToAppPayload;
          if (payload?.accessToken && payload?.refreshToken) {
            const tokens: Tokens = {
              accessToken: payload.accessToken,
              refreshToken: payload.refreshToken,
            };

            await login(tokens);

            // 메인 화면으로 이동
            router.replace('/(main)');
          }
          break;

        case MESSAGE_TYPES.NAVIGATE_TO_NATIVE_LOGIN:
          router.replace('/(auth)/login');
          break;
      }
    },
    [login, router]
  );

  return (
    <WebView
      ref={webViewRef}
      incognito={true}
      source={{ uri }}
      style={styles.webview}
      onMessage={handleMessage}
      javaScriptEnabled={true}
      domStorageEnabled={true}
      sharedCookiesEnabled={false}
      webviewDebuggingEnabled={__DEV__}
      bounces={false}
      overScrollMode="never"
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
    backgroundColor: '#0f0f10',
  },
});
