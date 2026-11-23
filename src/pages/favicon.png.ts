// 파비콘(public/favicon.svg)의 PNG 버전 512×512: /favicon.png
// 링크 공유 미리보기 썸네일(카톡, 디스코드 등)과 아이폰 홈 화면 아이콘에 씀 (둘 다 SVG 를 못 읽음)
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import svg from '../../public/favicon.svg?raw';

export const GET: APIRoute = async () => {
	const png = await sharp(Buffer.from(svg), { density: 1536 }).resize(512, 512).png().toBuffer();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
