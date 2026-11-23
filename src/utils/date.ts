/** 날짜 → '2026-11-04' (사이트 전체에서 쓰는 날짜 모양) */
export const ymd = (date: Date) => date.toISOString().slice(0, 10);
