// 파비콘(public/favicon.svg)의 PNG 버전 512×512: /favicon.png
// 아이폰 홈 화면 아이콘(apple-touch-icon)에 씀 (SVG 를 못 읽음)
import type { APIRoute } from 'astro';
import sharp from 'sharp';
import svg from '../../public/favicon.svg?raw';

export const GET: APIRoute = async () => {
	const png = await sharp(Buffer.from(svg), { density: 1536 }).resize(512, 512).png().toBuffer();
	return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
