# Hoesu.github.io

[Astro](https://astro.build)로 만든 개인 블로그 **https://hoesu.github.io** 의 사용 설명서.
기능이 추가되거나 바뀔 때마다 이 문서도 같이 고친다.

| 하고 싶은 것 | 바로 가기 |
|---|---|
| 글 하나 써서 올리기 | [1. 빠른 시작](#1-빠른-시작) |
| 글 정보, 마크다운, 코드 블록, 수식 | [2. 글 쓰기](#2-글-쓰기) |
| `/` 명령어로 템플릿 불러오기 | [3. 스니펫](#3-스니펫-vs-code--cursor) |
| 카테고리 만들기, 태그 달기 | [4. 카테고리와 태그](#4-카테고리와-태그) |
| 홈 화면 아이콘, 색 바꾸기 | [5. 홈 화면](#5-홈-화면) |
| 목차, 검색, 댓글, 방문 통계, 링크 미리보기 | [6. 사이트 기능](#6-사이트-기능) |
| 사이트 색 바꾸기 | [7. 색과 디자인](#7-색과-디자인) |
| 뭔가 안 될 때 | [8. 문제 해결](#8-문제-해결) |
| 명령어, 파일 구조, 작동 방식 | [9. 개발 참고](#9-개발-참고) |

---

## 1. 빠른 시작

### 처음 한 번

```bash
npm install
```

### 글 하나 올리기

1. **파일 만들기**: `src/content/blog/<카테고리>/<주소>.md`
   예) `src/content/blog/algorithm/two-sum.md` → https://hoesu.github.io/blog/algorithm/two-sum/
2. **글 정보 넣기**: 빈 파일에서 `/new` 입력 → `Enter` → 제목, 태그 입력 ([스니펫](#3-스니펫-vs-code--cursor))
3. **본문 쓰기**: 마크다운으로 쓴다 ([2. 글 쓰기](#2-글-쓰기))
4. **미리 보기**: `npm run dev` → http://localhost:4321
5. **올리기**:
   ```bash
   git add .
   git commit -m "새 글: 제목"
   git push
   ```
   `main`에 push하면 GitHub Actions가 자동으로 빌드하고 배포한다. 1~2분 걸린다. 바로 안 바뀌어 보이면 `Ctrl+Shift+R`로 새로고침.

> 작성 중인 글은 `draft: true`로 두면 내 컴퓨터(`npm run dev`)에서만 보이고 배포에서는 빠진다.

---

## 2. 글 쓰기

### 글 정보 (frontmatter)

파일 맨 위 `---` 사이에 쓴다. `/new` 스니펫을 쓰면 자동으로 들어간다.

```md
---
title: '글 제목'
description: '한 줄 요약'
pubDate: 2026-11-04
updatedDate: 2026-11-05
tags: ['bfs', 'simulation']
draft: false
---

여기부터 본문.
```

| 항목 | 필수 | 설명 |
|---|:---:|---|
| `title` | ✔ | 글 제목 |
| `pubDate` | ✔ | 작성일. 목록은 이 날짜 기준 최신순 |
| `description` | | 한 줄 요약. 검색엔진, 링크 미리보기, RSS에 쓰임 |
| `updatedDate` | | 수정일. 있으면 글 상단에 `수정 2026-11-05`로 표시 |
| `tags` | | 태그 목록 ([태그](#태그)) |
| `draft` | | `true`면 내 컴퓨터에서만 보이고 배포에서 빠짐 |

### 주소 규칙

- **폴더 이름 = 카테고리, 파일 이름 = 글 주소**. `algorithm/two-sum.md` → `/blog/algorithm/two-sum/`
- 파일 이름은 영어 소문자와 `-`로 짓는 게 좋다
- 파일 이름을 **숫자만으로 짓지 말 것**. `algorithm/2.md`는 글 목록 2쪽 주소(`/blog/algorithm/2/`)와 겹친다
- 글을 다른 폴더로 옮기거나 파일 이름을 바꾸면 **주소가 바뀐다**. 이미 공유한 링크와 댓글 연결이 끊긴다 ([댓글](#댓글))

### 기본 마크다운

| 문법 | 결과 |
|---|---|
| `## 제목` ~ `###### 제목` | 본문 제목 5단계. `#`은 글 제목이 쓰니까 본문에서는 안 씀. 목차에는 `##`, `###`만 나옴 |
| `**굵게**` / `*기울임*` / `~~취소선~~` | **굵게** / *기울임* / ~~취소선~~ |
| `` `인라인 코드` `` | `인라인 코드` |
| `[링크](https://example.com)` | [링크](https://example.com) |
| `![설명](./image.png)` | 사진. [아래](#사진) 참고 |
| `> 인용` | 인용문 (보라색 막대) |
| `---` | 구분선. 윗줄과 사이에 빈 줄이 있어야 한다 (붙어 있으면 제목이 됨) |
| `- [ ] 할 일` / `- [x] 끝난 일` | 체크리스트 |
| `<kbd>Ctrl</kbd>` | 키보드 키 모양 |
| `<details><summary>제목</summary>내용</details>` | 접었다 펴는 블록 |

### 사진

```md
![바다거북 그림](./images/turtle.png)
```

- 사진 파일은 `src/content/blog/<카테고리>/` 안에 둔다. 글이 많아지면 `images/` 폴더를 만들어 모아두면 깔끔하다
- 경로는 글 파일 기준 `./`로 시작. `public/`에 넣거나 `/`로 시작하면 아래 최적화가 안 된다
- `[설명]`은 사진이 안 뜰 때, 화면 읽기 프로그램이 읽어주는 글이다. 비워두지 말자
- **자동 최적화** (빌드할 때, 따로 할 일 없음)
  - PNG / JPG를 **WebP**로 바꿔서 용량을 줄인다
  - 화면 크기별로 여러 장(640px ~ 원본 크기)을 만들어서 폰은 작은 사진을 받는다. 원본보다 크게는 안 만든다
  - 화면에 가까워졌을 때 불러온다 (긴 글에서 아래쪽 사진은 처음에 안 받음)
  - 예: 3000×2000 PNG 83KB → 폰에서 받는 사진 약 1~2KB, 큰 화면 11KB (단색 테스트 이미지 기준. 실제 사진은 더 크다)
- 원본은 너무 크지 않게 (가로 2000px 정도면 충분). 빌드 시간이 늘어난다

### 코드 블록

[Expressive Code](https://expressive-code.com)를 쓴다. 백틱 3개 뒤에 언어 이름, 그 뒤에 옵션을 붙인다. 모든 코드 블록에는 **복사 버튼**이 붙는다 (오른쪽 위에 마우스를 올리면 나옴).

| 기능 | 문법 | 설명 |
|---|---|---|
| 기본 | ` ```ts ` | 언어 이름. `py`, `js`, `java`, `cpp`, `bash`, `json` 등 |
| 줄 번호 끄기 | ` ```py showLineNumbers=false ` | 줄 번호는 기본으로 붙음 |
| 추가 / 삭제 줄 | ` ```js ins={3} del={2} ` | 3번 줄 초록(추가), 2번 줄 빨강(삭제). 범위는 `{1-5}` |
| diff | ` ```diff ` | `+` / `-`로 시작하는 줄이 바로 추가 / 삭제로 표시됨 |
| 단어 강조 | ` ```ts "getPosts" ` | 따옴표로 감싼 단어만 강조 |
| 터미널 창 | ` ```bash `, ` ```powershell ` | 셸 언어는 자동으로 터미널 모양 + 줄 번호 없음 |
| 긴 코드 접기 | ` ```py collapse={1-5} ` | 해당 범위가 접혀서 나오고, 누르면 펼쳐짐 |

````md
```js ins={3} del={2}
function greet(name) {
	return 'Hello ' + name;
	return `안녕, ${name}`;
}
```
````

- 옵션은 블로그에서만 적용된다. GitHub에서 이 README를 보면 평범한 코드 블록으로 보인다
- **코드 블록 문법 자체를 보여주려면** 바깥을 백틱 4개로 감싼다 (위 예시처럼)

### 수식

[KaTeX](https://katex.org) 문법(LaTeX)으로 쓴다.

```md
시간 복잡도는 $O(n \log n)$ 이다.

$$
\sum_{i=1}^{n} i = \frac{n(n+1)}{2}
$$
```

| 쓰는 법 | 결과 |
|---|---|
| `$ … $` | 문장 안의 인라인 수식 |
| `$$`로 위아래를 감싼 줄 | 가운데 정렬된 블록 수식. 화면보다 길면 가로 스크롤 |
| `\$5` | 수식이 아닌 그냥 `$` 글자 |

- **자주 쓰는 기호**: `\log`, `\sqrt{x}`, `\frac{a}{b}`, `x^2`, `a_i`, `\le` `\ge` `\ne`, `\sum`, `\min` `\max`, `\lfloor x \rfloor`, `\cdot`, `\infty`
  전체 목록: [KaTeX 지원 함수](https://katex.org/docs/supported)
- 수식에 오타가 있어도 빌드는 멈추지 않고, 그 수식만 빨간 글자로 보인다
- 코드 블록이나 인라인 코드 안의 `$`는 수식으로 바뀌지 않는다

---

## 3. 스니펫 (VS Code / Cursor)

마크다운 파일에서 **`/명령어`** 를 입력하고 `Enter`를 누르면 템플릿이 들어간다.

- `Tab`: 다음 입력 칸 / `Shift+Tab`: 이전 칸
- 목록이 안 뜨면 `Ctrl+Space`
- Cursor에서 AI 제안이 떠 있으면 `Tab`이 AI 제안을 받는 데 쓰인다. `Esc`로 제안을 닫고 `Tab`

### 명령어 목록

| 분류 | 명령어 | 불러오는 것 |
|---|---|---|
| 글 | `/new` | 글 정보 (frontmatter). 오늘 날짜 자동, `draft`는 true / false 중 선택 |
| | `/date` | 커서 위치에 오늘 날짜 |
| 제목, 구조 | `/heading` | 제목. `##`(가장 큼) ~ `######`(가장 작음) 중 선택 |
| | `/divider` | 구분선 (앞뒤 빈 줄 자동) |
| | `/quote` | 인용문 |
| | `/toggle` | 접었다 펴는 블록 |
| | `/table` | 표 (3열) |
| 글자 | `/bold` / `/italic` / `/strike` | 굵게 / 기울임 / 취소선 |
| | `/link` / `/img` | 링크 / 이미지 |
| | `/kbd` | 키보드 키 |
| 목록 | `/ul` / `/ol` / `/check` | 글머리표 / 번호 / 체크리스트 |
| 코드 | `/inline` | 인라인 코드 |
| | `/code` | 코드 블록 (언어 선택) |
| | `/collapse` | 일부 줄이 접힌 코드 블록 |
| | `/diff` | 추가 / 삭제 줄 표시 코드 블록 |
| | `/term` | 터미널 명령어 블록 (bash, powershell) |
| 수식 | `/math` / `/mathblock` | 인라인 수식 / 블록 수식 |

**글자를 감싸고 싶을 때**: 글자를 선택하고 `Ctrl+Shift+P` → **Insert Snippet** → 스니펫 선택. `/bold`면 `**선택한 글자**`가 된다.
지원: `/heading`, `/quote`, `/code`, `/inline`, `/link`, `/img`, `/bold`, `/italic`, `/strike`, `/math`

### 에디터 기본 스니펫 숨기기 (컴퓨터마다 한 번)

VS Code / Cursor에 원래 들어 있는 마크다운 스니펫은 이름에 `/`가 없어서, `/heading`처럼 치고 고르면 **앞의 `/`가 지워지지 않고 남는다.** 같은 기능을 전부 `/` 스니펫으로 만들어 뒀으니 기본 스니펫은 숨긴다.

1. 아무 `.md` 파일을 연다
2. `Ctrl+Shift+P` → `Insert Snippet` 입력 → **Snippets: Insert Snippet**
3. 숨길 항목에 마우스를 올리면 오른쪽에 **눈 모양 아이콘(Hide from IntelliSense)** 이 나온다. 누르면 자동완성에서 빠진다
4. 아래 19개를 모두 숨긴다

| 숨길 기본 스니펫 | 대신 쓸 것 |
|---|---|
| Insert heading level 1 ~ 6 | `/heading` |
| Insert horizontal rule | `/divider` |
| Insert quoted text | `/quote` |
| Insert fenced code block / Insert inline code | `/code` / `/inline` |
| Insert link / Insert image | `/link` / `/img` |
| Insert bold text / italic text / strikethrough | `/bold` / `/italic` / `/strike` |
| Insert unordered list / ordered list | `/ul` / `/ol` |
| Insert inline math / fenced math | `/math` / `/mathblock` |

- 숨긴 항목은 지워지는 게 아니다. **Insert Snippet** 목록에는 계속 보이고, 같은 아이콘을 다시 누르면 되살아난다
- 이 레포의 `/` 스니펫(설명이 한국어)은 숨기지 말 것

### 스니펫 추가 / 수정

`.vscode/markdown.code-snippets`를 고치고 저장하면 바로 적용된다.

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
| `$1`, `$2`, … | 입력 칸. `Tab`을 누르면 순서대로 이동 |
| `${1:기본값}` | 기본값이 들어간 입력 칸 |
| `${1\|py,ts,js\|}` | 목록에서 고르는 칸 |
| `$0` | 마지막에 커서가 멈출 위치 |
| `${TM_SELECTED_TEXT}` | 선택한 글자 |
| `$CURRENT_YEAR-$CURRENT_MONTH-$CURRENT_DATE` | 오늘 날짜 |

- 스니펫 사이에 **쉼표(`,`)** 가 빠지면 파일 전체가 동작하지 않는다
- 큰따옴표, 역슬래시는 `\"`, `\\`로 쓴다. 글자 그대로 `$`는 `\\$`
- 저장했을 때 빨간 밑줄이 생기면 문법 오류

---

## 4. 카테고리와 태그

**카테고리 = 폴더 하나**(큰 주제), **태그 = `tags`에 여러 개**(세부 키워드).

```
src/content/blog/
└── algorithm/          ← 카테고리 "algorithm"
    └── dijkstra.md     ← tags: ['graph', 'shortest-path']
```

### 카테고리

- **새 카테고리**: `src/content/blog/` 아래에 폴더를 만들고 글을 넣으면 끝. 홈 화면 앱 아이콘, 카테고리 카드, 글 목록이 자동으로 생긴다
- 아이콘 이름, 모양, 색을 바꾸고 싶을 때만 설정한다 ([카테고리 앱 꾸미기](#카테고리-앱-꾸미기))
- 폴더는 **한 단계만**. `algorithm/graph/a.md`처럼 더 깊이 넣으면 빌드 에러
- 빈 폴더는 안 나온다. 글이 하나 이상 있어야 한다 (git은 빈 폴더를 저장하지 않으니 미리 만들려면 `.gitkeep` 파일을 넣는다)
- `src/content/blog/` 바로 아래에 둔 글은 카테고리 없는 글이 된다

### 태그

```md
tags: ['bfs', 'Shortest Path']
```

- 주소는 소문자 + 공백은 `-`: `Shortest Path` → `/tags/shortest-path/`
- 대소문자만 다른 태그(`BFS`, `bfs`)는 하나로 합쳐진다
- 글 상단에 핑크 알약 모양으로 나오고, 누르면 그 태그의 글 목록으로 간다

### 글 목록 페이지

| 주소 | 내용 |
|---|---|
| `/blog/` | 카테고리 목록 (카드: 아이콘, 글 개수, 최근 글 날짜) |
| `/blog/algorithm/` | algorithm 카테고리 글 목록 1쪽 |
| `/blog/algorithm/2/`, `3/` … | 2쪽부터 |
| `/tags/` | 태그 목록 (글 개수 포함) |
| `/tags/bfs/`, `/tags/bfs/2/` … | bfs 태그 글 목록 |

- 한 쪽에 **10개씩** 보여주고, 아래에 `← 이전 · 1 2 3 · 다음 →` 쪽 번호가 나온다. 한 쪽에 다 들어가면 쪽 번호는 안 나온다
- 한 쪽 개수는 `src/consts.ts`의 `POSTS_PER_PAGE`

---

## 5. 홈 화면

홈(`/`)은 아이폰 홈 화면 모양이다. 화면 전체가 배경화면이고, 위쪽 메뉴와 푸터는 없다.

```
┌─────────────────────────────────────────┐
│ [Algorithm] [GitHub] [Gmail]            │ ← 앱 격자: 카테고리들 → 바깥 링크들
│                                         │
│                                         │
│                    •                    │
│ ┌─────────────────────────────────────┐ │
│ │ [Categories] [Tags] [Search] [About]│ │ ← 독 (고정 메뉴)
│ └─────────────────────────────────────┘ │
└─────────────────────────────────────────┘
```

| 부분 | 내용 |
|---|---|
| 앱 격자 | **카테고리 앱이 먼저**, 그 뒤에 바깥 링크 앱(GitHub: 새 탭, Gmail: 새 메일 쓰기). 빨간 배지는 글 개수 |
| 독 | Categories · Tags · Search · About |
| 데스크톱 | 아이콘이 왼쪽 위부터 채워지고, 독은 아래 가운데 |
| 모바일 (480px 이하) | 아이폰처럼 4칸 격자, 독은 화면 폭에 맞게 |

### 카테고리 앱 꾸미기

`src/consts.ts`의 `CATEGORY_APPS`. 키는 카테고리 폴더 이름이다. 안 적으면 자동으로 정해진다.

```ts
export const CATEGORY_APPS = {
	algorithm: { label: 'Algorithm', icon: 'lucide:waypoints', color: ['#bc6cff', '#6a3fd6'] },
	dev: { label: 'Dev', icon: 'lucide:code', color: ['#00d4f0', '#0a6fb0'] },
};
```

| 항목 | 설명 | 안 적으면 |
|---|---|---|
| `label` | 아이콘 아래 이름. 카테고리 목록, 글 상단에도 이 이름이 쓰인다 | 폴더 이름 (`dev`) |
| `icon` | 아이콘 이름 (아래 [아이콘 고르기](#아이콘-고르기)) | 이름 첫 글자 (`D`) |
| `color` | 배경 그라데이션 `[위, 아래]`. 흰 아이콘이 잘 보이게 아래쪽을 한 톤 어둡게 | 이름으로 자동 결정 (항상 같은 색) |

### 아이콘 고르기

직접 그리지 않고 아이콘 모음에서 **이름만** 적는다 ([astro-icon](https://www.astroicon.dev)). 실제로 쓴 아이콘만 페이지에 들어간다.

| 모음 | 용도 | 이름 예 | 검색 |
|---|---|---|---|
| Lucide (약 1,500개) | 선 아이콘 | `lucide:code`, `lucide:book-open`, `lucide:pen-line` | [icones.js.org/collection/lucide](https://icones.js.org/collection/lucide) |
| Simple Icons (3,000개 이상) | 브랜드 로고 | `simple-icons:github`, `simple-icons:python` | [icones.js.org/collection/simple-icons](https://icones.js.org/collection/simple-icons) |

1. 검색 사이트에서 아이콘을 누르면 이름(`lucide:...`)이 나온다
2. 그대로 복사해서 `icon`에 넣는다
3. 이름을 잘못 쓰면 빌드가 `Unable to locate "..." icon!` 에러로 멈추니 바로 알 수 있다

모음에 없는 아이콘은 SVG 파일을 `src/icons/`에 넣고 파일 이름으로 쓴다. `src/icons/my-logo.svg` → `icon: 'my-logo'`

### 바깥 링크 앱, 독 바꾸기

`src/pages/index.astro`에서 고친다.

| 바꿀 것 | 위치 |
|---|---|
| 바깥 링크 앱 (GitHub, Gmail …) | `links`. 항상 카테고리 앱 뒤에 붙는다 |
| Gmail 앱이 여는 메일 주소 | `src/consts.ts`의 `EMAIL` (사이트에 공개됨) |
| 독 메뉴, 순서, 색 | `dock` |
| 배경화면 | 맨 아래 `<style>`의 `.screen` `background` |

### 앱 열기 / 닫기 애니메이션

- **열기**: 아이콘을 누르면 페이지가 아이콘 자리에서 커져 나온다. 뒤의 홈 화면은 살짝 커지며 흐려진다
- **닫기**: `Home` 메뉴나 브라우저 뒤로 가기로 홈에 돌아오면, 보던 페이지가 줄어들며 **그 페이지가 속한 앱 아이콘**으로 돌아간다
  - 주소로 정함: `/blog/algorithm/...`(글, 2쪽 등) → Algorithm, `/blog/` → Categories, `/tags/...` → Tags, `/search/` → Search, `/about/` → About
  - 홈에서 앱을 열지 않고 글에 바로 들어왔어도 동작한다. 해당하는 앱이 없는 페이지(404 등)는 애니메이션 없이 홈으로
  - 글 개수 배지는 열 때 바로 사라지고, 닫을 때 아이콘이 거의 다 줄어들 무렵 다시 나타난다
- 휴대폰의 **스와이프 뒤로 가기**는 브라우저가 자체 애니메이션을 보여주므로 이 애니메이션이 안 나온다 (겹치지 않게 브라우저가 일부러 건너뜀)
- 앱 페이지는 홈 화면이 다 뜬 뒤 미리 받아둬서 누르자마자 열린다 (휴대폰 데이터 절약 모드면 안 받음)
- 사이트 밖 링크(GitHub, Gmail), 새 탭 열기(`Ctrl` 클릭, 가운데 버튼), 다른 페이지끼리 이동은 애니메이션 없이 그대로

> **애니메이션이 안 보이면**: OS의 "동작 줄이기"가 켜져 있는 것. Windows는 설정 → 접근성 → 시각 효과 → **애니메이션 효과**를 켠다.

---

## 6. 사이트 기능

글마다 자동으로 붙는 것들. 따로 할 건 없다.

### 목차

- 본문의 `##`, `###` 제목으로 자동 생성. 제목이 2개 미만이면 안 나온다
- **넓은 화면**(1200px 이상): 본문 오른쪽에 고정되고, 지금 읽는 섹션이 밝게 표시된다
- **좁은 화면**: 글 상단에 접힌 "목차"로 나온다
- 제목을 누르면 주소 끝에 `#제목`이 붙어서 그대로 섹션 링크로 공유할 수 있다

### 이전 / 다음 글

- 글 하단에 **같은 카테고리** 안의 바로 앞뒤 글이 카드로 나온다
- 이전 글 = 더 오래된 글, 다음 글 = 더 최근 글 (`pubDate` 기준, 같은 날짜면 제목순)

### 검색

[Pagefind](https://pagefind.app). 서버 없이 빌드할 때 만든 인덱스로 브라우저에서 검색한다.

- 메뉴의 **Search** 또는 `/search/`. 주소로 바로 검색: `/search/?q=bfs`
- **검색 대상**: 글 제목, 본문, 코드. 날짜, 태그 줄, 목차, 줄 번호는 빠진다
- 검색 결과 옆에 `category`, `tag` 필터가 나온다
- 배포할 때 자동으로 인덱스가 다시 만들어진다
- `npm run dev`에서는 안 된다. 테스트하려면 `npm run build` → `npm run preview`

### 댓글

[giscus](https://giscus.app). 댓글은 이 레포의 **GitHub Discussions**에 저장된다.

- 글 하단에 붙는다. 쓰려면 GitHub 로그인이 필요하다 (리액션, 마크다운, 코드 블록 가능)
- 글 주소(`/blog/algorithm/two-sum/`)가 Discussion 제목이 된다. 첫 댓글이 달릴 때 `Announcements` 카테고리에 자동 생성
- **글 주소를 바꾸면 기존 댓글과 연결이 끊긴다.** 옮겨야 하면 그 Discussion 제목을 새 주소로 고친다
- **댓글 관리**(삭제, 숨기기, 잠금): GitHub 레포 → Discussions → Announcements
- 댓글창 색은 사이트 팔레트에 맞춰뒀다 (배포된 사이트에서만. `npm run dev`에서는 기본 다크 테마)

### 방문 통계

[GoatCounter](https://www.goatcounter.com). 쿠키를 안 써서 동의 팝업이 필요 없다.

- **대시보드**: https://hoesu.goatcounter.com (페이지별 조회수, 방문 추이, 유입 경로, 브라우저 / OS / 국가)
- 배포된 사이트 방문만 집계된다. 내 컴퓨터(localhost)에서 보는 건 안 잡힌다
- 끄려면 `src/consts.ts`의 `GOATCOUNTER_CODE`를 비운다

### 링크 미리보기 이미지

카톡, 디스코드, 슬랙, X 등에 글 링크를 보내면 뜨는 카드 이미지. **빌드할 때 글마다 자동으로 만든다** (따로 할 일 없음).

- 글: 카테고리 아이콘 + 이름, 제목(그라데이션 글자), 한 줄 요약(`description`), 사이트 주소, 날짜
- 글이 아닌 페이지(홈, 카테고리, 태그, 검색, About): 사이트 이름 `Hoesu` + `SITE_DESCRIPTION`
- 이미지 주소: `/og/<카테고리>/<글 파일 이름>.png` (예: https://hoesu.github.io/og/algorithm/2d-tetris.png). 브라우저로 열어서 미리 볼 수 있다
- 제목이 길면 글자가 작아지고 최대 3줄, 요약은 최대 2줄까지 나온다
- 디자인은 `src/utils/og.ts`에서 바꾼다
- 메신저는 미리보기를 한동안 저장해둔다. 글을 고친 뒤 바로 다시 보내면 예전 카드가 뜰 수 있다 (카톡: [카카오 공유 디버거](https://developers.kakao.com/tool/debugger/sharing)에서 캐시 초기화)

### 404 페이지

없는 주소로 들어오면 나오는 페이지 (`src/pages/404.astro`).

- 문구는 "페이지를 찾을 수 없습니다" 하나. 그 아래 작은 표에 **요청한 주소**(오타를 눈치채기 쉽게)와 **비슷한 글**을 보여준다
- 비슷한 글: 주소가 비슷한 글을 하나 추천한다. 예: `/blog/algorithm/2d-tetri/`, `/blog/pacman/` → "2차원 테트리스", "팩맨". 너무 다른 주소면 추천 안 함
- 다른 곳으로 가는 버튼은 따로 두지 않는다 (상단 메뉴에 다 있음)

### RSS

- `/rss.xml`. RSS 리더(Feedly 등)에 이 주소를 넣으면 새 글 알림을 받을 수 있다
- 글의 `description`이 요약으로 들어간다

---

## 7. 색과 디자인

브라우저나 OS 설정과 상관없이 **항상 다크 테마**. 팔레트는 신스웨이브 계열.

| 색 | 쓰이는 곳 |
|---|---|
| `#0B0F2B` 남색 | 배경 |
| `#FF5CA8` 핑크 | 링크, 강조, 태그, 체크박스, 검색 결과 강조, 글자 선택 |
| `#00F0FF` 시안 | 인라인 코드 글자, 메뉴 네온 줄 |
| `#BC6CFF` 보라 | 제목 그라데이션, 카드에 마우스를 올렸을 때, 인용문 막대 |
| `#FFB86B` 오렌지 | 홈 화면 Tags 아이콘 |

글자 대비는 모두 웹 접근성 AA 기준(4.5:1 이상)을 넘는다 (본문 16:1, 흐린 글자 6.8:1, 링크 6.6:1).

### 글 페이지 꾸밈

본문은 글 위주로 담백하게 두고, 홈 화면 분위기에 맞춘 포인트만 넣었다.

| 어디 | 모양 |
|---|---|
| 페이지 위쪽 | 핑크 / 보라 빛이 은은하게 |
| 메뉴 | 지금 보는 메뉴 아래에 핑크 → 시안 네온 줄 |
| 페이지 제목 | 핑크 → 보라 그라데이션 글자 |
| 본문 `##` 제목 | 앞에 작은 그라데이션 막대 |
| 카테고리 | 홈 화면 앱 아이콘의 작은 버전 |
| 글 목록 | 마우스를 올리면 줄 전체에 보라 빛 |
| 이전 / 다음 글, 카테고리 목록 | 카드 |
| 인용문, 구분선, 표 | 보라 막대, 가운데가 빛나는 구분선, 표 첫 줄 배경 |

### 색 바꾸기

대부분은 `src/styles/global.css` 맨 위 `:root`에서 바꾼다.

```css
:root {
	--bg: #0b0f2b;       /* 배경 */
	--text: #edebff;     /* 본문 글자 */
	--muted: #9a97c9;    /* 날짜, 메뉴 같은 흐린 글자 */
	--border: #262c5e;   /* 구분선, 테두리 */
	--accent: #ff5ca8;   /* 링크, 강조 */
	--accent-2: #00f0ff; /* 인라인 코드 글자 */
	--accent-3: #bc6cff; /* 보라 */
	--accent-4: #ffb86b; /* 오렌지 */
	--code-bg: #151a3f;  /* 코드 배경 */
	/* + 카드 배경, 마우스 올렸을 때 색, 제목 그라데이션 */
}
```

**색이 따로 들어 있는 곳** (팔레트를 바꿀 때 같이 바꿀 것)

| 파일 | 내용 |
|---|---|
| `ec.config.mjs` | 코드 블록 테마(`themes`, 지금 `synthwave-84`, [테마 목록](https://shiki.style/themes))와 배경(`codeBackground`, `--code-bg`와 같은 값) |
| `src/styles/global.css`의 `html` | 글 페이지 위쪽 핑크 / 보라 빛 |
| `src/pages/index.astro` | 홈 화면 배경화면, 독 아이콘 색, 바깥 링크 앱 색 |
| `src/consts.ts` | 카테고리 아이콘 색 (`CATEGORY_APPS`) |
| `src/components/BaseHead.astro` | `theme-color` (모바일 주소창 색, `--bg`와 같게) |
| `public/giscus-theme.css` | 댓글창 색 |
| `public/favicon.svg` | 파비콘 |

> 코드 블록 테마(`ec.config.mjs`)를 바꾼 뒤 코드 블록이 깨져 보이면 [문제 해결](#코드-블록이-깨져-보인다)을 본다.

---

## 8. 문제 해결

### 새 글이 사이트에 안 보인다
- `draft: true`로 되어 있지 않은지 확인 (배포에서 빠짐)
- push한 뒤 1~2분 기다리고 `Ctrl+Shift+R`. GitHub 레포 → **Actions** 탭에서 배포가 성공(초록 체크)했는지 확인

### 빌드가 에러로 멈춘다

| 에러 메시지 | 원인 |
|---|---|
| `title` … `Required`, `pubDate` … `Expected type date` | 글 정보(frontmatter)가 빠졌거나 `---` 줄이 잘못됨 (`--`처럼 2개만 쓰면 안 됨) |
| `카테고리 폴더는 한 단계만 허용됨` | 폴더를 두 단계 이상 넣음 |
| `Unable to locate "..." icon!` | 아이콘 이름 오타 |
| `미리보기 이미지 글꼴을 못 받음` | 인터넷이 끊김. 링크 미리보기 이미지용 글꼴(Noto Sans KR)을 빌드할 때 Google Fonts에서 받는다. `npm run dev`(글 쓰면서 보기)는 미리보기 이미지를 열 때만 필요해서 상관없다 |

### 코드 블록이 깨져 보인다
코드 블록 설정(`ec.config.mjs`)을 바꾼 뒤 생긴다. Astro가 예전 변환 결과를 캐시에서 꺼내 쓰기 때문이다.

1. dev 서버를 끈다
2. `npm run clean` (캐시 두 군데를 지움: dev용 `.astro/data-store.json`, 빌드용 `node_modules/.astro`)
3. 다시 `npm run dev`

배포(GitHub Actions)는 이 문제를 막으려고 캐시를 꺼뒀다.

### 앱 열기 / 닫기 애니메이션이 안 보인다
OS의 "동작 줄이기"가 켜져 있다. Windows: 설정 → 접근성 → 시각 효과 → **애니메이션 효과** 켜기.

### 검색이 안 된다 (내 컴퓨터에서)
`npm run dev`에는 검색 인덱스가 없다. `npm run build` → `npm run preview`에서 테스트한다. 배포된 사이트는 정상.

### 댓글창 색이 사이트랑 다르다 (내 컴퓨터에서)
정상이다. 브라우저가 giscus(https) → localhost 접근을 막아서 dev 서버에서는 기본 다크 테마로 보인다. 배포된 사이트에서는 사이트 팔레트로 보인다.

### `/heading`을 골랐는데 `/`가 남는다
에디터 기본 스니펫을 고른 것. [기본 스니펫 숨기기](#에디터-기본-스니펫-숨기기-컴퓨터마다-한-번)를 한다.

### Gmail 앱을 눌러도 반응이 없다
PC에 메일 앱이 설정되어 있지 않은 것. 크롬에서 Gmail을 기본 메일 앱으로 설정하면 Gmail 웹이 열린다.

---

## 9. 개발 참고

### 명령어

| 명령 | 설명 |
|---|---|
| `npm install` | 의존성 설치 (처음 한 번) |
| `npm run dev` | 내 컴퓨터에서 보기 (http://localhost:4321). 저장하면 바로 반영 |
| `npm run build` | `dist/`로 빌드 + 검색 인덱스 생성 |
| `npm run preview` | 빌드 결과 미리보기 (검색 테스트는 여기서) |
| `npm run check` | 타입 검사 (코드를 고친 뒤 에러 확인) |
| `npm run clean` | Astro 캐시 지우기 ([코드 블록이 깨질 때](#코드-블록이-깨져-보인다)) |

### 프로젝트 구조

```
src/
├── content/blog/              # 글 (마크다운). 하위 폴더 = 카테고리
├── consts.ts                  # 사이트 설정: 제목, GitHub, 이메일, 카테고리 앱, 쪽당 글 수, 댓글 / 통계
├── content.config.ts          # 글 정보(frontmatter) 형식
├── pages/
│   ├── index.astro            # 홈 화면 (앱 격자, 독, 배경화면)
│   ├── blog/index.astro       # 카테고리 목록
│   ├── blog/[category]/[...page].astro  # 카테고리 글 목록 (쪽 나누기)
│   ├── blog/[...slug].astro   # 글 페이지
│   ├── tags/index.astro       # 태그 목록
│   ├── tags/[tag]/[...page].astro       # 태그 글 목록 (쪽 나누기)
│   ├── og/[...slug].png.ts    # 글 링크 미리보기 이미지 (/og/<글 id>.png)
│   ├── og/default.png.ts      # 글이 아닌 페이지의 링크 미리보기 이미지
│   ├── search.astro, about.astro, 404.astro, rss.xml.js
├── layouts/Base.astro         # 공통 레이아웃 (메뉴 / 푸터)
├── components/
│   ├── BaseHead.astro         # <head>: 메타 태그, 앱 전환 스크립트, 방문 통계
│   ├── AppIcon.astro          # 홈 화면 앱 아이콘
│   ├── MiniIcon.astro         # 작은 카테고리 아이콘 (카테고리 목록, 글 상단)
│   ├── PostList.astro         # 글 목록
│   ├── Pagination.astro       # 쪽 번호
│   ├── Toc.astro              # 목차
│   ├── PostNav.astro          # 이전 / 다음 글
│   ├── Comments.astro         # 댓글 (giscus)
│   └── FormattedDate.astro    # 날짜 (2026-11-05)
├── utils/
│   ├── posts.ts               # 글 목록, 카테고리, 태그, 이전 / 다음 글 계산
│   ├── apps.ts                # 카테고리 이름 / 아이콘 / 색 (CATEGORY_APPS + 자동 색)
│   └── og.ts                  # 링크 미리보기 이미지 그리기 (satori → sharp PNG, 글꼴 받기)
├── plugins/math.mjs           # 수식 → KaTeX HTML 변환
├── scripts/app-animation.ts   # 앱 열기 / 닫기 (클릭 처리, 미리 받기, Firefox용 대체 애니메이션)
├── styles/global.css          # 색, 글꼴, 본문 스타일, 앱 전환 애니메이션
└── icons/                     # 직접 넣는 SVG 아이콘
public/                        # 그대로 복사되는 파일 (파비콘, 댓글창 테마)
astro.config.mjs               # Astro 설정 (사이트 주소, 플러그인, 수식, 사진 크기별 생성)
ec.config.mjs                  # 코드 블록 테마, 줄 번호
.vscode/markdown.code-snippets # / 스니펫
.github/workflows/deploy.yml   # 자동 배포
```

### 앱 열기 / 닫기 작동 방식

| 브라우저 | 방식 |
|---|---|
| Chrome, Edge, 최신 Safari | **View Transitions API**. 브라우저가 떠나는 페이지 / 도착한 페이지 화면을 찍어서 아이콘 ↔ 페이지 전체를 이어준다 |
| Firefox 등 미지원 | JS 대체 애니메이션. 아이콘 모양 상자가 화면 전체로 커진 뒤 이동, 돌아오면 아이콘 자리로 줄어든다 |

| 파일 | 역할 |
|---|---|
| `src/components/BaseHead.astro` | 인라인 스크립트. `pageswap`(떠나는 페이지) / `pagereveal`(도착한 페이지)에서 `app-window` 이름표를 아이콘 ↔ 페이지 전체에, `app-badge`를 배지에 붙인다. 앱 열기 / 닫기가 아닌 이동은 전환을 건너뜀. 페이지가 보일 때마다 주소를 `app-from`에 기록하고, 닫을 때 `appFor()`가 그 주소와 가장 길게 겹치는 앱을 고른다 |
| `src/styles/global.css` (맨 아래) | `::view-transition-*` 스타일. 속도(`--app-open`, `--app-close`), 곡선(`--spring` 열기, `--settle` 닫기), 모서리, 페이드 |
| `src/scripts/app-animation.ts` | 아이콘 클릭 처리, 미리 받기, 미지원 브라우저용 JS 애니메이션 (`OPEN_MS`, `CLOSE_MS`) |

- 성능: 움직이는 건 대부분 GPU가 처리하는 속성(크기, 위치, 투명도). 모서리 둥글기만 매 프레임 다시 그려서 앞쪽 35% 구간에서만 돌린다. 대체 애니메이션은 상자를 화면 전체 크기로 두고 `clip-path`만 바꿔서 레이아웃 계산이 없다
- 미리 받기는 `rel="prefetch"`라 HTML만 받고 스크립트는 실행 안 함 → 방문 통계에 안 잡힌다

### 검색 대상 바꾸기

`src/pages/blog/[...slug].astro`의 `data-pagefind-*` 속성.

| 속성 | 의미 |
|---|---|
| `data-pagefind-body` | 이 요소 안만 검색 대상 (글 페이지의 `<article>`) |
| `data-pagefind-ignore` | 검색에서 제외 (안에 있는 필터는 그대로 동작) |
| `data-pagefind-filter="tag:bfs"` | 검색 필터 값 |

### 수식 처리

Astro 7의 기본 마크다운 처리기(Sätteri)가 `$ … $`를 찾아내고(`astro.config.mjs`의 `features.math`), `src/plugins/math.mjs`가 그 부분을 빌드할 때 KaTeX HTML로 바꾼다. 방문자 브라우저에서는 자바스크립트 없이 CSS(`katex.min.css`, 글 페이지에서 불러옴)만으로 보인다. 수식 글꼴은 수식이 있는 글에서만 받는다.

### 설정값 한눈에 (`src/consts.ts`)

| 값 | 의미 |
|---|---|
| `SITE_TITLE`, `SITE_DESCRIPTION` | 사이트 이름, 설명 (검색엔진, 링크 미리보기, RSS) |
| `GITHUB_URL` | 홈 화면 GitHub 앱, 푸터 링크 |
| `EMAIL` | 홈 화면 Gmail 앱이 여는 메일 주소 (사이트에 공개됨) |
| `POSTS_PER_PAGE` | 글 목록 한 쪽 글 수 (10) |
| `CATEGORY_APPS` | 카테고리 앱 이름 / 아이콘 / 색 |
| `GOATCOUNTER_CODE` | 방문 통계 사이트 코드 |
| `GISCUS` | 댓글 레포, Discussion 카테고리 ID |

About 페이지 내용은 `src/pages/about.astro`에서 고친다. 템플릿의 `[대괄호]` 부분을 내 이야기로 바꾸면 되고, 문단 하나가 `<p>...</p>` 하나다.

---

## 변경 이력

### 2026-11-06
- **404 페이지**: 제목, 요청한 주소 + 주소가 비슷한 글 추천(한 칸에)
- **기능**: 링크 공유 미리보기 이미지 (글마다 자동 생성, 카테고리 아이콘 + 제목 + 요약). 글 속 사진을 화면 크기별로 여러 장 만들어서 폰은 작은 사진을 받음
- **애니메이션**: 홈으로 돌아올 때 마지막으로 연 앱이 아니라 **보던 페이지가 속한 앱**으로 줄어듦 (상단 메뉴로 Tags에 갔다가 Home → Tags 아이콘). 글에 바로 들어와도 동작. 뒤로 가기로 돌아올 때 남은 이름표 때문에 전환이 취소될 수 있던 문제 정리. 앱 닫기 애니메이션이 튕기지 않고 아이콘 자리에 바로 붙게 (전에는 아이콘이 원래보다 작아지고 찌그러졌다가 돌아옴). 닫을 때 글 개수 배지가 잘리던 문제 수정: 아이콘이 거의 다 줄어들 무렵 배지가 톡 나타남. 열 때는 창이 커지기 시작하자마자 배지가 쏙 사라짐

### 2026-11-05
- **글쓰기**: `/` 스니펫 23개 (VS Code / Cursor). 에디터 기본 마크다운 스니펫을 대체. 수식(KaTeX) 지원
- **홈 화면**: 아이폰 홈 화면 스타일로 변경 (카테고리 앱 + 글 개수 배지 + 독). 앱 열기 / 닫기 애니메이션. 데스크톱도 화면 전체 사용. 아이콘을 astro-icon(Lucide + Simple Icons)으로. GitHub, Gmail 앱. 독: Categories · Tags · Search · About
- **디자인**: 신스웨이브 팔레트, 코드 블록 테마 synthwave-84. 글 페이지 꾸밈 (위쪽 빛, 네온 메뉴 줄, 그라데이션 제목, 카테고리 카드, 태그 알약, 카드형 이전 / 다음 글). 댓글창 전용 테마. 메뉴 맨 앞에 Home
- **기능**: 카테고리 / 태그 글 목록 10개씩 쪽 나누기. 제목 h4~h6, 체크리스트, 키보드 키 스타일
- **정리**: 코드 정리 (`global.css` 순서 정리, 애니메이션 코드 중복 제거), `npm run check` 추가, 배포 빌드 캐시 끔, README를 사용 설명서로 재구성

### 2026-11-04
- Astro로 블로그 새로 구축. 상시 다크 테마
- Expressive Code 코드 블록, 폴더 기반 카테고리 + 태그, 목차, 이전 / 다음 글
- Pagefind 검색, giscus 댓글, GoatCounter 방문 통계
- 알고리즘 풀이 글 58개 이식
