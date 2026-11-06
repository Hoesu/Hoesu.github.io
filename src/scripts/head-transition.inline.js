/*
 * 홈 화면 앱 열기 / 닫기 전환 (src/scripts/app-animation.ts 와 한 세트, 스타일은 global.css)
 * - View Transitions 지원 브라우저: pageswap(떠나는 페이지) / pagereveal(도착한 페이지)에서
 * 'app-window' 라는 이름을 아이콘 ↔ 페이지 전체에 붙여서 브라우저가 둘을 이어 애니메이션함
 * - 홈 앱 열기 / 닫기가 아닌 이동은 전환을 건너뜀 (다른 페이지 이동은 지금처럼 즉시)
 * - 미지원 브라우저: 앱 열고 들어온 페이지만 페이드인 (app-enter)
 * 첫 화면이 그려지기 전에 등록돼야 해서 <head> 인라인 스크립트로 둠
 *
 * 빌드할 때 주석을 빼고 <head> 에 그대로 넣음 (BaseHead.astro, src/utils/inline-js.ts)
 */
(function () {
	var ss;
	try {
		ss = sessionStorage;
	} catch (e) {
		return;
	}
	var html = document.documentElement;
	var reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

	if (ss.getItem('app-enter')) {
		ss.removeItem('app-enter');
		if (!reduce) html.classList.add('app-enter');
	}

	/**
	 * 이 주소가 속한 홈 앱 (닫을 때 줄어들 아이콘): 앱 주소 중 가장 길게 겹치는 것.
	 * /blog/algorithm/글/ → Algorithm, /blog/ → Categories, /tags/x/ → Tags. 없으면 null
	 * app-animation.ts(JS 대체 애니메이션)도 이 함수를 씀
	 */
	function appFor(path) {
		var best = null;
		var len = 0;
		document.querySelectorAll('a.app').forEach(function (a) {
			var href = a.getAttribute('href') || '';
			if (href.charAt(0) === '/' && href !== '/' && path.indexOf(href) === 0 && href.length > len) {
				best = a;
				len = href.length;
			}
		});
		return best;
	}
	window.__appFor = appFor;

	/** 남아 있는 이름표 정리. 뒤로 가기로 돌아온 홈에는 열 때 붙인 이름표가 남아 있고,
	    같은 이름이 두 개면 브라우저가 전환을 통째로 취소함 */
	function clearNames() {
		html.style.viewTransitionName = '';
		document.querySelectorAll('a.app .icon, a.app .badge').forEach(function (i) {
			i.style.viewTransitionName = '';
		});
	}

	/** 아이콘(+ 배지)에 이름표. 배지는 따로 떼어서 맨 위에 그림 (열 때 바로 사라지고, 닫을 때 끝무렵 나타남) */
	function nameApp(link) {
		link.querySelector('.icon').style.viewTransitionName = 'app-window';
		var badge = link.querySelector('.badge');
		if (badge) badge.style.viewTransitionName = 'app-badge';
	}

	// 가장 최근에 본 (홈이 아닌) 페이지 주소 = 홈으로 돌아올 때 떠나온 페이지 → 어느 앱으로 줄어들지 정함.
	// 떠날 때(pagehide)가 아니라 보일 때 기록: 뒤로 가기에선 브라우저에 따라
	// 돌아온 홈이 먼저 나타나고 떠나는 페이지의 pagehide 가 나중에 와서 늦음
	window.addEventListener('pageshow', function () {
		if (location.pathname !== '/') ss.setItem('app-from', location.pathname);
	});

	window.addEventListener('pageswap', function (e) {
		var vt = e.viewTransition;
		if (!vt) return;
		var dest = e.activation && e.activation.entry && e.activation.entry.url;
		var destPath = dest && new URL(dest).pathname;
		if (ss.getItem('vt-mode') === 'open') {
			// 홈에서 아이콘을 눌러 여는 중: 화면을 찍기 직전인 지금 그 아이콘에 이름표를 붙임
			var link = destPath && document.querySelector('a.app[href="' + destPath + '"]');
			if (link) {
				clearNames();
				nameApp(link);
			} else {
				ss.removeItem('vt-mode');
				vt.skipTransition();
			}
			return;
		}
		// 홈으로 가는 중 (Home 메뉴, 뒤로 가기 둘 다): 지금 페이지 전체가 아이콘으로 줄어듦.
		// 줄어들 아이콘이 없으면 도착한 홈의 pagereveal 에서 전환을 취소함
		if (!reduce && destPath === '/' && location.pathname !== '/') {
			html.style.viewTransitionName = 'app-window';
			ss.setItem('vt-mode', 'close');
			return;
		}
		vt.skipTransition();
	});

	window.addEventListener('pagereveal', function (e) {
		var vt = e.viewTransition;
		var mode = ss.getItem('vt-mode');
		// 전환이 일어났든 안 났든 표시는 여기서 끝 (남으면 다음 이동이 꼬임)
		ss.removeItem('vt-mode');
		clearNames();
		if (!vt) return;
		if (!mode || reduce) {
			vt.skipTransition();
			return;
		}
		if (mode === 'close') {
			var from = ss.getItem('app-from');
			var link = from && appFor(from);
			if (!link) {
				vt.skipTransition();
				return;
			}
			nameApp(link);
		}
		html.classList.add('vt-' + mode);
		vt.finished.finally(function () {
			html.classList.remove('vt-' + mode);
			clearNames();
		});
	});
})();
