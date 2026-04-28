---
name: deploy-prod
description: PROD 환경 배포 (EAS Submit)
context: fork
allowed-tools: Read, Bash
---
# /deploy-prod — PROD 환경 배포

## 개요

EAS Build + EAS Submit을 사용하여 프로덕션 빌드를 생성하고 스토어에 제출한다.

---

## 워크플로우

### Step 1: 사전 검증

**PROD 배포 전 반드시 확인:**
- [ ] DEV 빌드 테스트 완료
- [ ] 린트/타입 체크 통과
- [ ] app.json 버전 업데이트

### Step 2: 버전 업데이트

```bash
# app.json의 version, buildNumber/versionCode 업데이트
# expo.version: "1.x.x"
```

### Step 3: PROD 빌드

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile

# iOS 프로덕션 빌드
eas build --profile production --platform ios

# Android 프로덕션 빌드
eas build --profile production --platform android
```

### Step 4: 스토어 제출

```bash
# App Store 제출
eas submit --platform ios

# Google Play 제출
eas submit --platform android
```

### Step 5: 결과 보고

```
Build: {build-url}
Profile: production
Version: {version}
Status: {success | failure}
```

---

## 롤백 절차

- 이전 빌드를 스토어에 재제출
- 또는 핫픽스 브랜치 → 새 빌드 → 긴급 심사

---

## 주의사항

- DEV 테스트 완료 없이 PROD 배포하지 않는다.
- 버전 번호를 반드시 업데이트한다.
- iOS는 App Store 심사 기간을 고려한다.
- 서명 인증서/프로필이 유효한지 확인한다.
