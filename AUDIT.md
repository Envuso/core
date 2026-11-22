# Envuso Core — Audit (2026-11-22)

Static review of the codebase as of commit `0fd1d4d` (last touched April 2022). Nothing was run against live Mongo/Redis.

Legend: ✅ = verified directly against source · ⚠️ = reported by a subagent review, not yet independently verified · ❌ = checked and found to be wrong

---

## 0. Current state / tooling

- ✅ Stock build is broken: TS is pinned to `4.5.5`, which can't parse the `@types/node@16.18.x` that a fresh install pulls (1,366 errors, all in `node_modules`).
- ✅ Source type-checks cleanly on TS 5.6 with `--skipLibCheck`. The only error is the bogus `"reflect-metadata"` entry in `tsconfig.json` → `compilerOptions.types`.
- ✅ `npm audit`: 55 vulnerabilities (2 critical, 15 high). Direct: `class-validator` (critical), `fastify@3`, `fastify-multipart`, `jsonwebtoken@8`, `axios@0.21`, `@inertiajs/*`.
- ✅ Major versions behind: fastify 3→5, mongodb 4.2.2 (pinned)→7, ioredis 4→6, jest 26→30, TS 4.5→7, dotenv 8→18, ws 7→8, chalk/glob/file-type etc.
- ✅ `fastify-*` plugins are pre-rename (now `@fastify/*`). `middie` is registered but `.use()` is never called.
- ✅ `aws-sdk` v2 is end-of-life. Needs `@aws-sdk/client-s3` plus `@aws-sdk/s3-request-presigner`.
- ✅ `uWebSockets.js` is fetched from GitHub over git+ssh (`#v19.3.0`), not from the npm registry.
- ✅ Frontend/build tooling sits in runtime `dependencies`: `laravel-mix`, `ts-node`, `ts-node-dev`, several `@types/*`. Vue/babel/webpack are devDeps of a backend core.
- ⚠️ Tests: ~160 tests across 17 specs. No `test` script in package.json. They need live MongoDB + Redis + an uncommitted `.env`. `model.spec.ts` drops `users`/`books` in whatever DB `.env` points at. `unloadApp(true)` calls `process.exit`. jest `testRegex` also matches helper files. Queue, Events and the Redis queue have **zero** tests.
- ✅ No custom TS transformers are used. Parameter names are recovered by parsing `Function.prototype.toString()` (`src/Common/Decorators/DecoratorHelpers.ts:65`), which breaks under minification and with default values that contain commas.
- ⚠️ `tsconfig` has `strict: false`, ~130 `any` casts, several `@ts-ignore`.

---

## 1. Security

### High
- ✅ **Default app key `'1234'`** — `src/Config/AppConfiguration.ts:27`. This key signs JWTs and encrypts cookies and session ids. If `APP_KEY` is unset, JWTs and session cookies can be forged. → Refuse to boot without a strong key.
- ✅ **CSRF check is a no-op** — `src/Routing/Middleware/Middlewares/VerifyCsrfTokenMiddleware.ts:13` verifies `session.getCsrfSecret()` against `session.getCsrfToken()`. That compares the session to itself and never reads the submitted token or header. The middleware is also not registered globally.
- ✅ **TLS verification disabled process-wide** — `src/OAuthProvider/BaseOAuthProvider.ts:15` sets `https.globalAgent.options.rejectUnauthorized = false` at import time.
- ✅ **`BaseUserProvider` authenticates anything** — `src/Authentication/UserProvider/BaseUserProvider.ts:14,22`. `getUser` does no lookup and `verifyLoginCredentials` does no password check. Latent: it is the fallback in `Authentication.ts:56` when no provider is configured.
- ✅ **Session cookie flags** — `src/Config/SessionConfiguration.ts:16-17` sets `httpOnly: false, secure: false`, with a 5-year lifetime.
- ⚠️ **Session fixation** — the session is never regenerated on login (`Authentication.ts:88-109`). Client-supplied session ids are accepted if they are 32 chars long (`Session.ts:184`).

### Medium
- ⚠️ Cookie encryption uses Rabbit (`src/Crypt/RabbitEncryption.ts:21`), a stream cipher with no MAC, so ciphertext is malleable. The only integrity check is a prefix match.
- ⚠️ Homemade AES in `src/Crypt/SimpleCryptoJS.ts`:
  - Non-constant-time MAC compare (`:190`).
  - Same key for AES and HMAC (`:207-226`; there is a TODO).
  - PBKDF2 with only 100 iterations (`:49`).
