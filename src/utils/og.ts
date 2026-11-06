/**
 * 링크 공유 미리보기 이미지 (카톡, 디스코드 등에 링크를 보내면 뜨는 카드). 1200×630 PNG
 * satori 로 카드를 SVG 로 그린 뒤 sharp 로 PNG 변환. 빌드할 때 글마다 한 장씩 만듦
 * 주소: /og/<글 id>.png (src/pages/og/[...slug].png.ts), 글이 아닌 페이지는 /og/default.png
 *
 * 글꼴: Google Fonts 의 Noto Sans KR 을 빌드할 때 받음. 글들에 쓰인 글자만 담은 작은 파일이라 빠름
 * (그래서 빌드에 인터넷이 필요함. 오프라인이면 미리보기 이미지 만들기에서 빌드가 실패)
 */
import lucide from '@iconify-json/lucide/icons.json';
import simpleIcons from '@iconify-json/simple-icons/icons.json';
import satori from 'satori';
import sharp from 'sharp';
import { SITE_DESCRIPTION, SITE_TITLE } from '../consts';
import { type CategoryApp, categoryApp } from './apps';
import { getCategory, getPosts } from './posts';

export const OG_WIDTH = 1200;
export const OG_HEIGHT = 630;

const SITE_HOST = 'hoesu.github.io';
const C = {
	bg: '#0b0f2b',
	text: '#edebff',
	muted: '#9a97c9',
	pink: '#ff5ca8',
	purple: '#bc6cff',
	cyan: '#00f0ff',
};

// ---------- 글꼴 ----------
// 빌드 한 번에 글꼴을 한 번만 받음: 모든 글의 제목 / 요약 등에 쓰인 글자를 모아서 받고 모든 카드가 같이 씀.
// 주소 길이 제한 때문에 글자가 많으면 나눠서 여러 파일로 받음. 파일마다 이름을 다르게 붙이고
// fontFamily 에 전부 나열해서, 글자가 없으면 다음 파일에서 찾게 함 (같은 이름이면 첫 파일만 씀)
const CHUNK = 400;
type Font = { name: string; data: ArrayBuffer; weight: 500 | 800; style: 'normal' };

async function fetchFont(chars: string, weight: number) {
	const api = `https://fonts.googleapis.com/css2?family=Noto+Sans+KR:wght@${weight}&text=${encodeURIComponent(chars)}`;
	const css = await (await fetch(api)).text();
	const url = css.match(/src: url\((.+?)\) format\('(?:opentype|truetype)'\)/)?.[1];
	if (!url) throw new Error(`미리보기 이미지 글꼴을 못 받음 (Noto Sans KR ${weight}). 인터넷 연결을 확인하세요`);
	return (await fetch(url)).arrayBuffer();
}

async function loadFonts(text: string, weight: 500 | 800): Promise<Font[]> {
	// 숫자, 영문, 기본 기호는 항상 포함
	const base = `0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ.,:;!?-–—_/()[]'"#&+%…·`;
	const chars = [...new Set(base + text)].filter((c) => c.trim()).sort();
	const chunks: string[] = [];
	for (let i = 0; i < chars.length; i += CHUNK) chunks.push(chars.slice(i, i + CHUNK).join(''));
	const data = await Promise.all(chunks.map((c) => fetchFont(c, weight)));
	return data.map((d, i) => ({ name: `Noto Sans KR ${i}`, data: d, weight, style: 'normal' }));
}

let fontsPromise: Promise<Font[]> | undefined;
/** 모든 카드가 쓰는 글꼴 (처음 부를 때 한 번 받음) */
function getFonts() {
	// dev 서버(npm run dev)는 계속 켜져 있으니 매번 새로 받음: 글 제목을 고쳐서 새 글자가 생겨도 반영되게
	if (import.meta.env.DEV) fontsPromise = undefined;
	fontsPromise ??= (async () => {
		const posts = await getPosts();
		const labels = posts.map((p) => {
			const c = getCategory(p);
			return c ? categoryApp(c).label : '';
		});
		const bold = SITE_TITLE + posts.map((p) => p.data.title).join('') + labels.join('');
		const regular = SITE_DESCRIPTION + SITE_HOST + labels.join('') + posts.map((p) => p.data.description ?? '').join('');
		const [b, r] = await Promise.all([loadFonts(bold, 800), loadFonts(regular, 500)]);
		return [...b, ...r];
	})();
	return fontsPromise;
}

// ---------- 아이콘 ----------
type IconSet = { icons: Record<string, { body: string; width?: number; height?: number }>; width?: number; height?: number };
const ICON_SETS: Record<string, IconSet> = { lucide, 'simple-icons': simpleIcons };

/** 'lucide:waypoints' → 흰색 SVG data URI (없는 이름이면 null) */
function iconSrc(name: string) {
	const [prefix, id] = name.split(':');
	const set = ICON_SETS[prefix];
	const icon = set?.icons[id];
	if (!icon) return null;
	const w = icon.width ?? set.width ?? 24;
	const h = icon.height ?? set.height ?? 24;
	const body = icon.body.replaceAll('currentColor', '#fff');
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" fill="#fff">${body}</svg>`;
	return `data:image/svg+xml;base64,${Buffer.from(svg).toString('base64')}`;
}

