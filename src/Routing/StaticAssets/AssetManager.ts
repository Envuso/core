import {FastifyInstance, FastifyReply, FastifyRequest, HookHandlerDoneFunction} from "fastify";
import fs from "fs";
import * as path from "path";
import {App, ConfigRepository, resolve} from "../../AppContainer";
import Environment from "../../AppContainer/Config/Environment";
import {FileLoader, Log} from "../../Common";
import {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
import mime, {getType} from 'mime';
import {Routing} from "../Route/Routing";
import {assetHelperGlobal} from "./GlobalHandlers/AssetHelperGlobal";
import {mixViewHelperGlobal} from "./GlobalHandlers/MixViewHelperGlobal";
import {FSWatcher, watch, WatchOptions} from 'chokidar';

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
	 * When the above "watch" option is set to true, we can define any options here which will be passed to chokidar
	 *
	 * @type {WatchOptions}
	 */
	private watchOptions: WatchOptions = {};

	/**
	 * A list of assets we want to create paths for
	 * We store these here so that when the server
	 * is booted, we can then create the routes
	 * @type {string[]}
	 * @private
	 */
	private static assetPaths: string[] = [];

	private watcher: FSWatcher = null;

	/**
	 * Load our configuration for asset management
	 */
	loadConfiguration() {
		const config = resolve(ConfigRepository);

		this.rootPath  = config.get<string, string>('paths.root');
		this.assetPath = path.join(process.cwd(), config.get<string, string>('static.assetsPath'));
		this.assetDir  = this.assetPath.replace(this.rootPath, '');

		this.watch        = config.get<string, boolean>('static.watch');
		this.watchOptions = config.get<string, WatchOptions>('static.watchOptions', {});
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

		if (this.watch) {
			const watchPath = path.join(this.assetPath, '**/*');
			this.watcher    = watch(watchPath, this.watchOptions);

			Log.label('Asset Watcher').success(`Watching path: ${watchPath}`);

			this.watcher.on('all', async (eventName: 'add' | 'addDir' | 'change' | 'unlink' | 'unlinkDir', filePath: string, stats?: fs.Stats) => {
				Log.label('Asset Watcher').info(`Event ${eventName} triggered for path: ${filePath}. Reloading server.`);
				await App.reboot(false);
			});
		}

		const files = await FileLoader.filesInPathAsync(path.join(this.assetPath, '**/*'), {nodir : true});

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

		const handlerStream = (request: FastifyRequest, reply: FastifyReply, filePath: string) => {
			try {
				if (!fs.statSync(filePath)) {
					return reply.callNotFound();
				}
			} catch (error) {
				return reply.callNotFound();
			}

			const stream = fs.createReadStream(filePath);

			const mimeType = mime.getType(filePath);
			if (!mimeType) {
				return reply.callNotFound();
			}

			reply.type(mimeType).send(stream);
		};

		server.get(route, {prefixTrailingSlash : 'no-slash'}, (request, reply) => handlerStream(request, reply, assetPath));
		server.head(route, {prefixTrailingSlash : 'no-slash'}, (request, reply) => handlerStream(request, reply, assetPath));

		Log.info('Asset route registered @ "' + route + '"');
	}

	/**
	 * We'll register some global helpers for edge.js so that we can use
	 * handy little `mix()` and `asset()` helpers in our template files.
	 *
	 * @private
	 */
	private registerAssetViewHelper() {
		const viewManager = resolve<ViewManagerContract>('ViewManager');

		viewManager.registerGlobal('mix', mixViewHelperGlobal(this.assetDir, this.assetPath));
		viewManager.registerGlobal('asset', assetHelperGlobal(this.assetDir, this.assetPath));
	}

	private cleanAssetPath(filePath: string): string {
		return filePath
			.replace(this.assetPath.replace(/\\/g, '/'), '')
			.replace(/^\//, '');
	}

	private prepareAssetPath(filePath: string): string {
		return encodeURI(filePath.replace(/\\/g, '/')).replace(/\/\//g, '/');
	}

	public static hasAssetPath(filePath: string): boolean {
		return AssetManager.assetPaths.includes(filePath);
	}

	public static getAssetPaths(): string[] {
		return AssetManager.assetPaths;
	}
}
