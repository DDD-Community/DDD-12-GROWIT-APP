# 03. EAS Submit 설정

## 목표

EAS Submit을 통해 App Store Connect에 빌드를 자동으로 제출할 수 있도록 설정합니다.

## 상태

✅ 완료

## 선행 조건

- [x] Apple Developer 계정
- [x] App Store Connect 접근 권한
- [x] 01-프로덕션-환경변수-설정 완료
- [x] 02-app-store-connect-앱-등록 완료 (ascAppId 필요)

---

## Part 1: 필요한 정보 확인

> 02-app-store-connect-앱-등록에서 앱 생성 후 확인한 정보를 사용합니다.

### 1-1. Apple ID (ascAppId) 확인

1. [App Store Connect](https://appstoreconnect.apple.com) → 앱 선택
2. **앱 정보** (또는 **일반 정보**) → **Apple ID** 값 복사 (예: `1234567890`)

### 1-2. Team ID 확인

1. [Apple Developer](https://developer.apple.com/account) 접속
2. **Membership** 메뉴 → **Team ID** 값 복사 (예: `XXXXXXXXXX`)

---

## Part 2: App Store Connect API Key 생성

> EAS Submit에서 App Store Connect에 접근하기 위한 인증 키입니다.
>
> API Key가 필요한 이유와 인증 방식 비교는 [App Store Connect 가이드](../../references/2026-02-28-app-store-connect-가이드.md#인증-방식)를 참고하세요.

### 2-1. API Key 생성

1. [App Store Connect](https://appstoreconnect.apple.com) 접속
2. **사용자 및 액세스** → **통합** 탭 → **App Store Connect API**
3. **+** 버튼으로 새 키 생성
   - 이름: `EAS Submit Key`
   - 액세스: `App Manager` 또는 `Admin`
4. 생성된 키 다운로드 (`.p8` 파일)
   - ⚠️ **한 번만 다운로드 가능** - 안전한 곳에 보관
5. 다음 정보 기록:
   - **Issuer ID**: 페이지 상단에 표시
   - **Key ID**: 생성된 키 옆에 표시

### 2-2. EAS Credentials에 등록

```bash
eas credentials --platform ios
```

프롬프트에서:
1. `production` 빌드 프로필 선택
2. Apple Developer 계정으로 로그인
3. **App Store Connect: Manage your API Key** 선택
4. **Set up your project to use an API Key for EAS Submit** 선택
5. `.p8` 파일 경로, Issuer ID, Key ID 입력

> ✅ 이 과정에서 ascAppId, appleTeamId, API Key가 모두 EAS 서버에 저장됩니다.
> eas.json에 별도로 설정할 필요가 없습니다.

---

## Part 3: 설정 확인

### 3-1. Credentials 확인

```bash
# API Key 등록 상태 확인
eas credentials --platform ios
```

**App Store Connect API Key** 항목에 등록된 키 정보가 표시되면 설정 완료입니다.

### 3-2. 제출 명령어 (프로덕션 빌드 완료 후 사용)

```bash
# 최신 빌드 제출
eas submit --platform ios --profile production --latest

# 빌드와 제출을 한 번에
eas build --platform ios --profile production --auto-submit
```

---

## 완료 조건

- [x] App Store Connect API Key 생성 (`.p8` 파일 보관)
- [x] Issuer ID, Key ID 기록
- [x] `eas credentials`로 API Key 등록 (ascAppId, appleTeamId 포함)
- [x] `eas credentials --platform ios`로 등록 확인

---

## 다음 단계

- [04-스크린샷-준비](./04-스크린샷-준비.md): 앱 스크린샷 캡처 및 업로드
- [05-법적-문서-준비](./05-법적-문서-준비.md): 개인정보처리방침, 이용약관

---

## 참고 문서

- [EAS Submit 공식 문서](https://docs.expo.dev/submit/introduction/)
- [App Store Connect API Keys](https://developer.apple.com/documentation/appstoreconnectapi/creating_api_keys_for_app_store_connect_api)
- [App Store Connect 가이드](../../references/2026-02-28-app-store-connect-가이드.md)