- ⚠️ OAuth flaws:
  - No PKCE.
  - The state check is skipped when there is no session (`BaseOAuthProvider.ts:181-188`), which allows login CSRF.
  - Non-constant-time state compare.
  - `with()` can override `redirect_uri` and `client_id`.
- ⚠️ WebSockets: `subscription[event]` is dispatched with a client-supplied event name and no allowlist (`src/WebSockets/WebSocketServer.ts:347-353`).
- ⚠️ JWT is passed in `Sec-WebSocket-Protocol`, echoed back in the upgrade response, and likely logged. There is no aud/iss check and no revocation. HS256 is pinned (good).
- ⚠️ CORS reflects any origin with `credentials: true` (`src/Config/ServerConfiguration.ts:69-72`).

### Low
- ⚠️ `Math.random` is used for the CSRF salt (`CsrfRandom.ts:22`) and `Str.random` (WebSocket connection ids).
- ⚠️ CSRF token hash is plain SHA-1 rather than HMAC. `Compare.ts` uses the deprecated `pseudoRandomBytes`.
- ⚠️ `Hash.ts:12` ignores the `rounds` argument (always 10).

---

## 2. Correctness bugs

### Routing / request lifecycle
- ✅ **Arguments shift position** — `src/Routing/Route/Route.ts:260-280`. Arguments are `push`ed, not placed by index, so an unbound parameter shifts every later argument left.
- ✅ **`@request()` binds every parameter** — `RequestParam.canBind` returns `this instanceof RequestParam` and ignores the index (`RequestParam.ts:28`).
- ✅ **Plain returns are sent as 202 Accepted** — `Route.ts:336,347`.
- ⚠️ Several param decorators store single-slot metadata, so a second use overwrites the first:
  - `RouteQueryParam.ts:206`
  - `RequestBodyParam.ts:58`
  - `RouteUserParam.ts:106`
  - `DataTransferObjectParam.ts:98`
  - `RequestHeadersParam.ts:143`
- ⚠️ `RouteQueryParam.bind`: `if (!param) throw` makes `?n=0` and `?flag=false` return a 500.
- ⚠️ Exception mapping:
  - `shouldHandle` uses `||` where it should use `&&`.
  - `isReportable` can never be true.
  - View errors are hard-coded to 500.
  - Fastify's own 4xx errors (bad JSON, 413, 415) become 500, because `error.statusCode` is ignored.
- ⚠️ `Server.errorHandler` → `RequestContext.get()` can be empty, so the error handler itself throws.
- ⚠️ Routing:
  - `Routing.isInitiated()` never returns true.
  - `loadControllers` never clears routes.
  - The meta check uses `&&` where it should use `||`, then crashes on `.map`.
- ⚠️ `Route.ts:65-67` runs `match(routePath)(routePath)`, so params are the placeholder text, not real values.
- ⚠️ `ConfigRepository.set` doesn't lowercase the top-level key but `get` does.
- ⚠️ `Server.ts:161-163` doesn't await `register`. `setErrorHandling` is stored but never used.
- ⚠️ `ProcessUploadedFilesHook.ts:122` passes `undefined` when a multipart request has no file part, which then crashes.
- ⚠️ `src/index.ts` never imports `reflect-metadata`. Consumers must also call `Configuration.initiate()` manually, or boot crashes.
- ❌ ~~"Only the last Set-Cookie survives"~~ — Fastify's `reply.header` appends `set-cookie` (`fastify/lib/reply.js:242`). Not a bug.

### Database / ORM (Mongo)
- ✅ **`Model.save()` returns `undefined` on insert** — `src/Database/Mongo/Model.ts:230`. The update branch returns `this`.
- ⚠️ `new ObjectId(undefined)` on an unsaved model generates a random id, so delete/update/refresh silently target nothing.
- ⚠️ Write methods return `true` based on `acknowledged`, not on matched or modified counts.
- ⚠️ **`QueryBuilder.delete()` with no where calls `deleteMany({})`**, which wipes the collection (`QueryBuilder.ts:693`).
- ⚠️ `Model.load()` dereferences a null result (`Model.ts:61-69`).
- ⚠️ `update()` makes two extra round trips and mutates the caller's object.
- ⚠️ `ObjectId.isValid` accepts numbers and any 12-char string (query parts, decorators, route model binding).
- ⚠️ `toJSON` and query building mutate source objects in place.
- ⚠️ Paginator:
  - `new ObjectId(cursor)` on user input causes a 500 on bad input.
  - Cursor paging assumes `_id` order but only sorts when `orderBy` is set, so pages can skip or repeat.
