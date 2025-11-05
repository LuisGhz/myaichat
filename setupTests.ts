// Vitest setup file for jest-dom matchers and cleanup
// Loaded via vite.config.ts -> test.setupFiles
import '@testing-library/jest-dom/vitest';

// jsdom used by Vitest doesn't implement window.matchMedia which AntD's
// Grid.useBreakpoint relies on; provide a minimal polyfill for tests.
if (typeof window !== 'undefined' && !window.matchMedia) {
	Object.defineProperty(window, 'matchMedia', {
		writable: true,
		value: (query: string) => ({
			matches: false,
			media: query,
			onchange: null,
			addEventListener: () => {},
			removeEventListener: () => {},
			addListener: () => {}, // deprecated
			removeListener: () => {}, // deprecated
			dispatchEvent: () => false,
		}),
	});
}
