// app.js
import Alpine from 'alpinejs';
import '@picocss/pico/css/pico.min.css';
import '@shoelace-style/shoelace/dist/themes/light.css';
import '@shoelace-style/shoelace/dist/themes/dark.css';
import './styles/main.css';
import './styles/shoelace.css';

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
	const nextTheme = theme === 'dark' ? 'dark' : 'light';
	document.documentElement.setAttribute('data-theme', nextTheme);
}

function escapeHtml(value) {
	return String(value ?? '')
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#39;');
}

function joinAttributes(attributes) {
	return attributes.filter(Boolean).join(' ');
}

function formatMarkup(markup) {
	if (!markup) return '';
	const lines = markup
		.trim()
		.split('\n')
		.map((line) => line.trim())
		.filter((line) => line.length > 0);

	let depth = 0;
	const formatted = lines.map((line) => {
		const isClosing = /^<\//.test(line);
		const isSelfClosing = /\/>$/.test(line) || (line.includes('</') && !line.startsWith('</'));
		if (isClosing) {
			depth = Math.max(depth - 1, 0);
		}
		const current = `${'  '.repeat(depth)}${line}`;
		if (!isClosing && !isSelfClosing && /^<[a-z0-9-]+/i.test(line)) {
			depth += 1;
		}
		return current;
	});

	return formatted.join('\n');
}

function clamp(value, min, max) {
	if (typeof value !== 'number' || Number.isNaN(value)) {
		return min;
	}
	return Math.min(Math.max(value, min), max);
}

const componentLibrary = [
	{
		id: 'button',
		label: 'Button',
		description: 'Primary and secondary calls to action.',
		summary: 'Experiment with variants, icons, and states for <sl-button>.',
		tags: ['Action', 'Interactive'],
		controls: [
			{ id: 'label', type: 'text', label: 'Label', default: 'Primary action', placeholder: 'Button copy' },
			{
				id: 'variant',
				type: 'select',
				label: 'Variant',
				default: 'primary',
				options: [
					{ value: 'primary', label: 'Primary' },
					{ value: 'neutral', label: 'Neutral' },
					{ value: 'success', label: 'Success' },
					{ value: 'danger', label: 'Danger' },
					{ value: 'text', label: 'Text' }
				]
			},
			{
				id: 'size',
				type: 'select',
				label: 'Size',
				default: 'medium',
				options: [
					{ value: 'small', label: 'Small' },
					{ value: 'medium', label: 'Medium' },
					{ value: 'large', label: 'Large' }
				]
			},
			{ id: 'icon', type: 'boolean', label: 'Show icon', default: true },
			{ id: 'pill', type: 'boolean', label: 'Pill shape', default: false },
			{ id: 'caret', type: 'boolean', label: 'Caret', default: false },
			{ id: 'loading', type: 'boolean', label: 'Loading state', default: false },
			{ id: 'disabled', type: 'boolean', label: 'Disabled', default: false }
		],
		render(state) {
			const attr = joinAttributes([
				`variant="${state.variant}"`,
				state.size !== 'medium' ? `size="${state.size}"` : '',
				state.pill ? 'pill' : '',
				state.caret ? 'caret' : '',
				state.loading ? 'loading' : '',
				state.disabled ? 'disabled' : ''
			]);
			const openTag = attr ? `<sl-button ${attr}>` : '<sl-button>';
			const label = escapeHtml(state.label || 'Primary action');
			if (state.icon) {
				return `
${openTag}
  <sl-icon slot="prefix" name="lightning-charge"></sl-icon>
  ${label}
</sl-button>
`.trim();
			}
			return `${openTag}${label}</sl-button>`;
		}
	},
	{
		id: 'input',
		label: 'Input field',
		description: 'Single-line text entry with helper props.',
		summary: 'Preview <sl-input> configurations for forms and settings.',
		tags: ['Form', 'Text'],
		controls: [
			{ id: 'label', type: 'text', label: 'Label', default: 'Project name', placeholder: 'Visible label' },
			{ id: 'placeholder', type: 'text', label: 'Placeholder', default: 'Type something…' },
			{
				id: 'size',
				type: 'select',
				label: 'Size',
				default: 'medium',
				options: [
					{ value: 'small', label: 'Small' },
					{ value: 'medium', label: 'Medium' },
					{ value: 'large', label: 'Large' }
				]
			},
			{ id: 'clearable', type: 'boolean', label: 'Clearable', default: true },
			{ id: 'disabled', type: 'boolean', label: 'Disabled', default: false }
		],
		render(state) {
			const attr = joinAttributes([
				`label="${escapeHtml(state.label)}"`,
				state.placeholder ? `placeholder="${escapeHtml(state.placeholder)}"` : '',
				state.size !== 'medium' ? `size="${state.size}"` : '',
				state.clearable ? 'clearable' : '',
				state.disabled ? 'disabled' : ''
			]);
			const openTag = attr ? `<sl-input ${attr}></sl-input>` : '<sl-input></sl-input>';
			return openTag;
		}
	},
	{
		id: 'alert',
		label: 'Alert',
		description: 'Inline feedback for success, warning, or error states.',
		summary: 'Dial semantic messaging with <sl-alert> variants and icons.',
		tags: ['Feedback'],
		controls: [
			{
				id: 'variant',
				type: 'select',
				label: 'Variant',
				default: 'success',
				options: [
					{ value: 'primary', label: 'Primary' },
					{ value: 'success', label: 'Success' },
					{ value: 'warning', label: 'Warning' },
					{ value: 'danger', label: 'Danger' },
					{ value: 'neutral', label: 'Neutral' }
				]
			},
			{ id: 'title', type: 'text', label: 'Title', default: 'Deployment ready' },
			{ id: 'message', type: 'text', label: 'Message', default: 'All checks have passed. Ship it!' },
			{ id: 'icon', type: 'select', label: 'Icon', default: 'rocket-takeoff', options: [
				{ value: 'rocket-takeoff', label: 'Rocket' },
				{ value: 'check2-circle', label: 'Check' },
				{ value: 'exclamation-triangle', label: 'Warning' },
				{ value: 'info-circle', label: 'Info' }
			] },
			{ id: 'showIcon', type: 'boolean', label: 'Show icon', default: true },
			{ id: 'open', type: 'boolean', label: 'Open', default: true },
			{ id: 'closable', type: 'boolean', label: 'Closable', default: true }
		],
		render(state) {
			const attr = joinAttributes([
				`variant="${state.variant}"`,
				state.open ? 'open' : '',
				state.closable ? 'closable' : ''
			]);
			const openTag = attr ? `<sl-alert ${attr}>` : '<sl-alert>';
			const body = [];
			if (state.showIcon) {
				body.push(`  <sl-icon slot="icon" name="${state.icon}"></sl-icon>`);
			}
			if (state.title) {
				body.push(`  <strong>${escapeHtml(state.title)}</strong>`);
			}
			if (state.message) {
				body.push(`  <p>${escapeHtml(state.message)}</p>`);
			}
			const content = body.length ? `\n${body.join('\n')}\n` : '';
			return `${openTag}${content}</sl-alert>`;
		}
	},
	{
		id: 'progress',
		label: 'Progress bar',
		description: 'Track completion for async work.',
		summary: 'Adjust value, label, and stripes on <sl-progress-bar>.',
		tags: ['Feedback', 'Motion'],
		controls: [
			{ id: 'value', type: 'number', label: 'Value', default: 64, min: 0, max: 100 },
			{ id: 'label', type: 'text', label: 'Accessible label', default: 'Deploying build' },
			{ id: 'indeterminate', type: 'boolean', label: 'Indeterminate', default: false },
			{ id: 'striped', type: 'boolean', label: 'Striped', default: false }
		],
		render(state) {
			const value = clamp(state.value, 0, 100);
			const attr = joinAttributes([
				state.indeterminate ? 'indeterminate' : `value="${value}"`,
				state.label ? `label="${escapeHtml(state.label)}"` : '',
				state.striped ? 'striped' : ''
			]);
			const openTag = attr ? `<sl-progress-bar ${attr}></sl-progress-bar>` : '<sl-progress-bar></sl-progress-bar>';
			return openTag;
		}
	}
];

