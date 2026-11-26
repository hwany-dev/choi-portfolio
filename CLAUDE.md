# CLAUDE.md — Eunji Choi Portfolio

기획자·BX Strategist **Eunji Choi**의 원페이지 웹 포트폴리오.
콘텐츠는 **전부 Firebase(Firestore + Storage)** 에서 관리한다. 사이트 주인(비개발자)은 코드를 수정하지 않고 **Firebase 콘솔에서 데이터와 이미지만 바꿔서** 사이트를 유지보수한다.
→ 최우선 원칙 1: **콘솔에서 바꾸면 코드 수정·재배포 없이 사이트에 반영된다.**
→ 최우선 원칙 2: **디자인·인터랙션은 santalarch.com을 최대한 충실히 재현한다** (아래 §3, 레퍼런스 캡처 `docs/reference/*.jpg` 필독).

---

## 1. 레퍼런스

| 용도 | URL | 가져올 것 |
|---|---|---|
| **메인 컨셉 (디자인·인터랙션 전부)** | https://santalarch.com/ (Awwwards SOTD) | §3 전체. **Philosophy처럼 스크롤 인터랙션만 보여주는 섹션은 만들지 않는다.** Services(가로 스크롤), Company(Working Worldwide)도 해당 없음. |
| WORKS 그리드 | https://www.urbanplay.co.kr/PROJECT | 카테고리 탭 필터 |
| WORKS 그리드 | https://our-labour.com/Index | 이미지 인덱스(캡션 최소) |
| WORKS 상세 | https://www.urbanplay.co.kr/parkment_yh | 상단 대형 메인 이미지 → 타이틀 → 메타 → 이미지 나열 |
| PROJECT LIST | https://our-labour.com/Project-List-1 | 텍스트 전용, 연도 그룹, 최신순 |

### 1-1. 레퍼런스 캡처 (`docs/reference/`)
santalarch 화면 녹화(1920×1040)에서 뽑은 프레임. **구현 전에 반드시 이미지를 열어서 확인할 것.**

| 파일 | 내용 |
|---|---|
| `01-hero.jpg` | 첫 화면: 상단 거대 워드마크, 그 아래 8컬럼 그리드 내비, 좌측 소문구, 우측 큰 카피, 하단 `Scroll to discover`, 좌하단 `invert color`, 커스텀 커서(검은 점), 옅은 대각선·세로 그리드 라인 |
| `02-hero-scrolled-nav-sticky.jpg` | 스크롤 시 워드마크는 위로 사라지고 내비가 상단에 sticky |
| `03~06-transition-*.jpg` | **라이트 → 다크 섹션 전환**: 화면 중앙 세로 검은 바가 좌우로 넓어지며 화면을 덮음 → 작은 중앙 라벨 → 이미지들이 아래에서 올라옴 |
| `07-works-grid-parallax.jpg` | 다크 배경 3열 이미지 그리드, 열마다 세로 위치가 어긋남(패럴랙스), 내비는 `mix-blend-mode: difference`로 이미지 위에서 반전 |
| `08-works-load-more.jpg` | 그리드 아래 우측 정렬 큰 `Load more` (밑줄) |
| `09-process-list-style.jpg` | 다크 리스트: 큰 2줄 타이틀 + 우측 `+`, 헤어라인 구분선, 화면 중앙에 가까운 행만 밝고 나머지는 흐림. 좌측 소문구는 단어 단위로 서서히 밝아짐 → **PROJECT LIST에 적용** |
| `10-team-photos.jpg` | 흑백 인물 사진 + 이름/직함 소문구 → **PROFILE 사진 톤 참고** |
| `11~12-plus-transition-*.jpg` | **다크 → 라이트 전환**: 화면 중앙에 `+`(로고 심볼) 모양이 나타나 커지면서 화면을 밝게 덮음 |
| `13-contact.jpg`, `14-footer-wordmark.jpg` | 컨택트: 좌측 큰 `Let's Talk`(밑줄), 그리드 컬럼에 맞춘 연락처, 하단에 거대 워드마크가 잘린 채 올라옴 |
| `15-footer-wordmark-reveal.jpg` | 푸터 워드마크 reveal 중간 프레임 (마스크 밴드로 드러남) |

