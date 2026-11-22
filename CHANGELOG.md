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

**Security**

- **`APP_KEY` is required and must be at least 32 characters.** The `'1234'` default is gone; the app refuses to boot (encryption, JWT and cookies) with a missing or short key. Generate one with `bun -e "console.log(require('crypto').randomBytes(32).toString('base64url'))"`. (5b76c3a)
- **`VerifyCsrfTokenMiddleware` now actually checks the token.** Non-GET/HEAD/OPTIONS requests must send the session's token as a `csrf_token` or `_token` field, or an `X-CSRF-TOKEN` / `X-XSRF-TOKEN` header, or get a 403. Routes that relied on it passing everything will now reject requests. Override `except` to skip paths. (5b76c3a)
- **CSRF tokens use SHA-256** instead of SHA-1, so tokens issued before the upgrade stop verifying. (5b76c3a)
- **`BaseUserProvider` throws.** It is the fallback when `Auth.userProvider` is not set, and it used to accept any credentials and return a user for any id. Configure a real provider (e.g. `ModelUserProvider`). (5b76c3a)
- **Session ids the server did not issue are replaced**, ids must be 32 hex characters, and **logging in rotates the session id and CSRF token** (the old session is destroyed). A form rendered in the same response as a login carries the old token. (5b76c3a)
- **Cookie config: `expires` and `maxAge` are removed; use `lifetime`** (seconds, counted from when each cookie is set). The old options were fixed `DateTime`s evaluated when the config loaded, so `DateTime.now().addDays(7)` expired a week after the server booted. Per-cookie `withExpiresAt()`/`withMaxAge()` are unchanged. (5b76c3a, a205885)

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

