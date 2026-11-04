---
title: '블로그 사용 가이드'
description: '이 블로그에서 글 쓰고 배포하는 방법, 쓸 수 있는 기능 정리'
pubDate: 2026-11-04
updatedDate: 2026-11-04
tags: ['guide']
---

이 블로그에서 쓸 수 있는 기능을 정리한 문서. 기능이 추가되거나 바뀔 때마다 같이 업데이트한다.

## 변경 이력

- **2026-11-04**: Astro로 블로그 새로 구축. Expressive Code로 코드 블록 기능 추가. 상시 다크 테마 적용. 폴더 기반 카테고리, 태그 페이지 추가

## 1. 글 쓰기

`src/content/blog/<카테고리>/` 폴더에 `.md` 파일을 만들면 글 하나가 된다. 폴더 이름과 파일 이름이 그대로 주소가 된다.

```bash
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

## 2. 카테고리와 태그

**카테고리 = 폴더**, **태그 = frontmatter의 `tags`**. 카테고리는 큰 주제 하나, 태그는 세부 키워드 여러 개로 쓴다.

```bash
src/content/blog/
├── algorithm/          # 카테고리 "algorithm"
│   └── dijkstra.md     # tags: ['graph', 'python']
└── blog-guide.md       # 최상위 글 = 카테고리 없음 (이 가이드)
```

### 카테고리

- 새 카테고리는 `src/content/blog/` 아래에 폴더만 만들면 된다. 설정은 따로 없다
- 폴더는 **한 단계만** 쓸 수 있다. `algorithm/graph/a.md`처럼 더 깊이 넣으면 빌드할 때 에러가 난다
- 글을 다른 폴더로 옮기면 **주소가 바뀐다**. 이미 공유한 링크가 깨지니까 주의
- 빈 폴더는 카테고리 목록에 안 나온다. 글이 하나 이상 있어야 나온다
- git은 빈 폴더를 저장하지 않으니까, 미리 만들어두려면 폴더 안에 `.gitkeep` 파일을 넣는다

| 주소 | 내용 |
|---|---|
| `/blog/` | 카테고리 목록 (글 개수 포함) |
| `/blog/algorithm/` | algorithm 카테고리 글 목록 |

### 태그

```md
tags: ['graph', 'Python']
```

- 태그 주소는 소문자로 바뀌고 공백은 `-`가 된다 (`Python` → `/tags/python/`, `Two Pointer` → `/tags/two-pointer/`)
- 대소문자만 다른 태그(`Python`, `python`)는 같은 태그로 합쳐진다

| 주소 | 내용 |
|---|---|
| `/tags/` | 태그 목록 (글 개수 포함) |
| `/tags/python/` | python 태그 글 목록 |

## 3. 로컬에서 보기 & 배포

```bash
npm install      # 처음 한 번
npm run dev      # http://localhost:4321
```

`main` 브랜치에 push하면 GitHub Actions가 자동으로 빌드하고 배포한다. 1~2분 정도 걸린다.

```bash
git add .
git commit -m "새 글: 제목"
git push
```

## 4. 코드 블록

백틱 3개 뒤에 언어 이름을 쓴다. 모든 코드 블록에는 **복사 버튼**이 붙는다 (오른쪽 위에 마우스를 올리면 나옴).

### 기본

````md
```ts
const hello = (name: string) => `안녕, ${name}`;
```
````

```ts
type Post = { title: string; pubDate: Date };

