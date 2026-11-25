# Eunji Choi Portfolio

기획자·BX Strategist Eunji Choi의 원페이지 포트폴리오.
콘텐츠(글·이미지)는 전부 Firebase(Firestore + Storage)에서 관리하며, 콘솔에서 바꾸면 재배포 없이 사이트에 반영됩니다.

- 사이트: https://choi-portfolio-98f6a.web.app
- 사이트 주인용 관리 가이드: [docs/ADMIN_GUIDE.md](docs/ADMIN_GUIDE.md)
- 설계·디자인 사양: [CLAUDE.md](CLAUDE.md)

## 스택

Vite · React 19 · TypeScript (strict) · react-router · Firebase JS SDK (Firestore, Storage) · TanStack Query · Lenis · GSAP (ScrollTrigger, SplitText) · CSS Modules + CSS 변수 · Firebase Hosting

## 로컬 개발

```bash
npm install
cp .env.example .env.local   # Firebase 웹 앱 설정값 입력 (콘솔 → 프로젝트 설정 → 내 앱)
npm run dev
```

| 명령 | 설명 |
|---|---|
| `npm run dev` | 개발 서버 |
| `npm run build` | 타입 체크 + 프로덕션 빌드 (`dist/`) |
| `npm run lint` | ESLint |
| `npm run seed` | `seed/seed-data.json`을 Firestore에 업로드 (아래 참고) |
| `npm run deploy` | 빌드 후 Firebase Hosting 배포 |

커밋 전 `npm run build`, `npm run lint`가 통과해야 합니다.

## 시드 데이터

`seed/seed-data.json` (settings 1개 + works 65개)을 Firestore에 올립니다.

1. Firebase 콘솔 → 프로젝트 설정 → 서비스 계정 → **새 비공개 키 생성**
2. 받은 파일을 프로젝트 루트에 `serviceAccount.json`으로 저장 (`.gitignore`에 포함, 절대 커밋 금지)
3. 실행

```bash
npm run seed              # 없는 문서만 생성 (콘솔에서 수정한 문서는 건너뜀)
npm run seed -- --force   # 기존 문서도 덮어쓰기
npm run seed -- --dry-run # 업로드 없이 데이터 검증만
```

## 배포

처음 한 번 Firebase CLI 로그인이 필요합니다.

```bash
npx firebase-tools login
```

```bash
npm run deploy                                            # Hosting
npx firebase-tools deploy --only firestore:rules,storage  # 보안 규칙 (firestore.rules, storage.rules)
```

- 보안 규칙은 **모두 읽기 허용 / 쓰기 금지**입니다. 콘솔 편집은 규칙과 무관하게 가능합니다.
- 데이터·이미지 변경은 배포가 필요 없습니다. 코드를 바꿨을 때만 배포합니다.

## 요금 (Blaze 요금제)

Cloud Storage for Firebase는 Blaze(종량제) 요금제가 필요합니다. 무료 사용량은 그대로라 포트폴리오 규모면 사실상 0원이지만, 만약을 위해 **예산 알림**을 꼭 설정하세요.

1. [Google Cloud 콘솔 → 결제 → 예산 및 알림](https://console.cloud.google.com/billing/budgets) 열기
2. **예산 만들기** → 프로젝트 `choi-portfolio-98f6a` 선택
3. 금액 **$1** → 알림 기준 50% / 90% / 100% → 이메일 수신 확인 → 저장

예산 알림은 알림만 보낼 뿐 과금을 막지는 않습니다. 알림이 오면 Storage 사용량(이미지 용량·트래픽)을 확인하세요.

## 폴더 구조

```
src/
  lib/          firebase, storage(이미지 URL), lenis(스무스 스크롤·GSAP), navigation, sections
  data/         Firestore 타입·파서·쿼리 훅
  hooks/        현재 섹션, 페이지 테마, 스크롤 복원, 워드마크 크기 등
  components/   고정 UI(내비·커서·invert·인디케이터), 워드마크, 이미지, 텍스트 reveal
  sections/     Home, Profile, Works, ProjectList, Footer
  pages/        홈, 프로젝트 상세(/works/:id), 404
  styles/       tokens.css(디자인 토큰), grid.css(8/4/2 컬럼), global.css
docs/           관리 가이드, 디자인 레퍼런스 캡처
scripts/        seed.mjs
seed/           시드 데이터
```

디자인 값(크기·간격·색·속도)은 대부분 `src/styles/tokens.css` 변수 하나로 조절됩니다.
