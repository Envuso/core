/**
 * Verify that every named import from an external package in dist/ exists at runtime.
 *
 * Running from source, Bun drops imports that are only used as types, so a value-style
 * import of a type (`import {SomeType} from "pkg"`) goes unnoticed. In the compiled build
 * it stays and fails to load ("Export named 'X' not found"). tsc can't catch it when the
 * package's .d.ts declares the type as a class that the package no longer exports.
 *
 *   bun scripts/check-dist-imports.ts     (run after `bun run build`)
 */
// Packages like tsyringe refuse to load without the Reflect polyfill
import "reflect-metadata";
import fs from "fs";
import path from "path";

const dist = path.resolve(import.meta.dir, '..', 'dist');
const importRe = /import\s+(?:[\w$]+\s*,\s*)?\{([^}]*)\}\s+from\s+["']([^"'.][^"']*)["']/g;

const problems: string[] = [];
const cache    = new Map<string, Record<string, unknown> | Error>();

async function load(pkg: string) {
	if (!cache.has(pkg)) {
		try {
			cache.set(pkg, await import(pkg));
		} catch (error) {
			cache.set(pkg, error as Error);
		}
	}

	return cache.get(pkg);
}

for (const file of new Bun.Glob('**/*.js').scanSync({cwd : dist, absolute : true})) {
	// Drop comments: tsc keeps them, including commented-out imports
	const source = fs.readFileSync(file, 'utf8').replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

	for (const [, names, pkg] of source.matchAll(importRe)) {
		const module = await load(pkg);
		if (!module || module instanceof Error) {
			problems.push(`${path.relative(dist, file)}: cannot load "${pkg}" (${(module as Error)?.message})`);
			continue;
		}

		for (let name of names.split(',').map(n => n.trim()).filter(Boolean)) {
			name = name.split(/\s+as\s+/)[0].trim();
			if (!(name in module)) {
				problems.push(`${path.relative(dist, file)}: "${name}" is not exported by "${pkg}" at runtime`);
			}
		}
	}
}

if (problems.length) {
	console.error(problems.join('\n'));
	process.exit(1);
}

console.log('dist imports OK');
