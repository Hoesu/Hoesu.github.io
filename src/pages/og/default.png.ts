// 글이 아닌 페이지(홈, 카테고리, 태그 등)의 링크 공유 미리보기 이미지: /og/default.png
import type { APIRoute } from 'astro';
import { defaultOgImage } from '../../utils/og';

export const GET: APIRoute = async () =>
	new Response(new Uint8Array(await defaultOgImage()), { headers: { 'Content-Type': 'image/png' } });
