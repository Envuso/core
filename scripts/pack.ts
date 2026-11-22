/**
 * Build the framework into dist/ and pack it the way it is published.
 *
 *   bun run pack           -> .pack/envuso-core.tgz
 *
 * An app can then install the unpublished build like a real npm release:
 *
 *   "@envuso/core": "file:../core/.pack/envuso-core.tgz"
 *
 * (A tarball rather than `bun link`: a symlinked package resolves its own copies of
 * class-validator, reflect-metadata, tsyringe..., so the app and the framework would
 * see different validator/DI registries. A tarball install is deduplicated.)
 *
 * After repacking, reinstall it in the app: `bun install --force` (or `bun run core:update`).
 */
import {$} from "bun";
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dir, '..');
const dist = path.join(root, 'dist');
const out  = path.join(root, '.pack');

fs.rmSync(dist, {recursive : true, force : true});

console.log('› Building dist/');
await $`bunx tsc -p tsconfig-dist.json`.cwd(root);

const pkg = JSON.parse(fs.readFileSync(path.join(root, 'package.json'), 'utf8'));

// dist/ becomes the package root, so `@envuso/core/Routing` maps to dist/Routing
const manifest = {
	name         : pkg.name,
	version      : pkg.version,
	description  : pkg.description,
	license      : pkg.license,
	author       : pkg.author,
	repository   : pkg.repository,
	keywords     : pkg.keywords,
	type         : 'module',
	types        : './index.d.ts',
	main         : './index.js',
	engines      : {bun : '>=1.3.0'},
	dependencies : pkg.dependencies,
};

fs.writeFileSync(path.join(dist, 'package.json'), JSON.stringify(manifest, null, 2) + '\n');
for (const file of ['README.md', 'LICENSE', 'CHANGELOG.md']) {
	if (fs.existsSync(path.join(root, file))) {
		fs.copyFileSync(path.join(root, file), path.join(dist, file));
	}
}

console.log('› Packing');
fs.mkdirSync(out, {recursive : true});
for (const old of fs.readdirSync(out)) {
	fs.rmSync(path.join(out, old));
}
await $`bun pm pack --destination ${out}`.cwd(dist).quiet();

const [tarball] = fs.readdirSync(out).filter(f => f.endsWith('.tgz'));
// Stable name, so apps can depend on it without editing package.json per version
fs.renameSync(path.join(out, tarball), path.join(out, 'envuso-core.tgz'));

console.log(`› ${path.join(out, 'envuso-core.tgz')} (${manifest.name}@${manifest.version})`);
