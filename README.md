# Hoesu.github.io

[Astro](https://astro.build) 기반 개인 블로그. https://hoesu.github.io

## 명령어

| 명령 | 설명 |
|---|---|
| `npm install` | 의존성 설치 |
| `npm run dev` | 로컬 서버 (http://localhost:4321) |
| `npm run build` | `dist/`로 빌드 |
| `npm run preview` | 빌드 결과 미리보기 |

## 글 쓰기

`src/content/blog/` 에 `.md` 파일 추가 → `main`에 push하면 GitHub Actions가 자동 배포.

```md
---
title: '제목'
description: '한 줄 요약'   # 선택
pubDate: 2026-11-04
tags: ['태그']              # 선택
draft: true                 # 선택, true면 배포 제외
---
```

## 구조

```
src/
├── content/blog/     # 글 (마크다운)
├── layouts/Base.astro  # 공통 레이아웃 (헤더/푸터)
├── pages/            # 라우트 (/, /about, /blog/[slug], /rss.xml)
├── styles/global.css # 전체 스타일
└── consts.ts         # 사이트 제목 등 설정
```