// ---------- 카드 그리기 ----------
// satori 는 React 요소 모양의 객체를 받음: { type, props: { style, children } }
type Node = { type: string; props: Record<string, unknown> };
const h = (type: string, style: Record<string, unknown>, children?: unknown, extra: Record<string, unknown> = {}): Node => ({
	type,
	props: { style, children, ...extra },
});

/** 홈 화면 앱 아이콘과 같은 모양 (그라데이션 둥근 사각형 + 흰 아이콘) */
function appIcon(app: CategoryApp, size: number): Node {
	const src = app.icon ? iconSrc(app.icon) : null;
	return h(
		'div',
		{
			display: 'flex',
			alignItems: 'center',
			justifyContent: 'center',
			width: size,
			height: size,
			borderRadius: size * 0.25,
			backgroundImage: `linear-gradient(160deg, ${app.color[0]}, ${app.color[1]})`,
			color: '#fff',
			fontSize: size * 0.5,
			fontWeight: 800,
		},
		src
			? h('img', { width: size * 0.55, height: size * 0.55 }, undefined, { src, width: size * 0.55, height: size * 0.55 })
			: app.label.charAt(0).toUpperCase(),
	);
}

/** 바탕: 남색 + 위쪽 핑크 / 보라 빛 + 맨 아래 네온 줄 */
function frame(children: Node[]): Node {
	return h(
		'div',
		{
			position: 'relative',
			display: 'flex',
			flexDirection: 'column',
			width: OG_WIDTH,
			height: OG_HEIGHT,
			// satori 기본값은 content-box 라 여백이 크기 바깥에 더해짐 → 카드가 1200×630 보다 커져서 아래가 잘림
			boxSizing: 'border-box',
			padding: '64px 80px 72px',
			backgroundColor: C.bg,
			backgroundImage: `radial-gradient(circle at 8% 0%, rgba(255, 92, 168, 0.32), transparent 50%), radial-gradient(circle at 92% 0%, rgba(188, 108, 255, 0.32), transparent 50%)`,
			color: C.text,
		},
		[
			...children,
			h('div', {
				position: 'absolute',
				left: 0,
				right: 0,
				bottom: 0,
				height: 10,
				backgroundImage: `linear-gradient(90deg, ${C.pink}, ${C.purple}, ${C.cyan})`,
			}),
		],
	);
}

const gradientText = {
	backgroundImage: `linear-gradient(90deg, ${C.pink}, ${C.purple})`,
	backgroundClip: 'text',
	color: 'transparent',
};

async function render(node: Node) {
	const fonts = await getFonts();
	(node.props.style as Record<string, unknown>).fontFamily = [...new Set(fonts.map((f) => `'${f.name}'`))].join(', ');
	const svg = await satori(node as never, { width: OG_WIDTH, height: OG_HEIGHT, fonts });
	return sharp(Buffer.from(svg)).png().toBuffer();
}

/** 글 미리보기: 카테고리 아이콘 + 이름 / 제목 / 한 줄 요약 / 사이트 주소, 날짜 */
export function postOgImage(post: { title: string; description?: string; date: Date; app?: CategoryApp }) {
	const { title, description, date, app } = post;
	const dateText = date.toISOString().slice(0, 10);
	// 제목이 길면 글자를 줄임 (최대 3줄)
	const titleSize = title.length > 40 ? 56 : title.length > 22 ? 64 : 76;

	const node = frame([
		h(
			'div',
			{ display: 'flex', alignItems: 'center', gap: 22 },
			app ? [appIcon(app, 72), h('div', { fontSize: 34, fontWeight: 500 }, app.label)] : [],
		),
		h(
			'div',
			{ display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', gap: 22 },
			[
				h(
					'div',
					{ display: 'block', wordBreak: 'keep-all', fontSize: titleSize, fontWeight: 800, lineHeight: 1.25, lineClamp: 3, ...gradientText },
					title,
				),
				description
					? h('div', { display: 'block', wordBreak: 'keep-all', fontSize: 30, fontWeight: 500, lineHeight: 1.45, color: C.muted, lineClamp: 2 }, description)
					: null,
			].filter(Boolean),
		),
		h('div', { display: 'flex', justifyContent: 'space-between', fontSize: 28, fontWeight: 500 }, [
			h('div', { color: C.cyan }, SITE_HOST),
			h('div', { color: C.muted }, dateText),
		]),
	]);
	return render(node);
}

/** 글이 아닌 페이지(홈, 카테고리, 태그, 검색, About)의 미리보기 */
export function defaultOgImage() {
	const node = frame([
		h('div', { display: 'flex', flexDirection: 'column', flexGrow: 1, justifyContent: 'center', gap: 20 }, [
			h('div', { display: 'block', fontSize: 140, fontWeight: 800, lineHeight: 1.1, ...gradientText }, SITE_TITLE),
			h('div', { fontSize: 40, fontWeight: 500, color: C.muted }, SITE_DESCRIPTION),
		]),
		h('div', { display: 'flex', fontSize: 28, fontWeight: 500, color: C.cyan }, SITE_HOST),
	]);
	return render(node);
}
