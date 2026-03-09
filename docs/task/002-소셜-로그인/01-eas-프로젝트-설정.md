# 01. EAS 프로젝트 설정

## 목표

EAS (Expo Application Services) 프로젝트를 설정하여 네이티브 빌드 환경을 구성합니다.

## 상태

✅ 완료

## 사전 지식

이 태스크를 진행하기 전에 다음 문서를 참고하세요:

| 문서 | 내용 |
|------|------|
| [EAS Apple 인증과 코드 서명](../../references/2025-02-15-eas-apple-인증과-코드서명.md) | Apple ID vs API Key, 인증서/Provisioning Profile |
| [EAS 빌드 방식 비교](../../references/2025-02-15-eas-빌드-방식-비교.md) | 클라우드 vs 로컬 빌드 |
| [Expo 개발 워크플로우](../../references/2025-02-15-expo-개발-워크플로우.md) | 핫 리로드 개발 방식 |

## 왜 EAS Build가 필요한가?

| 구분 | Expo Go | EAS Build |
|------|---------|-----------|
| 네이티브 모듈 | ❌ 불가 | ✅ 가능 |
| Apple 로그인 | ❌ 불가 | ✅ 가능 |
| Kakao 로그인 | ❌ 불가 | ✅ 가능 |
| 커스텀 네이티브 코드 | ❌ 불가 | ✅ 가능 |

> `expo-apple-authentication`, `@react-native-seoul/kakao-login`은 네이티브 모듈이므로 **EAS Build 필수**입니다.

## 작업 절차

### 1. EAS CLI 설치

```bash
yarn global add eas-cli
```

### 2. EAS 로그인

```bash
eas login
```

### 3. EAS 프로젝트 초기화

```bash
cd growit-mobile
eas init
```

> Expo 계정에 새 프로젝트가 생성됩니다.

### 4. eas.json 생성

```bash
eas build:configure
```

생성된 `eas.json` (예시):

```json
{
  "cli": {
    "version": ">= 5.0.0"
  },
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    },
    "preview": {
      "distribution": "internal"
    },
    "production": {}
  },
  "submit": {
    "production": {}
  }
}
```

> 위는 기본 예시이며, 실제 생성되는 설정은 프로젝트에 따라 다를 수 있습니다.

### 5. app.json 설정 확인

EAS 빌드에 필요한 최소 설정:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.example.app"
    },
    "android": {
      "package": "com.example.app"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

> 위는 필수 항목 예시입니다. `eas init` 실행 시 `projectId`가 자동으로 설정됩니다. 기존 `app.json`에 이미 설정되어 있다면 이 단계는 건너뜁니다.

### 6. expo-dev-client 설치

Development Build를 생성하려면 `expo-dev-client` 패키지가 필요합니다:

```bash
yarn add expo-dev-client
```

> 이 패키지가 없으면 `eas build` 실행 시 오류가 발생합니다.

### 7. Development Build 생성

#### iOS 시뮬레이터용 (클라우드)

```bash
eas build --profile development --platform ios
```

#### iOS 시뮬레이터용 (로컬 - Mac에서 더 빠름)

```bash
eas build --profile development --platform ios --local
```

> 첫 빌드 시 Apple Developer 계정 연결이 필요합니다. [EAS Apple 인증과 코드 서명](../../references/2025-02-15-eas-apple-인증과-코드서명.md) 참고.

#### 첫 빌드 시 질문 및 응답

| 질문 | 권장 응답 | 설명 |
|------|----------|------|
| Generate a new Apple Distribution Certificate? | **Yes** | EAS가 인증서를 자동 생성/관리 |
| Would you like to register devices now? | **No** | 시뮬레이터만 사용 시 불필요 |

> **주의**: 첫 빌드는 **interactive 모드**로 실행해야 합니다 (터미널에서 직접 실행). Apple Developer 계정 로그인 및 2FA 인증이 필요합니다.

#### 시뮬레이터 전용 빌드 설정

실제 기기 등록 없이 시뮬레이터에서만 테스트하려면 `eas.json`에 `simulator: true` 설정이 필요합니다:

```json
{
  "build": {
    "development": {
      "developmentClient": true,
      "distribution": "internal",
      "ios": {
        "simulator": true
      }
    }
  }
}
```

### 8. Development Build 설치

빌드 완료 후:

```bash
# 시뮬레이터에 설치
eas build:run --platform ios

# 또는 QR 코드로 실제 기기에 설치
```

### 9. 개발 서버 실행 및 연결

```bash
npx expo start --dev-client
```

시뮬레이터에서 앱을 열면 개발 서버에 자동 연결됩니다. 이후 코드 수정 시 핫 리로드로 즉시 반영됩니다.

> 개발 워크플로우 상세 내용은 [Expo 개발 워크플로우](../../references/2025-02-15-expo-개발-워크플로우.md) 참고.

## 완료 조건

- [x] EAS CLI 설치
- [x] EAS 로그인
- [x] EAS 프로젝트 초기화 (`eas init`)
- [x] eas.json 생성
- [x] expo-dev-client 설치
- [x] Apple Developer 계정 연결
- [x] 인증서/프로필 자동 생성 확인
- [x] Development Build 생성 (iOS)
- [x] 개발 서버 연결 확인

## 예상 소요 시간

- EAS 설정: 10분
- iOS 빌드: 5-30분 (로컬 5-10분, 클라우드 15-30분)

## 참고 자료

- [EAS Build 시작하기](https://docs.expo.dev/build/introduction/)
- [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
- [eas.json 설정](https://docs.expo.dev/build/eas-json/)
