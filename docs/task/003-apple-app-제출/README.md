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
| 04 | [스크린샷 준비](./04-스크린샷-준비.md) | ⬜ 대기 | 필수 해상도별 스크린샷 캡처 |
| 05 | [법적 문서 준비](./05-법적-문서-준비.md) | ⬜ 대기 | 개인정보처리방침, 이용약관 URL |
| 06 | [프로덕션 빌드 및 제출](./06-프로덕션-빌드-및-제출.md) | ⬜ 대기 | eas build & submit |

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
│  6. 빌드 및 제출                                                 │
│     ├─ eas build --platform ios --profile production            │
│     └─ eas submit --platform ios --profile production           │
│                                                                 │
│  7. 심사 대기                                                    │
│     └─ Apple 심사 (보통 24-48시간)                               │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

## 참고 문서

- [EAS Apple 인증과 코드 서명](../../references/2026-02-15-eas-apple-인증과-코드서명.md)
- [EAS 환경변수 설정](../../references/2026-02-23-eas-환경변수-설정.md)
- [iOS Bundle Identifier](../../references/2026-02-16-ios-bundle-identifier.md)