톤: *Bold presence. Quiet execution.* 장식 최소화, 그리드·헤어라인·타이포·여백, 사진이 주인공.

---

## 2. 기술 스택

- **Vite + React + TypeScript** (strict)
- **react-router** — `/` 원페이지, `/works/:id` 상세
- **Firebase JS SDK (modular)** — Firestore, Storage
- **TanStack Query** — Firestore/Storage 요청 캐싱
- **Lenis** — 스무스 스크롤 / 앵커 이동
- **GSAP + ScrollTrigger** — 스크롤 scrub 전환, reveal (GSAP는 현재 플러그인 포함 무료)
- 스타일: **CSS Modules + CSS 변수** (Tailwind 쓰지 않음)
- 폰트
  - 워드마크(HOME 타이틀·푸터): **Archivo Variable, wdth 125 / wght 900** (`@fontsource-variable/archivo`의 wdth 포함 버전). santalarch 워드마크처럼 굵고 넓은 그로테스크.
  - 그 외 전부: **Pretendard Variable** (`pretendard` npm, self-host). 국·영문 공용.
- 배포: **Firebase Hosting** (SPA rewrite)

패키지는 최신 안정 버전. 새 의존성은 꼭 필요할 때만.

---

## 3. 디자인 시스템 & 인터랙션 (santalarch 재현)

### 3-1. 그리드 — 모든 배치의 기준
- desktop **8컬럼, 거터 0**, 좌우 패딩 `var(--gutter)`. (1905px 기준 1컬럼 ≈ 238px)
- 내비 항목, 소문구, 카피, 리스트, 연락처 등 **모든 텍스트 블록의 시작 x좌표를 컬럼 시작선에 맞춘다.**
- 배경에 컬럼 경계 **세로 헤어라인**을 아주 옅게 (`color-mix(in srgb, var(--fg) 6%, transparent)`). HOME에는 좌상→우하 **대각선 헤어라인** 1개 (SVG, 같은 투명도).
- tablet(≤1024) 4컬럼, mobile(≤768) 2컬럼. 컬럼 배치 규칙은 `--col-*` 변수/유틸로 관리.

### 3-2. 컬러 & 테마
- 팔레트는 2색: `--paper: #f0f0f0` (순백 아님), `--ink: #0e0e0e`.
- 섹션마다 테마가 있다: light(bg paper / fg ink), dark(bg ink / fg paper). 테마는 **페이지 전체(`html[data-theme]`) 하나**로 적용되고, 현재 섹션(화면 가운데를 지나는 섹션)에 따라 바뀐다 (§3-8).
  - HOME, PROFILE = light / **WORKS, PROJECT LIST, 푸터 = dark** / 상세 페이지 = light
- 보조색은 `color-mix()`로 파생 (dim 텍스트 40%, 헤어라인 6~12%).

### 3-3. INVERT COLOR (다크모드)
- 좌하단 고정 `invert color` (소문자, 13px, 밑줄, `i` 위 점 대신 작은 원형 dot을 앞에 둔 santalarch 스타일 — `01-hero.jpg` 참고).
- 동작: `html[data-inverted]`에서 `--paper` ↔ `--ink` 값을 맞바꾼다 → 모든 섹션 테마가 함께 뒤집힘(light 섹션은 어두워지고 dark 섹션은 밝아짐). 사진은 그대로.
  - `filter: invert()`는 쓰지 않는다.
- `localStorage` 저장, 초기값은 `prefers-color-scheme: dark`면 inverted. **FOUC 방지**: `index.html` `<head>` 인라인 스크립트에서 먼저 세팅. `<meta name="theme-color">` 갱신.
- 전환: `background-color, color` 0.8s (`--dur-theme`, 섹션 테마 전환과 같은 값).

### 3-4. 고정 UI 레이어 (`mix-blend-mode: difference`)
아래 요소들은 `color: #fff; mix-blend-mode: difference;`로 **어떤 배경(라이트/다크/사진) 위에서도 자동 반전**되게 한다 (`07`, `13` 캡처에서 내비가 영역별로 흑/백 반전되는 것 확인).
- 상단 내비 (sticky 이후), 좌하단 `invert color`, 커스텀 커서, 우하단 섹션 인디케이터
- 주의: blend가 먹으려면 이 요소들의 조상에 `isolation`/`transform`/불투명 배경이 없어야 함. 고정 레이어는 `body` 직속 portal로 렌더.

