// 홈 화면 랜덤 글 위젯: 들어올 때마다 글 하나를 무작위로 골라 채움, 🔀 버튼을 누르면 다시 고름
// 위젯 바로 뒤에서 실행돼서 화면이 그려지기 전에 바뀜 (깜빡임 없음). posts = [[주소, 제목, 날짜], …] (RandomWidget.astro 가 넣어줌)
(function () {
	var box = document.currentScript.previousElementSibling;
	var link = box.querySelector('.link');
	var title = box.querySelector('.title');
	var date = box.querySelector('time');
	var last = -1;
	function pick() {
		if (posts.length === 0) return;
		var i;
		do i = Math.floor(Math.random() * posts.length);
		while (posts.length > 1 && i === last);
		last = i;
		link.href = posts[i][0];
		link.setAttribute('aria-label', '랜덤 글: ' + posts[i][1]);
		title.textContent = posts[i][1];
		date.textContent = posts[i][2];
		date.dateTime = posts[i][2];
	}
	pick();
	box.querySelector('.shuffle').addEventListener('click', pick);
})();
