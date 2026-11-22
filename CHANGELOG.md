# Changelog

All notable changes to Envuso are documented in this file. The format follows [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [3.0.0] - Unreleased

**Upgrade overview.** Envuso 3.0 runs on Bun only. Node.js is no longer supported, and the framework relies on Bun built-ins (`Bun.password`, `Bun.Glob`, `Bun.file`, `Bun.redis`, `Bun.serve`) in place of several npm packages. TypeScript moves to 7, which requires tsconfig changes. Major dependency jumps include Fastify 3 to 5, the MongoDB driver 4.2 to 7.9, tslog 3 to 5, and the AWS SDK v2 to v3 for S3. Expect to update your app's `tsconfig.json`, `.env`, imports of `@fastify/*` plugins, WebSocket and queue configuration, and any code that imports the packages listed under Removed.

### ⚠️ Breaking changes

**Runtime and TypeScript**

- **Bun only.** Node.js is no longer supported. Run and test your app with `bun`. (142c622)
- **TypeScript 7.** Update `typescript` to `7` and review your `tsconfig.json` against these changes (4421992, 33b70de):
  - `baseUrl`, `node10` module resolution and `downlevelIteration` are removed. Use `"moduleResolution": "bundler"`.
  - The framework's own tsconfig enables `isolatedModules` and `verbatimModuleSyntax`. Apps don't have to, but using `import type` for type-only imports is recommended: under Bun's ESM loading, a value import that is only used as a type can create an import cycle and break decorator metadata (see **Models** below).
- **`.env` files are loaded by Bun, not Envuso.** Bun reads them before any code runs, in increasing precedence: `.env`, `.env.{NODE_ENV}`, `.env.local` (skipped when `NODE_ENV=test`), `.env.{NODE_ENV}.local`. `${VAR}` references are expanded. `dotenv` and `dotenv-expand` are removed. (9ea4f00)
  - `Environment.load(path)` no longer loads a file. The argument is ignored and logs a warning (unless it is the project-root `.env`). Load another file with Bun's flag instead:
    ```sh
    # before: Environment.load('config/.env.staging')
    bun --env-file=config/.env.staging src/index.ts
    ```
  - `Environment.hasEnvFile()` and `Environment.loadEnvFile()` are removed.
  - The `.env` is resolved from the directory Bun is started in (the project root), not from the file that called `Environment.load()`.
  - To load no `.env` at all (e.g. production relying on real env vars), use `bun --no-env-file` or `env = false` in `bunfig.toml`.
- **Environment variables override `.env`.** Real environment variables take precedence over `.env` values. In 2.x the `.env` file won. If your deployment relies on `.env` overriding the shell environment, that changes. (4421992, 9ea4f00)

- **The package is ESM and compiled with Bun.** `@envuso/core` ships as ES modules (`"type": "module"`) built with Bun's transpiler, plus `.d.ts` files. Deep imports such as `@envuso/core/Routing` keep working. (c5cfae0, 68617cc)
- **App files are loaded as they are.** `FileLoader.formatPathForRunEnvironment()` no longer rewrites `src/**/*.ts` to `dist/**/*.js`; Bun runs your app's TypeScript directly, so there is no app build step. The method is deprecated. (c5cfae0)
- **`"false"` in the environment is now `false`.** In 2.x every `"false"` value (any case) was read as `true`. Settings you had set to `false` in `.env` now actually take effect. Numbers are still returned as strings; wrap them in `Number(...)`. (832b7d4)

**Fastify 5**

- Fastify is upgraded from 3 to 5, and the `fastify-*` plugins are replaced by their `@fastify/*` equivalents: `@fastify/cors`, `@fastify/helmet`, `@fastify/multipart`, `@fastify/formbody`, `@fastify/raw-body` (6). `middie` is removed. (50211bd)
- `ServerConfiguration.fastifyPlugins` and `cors.options` are typed against the `@fastify/*` packages. If you register these plugins yourself, install the `@fastify/*` package and update the import.

  ```ts
  // before
  import fastifyCors from 'fastify-cors';
  // after
  import fastifyCors from '@fastify/cors';
  ```

- Hook arguments are now mapped by Fastify's documented signature for each hook, instead of being guessed at runtime. Review any custom hook that depends on argument order or on the internal `next` callback. (50211bd)

**MongoDB driver 7**

- The driver is upgraded from 4.2 to 7.9 (bson 7). `FindOptions` is no longer generic, `insertOne`/`deleteOne` have stricter generics, and `Sort` is a readonly index type. Code that builds sort objects or passes typed options may need small type fixes. (646379c)

**Redis**

- The Redis client is Bun's built-in `RedisClient`. `ioredis` and its types are removed. (a193c14, 3d94630)
- Configuration accepts either a `url` (`redis://` or `rediss://`) or `host`/`port`/`password`/`db`. When `url` is set it takes priority. (a193c14)
  ```ts
  // config/redis
  url: 'redis://:password@host:6379/0',
  ```
- The framework applies `keyPrefix` itself, because Bun's client has no such option. (a193c14)
- `push`, `pushToEnd` and `lRemove` now return `true` when something was pushed or removed. Previously they returned `true` only when the list ended with exactly one element. Callers that treated `false` as a signal on longer lists should be reviewed. (a193c14)

**Queue**

- **`retries` has a clear meaning.** `retries` is the number of retries after the first attempt, so total runs = `retries + 1`. The default is `0`, meaning one run. In 2.x a job with the default `retries = 0` never ran at all. (efdf449)
- **Redis key layout changed.** The queue uses a new set of keys (ready list, delayed and reserved sorted sets, payload and attempt hashes). Jobs queued by 2.x are not processed by 3.0: the old `queue` and `queue:reserved` lists are never read, and old entries in `queue:delayed` (which held payloads, not ids) are discarded when they come due. Drain your 2.x queues before deploying 3.0, or re-dispatch those jobs. (efdf449)
- **New config fields** on `QueueConfiguration` (efdf449):
  - `name` (default `'queue'`): the queue's name, used for its Redis keys.
  - `workers` (default `1`, env `QUEUE_WORKERS`): worker threads per process. `0` makes the process dispatch-only.
  - `visibilityTimeoutMs` (default 5 minutes): running jobs keep their reservation alive; if a process dies, its jobs become available again after this long.
  - `backoff` (seconds) and an overridable `retryDelay(attempt)` on a job control the delay between retries.
- **Job retries and failure.** `Job.failed()` is called once retries are exhausted. A `handleException()` that returns a value now marks the job as handled. Previously the worker never reported back. (efdf449)

**WebSockets**

- The uWebSockets.js server is replaced by `Bun.serve`. The `options` (ws `ServerOptions`), `uWebsocketAppOptions` and `uWebsocketServerBehaviour` config fields are removed. Move your settings under `server`, which takes Bun's websocket handler options: `maxPayloadLength` and `idleTimeout` keep their names, `compression` becomes `perMessageDeflate`, and `maxBackpressure` becomes `backpressureLimit`. (26e2e3a)
  ```ts
  // config/websockets
  enabled: true,
  port: Number(Environment.get('WEBSOCKET_PORT', 3335)),
  hostname: Environment.get('WEBSOCKET_HOST', '0.0.0.0'),
  server: {
      maxPayloadLength: 16 * 1024 * 1024,
      idleTimeout: 32,
      perMessageDeflate: true,
  },
  ```
- New environment variables: `WEBSOCKET_PORT` (default 3335) and `WEBSOCKET_HOST` (default `0.0.0.0`). (26e2e3a)
- The uWS `WebSocket` type is replaced by `EnvusoWebSocket` (`ServerWebSocket<SocketData>`). Update any type annotations in your channels, listeners or connection code. (26e2e3a)
- The JWT is still sent in `Sec-WebSocket-Protocol`, but the server now echoes it back on upgrade, which standard clients require to accept the connection. (26e2e3a)
- `enabled: false` is now honoured. Previously the server ran regardless. (26e2e3a)
- The `ws` and `@types/ws` packages are removed. (26e2e3a)

- The websocket configuration contract (`WebsocketsConfiguration`, `WebSocketServerOptions`) lives in `@envuso/core/Contracts/Configuration/WebsocketsConfigurationContracts`; implement it in your `WebsocketsConfiguration` class. (c5cfae0)

**Storage (S3)**

- S3 uses AWS SDK v3 (`@aws-sdk/client-s3` and `@aws-sdk/s3-request-presigner`). The v2 `aws-sdk` package is removed. Apps that import `aws-sdk` directly must migrate. (a7c1bb2)
- New disk options (a7c1bb2):
  - `region`, env `SPACES_REGION` (default `us-east-1`).
  - `forcePathStyle`, env `SPACES_FORCE_PATH_STYLE` (default `false`). Set `true` for MinIO and other self-hosted S3-compatible stores.
  - `acl`: defaults to `"public-read"` as before. Set `acl: null` for buckets with ACLs disabled, which is the AWS default for new buckets (the canned ACL is not sent when `null`).

**Models**

- Relation properties should be typed as `Relation<T>`. Models that import each other (for example `User` and `Book`) otherwise fail at startup under ESM with decorator-metadata errors (TDZ). (55123ec)
  ```ts
  import type {Relation} from '@envuso/core/Database';

  // before
  user: User;
  // after
  user: Relation<User>;
  ```

**Controllers**

- Avoid naming a parameter the same as its decorator (`@body body`, `@dto() dto`, `@user user`). Under Bun the decorator import can be dropped, causing `dto is not defined` at runtime. Rename the parameter, for example to `payload`. (55123ec)

**Jobs**

- `@job` no longer requires the file name to match the class name. The declaring file is found from the call stack. (efdf449)

### Added

**Queue**

- Visibility timeouts: running jobs keep extending their reservation, and only jobs from a dead process are retried. (efdf449)
- Multiple processes can work the same queue. Each job is handed to exactly one worker. (efdf449)
- Retries with `backoff` and `retryDelay(attempt)`. (efdf449)
- Failed jobs are kept in a capped failed list after `Job.failed()` runs. (efdf449)
- `workers` and `name` config, and the `QUEUE_WORKERS` environment variable. (efdf449)

**Redis**

- `url` configuration (`redis://` or `rediss://`). (a193c14)

**Storage**

- S3 `region`, `forcePathStyle` and `acl` disk options (see Breaking changes). (a7c1bb2)
- `SPACES_REGION` and `SPACES_FORCE_PATH_STYLE` environment variables. (a7c1bb2)
- `files('/')` lists the bucket root. (a7c1bb2)
- `ListObjectsV2` pagination past 1000 keys. (a7c1bb2)

**WebSockets**

- `WEBSOCKET_HOST` environment variable. (26e2e3a)
- `EnvusoWebSocket` and `SocketData` type exports. (26e2e3a)
- `WebSocketServer.removeGlobalMiddleware()`, the counterpart to `addGlobalMiddleware()`. (26e2e3a)

**Models**

- `Relation<T>` type for relation properties. (55123ec)

**Packaging**

- `bun run pack` builds the framework and packs it exactly as it is published (`.pack/envuso-core.tgz`), so an app can install an unpublished build with `"@envuso/core": "file:../core/.pack/envuso-core.tgz"`. A tarball gives a deduplicated install; `bun link` would give the app its own copies of `class-validator`, `reflect-metadata` and `tsyringe`, and validation rules or DI registrations would not be shared. (c5cfae0)
- Packing checks that every named import from a dependency exists at runtime (`scripts/check-dist-imports.ts`). (68617cc)

**Configuration**

- `ConfigurationFile.appConfigurationPath()` and `ConfigurationFile.initiateAppConfiguration()` locate and load the app's `Configuration.ts` (from `configurationDirectory` in `envuso.json`, default `src/Config`). (c5cfae0)

**Tooling**

- `test` and `typecheck` scripts. The test suite runs on `bun test` and starts MongoDB 8, Redis 8 and an S3-compatible store (RustFS) through Testcontainers, once per run. (4421992, a7c1bb2)

### Changed

**Dependencies (major versions)**

- Fastify 3 to 5 (50211bd), MongoDB driver 4.2 to 7.9 (646379c), tslog 3 to 5 (50211bd), `aws-sdk` v2 to AWS SDK v3 (a7c1bb2).
- `jsonwebtoken` 9, `class-validator` 0.15, `reflect-metadata` 0.2, `chalk` 6, `winston` with `winston-daily-rotate-file` 5, `fs-extra` 11, `tsyringe` 4.10 (10d6260).
- `file-type` 16 to 22 (142c622).
- `laravel-mix` is now a devDependency; it only builds the Inertia/Vue test app (4eec103).

**Environment**

- `Environment.get()`, `has()` and the `is*()` helpers load the environment on first use, so config classes no longer depend on `Environment.load()` having been called first. (9ea4f00)

**Hashing**

- `Hash.make(content, rounds)` now honours `rounds` (it previously always used 10). The default is still 10. (8efa27e)
- Hashing uses `Bun.password` with bcrypt. Hashes created by the `bcrypt` npm package continue to verify. (8efa27e)

**Queue**

- `WorkerPool` runs `Worker.ts` directly under Bun instead of through `ts-node`. Crashed workers are removed from the pool, their job is released, and a replacement is started after a delay. (efdf449)
- A full pool releases the job back to the queue instead of pushing a duplicate. (efdf449)
- Queue loop errors are caught instead of stopping the queue. (efdf449)
- The queue store is one Lua-backed `QueueStore`. Each state change (reserve, release, fail, extend) is a single atomic script. (efdf449)

**Redis**

- Boot awaits the connection, so the first command cannot race it. (a193c14)

**Server and WebSockets**

- The WebSocket server starts on its own port (`WEBSOCKET_PORT`) and is one instance per process. Booting again (for example, when providers are reloaded) replaces the running server instead of failing with `EADDRINUSE`. (26e2e3a)

**Filesystem and assets**

- Static asset types are detected with `Bun.file(path).type`. The read stream opens only after the type check. Unknown types still return 404. (142c622)
- `FileLoader` splits absolute and Windows patterns into a working directory and a glob, since `Bun.Glob` treats backslashes as escapes. Relative patterns return paths relative to the process cwd again. (142c622, efdf449)

**Imports and build**

- Internal framework code imports concrete modules instead of barrel `index.ts` files, and helpers live in `helpers.ts` beside each barrel. Public barrels are unchanged. Import cycles inside the framework are reduced substantially. (55b0809, 2950749)
- Type-only imports use `import type` throughout the framework. (33b70de)

**Dev tooling**

- Dev scripts use `bun --watch` instead of `ts-node-dev`. Jest is replaced by `bun test`. (4eec103, 4421992)
- `fs.watch(dir, {recursive: true})` replaces `chokidar`. Changes are debounced so one save triggers one reboot. (142c622)

### Fixed

**Packaging and loading**

- Queue workers and the CLI loaded the framework's own bundled test configuration instead of the app's. They now load the app's `Configuration.ts` (see Added); a worker can also be given `workerData.configurationPath`. (c5cfae0)
- The worker thread file is resolved with the running extension, so queue workers start when the framework is installed compiled. (c5cfae0)
- A value import of `BulkWriteResult`, which mongodb 7 only exports as a type, failed to load in the compiled build. (68617cc)
- Classes imported only for their types no longer become runtime imports in the build, which formed import cycles (`Cannot access 'Hook' before initialization`). (68617cc)

**Routing**

- Async route handlers now return the reply after sending it. Fastify 5 otherwise sent the response a second time (`ERR_HTTP_HEADERS_SENT`). (68617cc)

**Filesystem**

- `FileLoader` returns no files for a missing directory instead of throwing, so an app without, for example, `App/Events` boots again (a regression from the switch to `Bun.Glob`). (68617cc)

**Environment**

- `"false"` (any case) was read as `true` (see Breaking changes). (832b7d4)

**Logging**

- Error logging matches tslog 5's `(message, ...args)` signature, and an intentional Redis `close()` on shutdown is no longer logged as an error. (c5cfae0, 68617cc)

**Queue**

- Jobs could be lost or run twice across processes. Concurrent workers no longer double-reserve a job, and a job from another live process is no longer re-run at boot. (efdf449)
- A job with the default `retries = 0` never ran. It now runs once. (efdf449)
- A worker that returned from `handleException()` was never reported back and was stuck. (efdf449)
- `release` and `fail` are atomic, removing a window where a job could be lost between two commands. (efdf449)

**Redis**

- `push`, `pushToEnd` and `lRemove` return values (see Breaking changes). (a193c14)
- `set()` with a `ttl` in the past no longer sends an invalid `EX 0`. (a193c14)

**Hashing**

- `Hash.make()` ignored `rounds`. (8efa27e)
- `Hash.check()` returns `false` for empty input instead of throwing. (8efa27e)

**Storage (S3)**

- `fileExists()` returns `false` on a 404 instead of throwing. (a7c1bb2)
- `files('/')` matched only keys starting with a slash. (a7c1bb2)
- Streams are uploaded with an explicit `ContentLength`. (a7c1bb2)

**WebSockets**

- Booting the app again no longer fails with `EADDRINUSE`. (26e2e3a)
- `enabled: false` is honoured. (26e2e3a)

**Static assets**

- The AssetManager file watcher is closed on unload, so a file change can no longer reboot an app that has shut down. There is one AssetManager per app, and asset paths are reset on load instead of accumulating. (26e2e3a)

**Decorators and loading**

- `@job` no longer requires the file name to match the class name. (efdf449)
- The OAuth provider no longer disables TLS certificate verification process-wide (see Security). (142c622)

### Security

- **TLS verification is no longer disabled.** The OAuth provider import set `https.globalAgent.options.rejectUnauthorized = false`, which turned off certificate checks for the whole process. This line is removed. (142c622)
- **`jsonwebtoken` 9** fixes CVE-2022-23529, CVE-2022-23539, CVE-2022-23540 and CVE-2022-23541. (10d6260)
- **`class-validator` 0.15** resolves a critical finding from the dependency audit. (10d6260)
- **`dotenv-expand` is removed.** Its newer versions (1000.0.0+) run shell command substitution (`$(...)`) while expanding `.env` values; Bun's own expansion does not. (9ea4f00)

### Removed

**Packages**

Apps that imported any of these directly, or relied on them transitively, need to add them to their own `package.json` or migrate:

- Runtime: `uWebSockets.js` (git dependency), `ioredis` and its types, `aws-sdk` (v2), `axios` (use `fetch`), `chokidar`, `glob`, `path-to-regexp`, `read-chunk`, `is-image`, `is-video`, `mime` (use `Bun.file(path).type`), `ws`, `@types/ws`, `dotenv` and `dotenv-expand` (Bun loads `.env`), `middie`, `cookies`, `dayjs`, `node-fetch`, `qs`, `bufferutil`, `utf-8-validate`.
- Runtime: `ts-node` (it was listed as a runtime dependency).
- Dev: `ts-node-dev`, Jest, the `@babel/*` set and `babel-loader`, and stale `@types/*` packages (`node`, `chokidar`, `busboy`, `connect`, `dotenv`, `glob`, `mime`, `ioredis`, `redis`).

**Behaviour**

- The `https.globalAgent` TLS override (see Security).
- Legacy WebSocket config: `options`, `uWebsocketAppOptions` and `uWebsocketServerBehaviour` (see Breaking changes).
