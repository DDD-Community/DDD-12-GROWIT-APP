# Apple Sign in 서버 검증

## 개요

Apple 로그인 후 백엔드에서 Identity Token을 검증하기 위해 필요한 설정과 절차를 정리합니다.

## 왜 서버 검증이 필요한가?

### 검증 없이 발생할 수 있는 문제

| 상황 | 위험 |
|------|------|
| 토큰 검증 안 함 | 공격자가 가짜 토큰을 만들어 로그인 가능 |
| 토큰 검증 함 | Apple이 발급한 토큰만 인정 → 안전 |

### 인증 플로우

```
[Apple 로그인 플로우]

1. 사용자가 앱에서 Apple 로그인
2. Apple → 앱에 Identity Token 전달
3. 앱 → 백엔드에 Identity Token 전송
4. 백엔드에서 "이 토큰이 진짜 Apple이 발급한 것인가?" 검증
   └── 이때 .p8 키 파일 사용
5. 검증 성공 시 자체 JWT 발급
```

## .p8 Key 파일이란?

Apple이 발급하는 **비밀 키 파일**입니다. 백엔드 서버에서 Apple로부터 받은 토큰이 진짜인지 검증할 때 사용합니다.

| 항목 | 설명 |
|------|------|
| 파일 형식 | `.p8` (PEM 형식의 비밀 키) |
| 발급 위치 | Apple Developer → Keys 메뉴 |
| 다운로드 | **1회만 가능** (분실 시 재생성 필요) |
| 사용 위치 | 백엔드 서버 |

## Key 생성 절차

### Apple Developer 콘솔에서 생성

1. [Apple Developer Console](https://developer.apple.com/account) 접속
2. **Certificates, Identifiers & Profiles** 클릭
3. **Keys** 메뉴 이동
4. **Create a key** (+ 버튼) 클릭
5. Key Name 입력: `GrowIt Sign in with Apple`
6. **Sign in with Apple** 체크
7. **Configure** 클릭 → App ID 선택 (`com.growitddd.growit-app`)
8. **Continue** → **Register** 클릭
9. **Download** 클릭하여 `.p8` 파일 다운로드

> **주의**: 다운로드는 **1회만 가능**합니다. 안전한 곳에 백업해두세요.

### 저장할 정보

| 항목 | 예시 | 확인 위치 |
|------|------|----------|
| Key ID | `ABC123XYZ` | Keys 목록에서 확인 |
| Team ID | `TEAM123` | [Membership](https://developer.apple.com/account/#!/membership)에서 확인 |
| Key File | `AuthKey_ABC123XYZ.p8` | 다운로드한 파일 |
| Bundle ID | `com.growitddd.growit-app` | app.json에서 확인 |

## 백엔드 전달 정보

백엔드 담당자에게 다음 정보를 전달해야 합니다:

### 필수 전달 항목

| 항목 | 값 | 비고 |
|------|-----|------|
| `.p8` 파일 | `AuthKey_XXXXXX.p8` | 안전한 방법으로 전달 |
| Key ID | `XXXXXXXXXX` | 10자리 |
| Team ID | `XXXXXXXXXX` | 10자리 |
| Bundle ID | `com.growitddd.growit-app` | iOS 앱 식별자 |

### 백엔드 환경변수 예시

```bash
# Apple Sign in 검증용 환경변수
APPLE_KEY_ID=ABC123XYZ
APPLE_TEAM_ID=TEAM123
APPLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIGT...내용...AB==\n-----END PRIVATE KEY-----"
APPLE_BUNDLE_ID=com.growitddd.growit-app
```

> `.p8` 파일 내용을 환경변수로 저장할 때는 줄바꿈을 `\n`으로 변환합니다.

## 검증 로직 (백엔드)

백엔드에서 Apple Identity Token 검증 시 수행하는 작업:

```
[검증 단계]

1. 앱에서 Identity Token 수신
2. Apple 공개키 조회 (https://appleid.apple.com/auth/keys)
3. JWT 서명 검증 (공개키 사용)
4. 토큰 내용 검증
   - iss: https://appleid.apple.com
   - aud: Bundle ID (com.growitddd.growit-app)
   - exp: 만료 시간 확인
5. 사용자 정보 추출 (sub, email 등)
6. 자체 JWT 발급
```

## 보안 주의사항

1. **파일 보안**: `.p8` 파일은 Git에 절대 커밋하지 마세요
2. **환경변수**: 프로덕션 환경에서는 시크릿 매니저 사용 권장
3. **1회 다운로드**: 파일 분실 시 새 Key를 생성해야 함
4. **Key 유출**: 유출 시 즉시 Key를 revoke하고 재생성

## 참고 링크

- [Sign in with Apple - Apple Developer](https://developer.apple.com/sign-in-with-apple/)
- [Verifying a User - Apple Documentation](https://developer.apple.com/documentation/sign_in_with_apple/sign_in_with_apple_rest_api/verifying_a_user)
- [Generate and Validate Tokens](https://developer.apple.com/documentation/sign_in_with_apple/generate_and_validate_tokens)
