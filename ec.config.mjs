// @ts-check
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

// 코드 블록 설정 (Expressive Code)
// 문법: https://expressive-code.com/key-features/syntax-highlighting/
export default defineEcConfig({
	// 상시 다크 테마. 테마를 하나만 두면 OS 설정과 상관없이 항상 이 색으로 나옴
	themes: ['github-dark'],
	plugins: [pluginLineNumbers(), pluginCollapsibleSections()],
	defaultProps: {
		showLineNumbers: true,
		// 터미널 명령어에는 줄 번호 숨김
		overridesByLang: {
			'bash,sh,shell,zsh,powershell,ps,cmd': { showLineNumbers: false },
		},
	},
	styleOverrides: {
		borderRadius: '8px',
		borderColor: 'var(--border)',
		codeFontFamily: 'ui-monospace, SFMono-Regular, Menlo, Consolas, monospace',
		codeFontSize: '0.875rem',
		codeLineHeight: '1.6',
		uiFontFamily: 'inherit',
		frames: {
			frameBoxShadowCssValue: 'none',
		},
	},
});
