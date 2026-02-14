# 01. Expo 프로젝트 생성

## 목표

Expo CLI를 사용하여 expo-router 기반 React Native 프로젝트를 생성합니다.

## 상태

⬜ 대기

## 사전 요구사항

- Node.js 18+ 설치
- yarn 설치 (`npm install -g yarn`)

## 작업 절차

### 1. Expo 프로젝트 생성

```bash
npx create-expo-app@latest growit-mobile
```

> **참고**: `growit-mobile` 폴더에 프로젝트를 생성합니다.
> 기본 템플릿(`default`)을 사용하여 expo-router가 포함된 프로젝트로 시작합니다.

### 2. 프로젝트 디렉토리 이동 및 의존성 설치 확인

```bash
cd growit-mobile
yarn install
```

### 3. 프로젝트 실행 테스트

```bash
npx expo start
```

## 생성되는 파일 구조

```
growit-mobile/
├── app/                  # expo-router 기반 화면 (파일 기반 라우팅)
│   ├── _layout.tsx       # 루트 레이아웃
│   ├── index.tsx         # 메인 화면 (/)
│   └── +not-found.tsx    # 404 화면
│
├── assets/               # 정적 리소스
│   ├── fonts/
│   └── images/
│
├── components/           # 재사용 컴포넌트
├── constants/            # 상수 정의
├── hooks/                # 커스텀 훅
│
├── app.json              # Expo 설정 파일
├── babel.config.js       # Babel 설정
├── package.json          # 프로젝트 의존성
├── tsconfig.json         # TypeScript 설정
└── node_modules/         # 의존성 패키지
```

## 템플릿 선택 이유

| 항목 | blank-typescript | default (선택) |
|------|------------------|----------------|
| expo-router | ❌ 미포함 | ✅ 포함 |
| 파일 기반 라우팅 | ❌ | ✅ |
| 다중 화면 지원 | 수동 설정 필요 | ✅ 기본 제공 |
| 네이티브 로그인 화면 | 추가 작업 필요 | ✅ 쉬운 화면 분기 |

네이티브 로그인 화면(Apple/Kakao)과 웹뷰 화면 간 전환이 필요하므로 `default` 템플릿을 선택합니다.

## 완료 조건

- [ ] Expo 프로젝트 생성 완료
- [ ] `npx expo start` 실행 시 정상 동작
- [ ] iOS/Android 시뮬레이터 또는 Expo Go 앱에서 확인
- [ ] expo-router 동작 확인 (화면 전환 테스트)

## 참고 자료

- [Expo 공식 문서 - Create a project](https://docs.expo.dev/get-started/create-a-project/)
- [Expo Router 공식 문서](https://docs.expo.dev/router/introduction/)
