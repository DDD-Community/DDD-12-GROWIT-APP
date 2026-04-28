---
name: deploy-local
description: 로컬 개발 서버 기동 (Expo Metro)
context: fork
allowed-tools: Read, Bash
---
# /deploy-local — 로컬 개발 서버 기동 (Expo Metro)

## 개요

로컬 환경에서 Expo Metro 번들러를 기동한다.

---

## 워크플로우

### Step 1: 의존성 확인

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile

# node_modules 확인
ls node_modules/.package-lock.json 2>/dev/null || npm install
```

### Step 2: Metro 번들러 기동

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile && npx expo start
```

### Step 3: 상태 보고

```
Metro Bundler: http://localhost:8081
Framework: Expo SDK 54 + React Native 0.81
Platform: iOS Simulator / Android Emulator / Web
```

---

## 실행 옵션

```bash
# iOS 시뮬레이터
npm run ios

# Android 에뮬레이터
npm run android

# 웹 브라우저
npm run web
```

---

## 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| Port 8081 already in use | 다른 Metro 프로세스 | `lsof -i :8081` 후 종료 |
| Module not found | 의존성 미설치 | `npm install` |
| Native module error | 네이티브 빌드 필요 | `npx expo prebuild` |
| Cache issue | Metro 캐시 문제 | `npx expo start --clear` |