### 3-5. 커스텀 커서
- 지름 10px 원형 dot, 마우스를 lerp(0.15~0.2)로 따라감 (`01-hero.jpg`의 검은 점). difference blend.
- 링크/카드 hover 시 dot이 커지거나(지름 ~40px) 살짝 변형. 텍스트 입력 없음.
- `(pointer: fine)`일 때만 활성화, 네이티브 커서는 유지(숨기지 않음 — 접근성).

### 3-6. 내비게이션 (`01`, `02` 참고)
- 구조: 좌측 `+` 심볼(굵은 십자 아이콘, 클릭 = 맨 위로) + 탭 라벨들. 각 라벨은 **컬럼 시작선에 위치**하고, 라벨 아래 헤어라인 가로줄 + 라벨 시작점에 짧은 세로 tick.
- 탭 배치(8컬럼 기준): `+` col1 / HOME col2 / PROFILE col4 / WORKS col6 / PROJECT LIST col8.
- **스크롤 진행 라인**: 헤어라인 위에 ink색 실선이 왼쪽 끝부터 **현재 스크롤 위치에 해당하는 탭의 tick까지** 늘어난다(scrub). 섹션 경계마다 다음 tick까지 이어서 증가. (`03`, `09`, `14` 캡처에서 라인이 점점 길어지는 것 확인)
- HOME 첫 화면에서 내비는 **워드마크 바로 아래 문서 흐름 안**에 있다가, 스크롤로 상단에 닿으면 `position: sticky; top: 0`으로 고정.
- 클릭 → `lenis.scrollTo('#works', { offset: -navHeight, duration: 1.2 })`. 진행 중 hash `history.replaceState` 갱신, 진입 시 hash 있으면 해당 섹션으로.
- 현재 섹션 탭은 라벨 opacity 1, 나머지 0.6.
- **Instagram 링크는 내비에 두지 않는다** — PROFILE 섹션 이름·직함 아래에 둔다 (사이트 주인 결정, §4-2).
- mobile(≤768): `+` 와 `Menu`만 표시 → 풀스크린 오버레이에 탭 크게 나열, 열려 있는 동안 Lenis stop, `Esc` 닫기.

### 3-7. 우하단 섹션 인디케이터
- santalarch 우하단 `Resolution 04 | 04` 처럼, 고정 소문구로 `{섹션명}  {현재} | {전체}` 표시 (예: `Works  03 | 04`). difference blend. mobile 숨김.

### 3-8. 섹션 전환 — 페이지 테마 크로스페이드
- **santalarch의 바 확장·`+` 전환은 쓰지 않는다** (사이트 주인 결정, 2026-11-25). 멈추거나(pin) 화면을 덮는 연출 없음.
- 섹션 경계가 화면 세로 가운데를 지나면 `html[data-theme]`가 그 섹션 테마로 바뀌고, 배경·글자색이 `--dur-theme`(0.8s, `--ease-out`) 동안 부드럽게 전환된다 (`usePageTheme` + `useActiveSection`).
- 섹션 요소에는 `data-theme`를 두지 않는다 (배경을 칠하면 페이지 전환이 가려짐). 예외: 모바일 메뉴 오버레이.
- `prefers-reduced-motion`이면 즉시 전환.

### 3-9. 텍스트 reveal
- 섹션 소문구·설명: **단어 단위 opacity scrub** (0.15 → 1), 읽는 위치에 맞춰 왼→오 순서로 밝아짐 (`09`의 좌측 소문구).
- 큰 타이틀: 줄 단위 마스크 슬라이드업 (y 100% → 0, 0.9s, `power3.out`), 1회.
- 리스트 행: 화면 세로 중앙에 가까울수록 opacity 1, 멀수록 0.35 (scrub).
- 모든 모션 `prefers-reduced-motion: reduce`면 즉시 표시, Lenis 비활성.

---

## 4. 섹션별 사양

