# Expo Router 네비게이션 메서드 비교

## 개요

Expo Router에서 화면 전환 시 사용하는 다양한 네비게이션 메서드의 차이점과 적절한 사용 시점을 정리합니다.

## 메서드 비교

| 메서드 | 동작 | 스택 변화 | 사용 시점 |
|--------|------|----------|----------|
| `router.push(href)` | 새 화면을 스택에 추가 | 스택 +1 | 일반적인 화면 이동 (뒤로가기 필요) |
| `router.back()` | 이전 화면으로 이동 | 스택 -1 | 뒤로가기 |
| `router.replace(href)` | 현재 화면을 새 화면으로 대체 | 스택 유지 | 인증 플로우, 리다이렉트 |
| `router.dismiss(n)` | n개 화면 dismiss | 스택 -n | 모달 닫기, 여러 화면 닫기 |
| `router.dismissAll()` | 스택의 모든 화면 dismiss | 스택 초기화 | 스택 전체 초기화 |
| `router.dismissTo(href)` | 특정 href까지 dismiss | 가변 | 특정 화면까지 돌아가기 |

## 상세 설명

### router.push()

```typescript
router.push('/(auth)/signup');
```

- 새 화면을 navigation stack에 추가
- 뒤로가기 시 이전 화면으로 돌아감
- 스택이 계속 쌓일 수 있음

### router.replace()

```typescript
router.replace('/(auth)/login');
```

- 현재 화면을 새 화면으로 **대체**
- 뒤로가기 시 대체된 화면이 아닌 그 이전 화면으로 돌아감
- 인증 플로우에서 스택이 쌓이지 않도록 할 때 유용

### router.dismiss() / router.dismissAll()

```typescript
// 1개 화면 dismiss
router.dismiss();

// 3개 화면 dismiss
router.dismiss(3);

// 스택의 모든 화면 dismiss (첫 번째 화면으로 돌아감)
router.dismissAll();
```

- 가장 가까운 스택에서 화면을 제거
- `dismissAll()`은 `popToTop`과 유사하게 동작

### router.dismissTo()

```typescript
router.dismissTo('/(auth)/login');
```

- 지정된 href까지 모든 화면을 dismiss
- href가 스택에 없으면 push 동작 수행

## 인증 플로우에서의 활용

### 문제 상황

```mermaid
flowchart LR
    A[로그인] -->|push| B[회원가입]
    B -->|back| A2[로그인]
    A2 -->|push| B2[회원가입]
    B2 -->|back| A3[로그인]
```

`push`와 `back`을 사용하면 스택이 계속 쌓여 뒤로가기 시 이전 화면들이 모두 나타남.

### 해결 방안

```mermaid
flowchart LR
    A[로그인] -->|replace| B[회원가입]
    B -->|replace| A2[로그인]
```

`replace`를 사용하면 스택이 쌓이지 않음.

## 사용 가이드라인

| 상황 | 권장 메서드 |
|------|------------|
| 일반 화면 이동 (뒤로가기 필요) | `push()` |
| 인증 플로우 (로그인 → 메인) | `replace()` |
| 로그아웃 후 로그인 화면 | `replace()` |
| 모달/바텀시트 닫기 | `dismiss()` |
| 딥링크로 특정 화면 진입 후 복귀 | `dismissTo()` |
| 온보딩 완료 후 메인 진입 | `replace()` |

## 참고 링크

- [Expo Router - Navigation](https://docs.expo.dev/router/basics/navigation/)
- [Expo Router - Stack](https://docs.expo.dev/router/advanced/stack/)
- [Router API Reference](https://docs.expo.dev/versions/latest/sdk/router/)
