# /research — 요구사항 분석 & APP 변경 영향도 파악

## 개요

growit-lead 오케스트레이터에서 위임받아 APP 코드베이스를 분석한다.
티켓 요구사항을 기반으로 변경 영향도를 파악하고 리서치 결과를 산출한다.

---

## 입력

오케스트레이터가 주입하는 컨텍스트:

- `TICKET_ID`: 티켓 ID (예: DEVS-11)
- `TICKET_TITLE`: 티켓 제목
- `TICKET_TYPE`: feat | fix | modify
- `TICKET_SUMMARY`: 요구사항 요약
- `TICKET_REQUIREMENTS`: 상세 요구사항

---

## 워크플로우

### Step 1: 영향 스크린 식별

요구사항을 분석하여 영향받는 스크린과 컴포넌트를 식별한다.

```
스크린 경로: growit-mobile/src/app/
컴포넌트 경로: growit-mobile/src/components/
훅/유틸 경로: growit-mobile/src/lib/
상수 경로: growit-mobile/src/constants/
```

### Step 2: 현재 상태 분석

**스크린 분석**
- Expo Router 라우트: `src/app/` 하위 파일
- Layout 구조: `_layout.tsx` 파일
- 네비게이션 흐름

**컴포넌트 분석**
- 재사용 컴포넌트: `src/components/` 하위
- UI 프리미티브: `src/components/ui/` 하위
- 테마 컴포넌트: `ThemedText`, `ThemedView`

**상태/데이터 분석**
- 커스텀 훅: `src/lib/use*.ts`
- API 연동: `src/lib/` 하위
- 인증: `src/lib/auth.ts`

### Step 3: BE API 계약 확인

- BE에서 변경되는 API의 현재 APP 사용처 확인
- FE와 동일한 API를 사용하는지 확인
- 모바일 전용 엔드포인트 필요 여부

### Step 4: 플랫폼 영향 확인

- iOS/Android 플랫폼별 영향 여부
- 네이티브 모듈 필요 여부
- Expo SDK 호환성 확인

---

## 산출물

파일: `.research/{TICKET_ID}/research.md`

```markdown
# Research: {TICKET_ID} — {TICKET_TITLE}

## 요약
{한 줄 요약}

## 영향 스크린
- [ ] {screen1} — {영향 설명}

## 현재 상태 분석

### 스크린
{관련 라우트, 레이아웃}

### 컴포넌트
{관련 컴포넌트 목록}

### 상태/데이터
{관련 훅, API 연동}

## 변경 영향 평가
- 신규 생성: {새로 만들어야 할 것}
- 수정: {기존 코드 변경사항}

## BE API 의존성
- {API 변경에 따른 APP 수정사항}

## 플랫폼 영향
- iOS: {영향}
- Android: {영향}

## 참고 파일
- {중요 파일 경로 목록}
```

---

## 주의사항

- **코드를 수정하지 않는다.** 읽기 전용 분석만 수행.
- 기존 패턴을 존중한다.
- FE와의 UI/UX 일관성을 확인한다.
