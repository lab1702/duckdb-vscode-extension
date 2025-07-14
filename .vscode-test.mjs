import { defineConfig } from '@vscode/test-cli';

export default defineConfig({
	files: 'out/test/**/*.test.js',
	// Headless mode configuration for CI environments
	launchArgs: [
		'--disable-extensions',
		'--disable-gpu',
		'--no-sandbox',
		'--disable-dev-shm-usage'
	],
	env: {
		// Ensure we're in CI mode for proper headless operation
		CI: 'true'
	}
});
