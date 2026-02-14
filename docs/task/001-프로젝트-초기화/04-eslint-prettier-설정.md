# 04. ESLint/Prettier 설정

## 목표

코드 품질과 일관된 코드 스타일을 위해 ESLint와 Prettier를 설정합니다.

## 상태

⬜ 대기

## 작업 절차

### 1. 패키지 설치

```bash
yarn add -D eslint prettier eslint-config-expo eslint-config-prettier eslint-plugin-prettier @typescript-eslint/eslint-plugin @typescript-eslint/parser
```

### 2. ESLint 설정 파일 생성

`.eslintrc.js` 파일을 프로젝트 루트에 생성합니다.

```javascript
module.exports = {
  extends: [
    'expo',
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:prettier/recommended',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  parserOptions: {
    ecmaVersion: 2021,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
  },
  rules: {
    'prettier/prettier': 'error',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    '@typescript-eslint/explicit-function-return-type': 'off',
    '@typescript-eslint/no-explicit-any': 'warn',
  },
  ignorePatterns: ['node_modules/', 'dist/', '.expo/'],
};
```

### 3. Prettier 설정 파일 생성

`.prettierrc` 파일을 프로젝트 루트에 생성합니다.

```json
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 100,
  "tabWidth": 2,
  "useTabs": false,
  "bracketSpacing": true,
  "jsxSingleQuote": false
}
```

### 4. Prettier 무시 파일 생성

`.prettierignore` 파일을 생성합니다.

```
node_modules/
dist/
.expo/
*.lock
```

### 5. package.json 스크립트 추가

```json
{
  "scripts": {
    "lint": "eslint . --ext .ts,.tsx",
    "lint:fix": "eslint . --ext .ts,.tsx --fix",
    "format": "prettier --write \"**/*.{ts,tsx,js,jsx,json,md}\""
  }
}
```

### 6. VSCode 설정 (권장)

`.vscode/settings.json` 파일을 생성하여 저장 시 자동 포맷팅을 활성화합니다.

```json
{
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit"
  }
}
```

## 주요 규칙 설명

| 규칙 | 설명 |
|------|------|
| `semi: true` | 세미콜론 사용 |
| `singleQuote: true` | 문자열에 작은따옴표 사용 |
| `printWidth: 100` | 한 줄 최대 100자 |
| `trailingComma: es5` | ES5 호환 후행 쉼표 |
| `tabWidth: 2` | 들여쓰기 2칸 |

## 완료 조건

- [ ] ESLint 패키지 설치 완료
- [ ] Prettier 패키지 설치 완료
- [ ] `.eslintrc.js` 파일 생성
- [ ] `.prettierrc` 파일 생성
- [ ] `yarn lint` 정상 동작
- [ ] `yarn format` 정상 동작

## 참고 자료

- [ESLint 공식 문서](https://eslint.org/docs/latest/)
- [Prettier 공식 문서](https://prettier.io/docs/en/)
- [eslint-config-expo](https://github.com/expo/expo/tree/main/packages/eslint-config-expo)
