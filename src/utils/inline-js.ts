/**
 * <script is:inline> 에 넣을 코드에서 주석을 뺌 (사이트 HTML 에 설명 주석이 실려 나가지 않게).
 * 원본은 src/scripts/*.inline.js 에 주석과 함께 두고, ?raw 로 불러와서 이걸 거쳐 넣음:
 *   <script is:inline set:html={inlineJs(code)}></script>
 *
 * 줄 전체가 주석인 것만 뺌 (// 한 줄, /* … *\/ 여러 줄). 코드 뒤에 붙은 주석은 못 빼니까 원본에서 따로 줄에 쓸 것
 * (문자열 안의 '//' 같은 걸 잘못 지우지 않으려고 일부러 단순하게 함)
 */
export function inlineJs(code: string) {
	return code
		.replace(/^[ \t]*\/\*[\s\S]*?\*\/[ \t]*$/gm, '')
		.replace(/^[ \t]*\/\/.*$/gm, '')
		.replace(/\n[ \t]*(?=\n)/g, '')
		.trim();
}

/** 값을 인라인 스크립트에 넣을 JS 리터럴로 ('</script>' 로 스크립트가 끊기지 않게 < 를 이스케이프) */
export function toJs(value: unknown) {
	return JSON.stringify(value).replace(/</g, '\u003c');
}
