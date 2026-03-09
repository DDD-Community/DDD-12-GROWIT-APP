# 05. Git 설정

## 목표

프로젝트의 Git 설정을 완료하고 초기 커밋을 진행합니다.

## 상태

✅ 완료

## Git 저장소 구조

프로젝트 루트(`DDD-12-GROWIT-APP/`)에 단일 Git 저장소를 사용합니다.

```
DDD-12-GROWIT-APP/          ← .git 여기 (단일 저장소)
├── .gitignore              ← 루트에 생성
├── growit-mobile/          ← .git 없음 (Expo 자동 생성 삭제)
│   ├── src/
│   ├── assets/
│   └── ...
└── docs/
```

### 단일 저장소를 선택한 이유

| 장점 | 설명 |
|------|------|
| 통합 관리 | 문서(docs)와 코드(growit-mobile)를 함께 버전 관리 |
| 단순함 | 하나의 저장소로 관리 오버헤드 감소 |
| 연관성 유지 | 문서와 코드 변경을 단일 커밋으로 추적 가능 |

## 작업 절차

### 1. 기존 Git 저장소 삭제

> **참고**: Expo CLI가 `growit-mobile/` 내에 자동 생성한 `.git`을 삭제합니다.

```bash
rm -rf growit-mobile/.git
```

### 2. 루트에서 Git 저장소 초기화

```bash
cd DDD-12-GROWIT-APP
git init
```

### 3. .gitignore 설정

루트에 `.gitignore` 파일을 생성합니다.

```gitignore
# Dependencies
node_modules/
.pnp/
.pnp.js

# npm (yarn 사용으로 제외)
package-lock.json

# Expo
.expo/
dist/
web-build/
expo-env.d.ts

# EAS
.eas/

# Native builds
ios/
android/
*.orig.*
*.jks
*.p8
*.p12
*.key
*.mobileprovision

# Metro
.metro-health-check*

# Debug
npm-debug.*
yarn-debug.*
yarn-error.*
*.log

# macOS
.DS_Store
*.pem

# Local env files
.env*.local
.env

# TypeScript
*.tsbuildinfo

# IDE
.idea/
.vscode/
*.swp
*.swo

# Test
coverage/
__tests__/

# Build
build/
out/

# Cache
.cache/
.turbo/
```

### 4. 초기 커밋

```bash
git add .
git commit -m "chore: 프로젝트 초기 설정"
```

### 5. 원격 저장소 연결 (선택)

```bash
git remote add origin <repository-url>
git push -u origin main
```

## .gitignore 항목 설명

| 항목 | 설명 |
|------|------|
| `node_modules/` | 패키지 (용량 큼, 재설치 가능) |
| `package-lock.json` | npm 락 파일 (yarn 사용으로 제외) |
| `yarn.lock` | ✅ **포함** (협업 시 동일 버전 보장) |
| `.expo/` | Expo 캐시 파일 |
| `.eas/` | EAS CLI 캐시 |
| `ios/`, `android/` | 네이티브 빌드 폴더 (EAS Build 사용 시 불필요) |
| `dist/` | 빌드 결과물 |
| `.env` | 환경 변수 (민감 정보 포함 가능) |
| `.DS_Store` | macOS 시스템 파일 |
| `*.jks`, `*.p12` | 서명 키 파일 (보안) |
| `*.log` | 로그 파일 |

> **참고**: `yarn.lock`은 협업 시 동일한 패키지 버전을 보장하므로 반드시 Git에 포함합니다.

## 완료 조건

- [x] growit-mobile/.git 삭제 완료
- [x] 루트에서 Git 저장소 초기화 완료
- [x] .gitignore 파일 생성
- [x] 초기 커밋 완료
- [ ] (선택) 원격 저장소 연결

## 참고 자료

- [Expo .gitignore 예시](https://github.com/expo/expo/blob/main/templates/expo-template-blank/.gitignore)
- [gitignore.io - Node](https://www.toptal.com/developers/gitignore/api/node,expo)
