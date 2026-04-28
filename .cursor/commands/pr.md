# /pr — PR 생성 & GitHub 푸시 (APP)

## 개요

구현 완료된 코드를 GitHub에 PR로 생성한다.
**빌드 체크 실패 시 PR을 생성하지 않는다.**

---

## 입력

- `TICKET_ID`: 티켓 ID
- `TICKET_TITLE`: 티켓 제목
- `TICKET_TYPE`: feat | fix | modify

---

## 워크플로우

### Step 1: Pre-flight Build Gate (필수)

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP/growit-mobile

# 1. 린트 체크
npm run lint

# 2. 타입 체크
npx tsc --noEmit
```

> **FAIL이 하나라도 있으면 PR 생성 차단.**

---

### Step 2: 변경 사항 확인 & 커밋

```bash
cd /Users/sagwangjin/Desktop/growit-test/DDD-12-GROWIT-APP

git status
git diff --name-only
```

커밋되지 않은 변경이 있으면:

```bash
git add {specific files}
git commit -m "{type}: {description}"
```

---

### Step 3: 리모트 브랜치 푸시

```bash
git push -u origin $(git branch --show-current)
```

---

### Step 4: PR 생성

```bash
gh pr create \
  --title "{type}: {TICKET_TITLE}" \
  --body "$(cat <<'EOF'
## Summary

{변경 사항 요약}

## Changes

### New Files
{신규 파일 목록}

### Modified Files
{수정 파일 목록}

## Pre-merge Verification

| Check | Status |
|-------|--------|
| lint | PASS |
| tsc | PASS |

## Related

- Ticket: {TICKET_ID}
- BE Impact: {있으면 기술, 없으면 None}
- FE Impact: {있으면 기술, 없으면 None}
EOF
)"
```

---

### Step 5: 결과 보고

```
## PR 생성 완료

| 항목 | 값 |
|------|------|
| PR URL | {pr-url} |
| Branch | {branch-name} |
| Title | {pr-title} |
```

---

## 주의사항

- **빌드 체크 실패 시 PR을 절대 생성하지 않는다.**
- PR 제목은 conventional commit 형식.
- `git add -A` 또는 `git add .` 금지.
