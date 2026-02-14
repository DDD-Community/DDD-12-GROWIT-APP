# Babel Config와 Expo

## 개요

Expo 프로젝트에서 `babel.config.js`가 왜 필요한지, 기본 설정과 커스텀 설정의 차이를 정리합니다.

## Expo의 기본 Babel 설정

### babel.config.js가 없을 때

Expo는 `babel-preset-expo`를 **암묵적으로 사용**합니다. `babel.config.js` 파일이 없어도 프로젝트가 정상 동작합니다.

```
Expo 프로젝트 실행
       ↓
babel.config.js 존재?
       ↓
   ┌───┴───┐
   ↓       ↓
  없음     있음
   ↓       ↓
기본 설정   파일 설정
(babel-preset-expo)  사용
```

### 기본 preset이 제공하는 것

`babel-preset-expo`는 다음을 포함합니다:

| 기능 | 설명 |
|------|------|
| React/JSX 변환 | JSX 문법 지원 |
| TypeScript 변환 | `.ts`, `.tsx` 파일 컴파일 |
| ES6+ 문법 변환 | 최신 JavaScript 문법 지원 |
| React Native 최적화 | 플랫폼별 최적화 |

## babel.config.js가 필요한 경우

### 1. 경로 별칭 (Path Alias)

TypeScript의 `paths` 설정만으로는 **타입 체킹**만 가능합니다. 실제 **런타임**에서 경로 별칭이 동작하려면 Babel 설정이 필요합니다.

```
┌─────────────────────────────────────────────────────────────┐
│                      경로 별칭 동작 원리                      │
├─────────────────────────────────────────────────────────────┤
│                                                             │
│  tsconfig.json의 paths                                      │
│  ├─ 역할: IDE 자동완성, 타입 체킹                             │
│  └─ 한계: 실제 번들링 시 경로 변환 안 됨                       │
│                                                             │
│  babel.config.js의 module-resolver                          │
│  ├─ 역할: 실제 import 경로를 변환                             │
│  └─ 결과: 번들에 올바른 경로로 포함                            │
│                                                             │
└─────────────────────────────────────────────────────────────┘
```

**예시:**

```typescript
// 코드에서 작성
import { Button } from '@components/Button';

// TypeScript (tsconfig.json)
// → 타입 체킹 시 './components/Button'으로 인식

// Babel (module-resolver)
// → 번들링 시 './components/Button'으로 실제 변환
```

### 2. 커스텀 플러그인 추가

Reanimated, Decorators 등 추가 Babel 플러그인이 필요한 경우:

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      'react-native-reanimated/plugin', // 예시
    ],
  };
};
```

## 현재 프로젝트 설정

### tsconfig.json (타입 체킹용)

```json
{
  "compilerOptions": {
    "paths": {
      "@components/*": ["./components/*"],
      "@hooks/*": ["./hooks/*"]
      // ...
    }
  }
}
```

### babel.config.js (런타임용)

```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      [
        'module-resolver',
        {
          root: ['./'],
          alias: {
            '@components': './components',
            '@hooks': './hooks',
            // ...
          },
        },
      ],
    ],
  };
};
```

## 요약

| 상황 | babel.config.js 필요 |
|------|---------------------|
| 기본 Expo 사용 | ❌ 불필요 |
| **경로 별칭 사용** | ✅ **필요** |
| 커스텀 플러그인 추가 | ✅ 필요 |
| Reanimated 사용 | ✅ 필요 (플러그인 추가) |

> **핵심**: TypeScript `paths`는 타입 체킹용, Babel `module-resolver`는 런타임 변환용입니다. 둘 다 설정해야 경로 별칭이 완전히 동작합니다.

## 참고 링크

- [babel-preset-expo](https://docs.expo.dev/versions/latest/config/babel/)
- [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
