// app.js
import 'htmx.org';
import Alpine from 'alpinejs';

// Styles: your token-driven CSS + optional Pico (if you want Pico, import it first)
import './styles/main.css';
// If you also want Pico as a baseline, uncomment the next line:
// import '@picocss/pico/css/pico.min.css';

// Shoelace setup: set asset base path and load a few components
import { setBasePath } from '@shoelace-style/shoelace/dist/utilities/base-path.js';
setBasePath('/node_modules/@shoelace-style/shoelace/dist');
import './components/shoelace/index.js';

const THEME_STORAGE_KEY = 'design-system-theme';

function getPreferredTheme() {
	if (typeof window === 'undefined') return 'light';
	const stored = window.localStorage.getItem(THEME_STORAGE_KEY);
	if (stored === 'dark' || stored === 'light') {
		return stored;
	}
	return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
}

function applyTheme(theme) {
	if (typeof document === 'undefined') return;
	if (theme === 'dark') {
		document.documentElement.setAttribute('data-theme', 'dark');
	} else {
		document.documentElement.removeAttribute('data-theme');
	}
}

const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

if (typeof window !== 'undefined') {
	const componentCatalog = [
		{
			id: 'buttons',
			label: 'Buttons',
			description: 'Primary, neutral, and text actions',
			detail: 'Combine variants, icons, and states to communicate priority and intent.',
			tokens: ['--color-semantic-brand', '--radius-md', '--font-size-sm'],
			notes:
				'Use brand accents for primary actions, keep a neutral option for secondary flows, and fall back to text buttons for low-emphasis affordances.'
		},
		{
			id: 'forms',
			label: 'Form inputs',
			description: 'Inputs, selects, toggles, helpers',
			detail: 'Form controls lean on spacing, helper text, and radius tokens to feel cohesive.',
			tokens: ['--space-md', '--radius-md', '--color-semantic-border'],
			notes:
				'Pair inputs with helper text and error states wired to semantic tokens. Align vertical rhythm to the spacing ramp for predictable scanning.'
		},
		{
			id: 'feedback',
			label: 'Feedback',
			description: 'Alerts, progress, dialogs',
			detail: 'Surface feedback with semantic colors and motion primitives for clarity.',
			tokens: ['--color-semantic-success', '--color-semantic-warning', '--shadow-md'],
			notes:
				'Use semantic colors to reinforce status. Layer motion tokens for transient states like progress or dialog entrances.'
		},
		{
			id: 'navigation',
			label: 'Navigation',
			description: 'Breadcrumbs, tabs, menus',
			detail: 'Guide users through flows with layered navigation primitives.',
			tokens: ['--space-sm', '--font-size-sm', '--color-semantic-muted'],
			notes:
				'Blend directional cues (breadcrumbs) with progressive disclosure (menus, tabs) to keep journeys oriented without overwhelming the page.'
		}
	];

	window.playgroundApp = function playgroundApp() {
		return {
			theme: initialTheme,
			init() {
				this.$watch('theme', (value) => {
					const nextTheme = value === 'dark' ? 'dark' : 'light';
					applyTheme(nextTheme);
					window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
				});
			}
		};
	};

	window.componentShowcase = function componentShowcase() {
		return {
			components: componentCatalog,
			activeId: componentCatalog[0]?.id ?? null,
			setActive(id) {
				this.activeId = id;
			},
			activeComponent() {
				return this.components.find((component) => component.id === this.activeId) ?? this.components[0];
			}
		};
	};
}

// Alpine boot
window.Alpine = Alpine;
Alpine.start();