```
#home          HOME           light
#profile       PROFILE        light
#works         WORKS          dark
#project-list  PROJECT LIST   dark
#footer        FOOTER         dark   (짧은 푸터, 내용 높이만큼)
```
※ FOOTER는 탭에는 없지만 santalarch 푸터 구성을 따라 페이지 끝에 둔다. CONTACT 섹션은 없음(§4-6).

### 4-1. HOME (`01-hero.jpg`, `02`)
- 최상단: **워드마크 "Eunji Choi"** (`settings/site.siteTitle`, `text-transform: uppercase`로 `EUNJI CHOI`).
  - Archivo wdth125 wght900, `line-height: 0.8`, 글자들이 **화면 좌우 끝까지 균등 분배**(santalarch처럼 글자 사이 간격이 벌어진 justify 느낌). 구현: 글자를 `span`으로 쪼개 `display:flex; justify-content: space-between`, font-size는 `useFitText`로 높이/폭 계산. 공백은 한 글자 폭의 gap으로 처리.
  - 상단이 살짝 잘려 화면 위에 붙은 느낌 (`margin-top: -0.08em`).
  - 로드 시 글자별 y 100% → 0 stagger reveal 1회.
- 워드마크 아래: 내비(§3-6).
- 좌측 col2: 작은 2줄 태그라인 `settings/site.heroTagline` (13px, 예: `Brand Experience` / `Strategist`, 비면 숨김).
- **메인 카피** `settings/site.heroCopy`: col5부터 시작, 3~4줄, `--fs-lead-xl`, weight 400, `letter-spacing: -0.02em`, `line-height: 1.1`, `pre-line`. 현재 seed는 placeholder 4줄.
- 하단 col5: 세로 헤어라인(위로 자라는 애니메이션 반복) + `Scroll to discover` 13px.
- 배경: 세로 그리드 라인 + 대각선 라인.
- 스크롤 시 워드마크는 일반 스크롤로 사라지고, 카피는 살짝 위로 drift + opacity 감소.
- 높이 `100svh`.

### 4-2. PROFILE (light)
- 좌측 col2~col4: 사진 (`profileImage`), **흑백(`filter: grayscale(1)`) 고정, hover 컬러 전환 없음** (사이트 주인 결정) — `10-team-photos.jpg` 톤.
- 우측 col5~col8: `profileName`(작게), `profileRole`(작게, dim), `Instagram ↗`(`instagramUrl`, 밑줄, 새 탭, 비면 숨김), `profileBio`(`--fs-lead`, 단어 단위 opacity scrub).
- 섹션 좌상단 소문구 라벨 `Profile` (13px).
- 사진은 clip-path(아래→위) reveal.

### 4-3. WORKS (dark) — `05~08` 참고
- 상단에 **카테고리 필터 탭** 한 줄: `All  BTL  Exhibition …` — **개수 표시 없음** (사이트 주인 결정) (13~15px, 컬럼 정렬, 활성 탭만 opacity 1 + 밑줄).
  - **카테고리 목록은 데이터에서 유니크 값 추출.** 정렬 순서 상수 `['BTL','POP UP','EXHIBITION','PERFORMANCE','COMMUNITY','SPACE']`, 그 외 새 값은 뒤에. 비교는 `trim().toUpperCase()`.
  - 필터 변경 시 그리드 fade-out → 재배치 → fade-in.
- **그리드: desktop 3열 masonry, 거터 16px, 이미지 원본 비율 유지** (`07` 캡처처럼 열 너비 꽉 채움). ≤1024 2열, ≤480 1열.
  - **열 패럴랙스**: 가운데 열은 다른 속도로 움직임 (scrub, yPercent ±8~12). mobile 비활성.
  - 이미지 등장: 아래에서 y 80px → 0 + opacity, 열마다 약간의 delay.
- 카드: 이미지만 노출. hover 시 이미지 하단에 `2026 — Google AI for Business 2026` 캡션(13px) + 이미지 scale 1.03, 커서 dot 확대. mobile은 캡션 항상 표시.
- 처음 **12개** → 그리드 아래 **우측 정렬 `Load more`** (`--fs-h3`, 밑줄, `08` 캡처) 클릭 시 12개씩 추가. 필터 바꾸면 12개로 리셋.
- 정렬: `year` 내림차순 → `order` 오름차순.
- 썸네일 lazy (§6-3). 카드 클릭 → `/works/:id`.

