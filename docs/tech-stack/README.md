# 기술 스택

## 개요

React Native 기반 하이브리드 웹뷰 앱 프로젝트의 기술 스택을 정의합니다.

## 타겟 플랫폼

| 플랫폼 | 지원 |
|--------|------|
| iOS | ✅ |
| Android | ✅ |

## 코어 기술

### 앱 프레임워크

| 기술 | 버전 | 설명 |
|------|------|------|
| **Expo** | SDK 52+ | React Native 개발 플랫폼 |
| **React Native** | 0.76+ | 크로스 플랫폼 모바일 앱 프레임워크 |
| **React** | 18.x | UI 라이브러리 |

### 라우팅

| 기술 | 설명 |
|------|------|
| **expo-router** | 파일 기반 라우팅 (React Navigation 기반) |

### 웹뷰

| 기술 | 설명 |
|------|------|
| **react-native-webview** | 웹 콘텐츠 표시를 위한 웹뷰 컴포넌트 |

### 소셜 로그인

| 기술 | 플랫폼 | 설명 |
|------|--------|------|
| **expo-apple-authentication** | iOS | Apple 로그인 (네이티브) |
| **@react-native-seoul/kakao-login** | iOS/Android | 카카오 로그인 (네이티브) |

> **참고**: 카카오 로그인은 네이티브 모듈이므로 Expo Go에서 동작하지 않습니다.
> Development Build 또는 EAS Build가 필요합니다.

### 푸시 알림 (예정)

| 기술 | 설명 |
|------|------|
| **expo-notifications** | Expo 푸시 알림 라이브러리 |
| **FCM** | Android 푸시 알림 (Firebase Cloud Messaging) |
| **APNs** | iOS 푸시 알림 (Apple Push Notification service) |

## 개발 환경

### 언어 및 도구

| 기술 | 설명 |
|------|------|
| **TypeScript** | 정적 타입 지원 |
| **ESLint** | 코드 린팅 |
| **Prettier** | 코드 포맷팅 |

### 패키지 매니저

| 기술 | 설명 |
|------|------|
| **yarn** | 의존성 관리 |

### 빌드 및 배포

| 기술 | 설명 |
|------|------|
| **EAS Build** | Expo Application Services - 앱 빌드 |
| **EAS Submit** | 앱 스토어 제출 |

## 프로젝트 구조

```
DDD-12-GROWIT-APP/
├── growit-mobile/
│   ├── src/                    # 소스 코드
│   │   ├── app/                # expo-router 화면 (파일 기반 라우팅)
│   │   │   ├── _layout.tsx     # 루트 레이아웃 (인증 체크)
│   │   │   ├── (auth)/         # 비로그인 사용자 그룹
│   │   │   │   └── login.tsx   # 로그인 화면
│   │   │   └── (main)/         # 로그인 사용자 그룹
│   │   │       └── index.tsx   # 웹뷰 화면
│   │   ├── components/         # 재사용 컴포넌트
│   │   ├── lib/                # 비즈니스 로직 + 커스텀 훅
│   │   └── constants/          # 상수 정의
│   │
│   ├── assets/                 # 정적 리소스
│   ├── app.json                # Expo 설정
│   ├── eas.json                # EAS Build 설정
│   ├── tsconfig.json           # TypeScript 설정
│   └── package.json
│
└── docs/                       # 프로젝트 문서
```

## 앱 화면 흐름

```
앱 실행 → _layout.tsx (인증 체크)
              ↓
     ┌───────┴───────┐
     ↓               ↓
  (auth)/login    (main)/index
  로그인 화면       웹뷰 화면
```

## 선택 이유

### Expo 선택 이유

1. **빠른 개발 시작** - 복잡한 네이티브 설정 없이 바로 개발 가능
2. **EAS Build** - 클라우드 빌드로 로컬 환경 의존성 최소화
3. **expo-notifications** - 푸시 알림 구현이 상대적으로 간편
4. **expo-apple-authentication** - Apple 로그인 쉬운 구현

### expo-router 선택 이유

1. **파일 기반 라우팅** - 직관적인 화면 관리
2. **인증 가드** - `_layout.tsx`에서 로그인 상태 체크 용이
3. **딥링크 지원** - 푸시 알림 클릭 시 특정 화면 이동 용이

### TypeScript 선택 이유

1. **타입 안정성** - 런타임 에러 사전 방지
2. **개발 생산성** - IDE 자동완성 및 리팩토링 지원
3. **문서화** - 타입 자체가 문서 역할
