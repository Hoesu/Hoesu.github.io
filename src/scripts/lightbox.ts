/**
 * 글 속 사진 크게 보기: 사진을 누르면 제자리에서 화면 가운데로 커지고, 캡션도 아래에 같이 보여줌
 * 닫기: 오른쪽 위 X 버튼, 아무 데나 누르기, Esc, 스크롤. 닫을 때는 원래 자리로 줄어들며 돌아감
 *
 * - 모든 사진이 화면에 꽉 차게 커짐. 원본보다 작은 그림 / 움짤도 늘려서 보여줌 (원본보다 크게 늘리면 살짝 흐릿할 수 있음)
 * - 처음엔 화면에 떠 있는 사진을 그대로 키우고, 큰 사진(srcset 중 화면에 맞는 것)을 받으면 바꿔 끼움
 * - 움직임 줄이기 설정이면 애니메이션 없이 바로 열고 닫음
 */

/** 홈 화면 앱 열기 / 닫기와 같은 곡선 (global.css 의 --settle) */
const EASE = 'cubic-bezier(0.32, 0.72, 0, 1)';
const DURATION = 380;
/** 화면 가장자리 여백(px), 캡션 자리 */
const MARGIN = 24;
const CAPTION_SPACE = 56;

type Rect = { left: number; top: number; width: number; height: number };

const reduceMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;

/** 사진 원래 크기 (Astro 가 넣어준 width / height 속성 = 원본 크기) */
function originalSize(img: HTMLImageElement) {
	const w = Number(img.getAttribute('width')) || img.naturalWidth;
	const h = Number(img.getAttribute('height')) || img.naturalHeight;
	return { w, h };
}

/** 크게 보일 자리: 화면에 꽉 차게, 원본 비율 그대로 */
function targetRect(img: HTMLImageElement, hasCaption: boolean): Rect {
	const { w, h } = originalSize(img);
	const maxW = innerWidth - MARGIN * 2;
	const maxH = innerHeight - MARGIN * 2 - (hasCaption ? CAPTION_SPACE : 0);
	const scale = Math.min(maxW / w, maxH / h);
	const width = w * scale;
	const height = h * scale;
	return { left: (innerWidth - width) / 2, top: (innerHeight - height - (hasCaption ? CAPTION_SPACE : 0)) / 2, width, height };
}

/** to 자리에 있는 요소를 from 자리에 있는 것처럼 보이게 하는 transform */
function transformFrom(from: Rect, to: Rect) {
	const sx = from.width / to.width;
	const sy = from.height / to.height;
	return `translate(${from.left - to.left}px, ${from.top - to.top}px) scale(${sx}, ${sy})`;
}

function open(img: HTMLImageElement) {
	const caption = img.nextElementSibling?.classList.contains('img-caption') ? img.nextElementSibling.textContent : '';
	const from = img.getBoundingClientRect();
	const to = targetRect(img, !!caption);
	const animate = !reduceMotion();

	const overlay = document.createElement('div');
	overlay.className = 'lightbox';
	overlay.setAttribute('role', 'dialog');
	overlay.setAttribute('aria-modal', 'true');
	overlay.setAttribute('aria-label', img.alt || '사진 크게 보기');
	overlay.tabIndex = -1;

	const big = document.createElement('img');
	big.className = 'lightbox-img';
	big.alt = img.alt;
	big.src = img.currentSrc || img.src; // 이미 받아둔 사진으로 바로 띄움
	Object.assign(big.style, { left: `${to.left}px`, top: `${to.top}px`, width: `${to.width}px`, height: `${to.height}px` });
	overlay.append(big);

	// 오른쪽 위 닫기 버튼 (누르면 overlay 클릭으로 같이 닫힘)
	const x = document.createElement('button');
	x.type = 'button';
	x.className = 'lightbox-close';
	x.setAttribute('aria-label', '닫기');
	x.innerHTML =
		'<svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" aria-hidden="true"><path d="M18 6 6 18M6 6l12 12"/></svg>';
	overlay.append(x);

	let cap: HTMLParagraphElement | undefined;
	if (caption) {
		cap = document.createElement('p');
		cap.className = 'lightbox-caption';
		cap.textContent = caption;
		cap.style.top = `${to.top + to.height + 14}px`;
		overlay.append(cap);
	}

	// 화면에 맞는 큰 사진을 받아서 다 받으면 바꿔 끼움
	if (img.srcset) {
		const hi = new Image();
		hi.sizes = `${Math.ceil(to.width)}px`;
		hi.srcset = img.srcset;
		hi.decode().then(() => (big.src = hi.currentSrc), () => {});
	}

	document.body.append(overlay);
	// 원래 자리는 비워둠 (커지는 사진이 거기서 출발). 본문 캡션도 숨김 (확대창 캡션과 겹쳐 보여서)
	const pageCaption = caption ? (img.nextElementSibling as HTMLElement) : undefined;
	img.style.visibility = 'hidden';
	if (pageCaption) pageCaption.style.visibility = 'hidden';
	x.focus({ preventScroll: true });

	if (animate) {
		overlay.animate([{ backgroundColor: 'rgb(0 0 0 / 0)' }, {}], { duration: DURATION, easing: 'ease-out' });
		big.animate([{ transform: transformFrom(from, to) }, { transform: 'none' }], { duration: DURATION, easing: EASE });
		cap?.animate([{ opacity: 0 }, { opacity: 0 }, { opacity: 1 }], { duration: DURATION, easing: 'ease-out' });
		x.animate([{ opacity: 0 }, { opacity: 1 }], { duration: DURATION, easing: 'ease-out' });
	}

	let closing = false;
	const close = () => {
		if (closing) return;
		closing = true;
		removeEventListener('scroll', close);
		removeEventListener('keydown', onKey);
		const done = () => {
			overlay.remove();
			img.style.visibility = '';
			if (pageCaption) pageCaption.style.visibility = '';
			img.focus({ preventScroll: true });
		};
		if (!animate) return done();
		// 원래 자리가 화면 밖으로 나갔어도 그 자리로 줄어듦 (스크롤로 닫은 경우)
		const back = img.getBoundingClientRect();
		for (const el of [cap, x]) el?.animate([{ opacity: 1 }, { opacity: 0 }], { duration: DURATION / 3, fill: 'forwards' });
		overlay.animate([{}, { backgroundColor: 'rgb(0 0 0 / 0)' }], { duration: DURATION, easing: 'ease-in', fill: 'forwards' });
		big.animate([{ transform: 'none' }, { transform: transformFrom(back, to) }], { duration: DURATION, easing: EASE, fill: 'forwards' }).finished.then(done);
	};
	const onKey = (e: KeyboardEvent) => {
		if (e.key === 'Escape') close();
	};
	overlay.addEventListener('click', close);
	addEventListener('keydown', onKey);
	addEventListener('scroll', close, { passive: true });
}

export function setupLightbox() {
	const imgs = document.querySelectorAll<HTMLImageElement>('article img');
	for (const img of imgs) {
		if (img.closest('a')) continue; // 링크로 감싼 사진은 링크가 우선
		// 마우스는 돋보기 모양, 키보드는 Tab 으로 골라서 Enter
		img.classList.add('zoomable');
		img.tabIndex = 0;
		img.setAttribute('role', 'button');
		img.addEventListener('click', () => open(img));
		img.addEventListener('keydown', (e) => {
			if (e.key === 'Enter' || e.key === ' ') {
				e.preventDefault();
				open(img);
			}
		});
	}
}