### 4-4. WORKS 상세 `/works/:id` (light 기본, invert 적용)
urbanplay 상세 구조 + santalarch 스타일:
1. **메인 이미지** — 내비 아래 풀폭, 최대 90svh, `object-fit: cover`, 진입 시 scale 1.08 → 1.
2. **Title** — 큰 타이틀(`detailTitle` 없으면 `title`), col2부터, 줄 단위 reveal.
3. **메타** — 순서 고정, **값이 빈 행은 숨김**: Client / Date / Location / Details / Partners (/ Work Range — 있으면). 라벨 col2(13px dim), 값 col5~col8. 행마다 헤어라인. 긴 텍스트 `pre-line`.
4. **Detail images** — Storage 폴더 나머지 이미지를 **개수 제한 없이 `map`**. 원본 비율, 세로 나열(col2~col8 폭). 연속된 가로 이미지 2장은 2열로 묶는 정도의 단순 규칙만. 각 이미지 아래에서 올라오는 reveal.
5. 하단: `← Prev` / `Back to Works` / `Next →` (전체 정렬 기준).
- 진입 시 `lenis.scrollTo(0, { immediate: true })`, `document.title = "{title} — Eunji Choi"`.
- 뒤로/`Back to Works` → 홈 WORKS 위치·필터·Load more 개수 복원 (sessionStorage).
- 없는 id → "Project not found" + 홈 링크. 이미지 로딩 중 비율 유지 skeleton.

### 4-5. PROJECT LIST (dark) — `09-process-list-style.jpg` 스타일
- **`works` 컬렉션에서 파생** (시트 PROJECT LIST 65개 = WORKS 65개 동일 확인). 별도 컬렉션 없음.
- 좌측 col2: 섹션 소문구(예: `Project List` / `2021 — 2026` / `65 projects`), 단어 단위 opacity scrub, 스크롤 동안 sticky.
- 우측 col5~col8: 리스트. 연도 그룹(최신순), 그룹 시작에 연도(13px dim), 행 사이 헤어라인.
  - 행: `Title`(`--fs-h3`, 2줄까지) + 우측 끝 `+`. 그 아래 작은 dim 텍스트 `Category · Client`.
  - 화면 중앙에 가까운 행만 밝게(§3-9).
  - hover: `+`가 45° 회전, 커서 옆에 해당 프로젝트 썸네일 작은 미리보기(desktop, 선택 구현).
  - 클릭 → `/works/:id`.
- mobile: 좌측 소문구는 리스트 위로, 행은 Title + `+`만.

