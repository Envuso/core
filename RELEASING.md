# Releasing @envuso/core

Releases are made with `scripts/release.ts`, the 3.x replacement for the old
`dist.sh` / `dist-next.sh`. It follows the same flow (build, bump, commit, publish,
push) with Bun tooling.

## Before you start

- `npm login` (`bun publish` uses your npm credentials; add `--otp` handling if 2FA prompts)
- Docker running: the test suite starts MongoDB and Redis with Testcontainers
- A clean `main` (untracked files are ignored)

## Commands

```sh
bun run release prerelease --dry-run   # rehearse: tests, pack, `bun publish --dry-run`; changes nothing
bun run release prerelease             # 3.0.0-alpha.0 -> 3.0.0-next.0, npm tag "next"  (was dist-next.sh)
bun run release patch                  # 3.0.0 -> 3.0.1, npm tag "latest"              (was dist.sh)
bun run release major                  # 3.0.0-next.N -> 3.0.0 (finish the prerelease)
bun run release 3.0.0-beta.0           # an exact version
```

Options: `--preid <id>` (default `next`), `--tag <npm tag>` (default `next` for
prereleases, else `latest`), `--skip-tests`, `--no-push`.

## What it does

1. Refuses a dirty tree, a branch other than `main`, or an existing `v<version>` tag
2. Runs `bun test`
3. Bumps `version` in package.json
4. `bun run pack`: builds `dist/` (Bun transpiler + tsc declarations), checks dist
   imports, writes the published manifest and packs `.pack/envuso-core.tgz`
5. Commits `:package: v<version>` and tags `v<version>`
6. `bun publish --access public --tag <tag> .pack/envuso-core.tgz`
7. `git push origin main --follow-tags`

Publishing happens before pushing: if it fails, nothing has been pushed. Retry with
`bun publish --access public --tag <tag> .pack/envuso-core.tgz`.

## Local development (was dist-local.sh)

No linking: apps install the packed tarball, which gives a deduplicated install
(a linked package would load its own copies of class-validator, tsyringe and
reflect-metadata).

```sh
bun run pack                               # in core
bun run core:update                        # in the app (framework skeleton)
```

with `"@envuso/core": "file:../core/.pack/envuso-core.tgz"` in the app's package.json.

## The CLI

`@envuso/cli` (github.com/Envuso/cli) is released from its own repo. Its `db:*`
commands import `node_modules/@envuso/core/Cli/CliHandler` from the app, which 3.x
still ships. 0.1.x runs under Node and compiles the app with `tsc` first, so it
needs updating for Bun-only 3.x.
