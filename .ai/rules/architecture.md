# Expo Router + React Native 아키텍처 규칙

## 개요

GROWIT APP은 Expo SDK 54 + React Native 0.81 기반의 모바일 앱이다.
Expo Router를 사용한 파일 기반 라우팅과 계층화된 컴포넌트 구조를 따른다.

---

## 프로젝트 구조

```
growit-mobile/
├── src/
│   ├── app/                 ← Expo Router 파일 기반 라우팅
│   │   ├── _layout.tsx      ← Root Layout (Stack Navigator)
│   │   ├── (tabs)/          ← Tab Navigation 그룹
│   │   │   ├── _layout.tsx  ← Bottom Tabs 설정
│   │   │   └── index.tsx    ← 홈 탭
│   │   └── modal.tsx        ← 모달 스크린
│   ├── components/          ← 재사용 가능한 UI 컴포넌트
│   │   ├── ui/              ← 기초 UI 프리미티브
│   │   └── {Component}.tsx  ← 공통 컴포넌트
│   ├── constants/           ← 상수 & 테마
│   │   └── theme.ts         ← Colors, Fonts 정의
│   └── lib/                 ← 유틸리티 & 커스텀 훅
│       ├── auth.ts          ← 인증 서비스
│       └── use*.ts          ← 커스텀 훅
├── assets/                  ← 이미지, 폰트 등 정적 리소스
├── app.json                 ← Expo 설정
├── babel.config.js          ← Babel 설정 (module-resolver)
└── tsconfig.json            ← TypeScript 설정
```

---

## 라우팅 (Expo Router)

### 파일 기반 라우팅 규칙

```
src/app/                     → /
src/app/(tabs)/index.tsx     → / (탭 홈)
src/app/(tabs)/explore.tsx   → /explore
src/app/modal.tsx            → /modal
src/app/[id].tsx             → /:id (동적 라우트)
```

### Layout 규칙

- `_layout.tsx` — 네비게이션 구조 정의
- `(group)/` — 라우트 그룹 (URL에 미반영)
- Root Layout: `Stack` Navigator + ThemeProvider
- Tab Layout: `Tabs` Navigator (Bottom Tabs)

---

## 컴포넌트 계층

| 계층 | 위치 | 책임 |
|------|------|------|
| **Screen** | `src/app/` | 페이지 단위, 라우팅 |
| **Component** | `src/components/` | 재사용 가능한 UI 컴포넌트 |
| **UI Primitive** | `src/components/ui/` | 기초 UI 요소 (아이콘, Collapsible) |
| **Hook** | `src/lib/use*.ts` | 커스텀 훅 |
| **Utility** | `src/lib/` | 헬퍼 함수, 서비스 |
| **Constant** | `src/constants/` | 테마, 상수 |

### 참조 규칙

```
Screen → Component, Hook, Utility, Constant
Component → UI Primitive, Hook, Utility, Constant
UI Primitive → Constant
Hook → Utility, Constant
```

---

## 테마 시스템

### ThemedText / ThemedView 패턴

```typescript
// 테마 인식 컴포넌트 — 라이트/다크 모드 자동 전환
export function ThemedText({ type = 'default', lightColor, darkColor, ...props }) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <Text style={[{ color }, styles[type]]} {...props} />;
}
```

### Colors 정의

```typescript
// constants/theme.ts
const Colors = {
  light: { text: '#11181C', background: '#fff', tint: '#0a7ea4', ... },
  dark: { text: '#ECEDEE', background: '#151718', tint: '#fff', ... },
};
```

---

## 신규 스크린 추가 체크리스트

1. `src/app/{route}/` 또는 `src/app/(group)/{route}.tsx` 생성
2. 필요 시 `_layout.tsx` 수정 (네비게이션 설정)
3. `src/components/` 에 도메인 컴포넌트 생성
4. `src/lib/` 에 커스텀 훅/유틸 추가
5. `src/constants/` 에 상수 추가

---

## Expo 설정

| 설정 | 값 |
|------|-----|
| SDK | 54 |
| React Native | 0.81.5 |
| New Architecture | 활성화 |
| React Compiler | 활성화 |
| Typed Routes | 활성화 |
| Router Root | `./src/app` |

---

## 금지 사항

- `react-navigation` 직접 설정 금지 — Expo Router 사용
- 인라인 스타일 남용 금지 — `StyleSheet.create()` 사용
- `any` 타입 사용 금지
- Platform-specific 코드 남용 금지 — 크로스 플랫폼 우선
- `src/app/` 외 경로에서 라우팅 처리 금지
