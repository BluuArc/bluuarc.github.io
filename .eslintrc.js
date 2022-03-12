module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended'],
	plugins: ['svelte3', '@typescript-eslint'],
	overrides: [{ files: ['*.svelte'], processor: 'svelte3/svelte3' }],
	settings: {
		'svelte3/typescript': require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2020
	},
	env: {
		browser: true,
		node: true
	},
	rules: {
		'comma-dangle': [
			'error',
			'always-multiline',
		],
		'indent': [
			'error',
			'tab',
		],
		'no-trailing-spaces': 'error',
		'quotes': [
			'error',
			'single',
		],
		'semi': [
			'error',
			'always',
		],
	}
};
