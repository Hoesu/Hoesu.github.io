// 검색 페이지: Pagefind 검색 UI 불러오기 (search.astro 에 주석을 빼고 인라인으로 들어감)
(function () {
	const s = document.createElement('script');
	s.src = '/pagefind/pagefind-ui.js';
	s.onload = function () {
		const ui = new PagefindUI({
			element: '#search',
			showSubResults: true,
			showImages: false,
			resetStyles: false,
			autofocus: true,
		});
		// /search/?q=bfs 처럼 주소로 바로 검색
		const q = new URLSearchParams(location.search).get('q');
		if (q) ui.triggerSearch(q);
	};
	// npm run dev 에서는 인덱스가 없으니 안내만 표시
	s.onerror = function () {
		document.querySelector('.dev-note').hidden = false;
	};
	document.head.appendChild(s);
})();
