// @ts-check
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections';
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers';
import { defineEcConfig } from 'astro-expressive-code';

// 코드 블록 설정 (Expressive Code)
// 문법: https://expressive-code.com/key-features/syntax-highlighting/
export default defineEcConfig({
	// 첫 번째 = 라이트, 두 번째 = 다크. OS 다크모드에 맞춰 자동 전환
	themes: ['github-light', 'github-dark'],
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
