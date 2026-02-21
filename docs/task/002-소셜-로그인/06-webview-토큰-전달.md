# 06. WebView 토큰 전달

## 목표

`postMessage`를 사용하여 앱과 WebView 간 토큰을 안전하게 전달합니다.

## 상태

⬜ 대기

## 선행 조건

- [x] 05-토큰-관리 완료

## 현재 프로젝트 상태

### 이미 완료된 항목

- [x] `react-native-webview` 설치됨 (package.json: 13.15.0)
- [x] `useAuth` hook 구현됨 (`src/lib/auth/useAuth/`)

### 현재 파일 구조

```
src/lib/auth/
├── index.ts
├── AppleAuth.ts
├── KakaoAuth.ts
├── auth.ts
└── useAuth/
    ├── index.ts          # useAuth hook export (Public API)
    ├── useAuth.ts
    ├── tokenStorage.ts   # 내부 전용 (외부 접근 불가)
    └── tokenUtils.ts     # 내부 전용 (외부 접근 불가)
```

**중요:** `tokenStorage`는 외부에서 직접 import할 수 없음. `useAuth` hook을 통해 토큰 관리.

## 선택 이유: postMessage

| 방식 | 보안 | 양방향 통신 | 리로드 필요 |
|------|------|------------|------------|
| URL 파라미터 | ❌ 노출 위험 | ❌ | ❌ |
| JS Injection | △ | ❌ | ✅ |
| **postMessage** | ✅ | ✅ | ❌ |

> 웹에서 토큰 갱신 시 앱에도 알릴 수 있어야 하므로 **양방향 통신** 필요

## 메시지 프로토콜

### 메시지 타입 정의

| 방향 | 타입 | 페이로드 | 설명 |
|------|------|----------|------|
| 웹 → 앱 | `READY` | - | 웹 로드 완료 |
| 앱 → 웹 | `AUTH_TOKEN` | `{ accessToken, refreshToken }` | 토큰 전달 |
| 웹 → 앱 | `TOKEN_REFRESHED` | `{ accessToken, refreshToken }` | 토큰 갱신됨 |
| 웹 → 앱 | `LOGOUT` | - | 로그아웃 요청 |

### 메시지 구조

```typescript
interface WebViewMessage {
  type: 'READY' | 'AUTH_TOKEN' | 'TOKEN_REFRESHED' | 'LOGOUT';
  payload?: Record<string, unknown>;
}
```

## 작업 절차

### 1. 메시지 타입 정의

#### src/lib/auth/webviewBridge.ts

```typescript
// 메시지 타입
export const MESSAGE_TYPES = {
  // 웹 → 앱
  READY: 'READY',
  TOKEN_REFRESHED: 'TOKEN_REFRESHED',
  LOGOUT: 'LOGOUT',

  // 앱 → 웹
  AUTH_TOKEN: 'AUTH_TOKEN',
} as const;

export type MessageType = (typeof MESSAGE_TYPES)[keyof typeof MESSAGE_TYPES];

export interface WebViewMessage<T = unknown> {
  type: MessageType;
  payload?: T;
}

export interface TokenPayload {
  accessToken: string;
  refreshToken: string;
}

// 메시지 생성 헬퍼
export const createMessage = <T>(
  type: MessageType,
  payload?: T
): string => {
  return JSON.stringify({ type, payload });
};

// 메시지 파싱 헬퍼
export const parseMessage = (data: string): WebViewMessage | null => {
  try {
    return JSON.parse(data);
  } catch {
    return null;
  }
};
```

### 2. WebView 컴포넌트 구현

#### src/components/AuthenticatedWebView.tsx

```typescript
import { useRef, useCallback } from 'react';
import { StyleSheet } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import { useRouter } from 'expo-router';
import { useAuth, type Tokens } from '@/lib/auth/useAuth';
import {
  MESSAGE_TYPES,
  parseMessage,
  createMessage,
  type TokenPayload,
} from '@/lib/auth/webviewBridge';

interface Props {
  uri: string;
}

export const AuthenticatedWebView = ({ uri }: Props) => {
  const webViewRef = useRef<WebView>(null);
  const router = useRouter();
  const { tokens, login, logout, user } = useAuth();

  // 웹에 토큰 전달
  const sendTokensToWeb = useCallback(() => {
    if (!tokens) return;

    const message = createMessage<TokenPayload>(MESSAGE_TYPES.AUTH_TOKEN, {
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

        case MESSAGE_TYPES.TOKEN_REFRESHED:
          const payload = message.payload as TokenPayload;
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
      }
    },
    [sendTokensToWeb, login, logout, user, router],
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
    />
  );
};

const styles = StyleSheet.create({
  webview: {
    flex: 1,
  },
});
```

### 3. 메인 화면에서 사용

#### src/app/(main)/index.tsx

```typescript
import { View, StyleSheet } from 'react-native';
import { AuthenticatedWebView } from '@components/AuthenticatedWebView';
import { WEB_URL } from '@constants';

export default function MainScreen() {
  return (
    <View style={styles.container}>
      <AuthenticatedWebView uri={WEB_URL} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});
```

