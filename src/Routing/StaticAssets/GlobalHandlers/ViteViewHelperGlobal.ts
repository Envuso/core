import fs from "fs";
import path from "path";
import Environment from "../../../AppContainer/Config/Environment";

export type ViteOptions = {
	/**
	 * Written by the dev server while it runs (contains its URL), relative to the app root.
	 * The framework skeleton's vite.config.ts writes it on start and removes it on exit.
	 */
	hotFile?: string;
	/**
	 * Vite's build.outDir, relative to the asset directory (static.assetsPath)
	 */
	buildDirectory?: string;
};

type ManifestChunk = {
	file: string;
	css?: string[];
	imports?: string[];
};

/**
 * `{{{ vite('src/Resources/Ts/app.ts') }}}`: the tags for one or more Vite entry points.
 *
 * - While the dev server runs (the hot file exists, outside production): @vite/client plus
 *   the entries, loaded from the dev server, for HMR
 * - Otherwise: the entries' CSS, <link rel="modulepreload"> for their static imports, and the
 *   entry scripts, from the build manifest (<assets>/<buildDirectory>/.vite/manifest.json)
 *
 * Returns HTML: use the raw `{{{ }}}` output.
 */
export function viteViewHelperGlobal(rootPath: string, assetsPath: string, options: ViteOptions = {}) {
	const hotFile   = path.join(rootPath, options.hotFile ?? 'storage/vite.hot');
	const buildDir  = options.buildDirectory ?? 'build';
	const manifest  = path.join(rootPath, assetsPath, buildDir, '.vite', 'manifest.json');
	// Envuso serves the asset directory at /<assetsPath>/...
	const publicUrl = '/' + [assetsPath, buildDir].map(p => p.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '')).join('/') + '/';

	let cached: Record<string, ManifestChunk> | null = null;

	const loadManifest = (): Record<string, ManifestChunk> => {
		// Re-read outside production, so a rebuild is picked up without a restart
		if (cached && Environment.isProduction()) {
			return cached;
		}
		if (!fs.existsSync(manifest)) {
			throw new Error(`Vite: no build manifest at ${manifest}. Build the frontend (vite build), or start the dev server.`);
		}

		return cached = JSON.parse(fs.readFileSync(manifest, 'utf8'));
	};

	const collectCss = (chunks: Record<string, ManifestChunk>, key: string, seen: Set<string>): string[] => {
		if (seen.has(key) || !chunks[key]) {
			return [];
		}
		seen.add(key);

		return [
			...(chunks[key].css ?? []),
			...(chunks[key].imports ?? []).flatMap(imported => collectCss(chunks, imported, seen)),
		];
	};

	return (...entries: string[]): string => {
		// Never in production: a hot file left by a dev server that was killed would point pages at nothing
		if (!Environment.isProduction() && fs.existsSync(hotFile)) {
			const devServer = fs.readFileSync(hotFile, 'utf8').trim().replace(/\/$/, '');

			return [
				`<script type="module" src="${devServer}/@vite/client"></script>`,
				...entries.map(entry => `<script type="module" src="${devServer}/${entry}"></script>`),
			].join('\n');
		}

		const chunks = loadManifest();
		const tags   = new Set<string>();

		for (const entry of entries) {
			const chunk = chunks[entry];
			if (!chunk) {
				throw new Error(`Vite: "${entry}" isn't an entry in the build manifest (${manifest}).`);
			}

			for (const css of collectCss(chunks, entry, new Set())) {
				tags.add(`<link rel="stylesheet" href="${publicUrl}${css}"/>`);
			}
			for (const imported of chunk.imports ?? []) {
				if (chunks[imported]) {
					tags.add(`<link rel="modulepreload" href="${publicUrl}${chunks[imported].file}"/>`);
				}
			}
			tags.add(`<script type="module" src="${publicUrl}${chunk.file}"></script>`);
		}

		return [...tags].join('\n');
	};
}
