// 404 페이지: 요청한 주소 보여주기 + 주소가 비슷한 글 추천.
// posts([주소, 제목] 목록)는 404.astro 가 이 코드 앞에 넣어줌. 주석을 빼고 인라인으로 들어감
(function () {
	// 요청한 주소 보여주기
	var path = decodeURIComponent(location.pathname);
	var box = document.querySelector('.not-found .info');
	box.querySelector('.req').textContent = path;
	box.hidden = false;

	// 주소 마지막 부분이 비슷한 글 하나 추천 (/blog/algorithm/2d-tetri/ → 2차원 테트리스)
	var slug = function (u) {
		return (u.split('/').filter(Boolean).pop() || '').toLowerCase().replace(/\.html?$/, '');
	};
	// 편집 거리: 한 글자 바꾸기 / 넣기 / 빼기를 몇 번 해야 같아지는지
	var dist = function (a, b) {
		var row = [];
		for (var j = 0; j <= b.length; j++) row[j] = j;
		for (var i = 1; i <= a.length; i++) {
			var prev = row[0];
			row[0] = i;
			for (var j = 1; j <= b.length; j++) {
				var tmp = row[j];
				row[j] = Math.min(row[j] + 1, row[j - 1] + 1, prev + (a[i - 1] === b[j - 1] ? 0 : 1));
				prev = tmp;
			}
		}
		return row[b.length];
	};
	var want = slug(path);
	if (want.length < 3) return;
	var best = null;
	var bestScore = Infinity;
	posts.forEach(function (p) {
		var have = slug(p[0]);
		// 앞부분만 친 경우(2d-tet)는 가깝게 침
		var score = have.indexOf(want) === 0 ? (have.length - want.length) * 0.2 : dist(want, have);
		if (score < bestScore) {
			best = p;
			bestScore = score;
		}
	});
	// 너무 다르면 추천 안 함 (주소 길이의 40% 이상 바꿔야 하면)
	if (!best || bestScore > Math.max(2, slug(best[0]).length * 0.4)) return;
	var sug = document.querySelector('.not-found .suggest');
	var a = sug.querySelector('a');
	a.href = best[0];
	a.textContent = best[1];
	sug.hidden = false;
})();
