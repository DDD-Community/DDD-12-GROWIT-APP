# 03. Apple 로그인 구현

## 목표

`expo-apple-authentication`을 사용하여 Apple 로그인을 구현합니다.

## 상태

⬜ 대기

## 선행 조건

- [x] 01-eas-프로젝트-설정 완료
- [x] 02-apple-developer-설정 완료

## 작업 절차

### 1. 패키지 설치

```bash
cd growit-mobile
npx expo install expo-apple-authentication expo-crypto
```

- `expo-apple-authentication`: Apple 로그인 SDK
- `expo-crypto`: Nonce 해시 생성

### 2. Apple 로그인 서비스 구현

#### src/lib/appleAuth.ts

```typescript
import * as AppleAuthentication from 'expo-apple-authentication';
import * as Crypto from 'expo-crypto';

// Apple 로그인 가능 여부 확인
export const isAppleAuthAvailable = async (): Promise<boolean> => {
  return await AppleAuthentication.isAvailableAsync();
};

// Nonce 생성 (Replay Attack 방지)
const generateNonce = async (): Promise<{ raw: string; hashed: string }> => {
  const rawNonce = Array.from(
    { length: 32 },
    () => Math.random().toString(36)[2]
  ).join('');

  const hashedNonce = await Crypto.digestStringAsync(
    Crypto.CryptoDigestAlgorithm.SHA256,
    rawNonce
  );

  return { raw: rawNonce, hashed: hashedNonce };
};

// Apple 로그인 결과 타입
export interface AppleLoginResult {
  identityToken: string;
  user: string;
  email: string | null;
  fullName: {
    givenName: string | null;
    familyName: string | null;
  } | null;
  nonce: string;
}

// Apple 로그인 실행
export const signInWithApple = async (): Promise<AppleLoginResult> => {
  // Nonce 생성
  const { raw: rawNonce, hashed: hashedNonce } = await generateNonce();

  // Apple 로그인 요청
  const credential = await AppleAuthentication.signInAsync({
    requestedScopes: [
      AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
      AppleAuthentication.AppleAuthenticationScope.EMAIL,
    ],
    nonce: hashedNonce,
  });

  if (!credential.identityToken) {
    throw new Error('Apple 로그인 실패: Identity Token이 없습니다.');
  }

  return {
    identityToken: credential.identityToken,
    user: credential.user,
    email: credential.email,
    fullName: credential.fullName
      ? {
          givenName: credential.fullName.givenName,
          familyName: credential.fullName.familyName,
        }
      : null,
    nonce: rawNonce,
  };
};
```

### 3. 백엔드 API 호출

#### src/lib/authApi.ts

```typescript
import { AppleLoginResult } from './appleAuth';

const API_BASE_URL = 'https://your-api.com';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
  isNewUser: boolean;
}

// Apple 소셜 로그인 API 호출
export const socialLogin = async (
  provider: 'apple' | 'kakao',
  data: AppleLoginResult
): Promise<AuthResponse> => {
  const response = await fetch(`${API_BASE_URL}/api/auth/social`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      provider,
      idToken: data.identityToken,
      nonce: data.nonce,
      email: data.email,
      fullName: data.fullName,
    }),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '로그인 실패');
  }

  return response.json();
};
```

### 4. Apple 로그인 버튼 컴포넌트

#### src/components/AppleLoginButton.tsx

```typescript
import * as AppleAuthentication from 'expo-apple-authentication';
import { StyleSheet, View, Text, Alert } from 'react-native';
import { signInWithApple, isAppleAuthAvailable } from '@lib/appleAuth';
import { socialLogin } from '@lib/authApi';
import { saveTokens } from '@lib/tokenStorage';
import { useEffect, useState } from 'react';

interface Props {
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

export const AppleLoginButton = ({ onSuccess, onError }: Props) => {
  const [isAvailable, setIsAvailable] = useState(false);

  useEffect(() => {
    isAppleAuthAvailable().then(setIsAvailable);
  }, []);

  const handleLogin = async () => {
    try {
      // 1. Apple 로그인
      const appleResult = await signInWithApple();

      // 2. 백엔드 API 호출
      const authResult = await socialLogin('apple', appleResult);

      // 3. 토큰 저장
      await saveTokens({
        accessToken: authResult.accessToken,
        refreshToken: authResult.refreshToken,
      });

      // 4. 성공 콜백
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        // 사용자가 취소한 경우
        if (error.message.includes('canceled')) {
          return;
        }
        onError?.(error);
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  if (!isAvailable) {
    return null; // iOS가 아니거나 지원하지 않는 경우 버튼 숨김
  }

  return (
    <View style={styles.container}>
      <AppleAuthentication.AppleAuthenticationButton
        buttonType={AppleAuthentication.AppleAuthenticationButtonType.SIGN_IN}
        buttonStyle={AppleAuthentication.AppleAuthenticationButtonStyle.BLACK}
        cornerRadius={8}
        style={styles.button}
        onPress={handleLogin}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    alignItems: 'center',
  },
  button: {
    width: '100%',
    height: 50,
  },
});
```

### 5. 로그인 화면에서 사용

#### src/app/(auth)/login.tsx

```typescript
import { View, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { AppleLoginButton } from '@components/AppleLoginButton';

export default function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    // 로그인 성공 시 메인 화면으로 이동
    router.replace('/(main)');
  };

  return (
    <View style={styles.container}>
      <View style={styles.loginButtons}>
        <AppleLoginButton onSuccess={handleLoginSuccess} />
        {/* Kakao 버튼은 추후 추가 */}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  loginButtons: {
    width: '100%',
    gap: 16,
  },
});
```

## Apple 로그인 주의사항

### 최초 로그인 시에만 이름/이메일 제공

```
첫 번째 로그인:
├── identityToken ✅
├── user (Apple User ID) ✅
├── email ✅ (또는 Private Relay 이메일)
└── fullName ✅

두 번째 이후 로그인:
├── identityToken ✅
├── user (Apple User ID) ✅
├── email ❌ (null)
└── fullName ❌ (null)
```

> **중요**: 첫 로그인 시 반드시 서버에 이름/이메일을 저장해야 합니다.

### 테스트 시 초기화 방법

테스트를 위해 Apple 로그인 정보를 초기화하려면:

1. **설정** → **Apple ID** → **비밀번호 및 보안** → **Apple로 로그인한 앱**
2. 해당 앱 선택 → **Apple ID 사용 중단**

## 에러 처리

| 에러 코드 | 원인 | 처리 |
|----------|------|------|
| `ERR_CANCELED` | 사용자가 취소 | 무시 |
| `ERR_INVALID_RESPONSE` | Apple 서버 오류 | 재시도 안내 |
| `ERR_REQUEST_FAILED` | 네트워크 오류 | 네트워크 확인 안내 |

## 완료 조건

- [ ] expo-apple-authentication 설치
- [ ] expo-crypto 설치
- [ ] appleAuth.ts 구현
- [ ] AppleLoginButton 컴포넌트 구현
- [ ] 로그인 화면에 버튼 추가
- [ ] Development Build에서 테스트

## 참고 자료

- [expo-apple-authentication](https://docs.expo.dev/versions/latest/sdk/apple-authentication/)
- [Sign in with Apple - Human Interface Guidelines](https://developer.apple.com/design/human-interface-guidelines/sign-in-with-apple)
