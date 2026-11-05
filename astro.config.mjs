// @ts-check
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import expressiveCode from 'astro-expressive-code';
import icon from 'astro-icon';
import { defineConfig } from 'astro/config';

// https://astro.build/config
export default defineConfig({
	site: 'https://hoesu.github.io',
	// expressiveCode는 mdx보다 앞에 있어야 함. 코드 블록 설정은 ec.config.mjs
	integrations: [expressiveCode(), mdx(), sitemap(), icon()],
});
