/**
 * 홈 화면 앱 열기 / 닫기 애니메이션 (아이폰 느낌)
 *
 * 1) View Transitions 지원 브라우저 (Chrome, Edge, 최신 Safari)
 *    누른 아이콘에 'app-window' 이름표만 붙이고 이동은 그대로 둠.
 *    브라우저가 [아이콘 → 새 페이지 화면]을 이어서 애니메이션함 (새 페이지가 아이콘에서 커져 나옴)
 *    나머지 처리: BaseHead.astro 인라인 스크립트(pageswap / pagereveal) + global.css(::view-transition-*)
 *
 * 2) 미지원 브라우저 (Firefox 등): 아래 JS 대체 애니메이션
 *    열기: 아이콘 모양 상자가 화면 전체로 커지며 배경색으로 바뀜 → 페이지 이동 → 새 페이지 페이드인
 *    닫기: 홈으로 돌아오면 화면 전체 상자가 아까 연 아이콘 자리로 줄어듦
 *    성능: 상자는 처음부터 화면 전체 크기로 두고 clip-path 로 보이는 영역만 바꿈 (레이아웃 계산 없음).
 *          아이콘 그림은 transform / opacity 만 바꿈
 */

const OPEN_MS = 420; // JS 대체 애니메이션 길이 (View Transitions 쪽 길이는 global.css 의 --app-open / --app-close)
const CLOSE_MS = 360;
// global.css 의 --spring 과 같은 곡선
const SPRING =
	'linear(0, 0.0063, 0.0251, 0.0562 3.3%, 0.1531 5.9%, 0.4155 11.1%, 0.6183 15.3%, 0.7649 19.2%, 0.8738 23.2%, 0.9442 27.3%, 0.9818 31.5%, 1.0055 36.4%, 1.0143 42%, 1.0125 50%, 1.0035 65%, 1)';
const EASE = CSS.supports('animation-timing-function', 'linear(0, 1)') ? SPRING : 'cubic-bezier(0.32, 0.72, 0.2, 1)';
const supportsViewTransitions = 'CSSViewTransitionRule' in window;
const RADIUS = '15px'; // AppIcon 의 border-radius 와 같게

// sessionStorage 키. BaseHead.astro 인라인 스크립트도 같은 이름을 씀
const KEY_ENTER = 'app-enter'; // 다음 페이지에서 페이드인 하라는 표시
const KEY_LAST = 'app-last'; // 마지막으로 연 앱 (닫기 애니메이션 대상)
const KEY_VT_MODE = 'vt-mode'; // View Transitions 전환 종류 (open / close)

/** BaseHead 의 pagereveal 이 View Transitions 로 닫기를 끝냈다는 표시 */
const appWindow = window as Window & { __appVtClose?: boolean };

const reduceMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches;
/** JS 애니메이션을 돌려도 되는지 (동작 줄이기 설정이 아니고, animate() 를 지원) */
const canAnimate = () => !reduceMotion() && 'animate' in Element.prototype;

function store(key: string, value?: string) {
	try {
		if (value === undefined) {
			const v = sessionStorage.getItem(key);
			sessionStorage.removeItem(key);
			return v;
		}
		sessionStorage.setItem(key, value);
	} catch {
		// 시크릿 모드 등에서 저장소를 못 쓰면 애니메이션만 생략
	}
	return null;
}

function pageBg() {
	return getComputedStyle(document.documentElement).getPropertyValue('--bg').trim() || '#0b0f2b';
}

/** 아이콘 자리만 보이게 자르는 clip-path (상자 자체는 화면 전체 크기) */
function iconClip(r: DOMRect) {
	const vw = document.documentElement.clientWidth;
	const vh = document.documentElement.clientHeight;
	return `inset(${r.top}px ${vw - r.right}px ${vh - r.bottom}px ${r.left}px round ${RADIUS})`;
}
const FULL_CLIP = 'inset(0px 0px 0px 0px round 0px)';

function removeOverlay() {
	document.querySelectorAll('.app-zoom').forEach((el) => el.remove());
}

/**
 * 아이콘을 덮는 상자 (아이콘 그라데이션 + 그 위에 배경색 레이어) + 아이콘 그림.
 * 상자는 화면 전체 크기로 고정하고 clip-path 만 바꾸므로 애니메이션 중 레이아웃 계산이 없음
 */
