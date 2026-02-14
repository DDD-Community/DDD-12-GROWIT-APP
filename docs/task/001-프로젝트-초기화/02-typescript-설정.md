# 02. TypeScript 설정

## 목표

TypeScript 설정을 최적화하고 경로 별칭(path alias)을 설정합니다.

## 상태

⬜ 대기

## 작업 절차

### 1. tsconfig.json 설정

Expo 템플릿에서 기본 제공되는 `tsconfig.json`을 확장합니다.

```json
{
  "extends": "expo/tsconfig.base",
  "compilerOptions": {
    "strict": true,
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"],
      "@components/*": ["./src/components/*"],
      "@lib/*": ["./src/lib/*"],
      "@constants/*": ["./src/constants/*"],
      "@assets/*": ["./assets/*"]
    }
  },
  "include": ["**/*.ts", "**/*.tsx", ".expo/types/**/*.ts", "expo-env.d.ts"]
}
```

> **참고**: `@assets/*`는 `src/` 외부의 `assets/` 폴더를 가리킵니다. `app.json`에서 아이콘/스플래시 경로가 `./assets/`를 참조하므로 루트에 유지합니다.

### 2. Babel 경로 별칭 설정

TypeScript 경로 별칭이 런타임에서도 동작하도록 `babel-plugin-module-resolver`를 설치합니다.

```bash
yarn add -D babel-plugin-module-resolver
```

### 3. babel.config.js 수정

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
            '@': './src',
            '@components': './src/components',
            '@lib': './src/lib',
            '@constants': './src/constants',
            '@assets': './assets',
          },
        },
      ],
    ],
  };
};
```

### 4. 경로 별칭 사용 예시

```typescript
// src 내부 파일
import { Button } from '@components/Button';
import { useAuth } from '@lib/useAuth';

// assets 폴더 (src 외부)
import logo from '@assets/images/logo.png';
```

> **주의**: `@/assets`가 아닌 `@assets`를 사용합니다. `@/*`는 `./src/*`를 가리키므로, assets 폴더는 별도의 `@assets` 별칭을 사용해야 합니다.

## 완료 조건

- [ ] tsconfig.json 경로 별칭 설정 완료
- [ ] babel-plugin-module-resolver 설치 완료
- [ ] babel.config.js 수정 완료
- [ ] 경로 별칭 import 정상 동작 확인

## 참고 자료

- [TypeScript Path Mapping](https://www.typescriptlang.org/docs/handbook/module-resolution.html#path-mapping)
- [babel-plugin-module-resolver](https://github.com/tleunen/babel-plugin-module-resolver)
