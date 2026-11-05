// 사이트 전역 설정
export const SITE_TITLE = 'Hoesu';
export const SITE_DESCRIPTION = 'Hoesu의 블로그';
export const GITHUB_URL = 'https://github.com/Hoesu';

// 홈 화면 카테고리 앱 아이콘. 키 = 카테고리 폴더 이름
// icon: 'graph' | 'code' | 'book' | 'pen' | 'terminal' | 'star' | 'github' (없으면 이름 첫 글자)
// color: 아이콘 배경 그라데이션 [위, 아래] (없으면 이름으로 자동 결정)
export const CATEGORY_APPS: Record<string, { label?: string; icon?: string; color?: [string, string] }> = {
	algorithm: { label: 'Algorithm', icon: 'graph', color: ['#bc6cff', '#6a3fd6'] },
};

// 방문 통계 (GoatCounter). 가입할 때 정한 사이트 코드. 비워두면 통계 스크립트를 넣지 않음
// 대시보드: https://<코드>.goatcounter.com
export const GOATCOUNTER_CODE = 'hoesu';

// 댓글 (giscus). 값은 https://giscus.app 에서 레포를 넣으면 나오는 것과 같음
export const GISCUS = {
	repo: 'Hoesu/Hoesu.github.io',
	repoId: 'R_kgDOVjaF6Q',
	category: 'Announcements',
	categoryId: 'DIC_kwDOVjaF6c4DKag1',
} as const;
