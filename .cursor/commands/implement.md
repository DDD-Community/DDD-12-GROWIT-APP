# /implement — APP 코드 구현 실행

## 개요

구현 계획을 기반으로 실제 코드를 작성한다.
Expo Router + React Native 규칙을 준수하며, 구현 순서를 따른다.

---

## 입력

- `TICKET_ID`: 티켓 ID
- 구현 계획: `.plan/{TICKET_ID}/plan.md`
- 아키텍처 규칙: `.ai/rules/architecture.md`
- 코딩 표준: `.ai/rules/coding-standards.md`

---

## 사전 준비

### 브랜치 생성

```bash
git checkout -b {feat|fix|modify}/{TICKET_ID}-{kebab-summary}
```

### 규칙 로드

반드시 아래 파일을 먼저 읽는다:
- `.ai/rules/architecture.md` — Expo Router, 컴포넌트 계층
- `.ai/rules/coding-standards.md` — 네이밍, 스타일, 컨벤션

---

## 구현 순서

**반드시 이 순서를 따른다.**

### Phase 1: 타입 정의

```typescript
// growit-mobile/src/lib/types/{domain}.ts
export interface Todo {
  id: string;
  content: string;
  isCompleted: boolean;
}
```

### Phase 2: API 연동 (`lib/`)

```typescript
// growit-mobile/src/lib/api/{domain}.ts
import { apiClient } from '../apiClient';

export const TodoApi = {
  getList: () => apiClient.get<TodoListResponse>('/todos'),
  create: (req: CreateTodoRequest) => apiClient.post<TodoResponse>('/todos', req),
};
```

### Phase 3: 커스텀 훅 (`lib/`)

```typescript
// growit-mobile/src/lib/use{Hook}.ts
export function useTodoList() {
  // ...
}
```

### Phase 4: UI 컴포넌트 (`components/`)

```typescript
// growit-mobile/src/components/{ComponentName}.tsx
import { ThemedText } from './themed-text';
import { ThemedView } from './themed-view';
import { StyleSheet } from 'react-native';

type Props = { /* ... */ };

export function TodoItem({ todo }: Props) {
  return (
    <ThemedView style={styles.container}>
      <ThemedText type="default">{todo.content}</ThemedText>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 16 },
});
```

### Phase 5: 스크린 (`app/`)

```typescript
// growit-mobile/src/app/(tabs)/todo.tsx
import { TodoItem } from '@components/TodoItem';

export default function TodoScreen() {
  return (
    // ...
  );
}
```

### Phase 6: 네비게이션 설정 (필요 시)

```typescript
// growit-mobile/src/app/(tabs)/_layout.tsx
// 새 탭 또는 스크린 추가
```

---

## 검증 단계

구현 완료 후 반드시 실행:

### 1. 린트 체크

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile && npm run lint
```

### 2. 타입 체크

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile && npx tsc --noEmit
```

### 3. Metro 번들 확인

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile && npx expo start --no-dev --minify
```

### 4. 실패 시

- 에러 메시지를 분석하고 수정
- lint → tsc 순서로 재실행
- 모두 통과할 때까지 반복

---

## 커밋

모든 검증 통과 후 커밋한다.

```bash
git add {specific files}
git commit -m "{type}: {description}"
```

**`git add -A` 또는 `git add .` 금지. 파일 지정만 사용.**

---

## 주의사항

- 계획에 없는 코드를 작성하지 않는다.
- 기존 코드 패턴을 따른다.
- `ThemedText`, `ThemedView` 테마 컴포넌트를 활용한다.
- `StyleSheet.create()`로 스타일 정의한다.
- `any` 타입 사용 금지.
- 크로스 플랫폼 호환성을 우선한다.
