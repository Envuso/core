import type {FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction} from "fastify";
import fs from "fs";
import * as path from "path";
import {App} from "../../AppContainer/App";
import {ConfigRepository} from "../../AppContainer/Config/ConfigRepository";
import {resolve} from "../../AppContainer/helpers";
import Environment from "../../AppContainer/Config/Environment";
import {FileLoader} from "../../Common/Utility/FileLoader";
import {Log} from "../../Common/Logger/Log";
import type {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
import {Routing} from "../Route/Routing";
import {assetHelperGlobal} from "./GlobalHandlers/AssetHelperGlobal";
import {viteViewHelperGlobal, type ViteOptions} from "./GlobalHandlers/ViteViewHelperGlobal";
import {mixViewHelperGlobal} from "./GlobalHandlers/MixViewHelperGlobal";

export type AssetWatchOptions = Omit<fs.WatchOptions, 'recursive'>;

export class AssetManager {

	/**
	 * Absolute path to our assets directory
	 *
	 * @type {string}
	 * @private
	 */
	private assetPath: string;

	/**
	 * Just the raw assets directory, for example, rather than
	 * /users/sam/projects/envuso/assets it would be /assets
	 *
	 * @type {string}
	 * @private
	 */
	private assetDir: string;

	/**
	 * The root project path
	 *
	 * @type {string}
	 * @private
	 */
	private rootPath: string;

	/**
	 * Essentially, by setting this to true, when our assets registered in our above asset's path
	 * the server will be re-booted automatically.
	 *
	 * without this, the server won't have your routes/asset's registered if you were to
	 * (for example) boot the server, then build your frontend asset's.
	 *
	 * By default, this is disabled so that you don't consume extra RAM in development
	 * It will also be disabled in production(you shouldn't be using this in production)
	 *
	 *
	 * @type {boolean}
	 */
	private watch: boolean = false;

	/**
	 * When the above "watch" option is set to true, these options are passed to fs.watch
	 */
	private watchOptions: AssetWatchOptions = {};

	/**
	 * A list of assets we want to create paths for
	 * We store these here so that when the server
	 * is booted, we can then create the routes
	 * @type {string[]}
	 * @private
	 */
	private static assetPaths: string[] = [];

	private watcher: fs.FSWatcher = null;
	private rebootTimer: ReturnType<typeof setTimeout> = null;

	/**
	 * Load our configuration for asset management
	 */
	loadConfiguration() {
		const config = resolve(ConfigRepository);

		this.rootPath  = config.get<string, string>('paths.root');
		this.assetPath = path.join(process.cwd(), config.get<string, string>('static.assetsPath'));
		this.assetDir  = this.assetPath.replace(this.rootPath, '');

		this.watch        = config.get<string, boolean>('static.watch');
		this.watchOptions = config.get<string, AssetWatchOptions>('static.watchOptions', {});
		if (Environment.isProduction()) {
			this.watch = false;
		}
	}

	/**
	 * Once the framework has booted, we'll call load
	 *
	 * This will look inside our configured asset path and prepare
	 * all the asset paths we want to register routes for
	 *
	 * @returns {Promise<void>}
	 */
	async load() {
		this.loadConfiguration();

		// Static, so a reboot must start from scratch rather than append duplicates
		AssetManager.assetPaths = [];

		if (this.watch) {
			const watchPath = this.assetPath;

			this.watcher = fs.watch(watchPath, {...this.watchOptions, recursive : true}, (eventName, filePath) => {
				// Editors often emit several events per save; reboot once per burst
				clearTimeout(this.rebootTimer);
				this.rebootTimer = setTimeout(async () => {
					if (!this.watcher || !App.isBooted()) {
						return;
					}
					Log.label('Asset Watcher').info(`Event ${eventName} triggered for path: ${filePath}. Reloading server.`);
					await App.reboot(false);
				}, 100);
			});

			Log.label('Asset Watcher').success(`Watching path: ${watchPath}`);
		}

		const files = await FileLoader.filesInPathAsync(path.join(this.assetPath, '**/*'), {onlyFiles : true});

		for (let file of files) {
			AssetManager.assetPaths.push(
				this.prepareAssetPath(path.join(this.assetDir, this.cleanAssetPath(file)))
			);
		}
	}

	/**
	 * During fastify server initialisation, this will be called, so we can register all of our {@see assetPaths} as routes
	 *
	 * @param {FastifyInstance} server
	 */
	public registerAssetPaths(server: FastifyInstance) {
		this.loadConfiguration();

		this.registerAssetViewHelper();


		for (let assetPath of AssetManager.assetPaths) {
			if (Routing.get().hasPathRegistered(assetPath)) {
				Log.error('Cannot register public asset path `' + assetPath + '` because this is registered as a controller path.');
				continue;
			}

			this.registerAssetRoute(server, assetPath);
		}
	}

	/**
	 * Called during server initialisation from {@see registerAssetPaths}
	 *
	 * This will register the actual routes and handlers for serving the assets
	 *
	 * @param {FastifyInstance} server
	 * @param {string} route
	 * @private
	 */
	private registerAssetRoute(server: FastifyInstance, route: string) {
		const assetPath = path.join(this.rootPath, route);

		//		server.addHook('onRequest', (request: FastifyRequest, reply: FastifyReply, done: HookHandlerDoneFunction) => {
		//			if (!AssetManager.hasAssetPath(request.raw.url) && ['get', 'head'].includes(request.method.toLowerCase())) {
		//				done();
		//			}
		//
		//			handlerStream(request, reply, assetPath)
		//		});

		// Bun resolves the type from the extension; unknown extensions come back as octet-stream.
		// Worked out once here instead of per request (as was a statSync of the file)
		const type     = Bun.file(assetPath).type;
		const mimeType = type === 'application/octet-stream' ? null : type;

		const handlerStream = (request: FastifyRequest, reply: FastifyReply, filePath: string) => {
			if (!mimeType) {
				return reply.callNotFound();
			}

			// A file deleted since boot is a 404; the stream had no error handler at all
			const stream = fs.createReadStream(filePath);
			stream.once('error', () => {
				if (!reply.sent) {
					reply.callNotFound();
				}
			});
			stream.once('open', () => reply.type(mimeType).send(stream));
		};

		// Fastify 5 adds the HEAD route for a GET itself; registering it too failed the boot
		server.get(route, {prefixTrailingSlash : 'no-slash'}, (request, reply) => handlerStream(request, reply, assetPath));

		Log.info('Asset route registered @ "' + route + '"');
	}

	/**
	 * We'll register some global helpers for edge.js so that we can use
	 * handy little `mix()`, `asset()` and `vite()` helpers in our template files.
	 *
	 * @private
	 */
	private registerAssetViewHelper() {
		const viewManager = resolve<ViewManagerContract>('ViewManager');

		viewManager.registerGlobal('mix', mixViewHelperGlobal(this.assetDir, this.assetPath));
		viewManager.registerGlobal('asset', assetHelperGlobal(this.assetDir, this.assetPath));

		const config = resolve(ConfigRepository);
		viewManager.registerGlobal('vite', viteViewHelperGlobal(
			this.rootPath,
			config.get<string, string>('static.assetsPath'),
			config.get<string, ViteOptions>('static.vite', {}),
		));
	}

	private cleanAssetPath(filePath: string): string {
		// Relative to the asset directory, with "/" separators. FileLoader returns OS paths,
		// so stripping a "/"-separated prefix left Windows paths absolute
		return path.relative(this.assetPath, path.resolve(filePath)).split(path.sep).join('/');
	}

	private prepareAssetPath(filePath: string): string {
		return encodeURI(filePath.replace(/\\/g, '/')).replace(/\/\//g, '/');
	}

	/**
	 * Stop watching; called when the app unloads, so a file change can't
	 * reboot an app that was shut down.
	 */
	public unload() {
		clearTimeout(this.rebootTimer);
		this.rebootTimer = null;
		this.watcher?.close();
		this.watcher = null;
	}

	public static hasAssetPath(filePath: string): boolean {
		return AssetManager.assetPaths.includes(filePath);
	}

	public static getAssetPaths(): string[] {
		return AssetManager.assetPaths;
	}
}
