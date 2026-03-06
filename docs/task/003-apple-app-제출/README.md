# 003. Apple App Store 제출

## 개요

growit 앱을 Apple App Store에 제출하기 위한 설정 및 준비 작업을 수행합니다.

## 선행 조건

- [x] 002-소셜-로그인 완료
- [x] Apple Developer 계정
- [x] EAS 프로젝트 설정 완료

## 태스크 목록

| 순서 | 태스크 | 상태 | 설명 |
|------|--------|------|------|
| 01 | [프로덕션 환경변수 설정](./01-프로덕션-환경변수-설정.md) | ✅ 완료 | EAS 대시보드 환경변수 및 eas.json 설정 |
| 02 | [App Store Connect 앱 등록](./02-app-store-connect-앱-등록.md) | ✅ 완료 | 앱 생성 및 메타데이터 입력 |
| 03 | [EAS Submit 설정](./03-eas-submit-설정.md) | ✅ 완료 | App Store Connect API Key 설정 |
| 04 | [스크린샷 준비](./04-스크린샷-준비.md) | ✅ 완료 | 필수 해상도별 스크린샷 캡처 |
| 05 | [법적 문서 준비](./05-법적-문서-준비.md) | ✅ 완료 | 개인정보처리방침, 이용약관 URL |
| 06 | [사전 작업](./06-사전-작업.md) | ⬜ 대기 | 소셜 로그인 테스트, Splash 이미지 변경 |
| 07 | [프로덕션 빌드 및 제출](./07-프로덕션-빌드-및-제출.md) | ⬜ 대기 | eas build & submit |
| 08 | [에러 메시지 표시 개선](./08-에러-메시지-표시-개선.md) | ⬜ 대기 | 백엔드 API 에러 메시지 Alert 표시 |

## 현재 설정 상태

### app.config.js

| 항목 | 값 | 상태 |
|------|-----|------|
| 앱 이름 | `그로잇: AI 데일리 투두앱` | ✅ |
| Bundle ID | `com.growitddd.growit-app` | ✅ |
| 버전 | `1.0.0` | ✅ |
| Apple Sign In | `true` | ✅ |
| 암호화 면제 | `usesNonExemptEncryption: false` | ✅ |

### eas.json

| 항목 | 값 | 상태 |
|------|-----|------|
| EAS Project ID | `f8f4eb8d-fc22-48bb-8aaa-fe36d96dcd90` | ✅ |
| Owner | `growit-ddd` | ✅ |
| production 빌드 | `autoIncrement: true` | ✅ |
| production 환경변수 | 미설정 | ⚠️ |
| submit 설정 | 비어있음 | ⚠️ |

## 제출 플로우

```
┌─────────────────────────────────────────────────────────────────┐
│                    Apple App Store 제출 플로우                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. 환경변수 설정                                                │
│     └─ EAS 대시보드에 환경변수 등록                               │
│                                                                 │
│  2. App Store Connect 앱 등록                                   │
│     └─ 앱 생성, 메타데이터 입력, ascAppId 확인                    │
│                                                                 │
│  3. EAS Submit 설정                                             │
│     └─ App Store Connect API Key 발급 및 설정                    │
│                                                                 │
│  4. 스크린샷 준비                                                │
│     └─ 6.7", 6.5" 필수 스크린샷 업로드                           │
│                                                                 │
│  5. 법적 문서 준비                                               │
│     └─ 개인정보처리방침 URL 등록                                  │
│                                                                 │
│  6. 사전 작업                                                    │
│     ├─ 소셜 로그인 최종 테스트                                    │
│     └─ Splash 이미지 변경                                        │
│                                                                 │
│  7. 빌드 및 제출                                                 │
│     ├─ eas build --platform ios --profile production            │
│     └─ eas submit --platform ios --profile production           │
│                                                                 │
│  8. 심사 대기                                                    │
│     └─ Apple 심사 (보통 24-48시간)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## TODO

### 소셜 로그인 최종 테스트

> 프로덕션 환경에서 카카오/애플 로그인이 정상 동작하는지 확인합니다.

**테스트 환경 준비:**
```bash
# preview 빌드로 프로덕션 환경변수 테스트
eas build --platform ios --profile preview
```

**테스트 체크리스트:**
| 항목 | Apple 로그인 | Kakao 로그인 |
|------|-------------|-------------|
| 로그인 화면 진입 | [ ] | [ ] |
| 인증 팝업 표시 | [ ] | [ ] |
| 로그인 성공 후 토큰 저장 | [ ] | [ ] |
| 메인 화면 이동 | [ ] | [ ] |
| 로그아웃 동작 | [ ] | [ ] |
| 재로그인 동작 | [ ] | [ ] |

**API 연동 확인:**
- [ ] 프로덕션 API URL로 정상 연결
- [ ] 토큰 갱신 정상 동작
- [ ] WebView에서 토큰 동기화 정상 동작

**에러 시나리오 테스트:**
- [ ] 네트워크 오류 시 적절한 에러 메시지 표시
- [ ] 로그인 취소 시 정상 처리
- [ ] 토큰 만료 시 자동 갱신

---

### 코드 리팩토링

> 프로덕션 출시 전 코드 품질 개선 작업

- [ ] TODO

---

### 카카오 회원가입 페이로드 변경 가능성

> ⚠️ **백엔드 API 스펙 확인 필요**
>
> 현재 카카오 회원가입 시 WebView로 전달하는 `OAuthSignupPayload`는 다음과 같습니다:
> ```typescript
> interface OAuthSignupPayload {
>   identityToken: string;      // idToken
>   registrationToken: string;  // 백엔드에서 발급한 임시 토큰
>   socialLoginType: 'apple' | 'kakao';
> }
> ```
>
> 만약 백엔드 회원가입 API (`POST /auth/signup/kakao`)에서 `refreshToken`이나 `nonce`가 필요하다면,
> `OAuthSignupPayload` 인터페이스를 확장해야 합니다:
> ```typescript
> interface OAuthSignupPayload {
>   identityToken: string;
>   registrationToken: string;
>   socialLoginType: 'apple' | 'kakao';
>   // 카카오 회원가입 시 추가 필요할 수 있는 필드
>   refreshToken?: string;
>   nonce?: string;
> }
> ```
>
> **수정 대상 파일:**
> - `src/lib/auth/webviewBridge.ts`: `OAuthSignupPayload` 인터페이스
> - `src/app/(auth)/login.tsx`: `handleKakaoLoginSuccess` 함수에서 페이로드 생성 부분

---

## 참고 문서

- [EAS Apple 인증과 코드 서명](../../references/2026-02-15-eas-apple-인증과-코드서명.md)
- [EAS 환경변수 설정](../../references/2026-02-23-eas-환경변수-설정.md)
- [iOS Bundle Identifier](../../references/2026-02-16-ios-bundle-identifier.md)
