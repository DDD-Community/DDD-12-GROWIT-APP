---
name: plan
description: APP 구현 계획 수립 (Expo Router, 컴포넌트, API 연동)
context: fork
allowed-tools: Read, Grep, Glob, Bash, Write, Edit
---
# /plan — APP 구현 계획 수립

## 개요

리서치 결과를 기반으로 APP 구현 계획을 수립한다.
스크린 설계, 컴포넌트, API 연동, 네비게이션을 포함한 체계적 계획을 산출한다.

---

## 입력

- `TICKET_ID`: 티켓 ID
- 리서치 결과: `.research/{TICKET_ID}/research.md`
- 아키텍처 규칙: `.ai/rules/architecture.md`
- 코딩 표준: `.ai/rules/coding-standards.md`

---

## 워크플로우

### Step 1: 리서치 결과 로드

`.research/{TICKET_ID}/research.md`를 읽고 영향 범위를 확인한다.

### Step 2: 스크린 & 네비게이션 설계

- 신규 스크린 필요 여부
- 라우트 구조 변경
- Layout 수정 여부
- 네비게이션 흐름

### Step 3: 컴포넌트 설계

각 컴포넌트에 대해:

```
- 컴포넌트 이름 (PascalCase)
- 위치 (components/, components/ui/)
- Props 타입
- 사용할 기존 컴포넌트 (ThemedText, ThemedView 등)
- 스타일 (StyleSheet.create)
```

### Step 4: API 연동 계획

- API 엔드포인트 (BE와 동일)
- Request/Response 타입
- 커스텀 훅 설계

### Step 5: 구현 순서

```
1. 타입 정의
2. API 연동 (lib/)
3. 커스텀 훅 (lib/)
4. UI 컴포넌트 (components/)
5. 스크린 (app/)
6. 네비게이션 설정 (_layout.tsx)
```

---

## 산출물

파일: `.plan/{TICKET_ID}/plan.md`

```markdown
# Plan: {TICKET_ID} — {TICKET_TITLE}

## 요약
{구현 범위 한 줄 요약}

## 스크린 설계
{라우트 구조, 네비게이션 흐름}

## 컴포넌트 설계
{컴포넌트 목록, Props, 스타일}

## API 연동
{엔드포인트, 타입}

## 구현 체크리스트
- [ ] {path}/{File}.tsx — {설명}

## 예상 파일 변경
- 신규: {N}개
- 수정: {N}개
```

---

## 주의사항

- **코드를 작성하지 않는다.** 계획만 수립.
- FE와의 UI/UX 일관성을 유지한다.
- Expo Router 파일 기반 라우팅 규칙을 따른다.
- 크로스 플랫폼 호환성을 우선한다.
