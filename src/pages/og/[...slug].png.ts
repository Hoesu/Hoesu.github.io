// 글마다 링크 공유 미리보기 이미지: /og/<글 id>.png (그리는 코드는 src/utils/og.ts)
import type { APIRoute, GetStaticPaths } from 'astro';
import { categoryApp } from '../../utils/apps';
import { postOgImage } from '../../utils/og';
import { getCategory, getPosts, type Post } from '../../utils/posts';

export const getStaticPaths = (async () => {
	const posts = await getPosts();
	return posts.map((post) => ({ params: { slug: post.id }, props: { post } }));
}) satisfies GetStaticPaths;

export const GET: APIRoute = async ({ props }) => {
	const { post } = props as { post: Post };
	const category = getCategory(post);
	const png = await postOgImage({
		title: post.data.title,
		description: post.data.description,
		date: post.data.pubDate,
		app: category ? categoryApp(category) : undefined,
	});
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
