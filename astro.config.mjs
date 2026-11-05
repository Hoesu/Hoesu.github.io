// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';
import { satteri } from '@astrojs/markdown-satteri';
import { mathPlugin } from './src/plugins/math.mjs';

// https://astro.build/config
export default defineConfig({
	site: 'https://hoesu.github.io',
	// expressiveCode는 mdx보다 앞에 있어야 함. 코드 블록 설정은 ec.config.mjs
	integrations: [expressiveCode(), mdx(), sitemap(), icon()],
	markdown: {
		// 수식: $인라인$, $$블록$$ 을 KaTeX로 변환 (src/plugins/math.mjs). 스타일은 글 페이지에서 불러옴
		processor: satteri({ features: { math: true }, mdastPlugins: [mathPlugin] }),
	},
});