### 4. 웹 사이드 구현 (웹 팀 협업)

#### 웹 프로젝트에 추가할 코드

```typescript
// utils/appBridge.ts

// 앱 환경 감지
export const isInApp = (): boolean => {
  return typeof window !== 'undefined' &&
         window.ReactNativeWebView !== undefined;
};

// 앱에 메시지 전송
export const sendToApp = (type: string, payload?: unknown): void => {
  if (!isInApp()) return;

  window.ReactNativeWebView.postMessage(
    JSON.stringify({ type, payload })
  );
};

// 앱에서 메시지 수신 리스너
export const onAppMessage = (
  callback: (message: { type: string; payload?: unknown }) => void
): (() => void) => {
  const handler = (event: MessageEvent) => {
    if (typeof event.data === 'object' && event.data.type) {
      callback(event.data);
    }
  };

  window.addEventListener('message', handler);
  return () => window.removeEventListener('message', handler);
};
```

```typescript
// hooks/useAppAuth.ts
import { useEffect } from 'react';
import { isInApp, sendToApp, onAppMessage } from '@/utils/appBridge';

export const useAppAuth = () => {
  useEffect(() => {
    if (!isInApp()) return;

    // 앱에 준비 완료 알림
    sendToApp('READY');

    // 앱에서 토큰 수신
    const unsubscribe = onAppMessage((message) => {
      if (message.type === 'AUTH_TOKEN' && message.payload) {
        const { accessToken, refreshToken } = message.payload as {
          accessToken: string;
          refreshToken: string;
        };

        // localStorage에 저장
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);

        // 인증 상태 업데이트 (앱의 상태 관리에 따라 다름)
        window.dispatchEvent(new Event('auth-updated'));
      }
    });

    return unsubscribe;
  }, []);
};

// 토큰 갱신 시 앱에 알림
export const notifyTokenRefresh = (
  accessToken: string,
  refreshToken: string
) => {
  if (!isInApp()) return;

  sendToApp('TOKEN_REFRESHED', { accessToken, refreshToken });
};

// 로그아웃 시 앱에 알림
export const notifyLogout = () => {
  if (!isInApp()) return;

  sendToApp('LOGOUT');
};
```

```typescript
// 웹 앱의 루트 또는 레이아웃에서
import { useAppAuth } from '@/hooks/useAppAuth';

function App() {
  useAppAuth();
  // ...
}
```

## 전체 플로우

```
[앱 시작]
    │
    ▼
┌───────────────────────────────────────────┐
│ 1. 앱: 로그인 완료, SecureStore에 토큰 저장 │
└───────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────┐
│ 2. 앱: WebView로 웹 URL 로드               │
└───────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────┐
│ 3. 웹: 페이지 로드 완료                    │
│    └─▶ isInApp() 확인                     │
│    └─▶ sendToApp('READY') 전송            │
└───────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────┐
│ 4. 앱: 'READY' 메시지 수신                 │
│    └─▶ SecureStore에서 토큰 조회           │
│    └─▶ injectJavaScript로 토큰 전달       │
└───────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────┐
│ 5. 웹: 'AUTH_TOKEN' 메시지 수신            │
│    └─▶ localStorage에 토큰 저장           │
│    └─▶ 인증 상태 업데이트                  │
└───────────────────────────────────────────┘
    │
    ▼
┌───────────────────────────────────────────┐
│ 6. (토큰 갱신 시) 웹에서 갱신 후            │
│    └─▶ sendToApp('TOKEN_REFRESHED') 전송  │
│    └─▶ 앱: SecureStore 업데이트           │
└───────────────────────────────────────────┘
```

## TypeScript 타입 선언 (웹)

웹 프로젝트에 타입 선언 추가:

```typescript
// types/global.d.ts
interface Window {
  ReactNativeWebView?: {
    postMessage: (message: string) => void;
  };
}
```

## 디버깅

### 앱에서 WebView 디버깅

```typescript
<WebView
  // ...
  webviewDebuggingEnabled={__DEV__}
  onError={(syntheticEvent) => {
    const { nativeEvent } = syntheticEvent;
    console.warn('WebView error:', nativeEvent);
  }}
/>
```

### Safari에서 WebView 디버깅

1. iOS 시뮬레이터/실기기에서 앱 실행
2. Mac Safari → 개발자 → [디바이스명] → [앱 WebView]

## 완료 조건

- [x] react-native-webview 설치 (이미 완료)
- [ ] `src/lib/auth/webviewBridge.ts` 구현
- [ ] `src/components/AuthenticatedWebView.tsx` 컴포넌트 구현
- [ ] 메인 화면에 WebView 연동
- [ ] 웹 사이드 코드 구현 (웹 팀 협업)
- [ ] 토큰 전달 테스트
- [ ] 토큰 갱신 동기화 테스트

## 참고 자료

- [react-native-webview](https://github.com/react-native-webview/react-native-webview)
- [WebView와 React Native 통신](https://github.com/nicoleahmed/webViewCommunication)
