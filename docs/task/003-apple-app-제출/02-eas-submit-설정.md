# 02. EAS Submit 설정

## 목표

EAS Submit을 통해 App Store Connect에 빌드를 자동으로 제출할 수 있도록 설정합니다.

## 상태

⬜ 대기

## 선행 조건

- [x] Apple Developer 계정
- [x] App Store Connect 접근 권한
- [ ] 01-프로덕션-환경변수-설정 완료

---

## 인증 방식 선택

EAS Submit은 두 가지 인증 방식을 지원합니다:

| 방식 | 장점 | 단점 |
|------|------|------|
| **App Store Connect API Key** | 자동화 친화적, 만료 없음 | 초기 설정 필요 |
| **Apple ID + App-Specific Password** | 간단한 설정 | 2FA 필요, 만료 가능성 |

> **권장:** App Store Connect API Key 사용

---

## 작업 내용

### 방법 1: App Store Connect API Key (권장)

#### 1-1. API Key 생성

1. [App Store Connect](https://appstoreconnect.apple.com) 접속
2. **사용자 및 액세스** → **키** 탭
3. **App Store Connect API** 선택
4. **+** 버튼으로 새 키 생성
   - 이름: `EAS Submit Key`
   - 액세스: `App Manager` 또는 `Admin`
5. 생성된 키 다운로드 (`.p8` 파일, 한 번만 다운로드 가능)
6. **Issuer ID**와 **Key ID** 기록

#### 1-2. EAS Credentials에 등록

```bash
# EAS CLI로 API Key 등록
eas credentials
```

또는 대화형으로:

```bash
eas submit --platform ios
# 첫 제출 시 인증 정보 입력 프롬프트 표시
```

#### 1-3. eas.json 설정

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890",
        "appleTeamId": "XXXXXXXXXX"
      }
    }
  }
}
```

| 필드 | 설명 | 확인 방법 |
|------|------|----------|
| `appleId` | Apple Developer 계정 이메일 | - |
| `ascAppId` | App Store Connect 앱 ID | App Store Connect → 앱 → 일반 정보 → Apple ID |
| `appleTeamId` | Apple Developer Team ID | Apple Developer → Membership → Team ID |

---

### 방법 2: Apple ID + App-Specific Password

#### 2-1. App-Specific Password 생성

1. [appleid.apple.com](https://appleid.apple.com) 접속
2. **로그인 및 보안** → **앱 암호**
3. **앱 암호 생성** 클릭
4. 이름 입력 (예: `EAS Submit`)
5. 생성된 암호 복사

#### 2-2. EAS Secrets에 등록

```bash
eas secret:create --scope project --name EXPO_APPLE_ID --value "your-apple-id@example.com"
eas secret:create --scope project --name EXPO_APPLE_PASSWORD --value "xxxx-xxxx-xxxx-xxxx"
```

#### 2-3. eas.json 설정

```json
{
  "submit": {
    "production": {
      "ios": {
        "appleId": "your-apple-id@example.com",
        "ascAppId": "1234567890"
      }
    }
  }
}
```

---

## ASC App ID 확인 방법

App Store Connect에서 앱을 먼저 생성해야 `ascAppId`를 얻을 수 있습니다.

1. [App Store Connect](https://appstoreconnect.apple.com) → **앱**
2. **+** → **새 앱** (또는 기존 앱 선택)
3. 앱 선택 → **일반 정보** → **Apple ID** 확인

> 앱이 아직 생성되지 않았다면 [03-app-store-connect-앱-등록](./03-app-store-connect-앱-등록.md)을 먼저 진행하세요.

---

## 설정 테스트

```bash
# Submit 설정 확인 (실제 제출하지 않음)
eas submit --platform ios --profile production --dry-run
```

---

## 완료 조건

- [ ] App Store Connect API Key 생성 (또는 App-Specific Password 생성)
- [ ] EAS Credentials에 인증 정보 등록
- [ ] eas.json submit 설정 완료
- [ ] `eas submit --dry-run` 테스트 성공

---

## 참고 문서

- [EAS Submit 공식 문서](https://docs.expo.dev/submit/introduction/)
- [App Store Connect API Keys](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api)
