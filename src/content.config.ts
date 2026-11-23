import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import type { Loader } from 'astro/loaders';
import { z } from 'astro/zod';

// src/content/blog/ 안의 .md, .mdx 파일이 글이 됨
const files = glob({ base: './src/content/blog', pattern: '**/*.{md,mdx}' });

// 배포 빌드에서는 draft 글을 아예 빼버림: 글 페이지뿐 아니라 그 글에 넣은 사진 파일도 빌드 결과에 안 들어감
// (목록에서만 숨기면 사진 원본은 그대로 복사돼서 올라감). dev 서버(npm run dev)에서는 그대로 보임
const blogLoader: Loader = {
	name: 'blog-without-drafts',
	async load(context) {
		await files.load(context);
		if (!import.meta.env.PROD) return;
		for (const [id, entry] of context.store.entries()) {
			if (entry.data.draft) context.store.delete(id);
		}
	},
};

const blog = defineCollection({
	loader: blogLoader,
	schema: z.object({
		title: z.string(),
		description: z.string().optional(),
		pubDate: z.coerce.date(),
		updatedDate: z.coerce.date().optional(),
		tags: z.array(z.string()).default([]),
		// true면 내 컴퓨터(dev 서버)에서만 보이고 배포에서 빠짐 (사진 포함)
		draft: z.boolean().default(false),
	}),
});

export const collections = { blog };
