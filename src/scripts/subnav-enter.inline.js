// 카테고리 목록 줄(Base.astro 의 .subnav)을 다른 곳에서 들어왔을 때만 펼치는 애니메이션으로 보여줌.
// 카테고리 하위 페이지끼리 이동할 때(이미 펼쳐져 있던 상태)는 그냥 보여줌. 주석을 빼고 인라인으로 들어감
(function () {
	var nav = document.currentScript && document.currentScript.previousElementSibling;
	if (!nav || !nav.classList.contains('subnav')) return;
	var from = '';
	try {
		var ref = new URL(document.referrer);
		if (ref.origin === location.origin) from = ref.pathname;
	} catch (e) {}
	if (!/^\/blog\/[^/]+\//.test(from)) nav.classList.add('enter');
})();