function createOverlay(iconEl: HTMLElement) {
	removeOverlay();
	const r = iconEl.getBoundingClientRect();

	const overlay = document.createElement('div');
	overlay.className = 'app-zoom';
	overlay.setAttribute('aria-hidden', 'true');
	Object.assign(overlay.style, {
		position: 'fixed',
		inset: '0',
		zIndex: '1000',
		pointerEvents: 'none',
		backgroundImage: getComputedStyle(iconEl).backgroundImage,
		willChange: 'clip-path',
	});
	const shade = document.createElement('div');
	Object.assign(shade.style, { position: 'absolute', inset: '0', background: pageBg(), opacity: '0' });
	overlay.appendChild(shade);

	// 아이콘 그림: 아이콘 자리에 따로 띄우고 transform / opacity 만 바꿈
	const glyph = document.createElement('div');
	glyph.className = 'app-zoom';
	glyph.setAttribute('aria-hidden', 'true');
	Object.assign(glyph.style, {
		position: 'fixed',
		left: `${r.left}px`,
		top: `${r.top}px`,
		width: `${r.width}px`,
		height: `${r.height}px`,
		zIndex: '1001',
		pointerEvents: 'none',
		display: 'grid',
		placeItems: 'center',
		willChange: 'transform, opacity',
	});
	const art = iconEl.querySelector('svg, .letter');
	if (art) glyph.appendChild(art.cloneNode(true));

	document.body.append(overlay, glyph);
	return { overlay, glyph, shade, clip: iconClip(r) };
}

function openApp(link: HTMLAnchorElement) {
	const iconEl = link.querySelector<HTMLElement>('.icon');
	if (!iconEl || !canAnimate()) {
		location.href = link.href;
		return;
	}

	const { overlay, glyph, shade, clip } = createOverlay(iconEl);
	overlay.style.clipPath = clip;

	const grow = overlay.animate([{ clipPath: clip }, { clipPath: FULL_CLIP }], {
		duration: OPEN_MS,
		easing: EASE,
		fill: 'forwards',
	});
	glyph.animate(
		[
			{ opacity: 1, transform: 'scale(1)' },
			{ opacity: 0, transform: 'scale(1.8)' },
		],
		{ duration: OPEN_MS * 0.35, easing: 'ease-out', fill: 'forwards' },
	);
	shade.animate([{ opacity: 0 }, { opacity: 1 }], {
		duration: OPEN_MS * 0.55,
		delay: OPEN_MS * 0.15,
		easing: 'ease-out',
		fill: 'forwards',
	});
	// 뒤에 있는 홈 화면은 살짝 커지면서 흐려짐
	document.querySelector('.screen')?.animate([{ transform: 'scale(1)' }, { transform: 'scale(1.06)', opacity: 0.6 }], {
		duration: OPEN_MS,
		easing: EASE,
		fill: 'forwards',
	});

	store(KEY_ENTER, '1');
	store(KEY_LAST, new URL(link.href).pathname);

	let gone = false;
	const go = () => {
		if (gone) return;
		gone = true;
		location.href = link.href;
	};
	grow.finished.then(go, go);
	setTimeout(go, OPEN_MS + 200); // 혹시 finished 가 안 오면
}

function clearIconNames() {
	document.querySelectorAll<HTMLElement>('a.app .icon').forEach((i) => (i.style.viewTransitionName = ''));
}

/** 앱을 여는 중인지. 이 사이에 늦게 도는 closeApp 이 방금 붙인 이름표를 지우면 안 됨 */
let opening = false;

/**
 * View Transitions 경로: "앱 여는 중" 표시만 남기고 브라우저 기본 이동에 맡김.
 * 아이콘 이름표는 BaseHead 의 pageswap(화면을 찍기 직전)에서 붙임
 */
function openWithViewTransition(link: HTMLAnchorElement) {
	opening = true;
	clearIconNames();
	try {
		sessionStorage.setItem(KEY_VT_MODE, 'open');
		sessionStorage.setItem(KEY_LAST, new URL(link.href).pathname);
	} catch {
		// 저장소를 못 쓰면 전환 없이 그냥 이동
	}
}

