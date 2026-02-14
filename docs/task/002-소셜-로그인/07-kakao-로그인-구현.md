# 07. 카카오 로그인 구현

## 목표

`@react-native-seoul/kakao-login`을 사용하여 카카오 로그인을 구현합니다.

## 상태

⬜ 대기

## 선행 조건

- [x] 01-eas-프로젝트-설정 완료
- [ ] 카카오 개발자 설정 완료 (아래 참조)

## 카카오 개발자 설정

### 1. 카카오 개발자 등록

1. [Kakao Developers](https://developers.kakao.com/) 접속
2. 로그인 후 **내 애플리케이션** → **애플리케이션 추가하기**
3. 앱 정보 입력:
   - 앱 이름: `GrowIt`
   - 회사명: (팀/회사명)

### 2. 플랫폼 등록

**내 애플리케이션** → **앱 설정** → **플랫폼**

#### iOS 플랫폼

| 항목 | 값 |
|------|-----|
| 번들 ID | `com.growit.mobile` |

#### Android 플랫폼

| 항목 | 값 |
|------|-----|
| 패키지명 | `com.growit.mobile` |
| 키 해시 | (아래 방법으로 생성) |

**키 해시 생성 방법:**

```bash
# 디버그 키 해시 (개발용)
keytool -exportcert -alias androiddebugkey -keystore ~/.android/debug.keystore -storepass android -keypass android | openssl sha1 -binary | openssl base64

# EAS Build 키 해시 확인
eas credentials
```

### 3. 카카오 로그인 활성화

**내 애플리케이션** → **제품 설정** → **카카오 로그인**

1. **활성화 설정**: ON
2. **OpenID Connect 활성화 설정**: ON (⚠️ 중요!)
3. **Redirect URI 등록**: `kakao{NATIVE_APP_KEY}://oauth`

### 4. 동의 항목 설정

**내 애플리케이션** → **제품 설정** → **카카오 로그인** → **동의항목**

| 항목 | 동의 수준 | 용도 |
|------|----------|------|
| 닉네임 | 필수 | 사용자 이름 |
| 프로필 사진 | 선택 | 프로필 이미지 |
| 카카오계정(이메일) | 선택 (비즈 앱 필수 가능) | 이메일 |

> **참고**: 이메일을 필수로 받으려면 비즈 앱 전환이 필요합니다.

### 5. 앱 키 확인

**내 애플리케이션** → **앱 설정** → **앱 키**

필요한 키:
- **네이티브 앱 키**: iOS/Android 네이티브 SDK용
- **REST API 키**: 서버 API 호출용 (백엔드에서 사용)

## 작업 절차

### 1. 패키지 설치

```bash
cd growit-mobile
yarn add @react-native-seoul/kakao-login
```

### 2. app.json 설정

#### app.json (또는 app.config.js)

```json
{
  "expo": {
    "plugins": [
      [
        "@react-native-seoul/kakao-login",
        {
          "kakaoAppKey": "YOUR_NATIVE_APP_KEY",
          "kotlinVersion": "1.9.0"
        }
      ]
    ],
    "ios": {
      "bundleIdentifier": "com.growit.mobile",
      "infoPlist": {
        "CFBundleURLTypes": [
          {
            "CFBundleURLSchemes": ["kakaoYOUR_NATIVE_APP_KEY"]
          }
        ],
        "LSApplicationQueriesSchemes": [
          "kakaokompassauth",
          "kakaolink",
          "kakaoplus"
        ]
      }
    },
    "android": {
      "package": "com.growit.mobile"
    }
  }
}
```

> **주의**: `YOUR_NATIVE_APP_KEY`를 실제 네이티브 앱 키로 교체하세요.

### 3. 카카오 로그인 서비스 구현

#### src/lib/kakaoAuth.ts

```typescript
import {
  login,
  logout,
  getProfile,
  KakaoOAuthToken,
  KakaoProfile,
} from '@react-native-seoul/kakao-login';

// 카카오 로그인 결과 타입
export interface KakaoLoginResult {
  idToken: string;
  accessToken: string;
  email: string | null;
  nickname: string | null;
  profileImageUrl: string | null;
}

// 카카오 로그인 실행
export const signInWithKakao = async (): Promise<KakaoLoginResult> => {
  // 1. 카카오 로그인 (ID Token 포함)
  const token: KakaoOAuthToken = await login();

  if (!token.idToken) {
    throw new Error('카카오 로그인 실패: ID Token이 없습니다. OpenID Connect 활성화를 확인하세요.');
  }

  // 2. 프로필 정보 조회
  const profile: KakaoProfile = await getProfile();

  return {
    idToken: token.idToken,
    accessToken: token.accessToken,
    email: profile.email ?? null,
    nickname: profile.nickname ?? null,
    profileImageUrl: profile.profileImageUrl ?? null,
  };
};

// 카카오 로그아웃
export const signOutFromKakao = async (): Promise<void> => {
  try {
    await logout();
  } catch (error) {
    // 이미 로그아웃된 상태일 수 있음
    console.warn('카카오 로그아웃:', error);
  }
};
```

### 4. authApi.ts 업데이트

#### src/lib/authApi.ts

```typescript
import { AppleLoginResult } from './appleAuth';
import { KakaoLoginResult } from './kakaoAuth';

const API_BASE_URL = 'https://your-api.com';

interface AuthResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
    profileImage?: string;
  };
  isNewUser: boolean;
}

// 소셜 로그인 API (Apple, Kakao 통합)
export const socialLogin = async (
  provider: 'apple' | 'kakao',
  data: AppleLoginResult | KakaoLoginResult
): Promise<AuthResponse> => {
  let body: Record<string, unknown>;

  if (provider === 'apple') {
    const appleData = data as AppleLoginResult;
    body = {
      provider,
      idToken: appleData.identityToken,
      nonce: appleData.nonce,
      email: appleData.email,
      fullName: appleData.fullName,
    };
  } else {
    const kakaoData = data as KakaoLoginResult;
    body = {
      provider,
      idToken: kakaoData.idToken,
      email: kakaoData.email,
      nickname: kakaoData.nickname,
      profileImageUrl: kakaoData.profileImageUrl,
    };
  }

  const response = await fetch(`${API_BASE_URL}/api/auth/social`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.message || '로그인 실패');
  }

  return response.json();
};
```

### 5. 카카오 로그인 버튼 컴포넌트

#### src/components/KakaoLoginButton.tsx

```typescript
import { TouchableOpacity, Text, StyleSheet, Alert, View } from 'react-native';
import { signInWithKakao } from '@lib/kakaoAuth';
import { socialLogin } from '@lib/authApi';
import { saveTokens, saveUserInfo } from '@lib/tokenStorage';

interface Props {
  onSuccess: () => void;
  onError?: (error: Error) => void;
}

export const KakaoLoginButton = ({ onSuccess, onError }: Props) => {
  const handleLogin = async () => {
    try {
      // 1. 카카오 로그인
      const kakaoResult = await signInWithKakao();

      // 2. 백엔드 API 호출
      const authResult = await socialLogin('kakao', kakaoResult);

      // 3. 토큰 저장
      await saveTokens({
        accessToken: authResult.accessToken,
        refreshToken: authResult.refreshToken,
      });

      // 4. 사용자 정보 저장
      await saveUserInfo({
        id: authResult.user.id,
        email: authResult.user.email,
        name: authResult.user.name,
        profileImage: authResult.user.profileImage,
      });

      // 5. 성공 콜백
      onSuccess();
    } catch (error) {
      if (error instanceof Error) {
        // 사용자가 취소한 경우
        if (error.message.includes('cancelled') || error.message.includes('cancel')) {
          return;
        }
        onError?.(error);
        Alert.alert('로그인 실패', error.message);
      }
    }
  };

  return (
    <TouchableOpacity style={styles.button} onPress={handleLogin}>
      <View style={styles.content}>
        <Text style={styles.icon}>💬</Text>
        <Text style={styles.text}>카카오 로그인</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    width: '100%',
    height: 50,
    backgroundColor: '#FEE500',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 18,
  },
  text: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
  },
});
```

### 6. 로그인 화면 업데이트

#### src/app/(auth)/login.tsx

```typescript
import { View, Text, StyleSheet, SafeAreaView } from 'react-native';
import { useRouter } from 'expo-router';
import { AppleLoginButton } from '@components/AppleLoginButton';
import { KakaoLoginButton } from '@components/KakaoLoginButton';

export default function LoginScreen() {
  const router = useRouter();

  const handleLoginSuccess = () => {
    router.replace('/(main)');
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        {/* 로고/타이틀 영역 */}
        <View style={styles.header}>
          <Text style={styles.title}>GrowIt</Text>
          <Text style={styles.subtitle}>성장을 위한 첫 걸음</Text>
        </View>

        {/* 로그인 버튼 영역 */}
        <View style={styles.loginButtons}>
          <AppleLoginButton onSuccess={handleLoginSuccess} />
          <KakaoLoginButton onSuccess={handleLoginSuccess} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  content: {
    flex: 1,
    justifyContent: 'space-between',
    padding: 24,
    paddingBottom: 48,
  },
  header: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#1a1a1a',
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginTop: 8,
  },
  loginButtons: {
    width: '100%',
    gap: 12,
  },
});
```

## Apple vs Kakao 로그인 비교

| 항목 | Apple | Kakao |
|------|-------|-------|
| 패키지 | `expo-apple-authentication` | `@react-native-seoul/kakao-login` |
| 토큰 | identityToken (JWT) | idToken (JWT, OpenID Connect) |
| 이름 제공 | 최초 로그인 시에만 | 항상 제공 |
| 이메일 제공 | 최초 로그인 시에만 | 동의 시 항상 제공 |
| 필수 설정 | Apple Developer | Kakao Developers |
| Nonce | 필요 (직접 생성) | 불필요 (SDK에서 처리) |

## 에러 처리

| 에러 | 원인 | 처리 |
|------|------|------|
| `ID Token이 없습니다` | OpenID Connect 미활성화 | 카카오 개발자 콘솔에서 활성화 |
| `cancelled` | 사용자가 취소 | 무시 |
| `KEYSTORE_NOT_FOUND` | 키 해시 미등록 | 플랫폼에 키 해시 추가 |
| `MISCONFIGURED` | 앱 키 또는 설정 오류 | 설정 확인 |

## 완료 조건

- [ ] 카카오 개발자 앱 등록
- [ ] 플랫폼 설정 (iOS, Android)
- [ ] OpenID Connect 활성화
- [ ] @react-native-seoul/kakao-login 설치
- [ ] app.json 플러그인 설정
- [ ] kakaoAuth.ts 구현
- [ ] KakaoLoginButton 컴포넌트 구현
- [ ] 로그인 화면에 버튼 추가
- [ ] Development Build에서 테스트

## 참고 자료

- [@react-native-seoul/kakao-login](https://github.com/react-native-seoul/react-native-kakao-login)
- [Kakao Developers - 카카오 로그인](https://developers.kakao.com/docs/latest/ko/kakaologin/common)
- [Kakao OpenID Connect](https://developers.kakao.com/docs/latest/ko/kakaologin/rest-api#oidc)
