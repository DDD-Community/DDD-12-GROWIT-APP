# 10. Android EAS 빌드 오류 수정

## 목표

EAS Build (Android) 파이프라인에서 발생한 Gradle 빌드 실패를 원인 분석 후 수정합니다.

## 상태

✅ 완료

---

## 발생한 오류

### 1. expo doctor - react-native-svg 버전 불일치

```
react-native-svg  expected: 15.12.1  found: 15.15.3
```

`package.json`에 `"react-native-svg": "^15.15.3"`으로 명시되어 있었으나, Expo SDK 54가 지원하는 공식 버전은 `~15.12.1`.

`^` (caret) 표기로 인해 마이너 버전이 올라간 15.15.3이 설치되어 있었고, 이로 인해 `expo doctor`가 non-zero exit code로 종료됨.

### 2. Gradle 빌드 실패 - Kotlin 버전 미지원

```
FAILURE: Build failed with an exception.
> Failed to apply plugin 'expo-root-project'.
  > Can't find KSP version for Kotlin version '1.9.0'.
    Supported versions are: '2.2.20, 2.2.10, 2.2.0, 2.1.21, ..., 2.0.0'
```

`app.config.js`의 `@react-native-seoul/kakao-login` 플러그인에 `kotlinVersion: "1.9.0"`이 설정되어 있었으나, Gradle 8.14.3은 Kotlin 2.x 이상만 지원함.

---

## 원인 분석

| 단계 | 오류 | 원인 |
|------|------|------|
| expo doctor | react-native-svg 버전 불일치 | `^15.15.3` → 실제 설치 15.15.3, 기대값 `~15.12.1` |
| Run gradlew | Gradle 빌드 실패 | `kotlinVersion: "1.9.0"` → Gradle 8.14.3이 Kotlin 2.x 이상만 지원 |

---

## 수정 내용

### 1. react-native-svg 버전 다운그레이드

**`package.json`**

```diff
- "react-native-svg": "^15.15.3",
+ "react-native-svg": "~15.12.1",
```

Expo SDK 54 호환 버전(`~15.12.1`)으로 변경 후 `yarn install` 재실행.

### 2. Kotlin 버전 업그레이드

**`app.config.js`**

```diff
  ["@react-native-seoul/kakao-login", {
    kakaoAppKey: process.env.KAKAO_NATIVE_APP_KEY,
-   kotlinVersion: "1.9.0",
+   kotlinVersion: "2.1.21",
  }],
```

Gradle 8.14.3이 지원하는 Kotlin 버전(`2.1.21`)으로 변경.

---

## 수정 파일

| 파일 | 수정 내용 |
|------|----------|
| `growit-mobile/package.json` | `react-native-svg` 버전 `^15.15.3` → `~15.12.1` |
| `growit-mobile/app.config.js` | Kakao Login 플러그인 `kotlinVersion` `1.9.0` → `2.1.21` |
| `growit-mobile/yarn.lock` | 의존성 재설치 반영 |

---

## 참고 사항

- `expo-dev-client`가 설치되어 있으므로, `npx expo start`는 EAS development 빌드가 기기에 설치된 이후에만 사용 가능
- 네이티브 모듈(`@react-native-seoul/kakao-login`, `expo-apple-authentication`) 및 `newArchEnabled: true` 설정으로 인해 Expo Go 실행 불가
- 이후 JS/TS 코드 수정은 `npx expo start`로 핫리로드 가능, 네이티브 코드 변경 시에만 EAS 재빌드 필요