const initialTheme = getPreferredTheme();
applyTheme(initialTheme);

if (typeof window !== 'undefined') {
	window.builderApp = function builderApp() {
		return {
			theme: initialTheme,
			components: componentLibrary,
			activeId: componentLibrary[0]?.id ?? null,
			controlValues: {},
			init() {
				this.components.forEach((component) => {
					this.controlValues[component.id] = component.controls.reduce((acc, control) => {
						acc[control.id] = control.default;
						return acc;
					}, {});
				});

				this.$watch('theme', (value) => {
					const nextTheme = value === 'dark' ? 'dark' : 'light';
					applyTheme(nextTheme);
					window.localStorage.setItem(THEME_STORAGE_KEY, nextTheme);
				});
			},
			setActive(id) {
				this.activeId = id;
			},
			activeComponent() {
				return this.components.find((component) => component.id === this.activeId) ?? this.components[0] ?? null;
			},
			activeControls() {
				return this.activeComponent()?.controls ?? [];
			},
			updateControl(controlId, value) {
				if (!this.controlValues[this.activeId]) return;
				this.controlValues[this.activeId][controlId] = value;
			},
			previewMarkup() {
				const component = this.activeComponent();
				if (!component) return '';
				const state = this.controlValues[this.activeId] ?? {};
				return component.render(state);
			},
			rawMarkup() {
				return this.previewMarkup();
			},
			prettyMarkup() {
				return formatMarkup(this.previewMarkup());
			},
			copyMarkup() {
				const markup = this.rawMarkup();
				if (!markup) return;
				if (navigator?.clipboard?.writeText) {
					navigator.clipboard.writeText(markup).catch(() => {});
					return;
				}
				const textarea = document.createElement('textarea');
				textarea.value = markup;
				document.body.appendChild(textarea);
				textarea.select();
				document.execCommand('copy');
				document.body.removeChild(textarea);
			}
		};
	};
}

window.Alpine = Alpine;
Alpine.start();
