/**
 * 소제목 링크: 글 속 ## / ### 제목에 마우스를 올리면 오른쪽에 🔗 버튼이 뜨고, 누르면 그 위치 주소가 복사됨
 * (주소 끝에 #제목 이 붙어서, 받은 사람은 바로 그 부분으로 이동). 폰에서는 버튼이 항상 흐리게 보임
 * 복사하면 화면 아래에 "링크를 복사했어요" 알림이 잠깐 뜸
 * 빌드한 HTML 에는 없고 브라우저에서 붙임 → 검색(Pagefind) 내용에 안 섞임
 */
const ICON =
	'<svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>';

let toastTimer: ReturnType<typeof setTimeout> | undefined;
/** 화면 아래 가운데에 잠깐 뜨는 알림 */
function toast(text: string) {
	let el = document.querySelector<HTMLElement>('.toast');
	if (!el) {
		el = document.createElement('div');
		el.className = 'toast';
		el.setAttribute('role', 'status');
		document.body.append(el);
	}
	el.textContent = text;
	requestAnimationFrame(() => el.classList.add('show'));
	clearTimeout(toastTimer);
	toastTimer = setTimeout(() => el.classList.remove('show'), 1600);
}

export function setupHeadingLinks() {
	for (const h of document.querySelectorAll<HTMLHeadingElement>('article h2[id], article h3[id]')) {
		const btn = document.createElement('button');
		btn.type = 'button';
		btn.className = 'heading-link';
		btn.setAttribute('aria-label', `"${h.textContent?.trim()}" 위치 주소 복사`);
		btn.innerHTML = ICON;
		btn.addEventListener('click', async () => {
			const url = `${location.origin}${location.pathname}#${encodeURIComponent(h.id)}`;
			history.replaceState(null, '', `#${encodeURIComponent(h.id)}`);
			try {
				await navigator.clipboard.writeText(url);
				toast('링크를 복사했어요');
			} catch {
				// 복사가 막힌 브라우저: 주소창에는 들어갔으니 거기서 복사하면 됨
				toast('주소창의 링크를 복사해 주세요');
			}
		});
		h.append(btn);
	}
}
