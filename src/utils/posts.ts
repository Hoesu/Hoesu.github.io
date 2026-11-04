import { type CollectionEntry, getCollection } from 'astro:content';

export type Post = CollectionEntry<'blog'>;

/** 공개된 글을 최신순으로 반환 (dev 서버에서는 draft도 보임) */
export async function getPosts() {
	const posts = await getCollection('blog', ({ data }) => import.meta.env.DEV || !data.draft);
	for (const post of posts) {
		if (post.id.split('/').length > 2) {
			throw new Error(
				`카테고리 폴더는 한 단계만 허용됨: "${post.id}" → src/content/blog/<카테고리>/<글>.md 형태로 옮겨주세요.`,
			);
		}
	}
	return posts.sort((a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf());
}

/** 글이 들어 있는 폴더 이름 = 카테고리. 최상위에 있는 글은 카테고리 없음 */
export function getCategory(post: Post): string | undefined {
	const parts = post.id.split('/');
	return parts.length > 1 ? parts[0] : undefined;
}

/** 카테고리별 글 목록 (글 많은 순) */
export function groupByCategory(posts: Post[]) {
	const map = new Map<string, Post[]>();
	for (const post of posts) {
		const category = getCategory(post);
		if (!category) continue;
		map.set(category, [...(map.get(category) ?? []), post]);
	}
	return [...map].sort((a, b) => b[1].length - a[1].length || a[0].localeCompare(b[0]));
}

/** 태그 → 주소용 문자열 (소문자, 공백은 -) */
export function tagSlug(tag: string) {
	return tag.trim().toLowerCase().replace(/\s+/g, '-');
}

/** 태그별 글 목록 (글 많은 순). 대소문자만 다른 태그는 하나로 합침 */
export function groupByTag(posts: Post[]) {
	const map = new Map<string, { name: string; posts: Post[] }>();
	for (const post of posts) {
		for (const tag of post.data.tags) {
			const slug = tagSlug(tag);
			const entry = map.get(slug) ?? { name: tag, posts: [] };
			entry.posts.push(post);
			map.set(slug, entry);
		}
	}
	return [...map]
		.map(([slug, { name, posts }]) => ({ slug, name, posts }))
		.sort((a, b) => b.posts.length - a.posts.length || a.slug.localeCompare(b.slug));
}