- **`QueryBuilder.delete()` without a `where()` throws** instead of deleting every document. Use the new `truncate()` to empty a collection. (4658082)
- **`delete()` returns whether a document was deleted** (`deletedCount`), on both the query builder and models. It used to return `true` whenever Mongo acknowledged the call, even if nothing matched. (4658082)
- **`Model.update()` returns whether the document exists** (it returned `acknowledged`), no longer removes relation keys from the object you pass, and passes `options` (e.g. `upsert`) on; it used to ignore them. (e5b3bcb)
- **`paginate()` always pages in `_id` order** and refuses an `orderBy` on any other field (`_id` cursors can't page by it). Cursors in responses are strings. (6c7ccdd)
- **`LocalFileProvider.makeDirectory(dir)` creates `dir` itself**; it used to create its parent. Paths that resolve outside a disk's root throw. (5ca3b98)
- A failed MongoDB connection at boot throws instead of calling `process.exit(0)`, and failing to create a model's indexes stops the boot instead of being logged. (aa6e3ea)
- **`QueryBuilder.update()` returns whether anything matched** (it returned `acknowledged`). (ed36da5)
- **Strings are only treated as ObjectIds when they are 24 hex characters.** `ObjectId.isValid()` also accepted any 12-character string and numbers, so values like `"hello world!"` in id fields were converted. Use `isObjectId()` from `@envuso/core/Database`. (ed36da5)
- **`EventDispatcher.dispatch()` and `EventManager.dispatch()` return a promise** you can await. Dispatcher classes are keyed by the class, so two dispatchers with the same name no longer share listeners. (9209174)
- **`getModelId()` throws on an unsaved model.** It used to generate a random id, so `refresh()`, `update()` and `delete()` on an unsaved model silently did nothing. (4658082)
- **CORS only allows listed origins.** The reference `ServerConfiguration` reflected any origin with `credentials: true`. It now allows the comma-separated `CORS_ORIGINS`, falling back to `APP_URL`. Add your frontends' origins to `CORS_ORIGINS`. (8e91aa0)
- **Encryption is AES-256-GCM.** `Encryption` (and cookie encryption, which used Rabbit) now use AES-256-GCM with a key derived from `APP_KEY` by HKDF. Anything encrypted by 2.x can't be decrypted: encrypted cookies from 2.x read as `null` (users are logged out once), and values you stored with `Encryption.encrypt()` must be re-encrypted. `RabbitEncryption`, `SimpleCryptoJS` and `CookieValuePrefix` are removed. `decrypt()` throws on tampered input; use `tryDecrypt()` for `null`. (6648b7f)
- **Cookies the browser sent aren't sent back** unless the app changes them. Each response used to re-send every request cookie with the default path, domain and expiry. (6648b7f)
- **OAuth needs a session unless `stateless()`.** `redirect()` throws without one, and a callback without a session fails the state check (it used to skip it). PKCE (S256) is sent by default; call `withoutPkce()` for a provider that rejects it. `with()` throws for `client_id`, `redirect_uri`, `response_type`, `state` and the PKCE parameters. (982ca6f)
- **WebSocket JWTs use the `envuso` subprotocol.** Clients offer `["envuso", token]` and the server answers `envuso`; the token is no longer echoed in the upgrade response. A token offered on its own still works, with a deprecation warning. Channel events only dispatch to methods the channel listener defines itself. (288ea75)
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

- **`vite()` and `inertia()` view helpers.** `{{{ vite('src/Resources/Ts/app.ts') }}}` outputs the Vite dev server's tags while it runs, otherwise the entries' CSS, preloads and scripts from the build manifest (`StaticAssetConfiguration.vite`: `hotFile`, `buildDirectory`). `{{{ inertia(page) }}}` outputs Inertia 1+'s initial page as an escaped JSON `<script>` plus the mount element; Inertia 0.x's `data-page` attribute is no longer read by current Inertia clients. The framework skeleton now uses Vite, Tailwind 4 and Inertia 3.
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
- `QueryBuilder.truncate()` deletes every document and returns how many. (4658082)

**Cache**

- `Cache.remember()` runs the callback once for concurrent misses, in one process and across processes (a short Redis lock, `lockTimeoutMs`, default 10s). A hit is one Redis read, and a cached `null` counts as a hit. (9209174)

**CSRF**

- Responses with a session set an **`XSRF-TOKEN` cookie** holding the CSRF token (readable by JavaScript, unencrypted). axios, and so Inertia, sends it back as `X-XSRF-TOKEN` on same-origin requests, which `VerifyCsrfTokenMiddleware` accepts, so Inertia apps get CSRF protection with no frontend code. Rename it with `Session.xsrfCookie`, or set that to `false` to turn it off. (a532357)
- `Cookie.withEncryption(false)` sends a single cookie unencrypted when `Session.cookie.encrypted` is on. (a532357)

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

**Routing and errors**

- `@query` parameters are converted by their declared type: `?n=0` is `0` (was a 500), `?flag=false` is `false` (was `true`), and values that can't be converted are a 400 instead of a 500. (4658082)
- Fastify's own client errors (invalid JSON 400, 413 payload too large, 415 unsupported media type) keep their status code instead of becoming 500. Errors raised before the request context exists no longer crash the error handler. (4658082)
- `ExceptionHandler`'s `ignoredExceptions`, `reportableExceptions` and `renderableExceptions` never matched anything (a list of classes was checked for an instance), and an exception in one ignore list was still handled. HTML error pages use the exception's status code instead of always 500. (4658082)

**Requests and uploads**

- Two of the same parameter decorator on one method (e.g. two `@query` params) both bind; the second used to replace the first. Arguments are passed at their parameter's position: an undecorated parameter shifted every later argument left. (65c805e)
- Multipart requests: every file is kept (only the first was), text fields before and after files reach the body, empty file inputs are skipped, and a form without a file no longer crashes. (aa6e3ea)
- Uploaded files get a UUID temp name and the extension from the client's filename is reduced to `[a-z0-9]`, so a filename like `x./../../evil` can't write outside the temp directory. The temp directory is created if missing. (aa6e3ea)

**Models and queries**

- Pagination: invalid cursors are a 400 (were a 500), pages no longer skip or repeat documents, `hasNext` is no longer `true` on the last page, and `before` cursors return the previous page. (6c7ccdd)
- `with()` queries applied `$limit` before `$sort`/`$skip`, so a limit picked arbitrary documents. (6c7ccdd)
- `Model.update()` makes one round trip instead of two. (e5b3bcb)
- `where()`, `update()` and `create()` no longer change the object you pass when converting ids. (ed36da5)
- `hasOne`/`belongsTo` lookups fetch one related document instead of all of them. (ed36da5)
- Model indexes are only created when missing or changed instead of dropped and rebuilt on every boot. (aa6e3ea)
- `Model.load()` on a document deleted since it was loaded no longer crashes. (aa6e3ea)

**Storage**

- `LocalFileProvider`: on Windows every directory creation failed (paths were split on `/`) and `write()`/`makeDirectory()` never settled on errors; both reject now. `directoryExists()` checked whether `isDirectory` existed instead of calling it. Written files report `file.txt` instead of `file..txt`. (5ca3b98)

**Models**

- `Model.save()` returns the model when inserting (it returned `undefined`; updates already returned the model). (4658082)

**Config**

- `ConfigRepository.set()` and `has()` treat the file name case-insensitively like `get()`, so `set('Session.x', …)` is visible to `get('session.x')`. (4658082)

**Sessions**

- Sessions are saved before the response is sent (`onSend`) instead of after (`onResponse`), so a request that follows quickly no longer reads stale session data. (5b76c3a)

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

- **Routes after `App.reboot()`** (e.g. the asset watcher): the old routes were never cleared, so every route logged a clash and the stale route kept being served. (e360856)
- **`Envuso.addExceptionHandler()` was ignored.** The handler is now called first: return a `Response`, or the `reply` once you've sent it, or nothing to fall back to the `ExceptionHandler`. (e360856)
- **`reflect-metadata` is imported by the package entry**, so apps no longer have to import it first. (e360856)
- **The queue only waits between polls when nothing was picked up.** It slept `waitTimeMs` after every pass, capping short jobs at about one per worker per second.

- **Decorated model fields under Bun.** Bun leaves class fields that have a decorator and no initialiser off the instance, so `_id`, `@id` fields, relations and `@Exclude()`d fields weren't model fields: `load()` attached no relations, extra `@id` fields weren't converted, and fields with only class-transformer decorators (e.g. `User.password` with `@Exclude()`) were never saved. Field names now also come from decorator metadata. (19894eb)
- **S3 `deleteDirectory()` deletes the files in the directory**, not just the `dir/` marker object, and refuses `/`. (94df217)

- **HTML error pages were sent with status 200.** `response().view()` always used 200, so 404/500 pages rendered for browsers (and the error page for a view that fails to render) went out as successes. `view()` takes a status code.

### Security

- **CSRF protection was a no-op**: the middleware compared the session's secret with the session's own token and never read what the client sent. CSRF salts used `Math.random`; they now use `crypto.randomInt`. (5b76c3a)
- **The default app key `'1234'`** let anyone forge JWTs and session cookies when `APP_KEY` was unset. (5b76c3a)
- **An app without a configured user provider authenticated everyone** (`BaseUserProvider`). (5b76c3a)
- **Session fixation**: client-chosen session ids were accepted and the id was not changed on login. The file session driver also used the id in a file path with only a length check. (5b76c3a)
- **Session cookies** in the reference config are `httpOnly`, `secure` in production and last 7 days (were readable from JS, never `secure`, 5 years). (5b76c3a)
- **TLS verification is no longer disabled.** The OAuth provider import set `https.globalAgent.options.rejectUnauthorized = false`, which turned off certificate checks for the whole process. This line is removed. (142c622)
- **`jsonwebtoken` 9** fixes CVE-2022-23529, CVE-2022-23539, CVE-2022-23540 and CVE-2022-23541. (10d6260)
- **`class-validator` 0.15** resolves a critical finding from the dependency audit. (10d6260)
- **`dotenv-expand` is removed.** Its newer versions (1000.0.0+) run shell command substitution (`$(...)`) while expanding `.env` values; Bun's own expansion does not. (9ea4f00)

- **OAuth login CSRF**: without a session the state check was skipped. State is now compared in constant time and is single-use, and PKCE is on by default. `with()` could override `redirect_uri`. (982ca6f)
- **Cookie encryption had no integrity** (Rabbit, with a prefix check). `Encryption` used CryptoJS AES with one key for AES and HMAC, a non-constant-time MAC compare and 100 PBKDF2 iterations. Both are replaced by AES-256-GCM; cookies are bound to their name. (6648b7f)
- **CORS reflected any origin with credentials.** (8e91aa0)
- **WebSockets**: clients could dispatch any method on a channel listener by event name (now only its own methods), the JWT was echoed back in `Sec-WebSocket-Protocol`, and connection ids used `Math.random` (now `crypto.randomUUID`). (288ea75)
- **CSRF tokens are an HMAC** of the salt keyed by the session secret (were a plain hash). `timeSafeCompare` no longer uses the deprecated `pseudoRandomBytes`. (3db0d56)

### Removed

**Packages**

Apps that imported any of these directly, or relied on them transitively, need to add them to their own `package.json` or migrate:

- Runtime: `uWebSockets.js` (git dependency), `ioredis` and its types, `aws-sdk` (v2), `axios` (use `fetch`), `chokidar`, `glob`, `path-to-regexp`, `read-chunk`, `is-image`, `is-video`, `mime` (use `Bun.file(path).type`), `ws`, `@types/ws`, `dotenv` and `dotenv-expand` (Bun loads `.env`), `middie`, `cookies`, `dayjs`, `node-fetch`, `qs`, `bufferutil`, `utf-8-validate`, `crypto-js` and its types, `random-bytes`.
- Runtime: `ts-node` (it was listed as a runtime dependency).
- Dev: `ts-node-dev`, Jest, the `@babel/*` set and `babel-loader`, and stale `@types/*` packages (`node`, `chokidar`, `busboy`, `connect`, `dotenv`, `glob`, `mime`, `ioredis`, `redis`).

**Behaviour**

- The `https.globalAgent` TLS override (see Security).
- Legacy WebSocket config: `options`, `uWebsocketAppOptions` and `uWebsocketServerBehaviour` (see Breaking changes).
