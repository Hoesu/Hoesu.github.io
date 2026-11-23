// @ts-check
// 사진 캡션 플러그인: ![설명](./사진.png "캡션") 처럼 따옴표 안에 글을 쓰면 사진 아래에 작은 글씨로 보여줌
// 사진 바로 뒤에 <span class="img-caption">캡션</span> 을 붙이고, 마우스를 올리면 뜨는 말풍선(title)은 지움 (같은 글이 두 번 보이니까)
// 스타일은 global.css 의 .img-caption
import { defineMdastPlugin } from 'satteri';

/** @param {string} s */
const escape = (s) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

export const captionPlugin = defineMdastPlugin({
	name: 'image-caption',
	image(node, ctx) {
		const caption = node.title?.trim();
		if (!caption) return;
		ctx.insertAfter(node, { type: 'html', value: `<span class="img-caption">${escape(caption)}</span>` });
		ctx.setProperty(node, 'title', null);
	},
});
