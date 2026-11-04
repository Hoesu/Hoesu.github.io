# Hoesu.github.io

[Astro](https://astro.build) 기반 개인 블로그. https://hoesu.github.io

이 블로그에서 쓸 수 있는 기능을 정리한 문서. 기능이 추가되거나 바뀔 때마다 같이 업데이트한다.

## 변경 이력

- **2026-11-04**: Astro로 블로그 새로 구축. Expressive Code로 코드 블록 기능 추가. 상시 다크 테마 적용. 폴더 기반 카테고리, 태그 페이지 추가. 알고리즘 풀이 글 58개 이식. 목차, 이전 / 다음 글 추가. 사용 가이드를 블로그 글에서 README로 이동. Pagefind 검색 추가

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

## 6. 코드 블록

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

## 7. 기본 마크다운

| 문법 | 결과 |
|---|---|
| `**굵게**` | **굵게** |
| `*기울임*` | *기울임* |
| `` `인라인 코드` `` | `인라인 코드` |
| `[링크](https://example.com)` | [링크](https://example.com) |
| `![설명](./image.png)` | 이미지 |
| `> 인용` | 인용문 |
| `---` | 구분선 |

## 8. 색상 테마

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

## 9. 프로젝트 구조

```
src/
├── content/blog/            # 글 (마크다운). 하위 폴더 = 카테고리
├── components/
│   ├── BaseHead.astro       # <head> 메타 태그 (SEO, 테마 색)
│   ├── PostList.astro       # 글 목록
│   ├── Toc.astro            # 목차 (위치, 표시 기준)
│   └── PostNav.astro        # 이전 / 다음 글
├── layouts/Base.astro       # 공통 레이아웃 (헤더 / 푸터)
├── pages/                   # 라우트 (/, /about, /blog/..., /tags/..., /search, /rss.xml)
├── styles/global.css        # 전체 색상, 폰트, 여백
├── utils/posts.ts           # 글 목록, 카테고리, 태그, 이전 / 다음 글 계산 규칙
└── consts.ts                # 사이트 제목, 설명, GitHub 주소
ec.config.mjs                # 코드 블록 테마, 줄 번호 규칙
astro.config.mjs             # Astro 설정 (사이트 주소, 플러그인)
```

About 페이지 내용은 `src/pages/about.astro`에서 고친다.
