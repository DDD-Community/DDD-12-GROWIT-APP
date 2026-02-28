# App Store Connect 가이드

## 개요

App Store Connect는 Apple Developer Program 회원이 App Store에서 앱을 관리하는 통합 플랫폼입니다. 앱 등록부터 심사 제출, 출시, 분석까지 전 과정을 웹에서 수행할 수 있습니다.

**접속**: https://appstoreconnect.apple.com

---

## 주요 기능

### 1. 앱 등록 및 메타데이터 관리

| 항목 | 설명 |
|------|------|
| 앱 이름 | App Store에 표시되는 앱 이름 |
| 부제목 | 앱 이름 아래 표시되는 짧은 설명 |
| 설명 | 앱의 기능과 특징 설명 (최대 4000자) |
| 키워드 | 검색 최적화용 키워드 (최대 100자) |
| 카테고리 | 기본/보조 카테고리 선택 |
| 스크린샷 | 디바이스별 최대 10장 |
| 앱 미리보기 | 15~30초 영상 (선택) |

### SKU (Stock Keeping Unit)

앱 생성 시 입력하는 **내부 관리용 고유 식별자**입니다.

#### 특징

| 항목 | 설명 |
|------|------|
| 용도 | Apple 내부 및 개발사의 앱 관리/추적용 |
| 노출 여부 | 사용자에게 **표시되지 않음** |
| 변경 가능 | 한 번 설정 후 **변경 불가** |
| 허용 문자 | 영문, 숫자, 하이픈(`-`), 밑줄(`_`), 마침표(`.`) |

#### 사용처

- **판매 보고서**: Apple의 매출/다운로드 리포트에서 앱 식별
- **재무 보고서**: 수익 추적 시 앱 구분
- **내부 관리**: 여러 앱을 운영할 때 앱 구분용

#### 네이밍 예시

```
com.growitddd.growit-app   # 번들 ID와 동일하게 설정 (권장)
growit-ios-001             # 앱이름-플랫폼-버전
GROWIT_2024_V1             # 프로젝트명_연도_버전
```

> 사용자에게 노출되지 않으므로 본인이 식별하기 편한 형식으로 설정하면 됩니다. 번들 ID와 동일하게 설정하면 관리가 편합니다.

### 2. TestFlight (베타 테스트)

- 최대 10,000명의 외부 테스터 초대
- 이메일 또는 공개 링크로 테스터 모집
- 빌드별 테스터 피드백 수집
- 내부 테스터: 팀 멤버 대상 즉시 테스트

### 3. App Review (심사)

- 빌드 업로드 후 심사 제출
- 심사 소요 시간: 보통 24~48시간
- 거절 시 Resolution Center에서 사유 확인 및 재제출

### 4. 릴리스 관리

| 옵션 | 설명 |
|------|------|
| 즉시 배포 | 심사 승인 즉시 App Store 게시 |
| 수동 배포 | 승인 후 원하는 시점에 수동 게시 |
| 단계적 배포 | 7일에 걸쳐 점진적으로 배포 |
| 사전 예약 | 출시 전 예약 다운로드 |

### 5. App Analytics (분석)

- 다운로드 수, 판매량 통계
- 사용자 유지율, 세션 데이터
- 마케팅 캠페인 성과 측정
- 수익 및 구독 현황

### 6. 재정 관리

- 판매 수익 및 지급금 조회
- 은행 계좌, 세금 정보 등록
- 계약 관리 및 승인

---

## EAS 프로젝트와의 연동

### eas.json submit 설정

EAS Submit을 사용하면 빌드를 App Store Connect에 자동으로 업로드할 수 있습니다.

```json
{
  "submit": {
    "production": {
      "ios": {
        "ascAppId": "1234567890",
        "appleTeamId": "XXXXXXXXXX"
      }
    }
  }
}
```

### 필요한 정보

| 필드 | 설명 | 확인 방법 |
|------|------|----------|
| `ascAppId` | App Store Connect 앱 ID | App Store Connect → 앱 → 일반 정보 → Apple ID |
| `appleTeamId` | Apple Developer Team ID | Apple Developer → Membership → Team ID |

### 인증 방식

EAS Submit이 App Store Connect에 빌드를 업로드하려면 **인증**이 필요합니다. Apple은 보안을 위해 일반 Apple ID/비밀번호 로그인을 CLI 도구에서 허용하지 않으므로, 별도의 인증 방식을 설정해야 합니다.

#### API Key가 필요한 이유

| 문제 | 설명 |
|------|------|
| **CLI 로그인 불가** | Apple은 보안상 CLI에서 Apple ID 직접 로그인을 차단 |
| **2FA 자동화 불가** | 2단계 인증은 사용자 상호작용이 필요하여 CI/CD에서 사용 불가 |
| **자동화 필요** | `eas submit`, `eas build --auto-submit` 등 자동화 명령어 실행 시 인증 필요 |

