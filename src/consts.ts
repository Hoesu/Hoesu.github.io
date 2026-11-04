// 사이트 전역 설정
export const SITE_TITLE = 'Hoesu';
export const SITE_DESCRIPTION = 'Hoesu의 블로그';
export const GITHUB_URL = 'https://github.com/Hoesu';

// 방문 통계 (GoatCounter). 가입할 때 정한 사이트 코드. 비워두면 통계 스크립트를 넣지 않음
// 대시보드: https://<코드>.goatcounter.com
export const GOATCOUNTER_CODE = 'hoesu';

// 댓글 (giscus). 값은 https://giscus.app 에서 레포를 넣으면 나오는 것과 같음
export const GISCUS = {
	repo: 'Hoesu/Hoesu.github.io',
	repoId: 'R_kgDOViUl_Q',
	category: 'Announcements',
	categoryId: 'DIC_kwDOViUl_c4DKWyC',
} as const;