### 4-6. FOOTER (light) — `14`, `15`
- **CONTACT 섹션(Let's Talk·이메일·연락처)은 만들지 않는다** (사이트 주인 결정, 2026-11-25). 페이지 끝은 푸터만.
- PROJECT LIST 바로 아래 이어지는 **내용 높이만큼의 짧은 푸터** (화면 한 장을 쓰지 않음, 사이트 주인 결정).
- 우측 col8: `Back to top ↑` (Lenis로 맨 위).
- 맨 아래: **거대 워드마크 `EUNJI CHOI`** (HOME과 동일 스타일, 하단이 화면 밖으로 잘림). 페이지 끝에 도달하며 아래에서 올라오는 마스크 reveal(scrub).
- 워드마크 위 작은 줄: `© {올해} Eunji Choi`.

---

## 5. 반응형 & 타이포

- 100% 반응형. 브레이크포인트 `480 / 768 / 1024 / 1280 / 1600`.
- **화면이 작아질수록 폰트도 작아짐 — 전부 `clamp()`. 본문 최소 12px.**

```css
:root {
  --fs-caption: clamp(12px, 0.70rem + 0.15vw, 13px);  /* 라벨·소문구. 12px 미만 금지 */
  --fs-body:    clamp(12px, 0.68rem + 0.35vw, 17px);
  --fs-nav:     clamp(12px, 0.70rem + 0.30vw, 16px);  /* 내비 weight 600, letter-spacing -0.02em */
  --fs-lead:    clamp(15px, 0.80rem + 0.80vw, 24px);
  --fs-lead-xl: clamp(20px, 0.90rem + 1.70vw, 46px);  /* HOME 메인 카피 */
  --fs-h3:      clamp(20px, 0.90rem + 1.40vw, 36px);  /* 리스트 타이틀, Load more */
  --fs-h2:      clamp(28px, 1.00rem + 3.00vw, 64px);  /* Let's Talk, 상세 타이틀 */
  --gutter:     clamp(16px, 1.2vw, 24px);
}
```
- 텍스트에 고정 px font-size 금지 (변수만). 워드마크는 `useFitText` 예외.
- 전반적으로 `letter-spacing: -0.02em`, 큰 텍스트는 `-0.03em`, `line-height` 큰 텍스트 1.05~1.1.
- 한글: `word-break: keep-all; overflow-wrap: anywhere;`
- 숫자: `font-variant-numeric: tabular-nums`.

---

## 6. Firebase 데이터 설계

> 원칙: **주인이 콘솔에서 편집하기 쉬울 것.** 중첩 map/array 최소화, 직관적 필드명, 복합 인덱스 필요한 쿼리 금지(정렬·필터는 클라이언트).

### 6-1. Firestore

**`settings/site`** (문서 1개)

| 필드 | 타입 | 설명 |
|---|---|---|
| siteTitle | string | HOME·푸터 워드마크 (`Eunji Choi`) |
| heroTagline | string | HOME 좌측 작은 2줄 (비면 숨김) |
| heroCopy | string | HOME 메인 카피 3~4줄 |
| profileName | string | `Eunji Choi` |
| profileRole | string | `기획자·Brand Experience(BX) Strategist` |
| profileBio | string | 소개글 (줄바꿈 포함) |
| profileImage | string | Storage 경로(`profile/profile.jpg`) **또는** 전체 URL |
| instagramUrl | string | `https://www.instagram.com/ihaveachois/` — PROFILE의 `Instagram ↗` 링크 (비면 숨김) |
| email | string | 현재 미사용 (CONTACT 섹션 없음) |

**`works/{id}`** (프로젝트 1개 = 문서 1개)

| 필드 | 타입 | 필수 | 설명 |
|---|---|---|---|
| (문서 ID) | — | ✔ | URL·Storage 폴더명. 형식 `{category}-{year}-{nn}` 예: `exhibition-2024-01` |
| category | string | ✔ | `BTL` `EXHIBITION` `SPACE` `POP UP` `PERFORMANCE` `COMMUNITY` |
| year | number | ✔ | 정렬·그룹 기준 |
| title | string | ✔ | 그리드·리스트 표시 |
| detailTitle | string | | 상세 타이틀 (비면 title) |
| client | string | | |
| date | string | | 형식 자유 — 파싱하지 말고 그대로 표시 |
| location | string | | |
| details | string | | 긴 설명, 줄바꿈 가능 |
| partners | string | | 줄바꿈 가능 |
| workRange | string | | 있으면 표시 |
| order | number | | 같은 연도 내 정렬 (작을수록 앞). seed는 10 단위 |
| published | boolean | | `false`면 숨김. **필드 없으면 true 취급** |

- 모든 문자열 `trim()`, 빈 문자열 = 없음.
- 문자열 안 리터럴 `\n`도 줄바꿈으로 치환 (`text.replace(/\\n/g, '\n')`).
- 타입 방어: `year` string이어도 `Number()`. 잘못된 문서는 `parseWork`에서 걸러내고 `console.warn` — 문서 하나 때문에 전체가 깨지지 않게.

### 6-2. Storage 폴더 규칙

```
profile/profile.jpg            ← 프로필 사진
works/{문서ID}/00.jpg           ← 대표 이미지 (썸네일 + 상세 메인)
works/{문서ID}/01.jpg           ← 상세 이미지 1
works/{문서ID}/02.jpg ...       ← 개수 제한 없음
```
- **폴더 안 파일을 이름순(natural sort) 정렬 → 첫 번째 = 대표, 나머지 = 상세.**
- 허용: jpg/jpeg/png/webp/avif/gif. 그 외(HEIC 등)는 무시 + `console.warn`.
- 폴더가 비면 placeholder(테마 dim 배경 + 타이틀 텍스트).

### 6-3. 이미지 URL (`src/lib/storage.ts`)
- public read 규칙이므로 `getDownloadURL` 대신 직접 URL 생성:
  `https://firebasestorage.googleapis.com/v0/b/${bucket}/o/${encodeURIComponent(fullPath)}?alt=media`
- 썸네일: `list(ref(storage, 'works/{id}'), { maxResults: 1 })` — **카드가 뷰포트 근처에 올 때** 조회, TanStack Query 캐시(staleTime 길게). masonry라 이미지 비율을 알기 전 높이가 0이 되지 않게 로딩 중 기본 비율(4:3) placeholder.
- 상세: `listAll(...)` 1회 → natural sort → `[cover, ...details]`.
- `resolveImage(value)`: `http`로 시작하면 그대로, 아니면 Storage 경로로 간주.

### 6-4. 보안 규칙
`firestore.rules`
```
rules_version = '2';
service cloud.firestore {
  match /databases/{db}/documents {
    match /{document=**} { allow read: if true; allow write: if false; }
  }
}
```
`storage.rules`
```
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} { allow read: if true; allow write: if false; }
  }
}
```
(콘솔 편집은 규칙과 무관하게 가능. 사이트는 읽기만.)

### 6-5. ⚠️ 요금제
Cloud Storage for Firebase는 **Blaze(종량제) 필수** (Spark로는 버킷 생성/접근 불가). Blaze에서도 무료 사용량은 그대로라 포트폴리오 규모면 사실상 0원, 단 카드 등록 필요.
- 버킷 리전: Always Free 대상 `us-central1` 권장 (속도 우선이면 `asia-northeast3`, 소액 과금 가능).
- README에 Google Cloud **예산 알림($1)** 설정 안내.

---

## 7. 시드 데이터

- `seed/seed-data.json` — 구글 시트 "Homepage Assets" 변환본 (settings 1 + works 65). 저장소에 포함.
- `scripts/seed.mjs`:
  - `firebase-admin` + 서비스 계정 키(`serviceAccount.json`, **.gitignore 필수**)
  - `settings/site`, `works/{id}` 업로드. **이미 존재하는 문서는 건너뛰기**(콘솔 수정분 보호), `--force`일 때만 덮어쓰기.
  - `npm run seed`
- (선택) `scripts/upload-images.mjs ./images` — 로컬 `images/{문서ID}/*`를 `works/{문서ID}/`로 업로드, 긴 변 2400px 리사이즈(sharp), `Cache-Control: public, max-age=31536000`.

---

## 8. 폴더 구조

```
src/
  main.tsx, App.tsx, router.tsx
  lib/
    firebase.ts        # initializeApp, db, storage (env)
    storage.ts         # resolveImage, listWorkImages, getCover, naturalSort
    lenis.ts           # Lenis 싱글톤 + GSAP ticker 연동
  data/
    types.ts, parse.ts, queries.ts
  hooks/
    useActiveSection.ts, useScrollProgress.ts, useFitText.ts, useTheme.ts, useScrollRestore.ts
  components/
    FixedLayer/        # body portal: Nav(sticky 이후), InvertToggle, Cursor, SectionIndicator
    Nav/, MobileMenu/, Wordmark/, GridLines/, SectionLabel/, WordReveal/, LineReveal/, Img/
    transitions/       # BarExpandTransition, PlusExpandTransition
  sections/
    Home/, Profile/, Works/, ProjectList/, Footer/
  pages/
    HomePage.tsx, WorkDetailPage.tsx, NotFound.tsx
  styles/
    reset.css, tokens.css, grid.css, global.css
docs/
  reference/*.jpg      # santalarch 캡처 (§1-1)
  ADMIN_GUIDE.md       # 사이트 주인용 (§10)
seed/seed-data.json
scripts/seed.mjs, scripts/upload-images.mjs
firebase.json, .firebaserc, firestore.rules, storage.rules
.env.local (git 제외), .env.example
```

`.env.example`
```
VITE_FIREBASE_API_KEY=
VITE_FIREBASE_AUTH_DOMAIN=
VITE_FIREBASE_PROJECT_ID=
VITE_FIREBASE_STORAGE_BUCKET=
VITE_FIREBASE_MESSAGING_SENDER_ID=
VITE_FIREBASE_APP_ID=
```
`firebase.json`: hosting `public: dist`, 전체 `/index.html` rewrite, `/assets/**` 장기 캐시.

---

## 9. 품질 기준

- 모션은 조용하게: reveal 거리 40~100px, 0.8~1.0s, `power3.out`. 과한 패럴랙스 금지.
- ScrollTrigger는 `gsap.context()` + cleanup으로 언마운트 시 kill. Lenis ↔ ScrollTrigger 연동(`lenis.on('scroll', ScrollTrigger.update)`, `gsap.ticker.add`). 데이터 로드 후 이미지 로딩 완료 시 `ScrollTrigger.refresh()` (masonry 높이 변화 대응).
- `prefers-reduced-motion: reduce` → Lenis off, 전환·reveal 즉시.
- 로딩: 섹션별 skeleton, 실패 시 조용한 에러 문구 (전체 흰 화면 금지).
- 접근성: 이미지 `alt` = title, 포커스 링 유지, 시맨틱 마크업, `lang="ko"`, 커스텀 커서가 네이티브 커서를 대체하지 않음.
- 성능: 첫 화면은 `settings/site`만 대기. 썸네일 lazy, 상세 메인 이미지만 `fetchpriority="high"`.
- 메타: 기본 title/description/OG (`Eunji Choi — Brand Experience Strategist`).

---

## 10. 사이트 주인용 관리 가이드 (`docs/ADMIN_GUIDE.md`)

비개발자용, **한국어, 단계별**, 스크린샷 자리 표시 포함:
1. 프로젝트 추가: Firestore `works` → 문서 추가 → ID 규칙(`exhibition-2026-01`) → 필드 입력(표 그대로) → Storage `works/{같은 ID}/`에 `00.jpg`(대표), `01.jpg`… 업로드
2. 수정/숨기기: 필드 수정, `published` = `false`
3. 순서: `year`, `order`
4. 대표 이미지 교체: `00` 파일 교체 / 상세 이미지 추가: 다음 번호로 업로드
5. HOME 카피·프로필·인스타·이메일: `settings/site`
6. 이미지 권장: jpg/webp, 긴 변 2000~2400px, 1MB 이하, 아이폰 HEIC는 jpg 변환 후
7. 반영: 저장 후 새로고침 (배포 불필요)
8. 금지: 문서 ID 변경(URL 바뀜, Storage 폴더명도 같이 바꿔야 함), 필드명 오타

---

## 11. 작업 순서

1. Vite + React + TS, 의존성, 폴더 구조, `tokens.css`/`grid.css`, 테마·invert FOUC 스크립트
2. `lib/firebase.ts`, 타입·파서·쿼리 훅, `seed.mjs` → 시드 업로드 확인
3. Lenis + GSAP 연동, FixedLayer(커서·invert·인디케이터, difference blend)
4. HOME (워드마크 useFitText + 글자 분배, 그리드/대각선 라인, 카피, Scroll 큐) + Nav(sticky, 진행 라인, 활성 탭)
5. PROFILE
6. light→dark 바 확장 전환 + WORKS(필터, masonry, 열 패럴랙스, Load more, lazy 썸네일)
7. 상세 페이지 + Prev/Next + 스크롤·필터 복원
8. PROJECT LIST (sticky 소문구, 중앙 강조 리스트)
9. dark→light `+` 전환 + 푸터 워드마크 reveal
10. reduced-motion, 반응형 점검 (320 / 375 / 768 / 1024 / 1440 / 1920px), 12px 미만 텍스트 없는지, `docs/reference` 캡처와 나란히 비교
11. 규칙·Hosting 배포, `docs/ADMIN_GUIDE.md`, README

## 12. 규칙

- 콘텐츠(텍스트·이미지·링크) 하드코딩 금지. 예외: 섹션 라벨, 메타 필드 라벨, 카테고리 정렬 상수, 전환 중앙 라벨.
- 빈 필드에도 레이아웃이 깨지지 않을 것 (현재 대부분 works에 details/partners 비어 있음).
- 함수형 컴포넌트 + hooks, `any` 금지, 매직 넘버는 토큰.
- 커밋 전 `npm run build`, `npm run lint` 통과.
