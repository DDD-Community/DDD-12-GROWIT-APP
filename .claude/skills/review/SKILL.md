---
name: review
description: APP 코드 리뷰 & 품질 게이트 검수
context: fork
allowed-tools: Read, Grep, Glob, Bash
---
# /review — APP 코드 리뷰 & 품질 게이트 검수

## 개요

구현된 코드를 리뷰하고 품질 게이트를 통과하는지 검수한다.
**모든 게이트를 통과해야 PASS.**

---

## 워크플로우

### Step 1: 변경 파일 수집

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP

git diff --name-only main...HEAD
git diff --stat main...HEAD
```

---

## Gate 1: 아키텍처 준수

### 1-1. Expo Router 규칙 검증

- [ ] 스크린 파일이 `src/app/` 하위에 있는가?
- [ ] `_layout.tsx`가 네비게이션 구조를 올바르게 정의하는가?
- [ ] 라우트 그룹 `(group)/`이 적절히 사용되는가?

### 1-2. 컴포넌트 계층 검증

- [ ] 재사용 컴포넌트가 `src/components/`에 있는가?
- [ ] 커스텀 훅이 `src/lib/`에 있는가?
- [ ] 상수가 `src/constants/`에 있는가?

---

## Gate 2: 코드 품질

```bash
# any 타입 사용 탐지
grep -rn ": any\|as any\|<any>" growit-mobile/src/ --include="*.ts" --include="*.tsx" || true

# console.log 잔류 탐지
grep -rn "console\.\(log\|debug\)" growit-mobile/src/ --include="*.ts" --include="*.tsx" || true

# React.FC 사용 탐지
grep -rn "React\.FC\|React\.FunctionComponent" growit-mobile/src/ --include="*.tsx" || true
```

- [ ] `any` 타입 사용이 없는가?
- [ ] `console.log` 잔류가 없는가?
- [ ] 컴포넌트 Props 타입이 명시적으로 정의되어 있는가?

---

## Gate 3: 스타일 규칙

- [ ] `StyleSheet.create()`로 스타일이 정의되어 있는가?
- [ ] 테마 색상에 `useThemeColor()` 또는 `Colors` 상수를 사용하는가?
- [ ] 하드코딩된 색상값이 없는가?

---

## Gate 4: 빌드 검증

### 4-1. 린트

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile && npm run lint
```

### 4-2. 타입 체크

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile && npx tsc --noEmit
```

**판정:** 모두 PASS → PASS, 하나라도 FAIL → 전체 FAIL

---

## 산출물

### PASS

```
## Review Result: PASS

| # | Gate | Status |
|---|------|--------|
| 1 | Architecture | PASS |
| 2 | Code Quality | PASS |
| 3 | Style Rules | PASS |
| 4 | Build Verification | PASS |

→ PR 생성 가능. `/pr` 실행하세요.
```

### FAIL

```
## Review Result: FAIL

| # | Gate | Status | Issues |
|---|------|--------|--------|
| ... | ... | ... | ... |

→ 수정 후 `/review` 재실행하세요.
```

---

## 주의사항

- 코드를 직접 수정하지 않는다. 리뷰 피드백만 제공.
- FAIL 시 구체적인 파일:라인번호와 수정 가이드를 제공한다.