- ⚠️ `createIndexes` drops and recreates all indexes on every boot and swallows errors.
- ⚠️ `DatabaseServiceProvider.ts:27` calls `process.exit(0)` on connection failure, which exits with a success code.
- ⚠️ `HAS_ONE` lookup has no `$limit`. Calling `load()`/`hasMany` in a loop is N+1 (`with()` is fine: it uses a single `$lookup`).

### Queue
- ✅ **Jobs never run with the default `retries = 0`** — `src/Queue/Jobs/Job.ts:13`. The Lua pop increments `attempts` to 1, and `Worker.ts:49` throws when `1 > 0`. Masked because `ImplementedJob` sets `retries = 3`.
- ⚠️ When the worker pool is full, the reserved payload is re-pushed without removal, creating duplicates.
- ⚠️ No visibility timeout. `recover()` requeues **all** reserved jobs on boot, so multiple instances run jobs twice.
- ⚠️ Run loop has no try/catch: one Redis error stops the queue.
- ⚠️ Worker: `JSON.parse` is outside the try block, the async IIFE has no catch, and a crashed worker isn't removed from `freeWorkers` (and the wrong element is spliced).
- ⚠️ Non-atomic `lRem` + `rpush`. No backoff. Requires Redis 6.2+.

### Events / Cache / Redis / Storage
- ⚠️ `dispatch` is async but typed `void`, so callers can't await it. Events are keyed by class name, so same-named classes collide.
- ⚠️ `Cache.remember` has no lock, so concurrent misses stampede.
- ⚠️ `Redis.ts:94` throws on a null TTL. `shutdown()` assumes the client exists.
- ⚠️ `LocalFileProvider.makeDirectory` never rejects, so errors hang forever. `originalName` produces `file..txt`.
- ⚠️ S3 `files`/`directories` don't paginate past 1000 keys. `ACL: 'public-read'` fails on buckets with ACLs disabled.

---

## 3. Performance
- ⚠️ Per request, each controller parameter loops over up to 7 metadata keys via `Reflect.getMetadata` (`Route.ts:212-257`). Binders should be compiled once per route.
- ⚠️ The controller is resolved and its method re-bound per request. A child container and an `InertiaRequest` are created per request.
- ⚠️ Every cookie is decrypted on every request.
- ⚠️ `AssetManager` calls `statSync` per request. `createReadStream` has no error listener.
- ⚠️ Queue loop sleeps 1s every iteration. Worker pool is hard-coded to 1 worker.

---

## 4. Architecture / design debt
- ⚠️ Fastify internals: `Hook.ts` deep-imports `fastify/lib/reply.js` and `fastify/lib/request.js` and uses `instanceof`. It identifies `done` via `fn.name === 'next'`. `RequestResponseContext` reads internal `routerMethod`.
- ⚠️ DI tokens are class names (breaks under minification). The controller registry is stored as metadata on the global `Reflect`.
- ⚠️ Global mutable state:
  - Module singletons (`App`, `RequestContextStore`, `Routing`).
  - Static arrays that grow on re-init (`ConfigurationFile`, `AssetManager`).
  - The shared global tsyringe container.
- Relies on legacy decorators: parameter decorators plus `emitDecoratorMetadata` / `design:paramtypes` for injection and route model binding.

---

## 5. Redesign candidates (proposed)
1. **Param injection**: keep the decorator + type-hint ergonomics (no per-route schemas — see Design principles). Compile per-route binders once at registration, indexed by position, so each request just runs a precomputed list. Isolate all `Reflect`/`design:*` reads behind one internal module so the metadata source can be swapped later without touching the user-facing API.
2. **Crypto**: replace CryptoJS/Rabbit/SimpleCryptoJS with `node:crypto` AES-256-GCM, with HKDF-derived subkeys for encryption and signing. Require a strong `APP_KEY` at boot.
3. **Queue**: replace with BullMQ (locking, stalled-job recovery, backoff, multi-instance), or rebuild on ZSET-based visibility timeouts.
4. **Fastify 5**: move to the `@fastify/*` plugins and remove the deep imports of Fastify internals.
5. **Tests**: Vitest (or `bun test`) with Testcontainers or `mongodb-memory-server`, an isolated DB per run, and a `test` script.
6. **Packaging**: move tooling out of runtime deps. Replace the git-sourced `uWebSockets.js` with the npm release or `ws@8` / `@fastify/websocket`.

