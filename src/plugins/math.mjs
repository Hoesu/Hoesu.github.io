// @ts-check
// 수식 플러그인: Sätteri(Astro 기본 마크다운 처리기)가 읽어낸 $...$ / $$...$$ 를 KaTeX HTML로 바꿈
// 변환은 빌드할 때 끝나서, 방문자 브라우저에서는 자바스크립트 없이 CSS(katex.min.css)만으로 보임
import { defineMdastPlugin } from 'satteri';
import katex from 'katex';

/** @param {string} tex @param {boolean} displayMode */
const render = (tex, displayMode) =>
	katex.renderToString(tex, {
		displayMode,
		// 수식에 오타가 있어도 빌드를 멈추지 않고, 그 부분만 빨간 글자로 보여줌
		throwOnError: false,
	});

export const mathPlugin = defineMdastPlugin({
	name: 'katex-math',
	math(node, ctx) {
		ctx.replaceNode(node, { type: 'html', value: render(node.value, true) });
	},
	inlineMath(node, ctx) {
		ctx.replaceNode(node, { type: 'html', value: render(node.value, false) });
	},
});
