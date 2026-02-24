# iOS Bundle Identifier

## 개요

Bundle Identifier는 iOS 앱을 전 세계적으로 고유하게 식별하는 문자열입니다. 앱 스토어에 제출하면 변경할 수 없으므로 신중하게 결정해야 합니다.

## Bundle Identifier란?

| 항목 | 설명 |
|------|------|
| **정의** | iOS 앱의 고유 식별자 |
| **형식** | 역순 도메인 표기법 (Reverse Domain Notation) |
| **예시** | `com.회사명.앱이름` |
| **용도** | 앱 스토어 등록, 인증서/프로필 생성, 푸시 알림 등 |

## 명명 규칙

### 허용되는 문자

| 문자 | 허용 | 예시 |
|------|------|------|
| 영문 소문자 | ✅ | `com.growit.mobile` |
| 숫자 | ✅ | `com.growit.app2` |
| 하이픈 (-) | ✅ | `com.growit.my-app` |
| 점 (.) | ✅ | `com.growit.mobile` |
| 영문 대문자 | ⚠️ 가능하나 비권장 | - |
| 언더스코어 (_) | ❌ | `com.growit.my_app` |
| 한글 | ❌ | `com.그로잇.앱` |
| 특수문자 | ❌ | `com.growit.app!` |

### 권장 형식

```
com.{회사/팀명}.{앱이름}
```

예시:
- `com.growitddd.growit`
- `com.mycompany.shopping-app`
- `org.opensource.myproject`

## EAS Build와의 관계

### 설정 위치

`app.json`의 `expo.ios.bundleIdentifier`에 설정:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.growitddd.growit"
    }
  }
}
```

### EAS Build 시 자동 처리

```
[첫 빌드 시 자동 처리 흐름]

1. app.json에서 bundleIdentifier 읽기
           │
           ▼
2. Apple Developer 계정에 App ID 등록 시도
           │
           ├── 성공 → 빌드 계속 진행
           │
           └── 실패 (이미 사용 중) → 오류 메시지 출력
                                    "App ID is not available"
```

**선행 작업 불필요**: Apple Developer 콘솔에서 미리 등록할 필요 없이, EAS Build가 자동으로 처리합니다.

## 충돌 시 대응

### 오류 메시지

```
Error: App ID "com.example.app" is not available.
It may already be registered by another team.
```

### 해결 방법

1. `app.json`에서 `bundleIdentifier` 변경
2. 다시 빌드 시도

```json
// 변경 전
"bundleIdentifier": "com.growit.mobile"

// 변경 후
"bundleIdentifier": "com.growitddd.growit"
```

### 충돌 가능성 낮추기

| 방식 | 예시 | 충돌 가능성 |
|------|------|------------|
| 일반적인 이름 | `com.growit.app` | 높음 |
| 팀/조직명 포함 | `com.growitddd.app` | 낮음 |
| 고유 식별자 포함 | `com.growitddd.growit-mobile` | 매우 낮음 |

> **팁**: 본인 소유 도메인을 역순으로 사용하면 충돌 가능성이 거의 없습니다.

## 주의사항

### 변경 불가

| 시점 | 변경 가능 |
|------|----------|
| 개발 중 | ✅ 자유롭게 변경 가능 |
| 앱 스토어 제출 전 | ✅ 변경 가능 |
| 앱 스토어 제출 후 | ❌ **변경 불가** |

> 앱 스토어에 제출한 후에는 bundleIdentifier를 변경할 수 없습니다. 변경하려면 새 앱으로 등록해야 합니다.

### Android와의 차이

| 항목 | iOS | Android |
|------|-----|---------|
| 설정 키 | `bundleIdentifier` | `package` |
| 형식 | 동일 (역순 도메인) | 동일 |
| 위치 | `expo.ios.bundleIdentifier` | `expo.android.package` |

두 플랫폼에서 같은 값을 사용하는 것이 일반적입니다:

```json
{
  "expo": {
    "ios": {
      "bundleIdentifier": "com.growitddd.growit"
    },
    "android": {
      "package": "com.growitddd.growit"
    }
  }
}
```

## 참고 링크

- [Apple - About Bundle IDs](https://developer.apple.com/documentation/appstoreconnectapi/bundle_ids)
- [Expo - app.json Configuration](https://docs.expo.dev/versions/latest/config/app/#bundleidentifier)