function closeApp() {
	if (opening) return;
	clearIconNames();
	const vtClosed = appWindow.__appVtClose;
	appWindow.__appVtClose = false;
	const last = store(KEY_LAST);
	// 뒤로 가기(bfcache)면 열 때 쓴 상자 / 홈 화면 애니메이션이 그대로 남아 있음 → 먼저 정리
	removeOverlay();
	resetScreen();

	// JS 애니메이션을 안 돌리는 경우
	// - View Transitions 가 이미 닫기 애니메이션을 함 (BaseHead 의 pagereveal)
	// - View Transitions 브라우저인데 전환이 안 일어남 (예: 브라우저 뒤로 가기 버튼).
	//   늦게 JS 애니메이션을 돌리면 홈이 한 번 보였다가 덮여서 깜빡이므로 그냥 홈을 보여줌
	// - 닫을 앱이 없음, 동작 줄이기 설정, animate() 미지원
	if (vtClosed || supportsViewTransitions || !last || !canAnimate()) return;

	const link = [...document.querySelectorAll<HTMLAnchorElement>('a.app')].find(
		(a) => new URL(a.href, location.href).pathname === last,
	);
	const iconEl = link?.querySelector<HTMLElement>('.icon');
	if (!iconEl) return;

	const { overlay, glyph, shade, clip } = createOverlay(iconEl);
	shade.style.opacity = '1';
	glyph.style.opacity = '0';
	overlay.style.clipPath = FULL_CLIP;

	const shrink = overlay.animate([{ clipPath: FULL_CLIP }, { clipPath: clip }], {
		duration: CLOSE_MS,
		easing: EASE,
		fill: 'forwards',
	});
	shade.animate([{ opacity: 1 }, { opacity: 0 }], { duration: CLOSE_MS * 0.6, easing: 'ease-in', fill: 'forwards' });
	// 줄어드는 끝무렵에 아이콘 그림이 다시 나타남
	glyph.animate(
		[
			{ opacity: 0, transform: 'scale(1.8)' },
			{ opacity: 1, transform: 'scale(1)' },
		],
		{ duration: CLOSE_MS * 0.4, delay: CLOSE_MS * 0.6, easing: 'ease-out', fill: 'forwards' },
	);
	document.querySelector('.screen')?.animate([{ transform: 'scale(1.06)', opacity: 0.6 }, { transform: 'scale(1)', opacity: 1 }], {
		duration: CLOSE_MS,
		easing: EASE,
	});
	shrink.finished.then(removeOverlay, removeOverlay);
}

/** 열 때 걸어둔 홈 화면 애니메이션(커짐, 흐려짐) 원상 복구 */
function resetScreen() {
	document
		.querySelector('.screen')
		?.getAnimations()
		.forEach((a) => a.cancel());
}

/**
 * 앱 페이지 미리 받기: 누르자마자 열리게.
 * - 페이지 로딩이 끝나고 브라우저가 한가할 때 시작 (첫 화면 로딩을 방해하지 않음)
 * - 데이터 절약 모드(Save-Data)면 안 함
 * - rel="prefetch" 는 HTML만 받고 스크립트는 실행 안 함 → 방문 통계에 안 잡힘
 */
function prefetchApps() {
	const conn = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection;
	if (conn?.saveData) return;
	const run = () => {
		const seen = new Set<string>();
		document.querySelectorAll<HTMLAnchorElement>('a.app:not([target="_blank"])').forEach((a) => {
			// 사이트 안 페이지만 (mailto: 같은 링크 제외)
			if (a.origin !== location.origin || seen.has(a.href)) return;
			seen.add(a.href);
			const link = document.createElement('link');
			link.rel = 'prefetch';
			link.href = a.href;
			document.head.appendChild(link);
		});
	};
	const idle = () => ('requestIdleCallback' in window ? requestIdleCallback(run, { timeout: 2000 }) : setTimeout(run, 300));
	if (document.readyState === 'complete') idle();
	else window.addEventListener('load', idle, { once: true });
}

export function setupAppAnimations() {
	prefetchApps();

	document.addEventListener('click', (e) => {
		const link = (e.target as Element).closest<HTMLAnchorElement>('a.app');
		if (!link || link.target === '_blank') return;
		// 사이트 밖 링크(mailto: 등)는 애니메이션 없이 그대로
		if (link.origin !== location.origin) return;
		// 새 탭 열기(Ctrl/Cmd/Shift 클릭, 가운데 버튼)는 그대로 둠
		if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
		if (reduceMotion()) return; // 동작 줄이기: 그냥 이동
		if (supportsViewTransitions) {
			openWithViewTransition(link); // preventDefault 안 함: 브라우저가 이동 + 전환
			return;
		}
		e.preventDefault();
		openApp(link);
	});

	// 첫 로드, 뒤로 가기(bfcache 복원) 둘 다 pageshow 가 옴.
	// View Transitions 브라우저에서는 pagereveal 이 먼저 처리할 수 있게 한 프레임 뒤에 확인
	window.addEventListener('pageshow', (e) => {
		if (e.persisted) opening = false; // 뒤로 가기로 홈에 돌아옴: 여는 중 아님
		if (supportsViewTransitions) requestAnimationFrame(() => requestAnimationFrame(closeApp));
		else closeApp();
	});
}
