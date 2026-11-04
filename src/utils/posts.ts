import { getCollection } from 'astro:content';

/** 공개된 글을 최신순으로 반환 (dev 서버에서는 draft도 보임) */
export async function getPosts() {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}
