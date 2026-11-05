# Hoesu.github.io

[Astro](https://astro.build) 기반 개인 블로그. https://hoesu.github.io

이 블로그에서 쓸 수 있는 기능을 정리한 문서. 기능이 추가되거나 바뀔 때마다 같이 업데이트한다.

## 변경 이력

- **2026-11-04**: Astro로 블로그 새로 구축. Expressive Code로 코드 블록 기능 추가. 상시 다크 테마 적용. 폴더 기반 카테고리, 태그 페이지 추가. 알고리즘 풀이 글 58개 이식. 목차, 이전 / 다음 글 추가. 사용 가이드를 블로그 글에서 README로 이동. Pagefind 검색 추가. giscus 댓글 추가. GoatCounter 방문 통계 추가
- **2026-11-05**: 헤더 왼쪽의 사이트 제목(Hoesu)을 빼고, 오른쪽 메뉴 맨 앞에 같은 스타일의 Home 링크 추가. 글 작성용 `/` 스니펫 추가 (VS Code / Cursor), `/new`로 새 글 정보 입력. 에디터 기본 마크다운 스니펫을 전부 `/` 버전으로 대체하고(기본 스니펫은 숨기기), 체크리스트, 키보드 키, 날짜 스니펫 추가. 제목 h4~h6 크기, 체크리스트, 키보드 키 스타일 추가

## 1. 로컬에서 보기 & 배포

| 명령 | 설명 |
|---|---|
| `npm install` | 의존성 설치 (처음 한 번) |
| `npm run dev` | 로컬 서버 (http://localhost:4321) |
| `npm run build` | `dist/`로 빌드 + 검색 인덱스 생성 |
| `npm run preview` | 빌드 결과 미리보기 (검색 테스트는 여기서) |

`main` 브랜치에 push하면 GitHub Actions(`.github/workflows/deploy.yml`)가 자동으로 빌드하고 배포한다. 1~2분 정도 걸린다.

```bash
git add .
git commit -m "새 글: 제목"
git push
```

## 2. 글 쓰기

`src/content/blog/<카테고리>/` 폴더에 `.md` 파일을 만들면 글 하나가 된다. 폴더 이름과 파일 이름이 그대로 주소가 된다.

```
src/content/blog/algorithm/two-sum.md  →  /blog/algorithm/two-sum/
```

파일 맨 위에 frontmatter(글 정보)를 쓴다.

```md
---
title: '글 제목'
description: '한 줄 요약'
pubDate: 2026-11-04
updatedDate: 2026-11-05
tags: ['태그1', '태그2']
draft: true
---

여기부터 본문.
```

| 항목 | 필수 | 설명 |
|---|---|---|
| `title` | O | 글 제목 |
| `pubDate` | O | 작성일. 목록은 이 날짜 기준 최신순 |
| `description` | | 한 줄 요약. 검색엔진, 링크 미리보기, RSS에 쓰임 |
| `updatedDate` | | 수정일. 있으면 글 상단에 표시 |
| `tags` | | 태그 목록. 글 상단에 링크로 표시 |
| `draft` | | `true`면 로컬(`npm run dev`)에서만 보이고 배포에서 빠짐 |

### 스니펫 (VS Code / Cursor)

마크다운 파일에서 `/명령어`를 입력하고 목록에서 `Enter`를 누르면 템플릿이 들어간다. `Tab`으로 다음 입력 칸, `Shift+Tab`으로 이전 칸으로 이동한다. 목록이 안 뜨면 `Ctrl+Space`.

| 명령어 | 불러오는 것 |
|---|---|
| `/new` | 새 글 정보 (frontmatter). `pubDate`에 오늘 날짜가 자동으로 들어가고, `draft`는 true / false 중 선택 |
| `/heading` | 제목. `##`(가장 큼) ~ `######`(가장 작음) 중 선택. 목차에는 `##`, `###`만 나옴. `#`은 글 제목이 쓰므로 본문에서는 안 씀 |
| `/divider` | 구분선 (`---`). 앞뒤 빈 줄이 자동으로 들어감. 윗줄에 글이 바로 붙어 있으면 구분선이 아니라 제목이 되기 때문 |
| `/quote` | 인용문 |
| `/code` | 코드 블록 (언어 선택). 옵션(`collapse`, `ins` 등)은 언어 뒤에 직접 붙여도 됨 |
| `/inline` | 인라인 코드 (`` `코드` ``) |
| `/link` | 링크 |
| `/img` | 이미지. 이미지 파일은 글 파일과 같은 폴더에 두고 `./파일명` |
| `/bold` / `/italic` / `/strike` | 굵게 / 기울임 / 취소선 |
| `/ul` / `/ol` | 글머리표 목록 / 번호 목록 |
| `/check` | 체크리스트. `[ ]` 안에 `x`를 넣으면 체크된 상태 (`- [x] 끝난 일`) |
| `/kbd` | 키보드 키 표시 (`<kbd>Ctrl</kbd>`) |
| `/date` | 커서 위치에 오늘 날짜 |
| `/collapse` | 일부 줄이 접힌 코드 블록 |
| `/diff` | 추가 / 삭제 줄 표시 코드 블록 |
| `/term` | 터미널 명령어 블록 (bash, powershell) |
| `/table` | 표 (3열) |
| `/toggle` | 접었다 펴는 블록 (`<details>`) |

**글자 감싸기**: 글자를 선택한 상태에서 명령 팔레트(`Ctrl+Shift+P`) → **Insert Snippet** → 스니펫 선택. 선택한 글자가 그대로 들어간다 (`/bold`면 `**선택한 글자**`). `/heading`, `/quote`, `/code`, `/inline`, `/link`, `/img`, `/bold`, `/italic`, `/strike`가 지원한다.

#### 에디터 기본 스니펫 숨기기

VS Code / Cursor에는 마크다운 기본 스니펫(`heading1`, `bold`, `quote` …)이 원래 들어 있다. 명령어에 `/`가 없어서 `/heading`처럼 치고 고르면 **앞의 `/`가 지워지지 않고 남는다.** 같은 기능을 위의 `/` 스니펫으로 다 만들어 뒀으니 기본 스니펫은 숨긴다. 에디터 개인 설정이라 컴퓨터마다 한 번씩 해야 한다.

1. 아무 `.md` 파일을 연다 (마크다운 파일이 열려 있어야 마크다운 스니펫 목록이 나온다)
2. `Ctrl+Shift+P` → `Insert Snippet` 입력 → **Snippets: Insert Snippet** 선택
3. 목록에서 숨길 항목에 마우스를 올리면 오른쪽에 **눈 모양 아이콘(Hide from IntelliSense)**이 나온다. 누르면 자동완성 목록에서 빠진다
4. 아래 19개를 모두 숨긴다

| 숨길 기본 스니펫 (목록에 보이는 이름) | 대신 쓸 것 |
|---|---|
| Insert heading level 1 ~ 6 | `/heading` |
| Insert horizontal rule | `/divider` |
| Insert quoted text | `/quote` |
| Insert fenced code block | `/code` |
| Insert inline code | `/inline` |
| Insert link / Insert image | `/link` / `/img` |
| Insert bold text / italic text / strikethrough | `/bold` / `/italic` / `/strike` |
| Insert unordered list / ordered list | `/ul` / `/ol` |
| Insert inline math / fenced math | 없음 (블로그에 수식 기능 없음) |

- 숨긴 항목은 지워지는 게 아니라 자동완성에서만 빠진다. **Insert Snippet** 목록에는 계속 보이고, 같은 아이콘을 다시 누르면 되살아난다
- 이 레포의 `/` 스니펫(설명이 한국어)은 숨기지 말 것

**새 글 만들기**: 스니펫은 파일을 만들 수 없어서, 원하는 카테고리 폴더에 빈 `.md` 파일을 먼저 만들고(`src/content/blog/<카테고리>/<주소>.md`) 그 안에서 `/new`를 입력한다. 카테고리는 폴더로 정해지니 어느 폴더에서든 똑같이 쓰면 된다.

- `.vscode/settings.json`에서 마크다운 자동완성을 켜뒀다 (VS Code 기본값은 꺼짐)
- Cursor에서 AI 제안(Cursor Tab)이 떠 있으면 `Tab`이 AI 제안을 받는 데 쓰일 수 있다. 그럴 땐 `Esc`로 제안을 닫고 `Tab`

#### 스니펫 추가 / 수정

`.vscode/markdown.code-snippets`를 고치면 저장하는 순간 바로 적용된다 (재시작 필요 없음). 스니펫 하나의 구조:

```jsonc
"Toggle": {                            // 이름 (겹치지만 않으면 아무거나)
	"scope": "markdown,mdx",           // 마크다운 파일에서만 동작
	"prefix": "/toggle",               // 입력할 명령어
	"description": "접었다 펴는 블록",   // 자동완성 목록에 뜨는 설명
	"body": [                          // 들어갈 내용. 한 줄 = 문자열 하나
		"<details>",
		"<summary>${1:제목}</summary>",
		"",
		"$0",
		"",
		"</details>"
	]
}
```

| 문법 | 의미 |
|---|---|
| `$1`, `$2`, … | 입력 칸. `Tab`을 누르면 1 → 2 → … 순서로 이동 |
| `${1:기본값}` | 기본값이 들어간 입력 칸 |
| `${1\|py,ts,js\|}` | 목록에서 고르는 칸 |
| `$0` | 마지막에 커서가 멈출 위치 |
| `$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE` | 오늘 날짜 |
| 같은 번호를 두 번 쓰기 | 한 칸에 입력하면 두 군데가 같이 바뀜 |

주의할 것:
- 스니펫과 스니펫 사이에 **쉼표(`,`)**가 빠지면 파일 전체가 동작하지 않는다
- 내용에 큰따옴표나 역슬래시를 넣으려면 `\"`, `\\`로 쓴다
- 글자 그대로 `$`를 넣으려면 `\\$`로 쓴다 (안 그러면 입력 칸으로 인식됨)
- 저장했을 때 빨간 밑줄이 생기면 문법 오류다

## 3. 카테고리와 태그

**카테고리 = 폴더**, **태그 = frontmatter의 `tags`**. 카테고리는 큰 주제 하나, 태그는 세부 키워드 여러 개로 쓴다.

```
src/content/blog/
└── algorithm/          # 카테고리 "algorithm"
    └── dijkstra.md     # tags: ['graph', 'shortest-path']
```

### 카테고리

- 새 카테고리는 `src/content/blog/` 아래에 폴더만 만들면 된다. 설정은 따로 없다
- 폴더는 **한 단계만** 쓸 수 있다. `algorithm/graph/a.md`처럼 더 깊이 넣으면 빌드할 때 에러가 난다
- 글을 다른 폴더로 옮기면 **주소가 바뀐다**. 이미 공유한 링크가 깨지니까 주의
- `src/content/blog/` 바로 아래에 둔 글은 카테고리 없는 글이 된다
- 빈 폴더는 카테고리 목록에 안 나온다. 글이 하나 이상 있어야 나온다
- git은 빈 폴더를 저장하지 않으니까, 미리 만들어두려면 폴더 안에 `.gitkeep` 파일을 넣는다

| 주소 | 내용 |
|---|---|
| `/blog/` | 카테고리 목록 (글 개수 포함) |
| `/blog/algorithm/` | algorithm 카테고리 글 목록 |

### 태그

```md
tags: ['graph', 'Shortest Path']
```

- 태그 주소는 소문자로 바뀌고 공백은 `-`가 된다 (`Shortest Path` → `/tags/shortest-path/`)
- 대소문자만 다른 태그(`BFS`, `bfs`)는 같은 태그로 합쳐진다

| 주소 | 내용 |
|---|---|
| `/tags/` | 태그 목록 (글 개수 포함) |
| `/tags/bfs/` | bfs 태그 글 목록 |

## 4. 목차와 이전 / 다음 글

글마다 자동으로 붙는다. 따로 설정할 건 없다.

### 목차

- 본문의 `##`, `###` 제목으로 자동 생성된다. 제목이 2개 미만이면 목차가 나오지 않는다
- **넓은 화면**(1200px 이상): 본문 오른쪽에 고정되고, 지금 읽고 있는 섹션이 밝게 표시된다
- **좁은 화면**(모바일 등): 글 상단에 접힌 "목차"로 나오고, 누르면 펼쳐진다
- 제목을 누르면 해당 섹션으로 이동한다. 주소 끝에 `#제목`이 붙어서 그대로 섹션 링크로 공유할 수 있다

### 이전 / 다음 글

- 글 하단에 **같은 카테고리** 안의 바로 앞뒤 글이 나온다. 카테고리 없는 글끼리는 서로 연결된다
- **이전 글** = 더 오래된 글, **다음 글** = 더 최근 글 (`pubDate` 기준)
- 날짜가 같은 글끼리는 제목 가나다순

## 5. 검색

[Pagefind](https://pagefind.app)를 쓴다. 서버 없이, 빌드할 때 만든 검색 인덱스로 브라우저에서 검색한다.

- 헤더의 **Search** 메뉴 또는 `/search/`. 주소로 바로 검색하려면 `/search/?q=검색어`
- **검색 대상**: 글 제목, 본문, 코드. 날짜, 태그 줄, 목차, 코드 블록의 줄 번호와 복사 버튼은 빠진다
- **필터**: 검색 결과 옆에 `category`, `tag` 필터가 자동으로 나온다
- **인덱스 생성**: `npm run build`가 `astro build` 다음에 `pagefind --site dist`를 돌려서 `dist/pagefind/`에 만든다. 글을 쓰고 push하면 배포할 때 자동으로 다시 만들어진다
- `npm run dev`에서는 인덱스가 없어서 검색이 안 된다. 테스트하려면 `npm run build` → `npm run preview`

검색 대상을 바꾸려면 `src/pages/blog/[...slug].astro`의 `data-pagefind-*` 속성을 고친다.

| 속성 | 의미 |
|---|---|
| `data-pagefind-body` | 이 요소 안만 검색 대상 (글 페이지의 `<article>`) |
| `data-pagefind-ignore` | 검색에서 제외 (안에 있는 필터는 그대로 동작) |
| `data-pagefind-filter="tag:bfs"` | 검색 필터 값 |

## 6. 댓글

[giscus](https://giscus.app)를 쓴다. 댓글은 이 레포의 **GitHub Discussions**에 저장된다. 서버나 DB는 없다.

- 글 하단(이전 / 다음 글 아래)에 자동으로 붙는다
- 댓글을 쓰려면 GitHub 로그인이 필요하다. 리액션, 마크다운, 코드 블록을 쓸 수 있다
- **글 ↔ Discussion 연결**: 글 주소(`/blog/algorithm/two-candies/`)가 Discussion 제목이 된다. 첫 댓글이 달릴 때 `Announcements` 카테고리에 자동으로 생성된다
- **글 주소를 바꾸면**(파일 이름 변경, 다른 카테고리로 이동) 기존 댓글과 연결이 끊긴다. 옮겨야 하면 해당 Discussion 제목을 새 주소로 고친다
- **댓글 관리**(삭제, 숨기기, 잠금): GitHub 레포 → Discussions → Announcements에서 한다
- 댓글은 스크롤해서 가까워질 때 불러온다 (`data-loading="lazy"`)

설정은 `src/consts.ts`의 `GISCUS`(레포, 카테고리 ID)와 `src/components/Comments.astro`(테마, 언어, 위치)에 있다. 레포 쪽에는 Discussions 활성화 + [giscus 앱](https://github.com/apps/giscus) 설치가 되어 있어야 한다.

## 7. 방문 통계

[GoatCounter](https://www.goatcounter.com)를 쓴다. 쿠키를 쓰지 않아서 개인정보 동의 팝업이 필요 없다.

- **대시보드**: `https://<사이트 코드>.goatcounter.com`. 페이지별 조회수, 방문 추이, 유입 경로, 브라우저/OS/국가를 볼 수 있다
- **설정**: `src/consts.ts`의 `GOATCOUNTER_CODE`에 사이트 코드를 넣는다. 비어 있으면 통계 스크립트를 넣지 않는다
- 배포 빌드(`npm run build`)에서만 스크립트가 들어간다. `npm run dev`에서는 안 들어가고, `npm run preview`처럼 localhost에서 보는 방문은 GoatCounter가 집계하지 않는다
- 스크립트는 `src/components/BaseHead.astro`에 있다

## 8. 코드 블록

[Expressive Code](https://expressive-code.com)를 쓴다. 백틱 3개 뒤에 언어 이름을 쓰고, 그 뒤에 옵션을 붙인다. 모든 코드 블록에는 **복사 버튼**이 붙는다 (오른쪽 위에 마우스를 올리면 나옴).

> 아래 옵션들은 블로그에서만 적용된다. GitHub에서 이 README를 보면 옵션 없이 평범한 코드 블록으로 보인다.

| 기능 | 문법 | 설명 |
|---|---|---|
| 기본 | ` ```ts ` | 언어 이름. `py`, `js`, `java`, `cpp`, `bash`, `json` 등 |
| 줄 번호 끄기 | ` ```py showLineNumbers=false ` | 줄 번호는 기본으로 붙음 |
| 추가 / 삭제 줄 | ` ```js ins={3} del={2} ` | 3번 줄 초록(추가), 2번 줄 빨강(삭제). 범위는 `{1-5}` |
| diff | ` ```diff ` | `+` / `-`로 시작하는 줄이 바로 추가 / 삭제로 표시됨 |
| 단어 강조 | ` ```ts "getPosts" ` | 따옴표로 감싼 단어만 강조 |
| 터미널 창 | ` ```bash `, ` ```powershell ` | 셸 언어는 자동으로 터미널 모양 + 줄 번호 없음 |
| 긴 코드 접기 | ` ```py collapse={1-5} ` | 해당 범위가 접혀서 나오고, 클릭하면 펼쳐짐 |

예시:

````md
```js ins={3} del={2}
function greet(name) {
	return 'Hello ' + name;
	return `안녕, ${name}`;
}
```
````

### 코드 블록 안에 코드 블록 쓰기

코드 블록 문법 자체를 보여주고 싶으면 바깥을 백틱 4개로 감싼다 (위 예시처럼).

`````md
````md
```ts
const a = 1;
```
````
`````

## 9. 기본 마크다운

| 문법 | 결과 |
|---|---|
| `**굵게**` | **굵게** |
| `*기울임*` | *기울임* |
| `` `인라인 코드` `` | `인라인 코드` |
| `[링크](https://example.com)` | [링크](https://example.com) |
| `![설명](./image.png)` | 이미지 |
| `> 인용` | 인용문 |
| `---` | 구분선 |

## 10. 색상 테마

브라우저나 OS 설정과 상관없이 **항상 다크 테마**로 보인다. 색을 바꾸려면 두 군데를 고친다.

- **사이트 색**: `src/styles/global.css` 맨 위 `:root`의 색상 변수

```css
:root {
	--bg: #0f1115;      /* 배경 */
	--text: #e6e6e6;    /* 본문 글자 */
	--muted: #8b949e;   /* 날짜 같은 흐린 글자 */
	--border: #262a31;  /* 구분선, 테두리 */
	--accent: #58a6ff;  /* 링크 */
	--code-bg: #161b22; /* 인라인 코드 배경 */
}
```

- **코드 블록 색**: `ec.config.mjs`의 `themes`. [Shiki 테마 목록](https://shiki.style/themes)에 있는 이름을 쓰면 된다 (예: `'one-dark-pro'`, `'tokyo-night'`)

배경색을 바꾸면 `src/components/BaseHead.astro`의 `theme-color`(모바일 주소창 색)도 같은 색으로 맞춘다.

## 11. 프로젝트 구조

```
src/
├── content/blog/            # 글 (마크다운). 하위 폴더 = 카테고리
├── components/
│   ├── BaseHead.astro       # <head> 메타 태그 (SEO, 테마 색), 방문 통계 스크립트
│   ├── PostList.astro       # 글 목록
│   ├── Toc.astro            # 목차 (위치, 표시 기준)
│   ├── PostNav.astro        # 이전 / 다음 글
│   └── Comments.astro       # 댓글 (giscus)
├── layouts/Base.astro       # 공통 레이아웃 (헤더 / 푸터)
├── pages/                   # 라우트 (/, /about, /blog/..., /tags/..., /search, /rss.xml)
├── styles/global.css        # 전체 색상, 폰트, 여백
├── utils/posts.ts           # 글 목록, 카테고리, 태그, 이전 / 다음 글 계산 규칙
└── consts.ts                # 사이트 제목, 설명, GitHub 주소, giscus / GoatCounter 설정
ec.config.mjs                # 코드 블록 테마, 줄 번호 규칙
astro.config.mjs             # Astro 설정 (사이트 주소, 플러그인)
.vscode/markdown.code-snippets  # 글 작성용 / 스니펫
```

About 페이지 내용은 `src/pages/about.astro`에서 고친다.