export function sortPosts(posts: Post[]) {
	return posts.sort((a, b) => b.pubDate.valueOf() - a.pubDate.valueOf());
}
```

줄 번호는 기본으로 붙는다. 끄려면 `showLineNumbers=false`를 쓴다.

````md
```py showLineNumbers=false
print("줄 번호 없음")
```
````

```py showLineNumbers=false
print("줄 번호 없음")
```

### 추가 / 삭제 표시

줄 번호로 지정한다. `ins`는 추가된 줄, `del`은 삭제된 줄.

````md
```js ins={3} del={2}
...
```
````

```js ins={3} del={2}
function greet(name) {
	return 'Hello ' + name;
	return `안녕, ${name}`;
}
```

`diff` 언어로 쓰면 `+` / `-` 로 바로 표시된다.

````md
```diff
- const API_URL = 'http://localhost:3000';
+ const API_URL = import.meta.env.API_URL;
```
````

```diff
- const API_URL = 'http://localhost:3000';
+ const API_URL = import.meta.env.API_URL;
```

### 단어 강조

따옴표로 감싼 단어만 강조된다.

````md
```ts "getPosts"
...
```
````

```ts "getPosts"
import { getPosts } from '../utils/posts';

const posts = await getPosts();
```

### 터미널 창

`bash`, `sh`, `powershell` 같은 셸 언어는 자동으로 터미널 모양이 되고 줄 번호가 빠진다.

```bash
npm run build
```

```powershell
Get-ChildItem src/content/blog
```

### 긴 코드 접기

`collapse={시작-끝}` 범위가 접혀서 나온다. 클릭하면 펼쳐진다.

````md
```ts collapse={1-5}
...
```
````

```ts collapse={1-5}
import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// 여기까지는 접혀 있음

const blog = defineCollection({
	loader: glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' }),
	schema: z.object({
		title: z.string(),
		pubDate: z.coerce.date(),
	}),
});
```

### 코드 블록 안에 코드 블록 쓰기

이 문서처럼 코드 블록 문법 자체를 보여주고 싶으면 바깥을 백틱 4개로 감싼다.

`````md
````md
```ts
const a = 1;
```
````
`````

## 5. 기본 마크다운

| 문법 | 결과 |
|---|---|
| `**굵게**` | **굵게** |
| `*기울임*` | *기울임* |
| `` `인라인 코드` `` | `인라인 코드` |
| `[링크](https://example.com)` | [링크](https://example.com) |
| `![설명](./image.png)` | 이미지 |
| `> 인용` | 인용문 |
| `---` | 구분선 |

> 인용문은 이렇게 보인다.

## 6. 색상 테마

브라우저나 OS 설정과 상관없이 **항상 다크 테마**로 보인다. 색을 바꾸려면 두 군데를 고친다.

- **사이트 색**: `src/styles/global.css` 맨 위 `:root`의 색상 변수

```css
:root {
	--bg: #0f1115;     /* 배경 */
	--text: #e6e6e6;   /* 본문 글자 */
	--muted: #8b949e;  /* 날짜 같은 흐린 글자 */
	--border: #262a31; /* 구분선, 테두리 */
	--accent: #58a6ff; /* 링크 */
	--code-bg: #161b22; /* 인라인 코드 배경 */
}
```

- **코드 블록 색**: `ec.config.mjs`의 `themes`. [Shiki 테마 목록](https://shiki.style/themes)에 있는 이름을 쓰면 된다 (예: `'one-dark-pro'`, `'tokyo-night'`)

배경색을 바꾸면 `src/components/BaseHead.astro`의 `theme-color`(모바일 주소창 색)도 같은 색으로 맞춘다.

## 7. 사이트 설정 파일

| 파일 | 내용 |
|---|---|
| `src/consts.ts` | 사이트 제목, 설명, GitHub 주소 |
| `src/pages/about.astro` | About 페이지 |
| `src/styles/global.css` | 전체 색상, 폰트, 여백 |
| `ec.config.mjs` | 코드 블록 테마, 줄 번호 규칙 |
| `src/components/BaseHead.astro` | `<head>` 메타 태그 (SEO, 테마 색) |
| `src/utils/posts.ts` | 글 목록, 카테고리, 태그 계산 규칙 |
| `astro.config.mjs` | Astro 설정 (사이트 주소, 플러그인) |
