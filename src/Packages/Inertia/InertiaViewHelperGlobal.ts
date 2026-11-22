/**
 * `{{{ inertia(page) }}}`: Inertia's initial page plus the element the app mounts on.
 *
 * Inertia 1+ reads the first page from `<script data-page="app" type="application/json">`
 * (0.x read a `data-page` attribute on the mount element). The JSON is written raw, so "<",
 * ">" and "&" are escaped: a prop containing "</script>" could otherwise close the tag (XSS).
 * U+2028/U+2029 are escaped too.
 *
 * Returns HTML: use the raw `{{{ }}}` output.
 *
 * @param page | the `page` variable Inertia renders the root view with (JSON)
 * @param id   | the mount element's id; createInertiaApp's `id` option (default "app")
 */
export function inertiaViewHelperGlobal(page: string, id: string = 'app'): string {
	const json = String(page)
		.replace(/</g, '\\u003c')
		.replace(/>/g, '\\u003e')
		.replace(/&/g, '\\u0026')
		.split(String.fromCharCode(0x2028)).join('\\u2028')
		.split(String.fromCharCode(0x2029)).join('\\u2029');

	const safeId = String(id).replace(/[^\w-]/g, '');

	return `<script data-page="${safeId}" type="application/json">${json}</script>\n<div id="${safeId}"></div>`;
}
