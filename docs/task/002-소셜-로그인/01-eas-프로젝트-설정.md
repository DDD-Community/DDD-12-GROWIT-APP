# 01. EAS 프로젝트 설정

## 목표

EAS (Expo Application Services) 프로젝트를 설정하여 네이티브 빌드 환경을 구성합니다.

## 상태

⬜ 대기

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
npm install -g eas-cli
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

생성된 `eas.json`:

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

### 5. Development Build 생성

#### iOS 시뮬레이터용

```bash
eas build --profile development --platform ios
```

#### iOS 실제 기기용

```bash
eas build --profile development --platform ios --device
```

> 실제 기기 테스트를 위해서는 Apple Developer 계정이 필요합니다.

### 6. Development Build 설치

빌드 완료 후:

```bash
# 시뮬레이터에 설치
eas build:run --platform ios

# 또는 QR 코드로 실제 기기에 설치
```

### 7. 개발 서버 실행

```bash
npx expo start --dev-client
```

## app.json 설정 추가

```json
{
  "expo": {
    "name": "growit-mobile",
    "slug": "growit-mobile",
    "version": "1.0.0",
    "ios": {
      "bundleIdentifier": "com.growit.mobile",
      "supportsTablet": true
    },
    "android": {
      "package": "com.growit.mobile"
    },
    "extra": {
      "eas": {
        "projectId": "your-project-id"
      }
    }
  }
}
```

## 빌드 프로필 설명

| 프로필 | 용도 | 특징 |
|--------|------|------|
| `development` | 개발 중 테스트 | 개발 클라이언트, 핫 리로드 |
| `preview` | 내부 테스트 배포 | 프로덕션 유사, 내부 배포 |
| `production` | 스토어 배포 | 최적화, 서명 포함 |

## 완료 조건

- [ ] EAS CLI 설치
- [ ] EAS 로그인
- [ ] EAS 프로젝트 초기화 (`eas init`)
- [ ] eas.json 생성
- [ ] Development Build 생성 (iOS)
- [ ] 개발 서버 연결 확인

## 예상 소요 시간

- EAS 설정: 10분
- iOS 빌드: 15-30분 (EAS 클라우드)

## 참고 자료

- [EAS Build 시작하기](https://docs.expo.dev/build/introduction/)
- [Development Build](https://docs.expo.dev/develop/development-builds/introduction/)
- [eas.json 설정](https://docs.expo.dev/build/eas-json/)
