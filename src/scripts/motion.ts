/**
 * 애니메이션 공통 값 (여러 스크립트가 같이 씀). CSS 쪽 같은 값은 global.css 의 --spring / --settle
 */

/** 살짝 탄력 있게 멈추는 스프링 곡선 (앱 열기) */
export const SPRING =
	'linear(0, 0.0063, 0.0251, 0.0562 3.3%, 0.1531 5.9%, 0.4155 11.1%, 0.6183 15.3%, 0.7649 19.2%, 0.8738 23.2%, 0.9442 27.3%, 0.9818 31.5%, 1.0055 36.4%, 1.0143 42%, 1.0125 50%, 1.0035 65%, 1)';

/** 튕기지 않고 빠르게 줄어들다 제자리에 착 붙는 곡선 (앱 닫기, 사진 크게 보기) */
export const SETTLE = 'cubic-bezier(0.32, 0.72, 0, 1)';

/** 움직임 줄이기 설정을 켰는지 */
export const prefersReducedMotion = () => matchMedia('(prefers-reduced-motion: reduce)').matches;
