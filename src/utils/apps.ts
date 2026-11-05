import { CATEGORY_APPS } from '../consts';

export interface CategoryApp {
	label: string;
	icon?: string;
	color: [string, string];
}

// 설정이 없는 카테고리는 이름으로 색을 정함 (항상 같은 색)
function autoColor(name: string): [string, string] {
	let h = 0;
	for (const ch of name) h = (h * 31 + ch.codePointAt(0)!) % 360;
	return [`hsl(${h} 70% 58%)`, `hsl(${(h + 30) % 360} 65% 45%)`];
}

/** 카테고리의 이름표 / 아이콘 / 색. 홈 화면 앱 아이콘과 글 페이지의 작은 아이콘이 같이 씀 */
export function categoryApp(name: string): CategoryApp {
	const cfg = CATEGORY_APPS[name] ?? {};
	return { label: cfg.label ?? name, icon: cfg.icon, color: cfg.color ?? autoColor(name) };
}
