import { useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAuth, type Tokens } from '@/lib/auth/useAuth';
import {
  MESSAGE_TYPES,
  parseMessage,
  createMessage,
  type SyncTokenToWebPayload,
  type SyncTokenToAppPayload,
} from '@/lib/auth/webviewBridge';

interface Props {
  uri: string;
}

export const MainWebView = ({ uri }: Props) => {
  const webViewRef = useRef<WebView>(null);
  const router = useRouter();
  const { tokens, login, logout, user } = useAuth();

  // 웹에 토큰 전달
  const sendTokensToWeb = useCallback(() => {
    if (!tokens) return;

    const message = createMessage<SyncTokenToWebPayload>(MESSAGE_TYPES.SYNC_TOKEN_TO_WEB, {
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });

    webViewRef.current?.injectJavaScript(`
      window.dispatchEvent(new MessageEvent('message', {
        data: ${message}
      }));
      true;
    `);
  }, [tokens]);

  // 웹에서 메시지 수신
  const handleMessage = useCallback(
    async (event: WebViewMessageEvent) => {
      const message = parseMessage(event.nativeEvent.data);
      if (!message) return;

      switch (message.type) {
        case MESSAGE_TYPES.READY:
          sendTokensToWeb();
          break;

        case MESSAGE_TYPES.SYNC_TOKEN_TO_APP:
          const payload = message.payload as SyncTokenToAppPayload;
          if (payload?.accessToken && payload?.refreshToken) {
            const newTokens: Tokens = {
              accessToken: payload.accessToken,
              refreshToken: payload.refreshToken,
            };
            if (user) {
              await login(newTokens, user);
            }
          }
          break;

        case MESSAGE_TYPES.LOGOUT:
          await logout();
          router.replace('/(auth)/login');
          break;

        case MESSAGE_TYPES.NAVIGATE_TO_NATIVE_LOGIN:
          router.replace('/(auth)/login');
          break;
      }
    },
    [sendTokensToWeb, login, logout, user, router]
  );

  return (
    <WebView
      ref={webViewRef}
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
