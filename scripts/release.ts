/**
 * Release @envuso/core (the 3.x replacement for the old dist.sh / dist-next.sh).
 *
 *   bun run release <major|minor|patch|prerelease|x.y.z[-pre.n]> [options]
 *
 *   --preid <id>   prerelease id (default "next"), e.g. 3.0.0-next.0
 *   --tag <tag>    npm dist-tag (default "next" for prereleases, else "latest")
 *   --dry-run      run the tests, pack and `bun publish --dry-run`; changes nothing
 *   --skip-tests   don't run the test suite (needs Docker for Testcontainers)
 *   --no-push      publish, commit and tag, but don't push to origin
 *
 * Steps: check the tree is clean and on main -> tests -> bump package.json -> pack
 * (scripts/pack.ts) -> commit ":package: vX" + tag vX -> bun publish the tarball -> push.
 * Publishing comes before pushing, so a failed publish leaves nothing pushed; the
 * local commit and tag stay, and the publish can be retried with
 * `bun publish --access public --tag <tag> .pack/envuso-core.tgz`.
 *
 * Needs `npm login` (bun publish uses the npm credentials). See RELEASING.md.
 */
import {$} from "bun";
import fs from "fs";
import path from "path";

const root = path.resolve(import.meta.dir, '..');
const args = process.argv.slice(2);

const flag   = (name: string) => args.includes(`--${name}`);
const option = (name: string) => {
	const i = args.indexOf(`--${name}`);
	return i === -1 ? undefined : args[i + 1];
};

const bump = args.find((arg, i) => !arg.startsWith('--') && !['--preid', '--tag'].includes(args[i - 1]));
if (!bump) {
	console.error('Usage: bun run release <major|minor|patch|prerelease|x.y.z> [--preid next] [--tag next] [--dry-run] [--skip-tests] [--no-push]');
	process.exit(1);
}

const dryRun = flag('dry-run');
const preid  = option('preid') ?? 'next';

const pkgPath = path.join(root, 'package.json');
const pkgText = fs.readFileSync(pkgPath, 'utf8');
const current = JSON.parse(pkgText).version as string;
const version = nextVersion(current, bump, preid);
const tag     = option('tag') ?? (version.includes('-') ? 'next' : 'latest');

console.log(`› ${current} -> ${version} (npm tag "${tag}")${dryRun ? ' [dry run]' : ''}`);

// Tracked changes only: untracked scratch files (e.g. a stray package-lock.json) aren't released
const dirty = (await $`git status --porcelain --untracked-files=no`.cwd(root).text()).trim();
if (dirty) {
	console.error(`› The working tree has uncommitted changes:\n${dirty}`);
	process.exit(1);
}
const branch = (await $`git rev-parse --abbrev-ref HEAD`.cwd(root).text()).trim();
if (branch !== 'main' && !dryRun) {
	console.error(`› Releases are made from main (on "${branch}").`);
	process.exit(1);
}
if ((await $`git tag --list v${version}`.cwd(root).text()).trim()) {
	console.error(`› Tag v${version} already exists.`);
	process.exit(1);
}

if (!flag('skip-tests')) {
	console.log('› Running the test suite');
	await $`bun test --timeout 30000`.cwd(root);
}

const writeVersion = (v: string) => fs.writeFileSync(pkgPath, pkgText.replace(/("version"\s*:\s*")[^"]+(")/, `$1${v}$2`));

writeVersion(version);
try {
	await $`bun scripts/pack.ts`.cwd(root);
	const tarball = path.join(root, '.pack', 'envuso-core.tgz');

	if (dryRun) {
		await $`bun publish --dry-run --access public --tag ${tag} ${tarball}`.cwd(root);
		console.log('› Dry run finished; package.json restored, nothing committed or published.');
		process.exit(0);
	}

	await $`git add package.json`.cwd(root);
	await $`git commit -m ${`:package: v${version}`}`.cwd(root);
	await $`git tag -a v${version} -m ${`v${version}`}`.cwd(root);

	console.log(`› Publishing @envuso/core@${version}`);
	await $`bun publish --access public --tag ${tag} ${tarball}`.cwd(root);

	if (flag('no-push')) {
		console.log('› Not pushing (--no-push). Push with: git push origin main --follow-tags');
	} else {
		await $`git push origin main --follow-tags`.cwd(root);
	}

	console.log(`› Released @envuso/core@${version}`);
} finally {
	if (dryRun) {
		fs.writeFileSync(pkgPath, pkgText);
	}
}

function nextVersion(from: string, how: string, id: string): string {
	if (/^\d+\.\d+\.\d+(-[0-9A-Za-z.-]+)?$/.test(how)) {
		return how;
	}

	const match = from.match(/^(\d+)\.(\d+)\.(\d+)(?:-([0-9A-Za-z-]+)\.(\d+))?/);
	if (!match) {
		throw new Error(`Can't parse the current version "${from}"`);
	}
	const [major, minor, patch] = [Number(match[1]), Number(match[2]), Number(match[3])];
	const [preName, preNum]     = [match[4], match[5] === undefined ? undefined : Number(match[5])];

	switch (how) {
		case 'major':
			// 3.0.0-next.4 -> 3.0.0 (finishing the prerelease), 2.1.0 -> 3.0.0
			return preName && minor === 0 && patch === 0 ? `${major}.0.0` : `${major + 1}.0.0`;
		case 'minor':
			return preName && patch === 0 ? `${major}.${minor}.0` : `${major}.${minor + 1}.0`;
		case 'patch':
			return preName ? `${major}.${minor}.${patch}` : `${major}.${minor}.${patch + 1}`;
		case 'prerelease':
			// 3.0.0-next.1 -> 3.0.0-next.2; 3.0.0-alpha.0 -> 3.0.0-next.0; 3.0.0 -> 3.0.1-next.0
			if (preName === id) {
				return `${major}.${minor}.${patch}-${id}.${(preNum ?? -1) + 1}`;
			}
			return preName ? `${major}.${minor}.${patch}-${id}.0` : `${major}.${minor}.${patch + 1}-${id}.0`;
		default:
			throw new Error(`Unknown version bump "${how}" (major, minor, patch, prerelease or an exact version)`);
	}
}
