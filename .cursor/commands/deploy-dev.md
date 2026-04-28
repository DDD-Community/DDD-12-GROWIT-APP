# /deploy-dev — DEV 환경 배포

## 개요

EAS Build를 사용하여 DEV 환경 빌드를 생성한다.

---

## 워크플로우

### Step 1: EAS 설정 확인

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile

# eas.json 확인
cat eas.json
```

### Step 2: DEV 빌드

```bash
# iOS 개발 빌드
eas build --profile development --platform ios

# Android 개발 빌드
eas build --profile development --platform android
```

### Step 3: 빌드 모니터링

```bash
eas build:list --limit=1
```

### Step 4: 결과 보고

```
Build: {build-url}
Profile: development
Platform: {ios | android}
Status: {success | failure}
```

---

## 주의사항

- EAS 계정 로그인 필요 (`eas login`)
- `eas.json`에 development 프로필 설정 필요
- 빌드 완료 후 개발 클라이언트에서 테스트