#### 인증 방식 비교

| 방식 | 장점 | 단점 | 권장 |
|------|------|------|------|
| **App Store Connect API Key** | 만료 없음, CI/CD 친화적, 권한 세분화 | 초기 설정 필요 | ✅ 권장 |
| **App-Specific Password** | 설정 간단 | 만료 가능, 2FA 계정에만 사용 가능 | 임시용 |

---

#### 방법 1: App Store Connect API Key (권장)

API Key는 **만료되지 않고** CI/CD 환경에서 안전하게 사용할 수 있어 권장됩니다.

##### 1단계: API Key 생성

1. [App Store Connect](https://appstoreconnect.apple.com) 접속
2. **사용자 및 액세스** → **통합** 탭 → **App Store Connect API**
3. **+** 버튼으로 새 키 생성
   - 이름: `EAS Submit Key`
   - 액세스: `App Manager` 또는 `Admin`
4. 생성된 키 다운로드 (`.p8` 파일)
   - ⚠️ **한 번만 다운로드 가능** - 안전한 곳에 보관
5. 다음 정보 기록:
   - **Issuer ID**: 페이지 상단에 표시 (예: `xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx`)
   - **Key ID**: 생성된 키 옆에 표시 (예: `XXXXXXXXXX`)

##### 2단계: EAS Credentials에 등록

```bash
eas credentials --platform ios
```

프롬프트에서:
1. `production` 빌드 프로필 선택
2. **App Store Connect: Manage your API Key** 선택
3. **Set up your project to use an API Key for EAS Submit** 선택
4. `.p8` 파일 경로, Issuer ID, Key ID 입력

> EAS가 API Key를 안전하게 저장하므로 이후 `eas submit` 실행 시 자동으로 인증됩니다.

---

#### 방법 2: App-Specific Password (대안)

API Key 설정이 어려운 경우 임시로 사용할 수 있습니다.

```bash
# 1. appleid.apple.com에서 앱 암호 생성
# 2. EAS Secret에 등록
eas secret:create --scope project --name EXPO_APPLE_APP_SPECIFIC_PASSWORD --value "xxxx-xxxx-xxxx-xxxx"
```

| 단계 | 작업 |
|------|------|
| 1 | [appleid.apple.com](https://appleid.apple.com) 접속 |
| 2 | **로그인 및 보안** → **앱 암호** |
| 3 | **앱 암호 생성** → 이름: `EAS Submit` |
| 4 | 생성된 암호를 위 명령어로 등록 |

### 제출 명령어

```bash
# 최신 빌드 제출
eas submit --platform ios --profile production --latest

# 빌드와 제출을 한 번에
eas build --platform ios --profile production --auto-submit
```

---

## App Store Connect에서 수행하는 작업

### EAS로 자동화 가능

| 작업 | EAS 명령어 |
|------|-----------|
| 빌드 업로드 | `eas submit` |
| 인증 정보 관리 | `eas credentials` |

### 수동 작업 필요

| 작업 | 위치 |
|------|------|
| 앱 생성 (최초 1회) | 앱 → 새 앱 |
| 메타데이터 입력 | 앱 정보 → iOS 앱 |
| 스크린샷 업로드 | 앱 정보 → 미디어 |
| 심사 정보 입력 | 앱 정보 → 앱 심사 정보 |
| 심사 제출 | 앱 정보 → 심사를 위해 제출 |
| 가격 설정 | 가격 및 사용 가능 여부 |

---

## 앱 심사 체크리스트

심사 제출 전 확인 사항:

- [ ] 앱 이름, 설명, 키워드 입력
- [ ] 카테고리 선택
- [ ] 스크린샷 업로드 (6.7인치, 6.5인치 필수)
- [ ] 개인정보처리방침 URL 입력
- [ ] 지원 URL 입력
- [ ] 연령 등급 설정
- [ ] 심사 정보 (테스트 계정, 연락처) 입력
- [ ] 빌드 선택

---

## 주요 URL

| 서비스 | URL |
|--------|-----|
| App Store Connect | https://appstoreconnect.apple.com |
| Apple Developer | https://developer.apple.com |
| App Store 심사 지침 | https://developer.apple.com/app-store/review/guidelines/ |
| App Store Connect API | https://developer.apple.com/documentation/appstoreconnectapi |

---

## 참고 문서

- [EAS Submit 공식 문서](https://docs.expo.dev/submit/introduction/)
- [App Store Connect 도움말](https://developer.apple.com/help/app-store-connect/)
