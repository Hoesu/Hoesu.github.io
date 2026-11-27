// 검색 페이지 (search.astro 에 주석을 빼고 인라인으로 들어감)
// Pagefind 의 기본 화면(pagefind-ui) 대신 검색 기능(pagefind.js)만 쓰고 결과는 직접 그림:
// 검색창 + 글 목록 모양의 결과 10개씩 + 더 보기
(function () {
	var root = document.getElementById('search');
	var input = document.getElementById('search-input');
	var clearBtn = document.getElementById('search-clear');
	var status = document.getElementById('search-status');
	var list = document.getElementById('search-results');
	var more = document.getElementById('search-more');
	var labels = JSON.parse(root.dataset.labels || '{}');
	var PAGE = 10;

	var pagefind = null;
	var results = [];
	var shown = 0;
	// 검색할 때마다 1씩 늘림. 늦게 도착한 예전 검색 결과는 그리지 않음
	var seq = 0;

	function el(tag, cls, text) {
		var e = document.createElement(tag);
		if (cls) e.className = cls;
		if (text) e.textContent = text;
		return e;
	}

	function row(data) {
		var li = el('li');
		var a = el('a');
		a.href = data.url;
		var title = el('span', 'sr-title');
		var cat = data.filters && data.filters.category && data.filters.category[0];
		if (cat) title.appendChild(el('span', 'sr-category', labels[cat] || cat));
		title.appendChild(document.createTextNode((data.meta && data.meta.title) || data.url));
		a.appendChild(title);
		// 본문 일부: pagefind 가 글자를 이스케이프하고 찾은 낱말만 <mark> 로 감싸서 줌
		var excerpt = el('p', 'sr-excerpt');
		excerpt.innerHTML = data.excerpt;
		a.appendChild(excerpt);
		var tags = (data.filters && data.filters.tag) || [];
		if (tags.length) {
			a.appendChild(
				el(
					'p',
					'sr-tags',
					tags
						.map(function (t) {
							return '#' + t;
						})
						.join(' '),
				),
			);
		}
		li.appendChild(a);
		return li;
	}

	/** 다음 10개를 불러와서 목록 끝에 붙임 */
	function showMore(mySeq) {
		var batch = results.slice(shown, shown + PAGE);
		shown += batch.length;
		more.hidden = true;
		return Promise.all(
			batch.map(function (r) {
				return r.data();
			}),
		).then(function (items) {
			if (mySeq !== seq) return;
			items.forEach(function (d) {
				list.appendChild(row(d));
			});
			more.hidden = shown >= results.length;
		});
	}

	/** 주소의 ?q= 를 지금 검색어로 (새로고침, 공유해도 같은 결과) */
	function syncUrl(q) {
		var url = new URL(location.href);
		if (q) url.searchParams.set('q', q);
		else url.searchParams.delete('q');
		history.replaceState(history.state, '', url);
	}

	function search() {
		var q = input.value.trim();
		var mySeq = ++seq;
		clearBtn.hidden = !input.value;
		syncUrl(q);
		if (!q) {
			results = [];
			list.textContent = '';
			more.hidden = true;
			status.textContent = '';
			return;
		}
		if (!pagefind) return;
		// 빠르게 치는 동안은 기다렸다가 마지막 글자 기준으로 한 번만 (중간 검색은 null)
		pagefind.debouncedSearch(q, {}, 150).then(function (res) {
			if (!res || mySeq !== seq) return;
			results = res.results;
			shown = 0;
			list.textContent = '';
			status.textContent = results.length
				? '‘' + q + '’ 검색 결과 ' + results.length + '개'
				: '‘' + q + '’에 맞는 글이 없음.';
			showMore(mySeq);
		});
	}

	input.addEventListener('input', search);
	input.addEventListener('keydown', function (e) {
		if (e.key === 'Escape' && input.value) {
			input.value = '';
			search();
		}
	});
	clearBtn.addEventListener('click', function () {
		input.value = '';
		search();
		input.focus();
	});
	more.addEventListener('click', function () {
		showMore(seq);
	});

	// /search/?q=bfs 처럼 주소로 바로 검색
	input.value = new URLSearchParams(location.search).get('q') || '';
	clearBtn.hidden = !input.value;

	import('/pagefind/pagefind.js').then(
		function (m) {
			pagefind = m;
			if (input.value.trim()) search();
		},
		// npm run dev 에서는 인덱스가 없으니 안내만 표시
		function () {
			document.querySelector('.dev-note').hidden = false;
		},
	);
})();
