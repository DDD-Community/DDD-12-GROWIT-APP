# 02. Apple Developer 설정

## 목표

Apple Developer 콘솔에서 Sign in with Apple을 활성화합니다.

## 상태

⬜ 대기

## 선행 조건

- Apple Developer Program 가입 ($99/년)
- App ID 생성 완료

## 작업 절차

### 1. Apple Developer 콘솔 접속

[Apple Developer Console](https://developer.apple.com/account) 접속

### 2. App ID 생성/수정

1. **Certificates, Identifiers & Profiles** 클릭
2. **Identifiers** 클릭
3. 기존 App ID 선택 또는 새로 생성

#### 새 App ID 생성 시

- **Register a new identifier** 클릭
- **App IDs** 선택
- **App** 선택
- Description: `GrowIt Mobile`
- Bundle ID: `com.growit.mobile` (Explicit)

### 3. Sign in with Apple 활성화

1. App ID 상세 페이지에서 **Capabilities** 섹션
2. **Sign in with Apple** 체크
3. **Configure** 클릭 (필요 시)
4. **Save** 클릭

### 4. Provisioning Profile 갱신

Sign in with Apple 활성화 후 Provisioning Profile 재생성 필요:

1. **Profiles** 메뉴 이동
2. 기존 프로필 삭제 또는 **Edit**
3. 새 프로필 생성 (App ID 선택)
4. 다운로드

> EAS Build 사용 시 자동으로 처리됩니다.

### 5. app.json 설정 추가

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.growit.mobile",
      "usesAppleSignIn": true,
      "infoPlist": {
        "CFBundleAllowMixedLocalizations": true
      }
    }
  }
}
```

### 6. (선택) 서버 검증용 Key 생성

백엔드에서 Identity Token 검증 시 필요:

1. **Keys** 메뉴 이동
2. **Create a key** 클릭
3. Key Name: `GrowIt Sign in with Apple`
4. **Sign in with Apple** 체크
5. **Configure** 클릭 → App ID 선택
6. **Register** 클릭
7. Key 파일 다운로드 (`.p8`) - **한 번만 다운로드 가능!**

#### 저장할 정보

| 항목 | 예시 | 용도 |
|------|------|------|
| Key ID | `ABC123XYZ` | JWT 헤더의 kid |
| Team ID | `TEAM123` | JWT 검증 |
| Key File | `AuthKey_ABC123XYZ.p8` | 서버에서 사용 |

## Apple Developer 콘솔 구조

```
Certificates, Identifiers & Profiles
├── Certificates      ← 인증서 (코드 서명)
├── Identifiers       ← App ID (Bundle ID)
│   └── com.growit.mobile
│       └── Capabilities
│           └── Sign in with Apple ✅
├── Profiles          ← Provisioning Profile
└── Keys              ← Sign in with Apple Key (서버용)
```

## 체크리스트

### Apple Developer 콘솔

- [ ] App ID 생성 (Bundle ID: `com.growit.mobile`)
- [ ] Sign in with Apple Capability 활성화
- [ ] (서버용) Key 생성 및 다운로드

### 프로젝트

- [ ] app.json에 `usesAppleSignIn: true` 추가
- [ ] Bundle ID 일치 확인

## 완료 조건

- [ ] Apple Developer에서 Sign in with Apple 활성화
- [ ] app.json 설정 완료
- [ ] (선택) 서버용 Key 생성

## 주의사항

1. **Key 파일 보안**: `.p8` 파일은 한 번만 다운로드 가능하며, 유출 시 재생성 필요
2. **Bundle ID 일치**: Apple Developer와 app.json의 Bundle ID가 반드시 일치해야 함
3. **Team ID 확인**: [Membership](https://developer.apple.com/account/#!/membership)에서 확인

## 참고 자료

- [Sign in with Apple - Apple Developer](https://developer.apple.com/sign-in-with-apple/)
- [Configuring Sign in with Apple](https://developer.apple.com/documentation/sign_in_with_apple/configuring_your_environment_for_sign_in_with_apple)