## 6. Suggested order
1. Baseline: modern TS, fixed tsconfig, tests that run hermetically.
2. Small security and correctness fixes, each with a test.
3. Dependency upgrades.
4. Redesigns.

## 7. Bun + latest TS — findings (tested 2026-11-22)

Test file: a parameter decorator, a method decorator, and `Reflect.getMetadata("design:paramtypes")` on a method with `(string, Svc, number)` params.

| Toolchain | `experimentalDecorators` | `emitDecoratorMetadata` / `design:paramtypes` |
|---|---|---|
| Bun 1.4.4 (reads tsconfig flags) | ✅ works | ✅ `[String, Svc, Number]` |
| TypeScript 6.x | ✅ works | ✅ |
| TypeScript 7.0.2 (native) | ✅ works | ✅ |

- ✅ The legacy decorator + reflect-metadata model this codebase depends on still works everywhere. It is **not** a blocker for Bun or TS 7.
- ✅ The project on TS 6/7 only fails on tsconfig options:
  - `moduleResolution: node` (node10), `baseUrl` and `downlevelIteration` are deprecated in 6 and removed in 7.
  - No source imports rely on `baseUrl`.
  - The `paths` entry for `class-transformer` can be dropped.
- TC39 standard decorators (TS 5.0+) are the long-term direction, but they have **no parameter decorators** and no type metadata emit. Moving to them would mean redesigning controller injection (e.g. schema-first routes), not a mechanical port.
- Custom transformers:
  - The codebase uses none (`func.toString()` parsing is used instead).
  - `tsc` never supported them via tsconfig (only ts-patch or the compiler API).
  - Bun doesn't run TS transformers; use `Bun.plugin` `onLoad` source transforms instead.
  - TS 7's native compiler has no JS transformer plugin API.
  - → Don't build anything that depends on TS transformers.
- Bun-specific risks to verify (not yet tested):
  - `uWebSockets.js` native addon (Bun has uWS-backed websockets built into `Bun.serve`).
  - `bcrypt` native addon (`Bun.password` is built-in).
  - `worker_threads` usage in the queue.
  - Fastify on Bun's `node:http` compat.
  - The `fastify/lib/*` deep imports.

### Bun blockers found while running the suite (2026-11-22)
- ✅ `uWebSockets.js@19.3.0` has no binary for Bun's ABI, and it was imported eagerly, so nothing loaded. **Fixed**: it is now type-only imports plus a lazy `require` in `WebSocketServer`. WebSockets still won't work on Bun until they're moved to `Bun.serve` websockets.
- ✅ Type re-exported as a value (`DependencyContainer` in `AppContainer/index.ts`). **Fixed**. `isolatedModules: true` is now on, so `tsc` catches these.
- ✅ **Decorator metadata + circular imports.** Bun emits `design:paramtypes` and `design:type` as direct ESM references. tsc emits a guarded `typeof X !== "undefined"` under CommonJS, which quietly falls back to `Object`. So under Bun, a decorated class that references a class still in the TDZ throws `Cannot access 'X' before initialization`.
  - madge reports **260 cycles**. The largest group is ~151 of 314 files, mostly through barrel `index.ts` files and value-imported contracts.
  - Two kinds of cycle:
    1. **Framework-internal** (barrels, contracts): fixable by importing concrete files and using `import type` (enforce with `verbatimModuleSyntax`).
    2. **User-model relations** (User ↔ Book): inherent to an ORM. Tested: `books?: Relation<Book>` with `type Relation<T> = T` (TypeORM's approach) avoids the crash on Bun. Plain `books?: Book` crashes.

## 8. Design principles (decided)
- Envuso is "Laravel for TS": simple, elegant, easy to use, moderately fast. Ergonomics win over raw speed where they conflict.
- **No schema-per-route.** Injection stays driven by decorators and type hints (route model binding, DTO params, `@user`, container injection).
- **Stay on legacy `experimentalDecorators` + `emitDecoratorMetadata` deliberately.** TC39 decorators lack parameter decorators and type metadata, which would force schema-style APIs.

- **Bun is the primary runtime** (decided 2026-11-22). Node compatibility is nice-to-have.

## 9. Open questions
- Test services: Testcontainers (real Mongo + Redis in Docker) vs mongodb-memory-server + something for Redis. See discussion.
