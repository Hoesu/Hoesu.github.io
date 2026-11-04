---
title: '블로그 다시 시작'
description: 'Jekyll에서 Astro로 갈아탄 첫 글'
pubDate: 2026-11-04
tags: ['blog']
---

Jekyll 템플릿을 걷어내고 Astro로 처음부터 다시 만들었다.

## 글 쓰는 법

`src/content/blog/` 에 마크다운 파일 하나 추가하면 끝.

```md
---
title: '글 제목'
description: '한 줄 요약'
pubDate: 2026-11-04
tags: ['태그']
draft: true # 작성 중이면 true, 배포에서 빠짐
---

본문...
```

코드 하이라이팅도 된다.

```ts
const hello = (name: string) => `안녕, ${name}`;
```

> 인용문은 이렇게 보인다.
