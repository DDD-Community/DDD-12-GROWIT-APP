# 002. 소셜 로그인

## 개요

Apple 로그인과 Kakao 로그인을 구현하고, WebView와 토큰을 연동합니다.

## 선행 조건

- [x] 001-프로젝트-초기화 완료
- [ ] Apple Developer 계정
- [ ] Kakao Developers 계정

## 태스크 목록

| 순서 | 태스크 | 상태 | 설명 |
|------|--------|------|------|
| 01 | [EAS 프로젝트 설정](./01-eas-프로젝트-설정.md) | ✅ 완료 | EAS Build 설정 |
| 02 | [Apple Developer 설정](./02-apple-developer-설정.md) | ✅ 완료 | Apple 개발자 콘솔 설정 |
| 03 | [Apple 로그인 구현](./03-apple-로그인-구현.md) | ✅ 완료 | SDK 연동 (Identity Token 획득) |
| 04 | [Kakao 로그인 구현](./04-kakao-로그인-구현.md) | ✅ 완료 | SDK 연동 (ID Token 획득) |
| 05 | [토큰 관리 (SecureStore)](./05-토큰-관리.md) | ✅ 완료 | 토큰 저장/조회/삭제 |
| 06 | [WebView 토큰 전달](./06-webview-토큰-전달.md) | ✅ 완료 | postMessage 구현 |
| 07 | [로그인 플로우 통합](./07-로그인-플로우-통합.md) | ✅ 완료 | BE API 연동, 라우팅, 상태 관리 |
| 08 | [사소한 버그 수정](./08-사소한-버그-수정.md) | ✅ 완료 | 네비게이션 스택, Safe Area 버그 수정 |
| 09 | [테스트 구현](./09-테스트-구현.md) | ⬜ 대기 | Jest, Testing Library, MSW |
| 10 | [앱 설정 및 UX 개선](./10-앱-설정-및-UX-개선.md) | ✅ 완료 | Splash 화면, 앱 이름, Safe Area |

## 아키텍처

```
┌─────────────────────────────────────────────────────────────┐
│                         모바일 앱                            │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  ┌─────────────┐    ┌─────────────┐    ┌─────────────┐     │
│  │ 로그인 화면  │───▶│ Apple/Kakao │───▶│  백엔드 API │     │
│  │  (네이티브)  │    │    SDK      │    │             │     │
│  └─────────────┘    └─────────────┘    └──────┬──────┘     │
│         │                                      │            │
│         │              JWT (access, refresh)   │            │
│         │◀─────────────────────────────────────┘            │
│         │                                                   │
│         ▼                                                   │
│  ┌─────────────┐                                           │
│  │ SecureStore │  ◀── 토큰 저장                             │
│  └──────┬──────┘                                           │
│         │                                                   │
│         │ postMessage                                       │
│         ▼                                                   │
│  ┌─────────────┐    ┌─────────────┐                        │
│  │   WebView   │───▶│ 웹 서비스   │                        │
│  │             │    │ (localStorage)│                       │
│  └─────────────┘    └─────────────┘                        │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

## 기술 스택

| 구분 | 기술 |
|------|------|
| Apple 로그인 | `expo-apple-authentication` |
| Kakao 로그인 | `@react-native-seoul/kakao-login` |
| 토큰 저장 | `expo-secure-store` |
| WebView | `react-native-webview` |
| 빌드 | EAS Build |

## 참고 문서

- [소셜 로그인 방식 비교](../../references/2026-02-14-social-login-comparison.md)
- [WebView 토큰 전달 방식](../../references/2026-02-14-webview-토큰-전달방식.md)
- [소셜 로그인 테스트 전략](../../references/2026-02-18-소셜-로그인-테스트-전략.md)
- [Expo Router 네비게이션 메서드](../../references/2026-02-24-expo-router-네비게이션-메서드.md)
- [React Native Safe Area Insets](../../references/2026-02-24-react-native-safe-area-insets.md)
