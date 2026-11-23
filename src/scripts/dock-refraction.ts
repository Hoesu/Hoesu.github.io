/**
 * 홈 화면 독의 굴절 효과 (리퀴드 글래스): 유리 가장자리에서 뒤 배경이 렌즈처럼 안쪽으로 휘어 보임
 *
 * 원리: SVG 필터 feDisplacementMap 이 "지도" 이미지의 색을 보고 배경 픽셀을 옮김
 *   - 빨강(R) = 가로로 얼마나, 초록(G) = 세로로 얼마나. 128(중간)이면 그대로
 *   - 지도: 왼쪽 가장자리는 R 이 크고(오른쪽 = 안쪽 배경을 끌어옴), 오른쪽 가장자리는 R 이 작음. 위 / 아래는 G 로 같게
 *     가운데는 중간색(128, 128)으로 덮어서 안 휨. 그 경계를 흐리게 해서 가장자리로 갈수록 점점 많이 휨
 *   - 독 크기가 화면마다 달라서 지도를 실제 크기에 맞춰 그때그때 만듦
 *
 * Chrome 계열(Chrome, Edge, 삼성 인터넷 등)만 backdrop-filter 에 SVG 필터를 쓸 수 있음.
 * 나머지 브라우저는 그냥 유리 효과 (index.astro 의 .dock 스타일)
 */

/** 가장자리에서 휘는 띠의 두께(px), 휘는 세기(px) */
const EDGE = 18;
const STRENGTH = 36;

function isChromium() {
	const nav = navigator as Navigator & { userAgentData?: { brands?: { brand: string }[] } };
	return !!nav.userAgentData?.brands?.some((b) => b.brand === 'Chromium');
}

/** 독 크기(w × h, 모서리 r)에 맞춘 굴절 지도 (SVG data URI) */
function mapUrl(w: number, h: number, r: number) {
	const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}" viewBox="0 0 ${w} ${h}">
<defs>
<linearGradient id="x" x1="0" x2="1"><stop offset="0" stop-color="#f00"/><stop offset="1" stop-color="#000"/></linearGradient>
<linearGradient id="y" x1="0" x2="0" y1="0" y2="1"><stop offset="0" stop-color="#0f0"/><stop offset="1" stop-color="#000"/></linearGradient>
<filter id="b"><feGaussianBlur stdDeviation="${EDGE / 2}"/></filter>
</defs>
<rect width="${w}" height="${h}" fill="#000"/>
<rect width="${w}" height="${h}" fill="url(#x)"/>
<rect width="${w}" height="${h}" fill="url(#y)" style="mix-blend-mode:screen"/>
<rect x="${EDGE}" y="${EDGE}" width="${w - EDGE * 2}" height="${h - EDGE * 2}" rx="${Math.max(r - EDGE, 0)}" fill="rgb(128,128,0)" filter="url(#b)"/>
</svg>`;
	return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}

export function setupDockRefraction() {
	const dock = document.getElementById('home-dock');
	const map = document.getElementById('dock-refract-map');
	const displace = document.getElementById('dock-refract-displace');
	if (!dock || !map || !displace || !isChromium()) return;
	// 투명도 줄이기 설정이면 안 함
	if (matchMedia('(prefers-reduced-transparency: reduce)').matches) return;

	displace.setAttribute('scale', String(STRENGTH));
	const update = () => {
		const { width, height } = dock.getBoundingClientRect();
		const radius = parseFloat(getComputedStyle(dock).borderTopLeftRadius) || 0;
		const w = Math.round(width);
		const h = Math.round(height);
		map.setAttribute('width', String(w));
		map.setAttribute('height', String(h));
		map.setAttribute('href', mapUrl(w, h, radius));
	};
	update();
	new ResizeObserver(update).observe(dock);
	dock.classList.add('refract');
}
