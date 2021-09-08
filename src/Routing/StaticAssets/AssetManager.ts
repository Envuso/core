import {FastifyInstance, FastifyReply, FastifyRequest} from "fastify";
import fs from "fs";
import {glob} from "glob";
import * as path from "path";
import {URL} from "url";
import * as util from "util";
import {debug} from "winston";
import {ConfigRepository, resolve} from "../../AppContainer";
import {Log} from "../../Common";
import {ViewManagerContract} from "../../Contracts/Routing/Views/ViewManagerContract";
import {ControllerManager} from "../Controller/ControllerManager";
import mime from 'mime';

const globPromise = util.promisify(glob);

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
	 * A list of assets we want to create paths for
	 * We store these here so that when the server
	 * is booted, we can then create the routes
	 * @type {string[]}
	 * @private
	 */
	private static assetPaths: string[] = [];

	loadConfiguration() {
		const config = resolve(ConfigRepository);

		this.rootPath  = config.get<string, string>('paths.root');
		this.assetPath = config.get<string, string>('static.assetsPath');
		this.assetDir  = this.assetPath.replace(this.rootPath, '');
	}

	async load() {
		this.loadConfiguration();

		const files = await globPromise(path.join(this.assetPath, '**/*'), {nodir : true});

		for (let file of files) {
			file = file
				.replace(this.assetPath.replace(/\\/g, '/'), '')
				.replace(/^\//, '');

			AssetManager.assetPaths.push(
				encodeURI(path.join(this.assetDir, file)).replace(/\/\//g, '/')
			);
		}

	}

	public registerAssetPaths(server: FastifyInstance) {
		this.loadConfiguration();

		this.registerAssetViewHelper();

		for (let assetPath of AssetManager.assetPaths) {
			if (ControllerManager.hasPathRegistered(assetPath)) {
				Log.error('Cannot register public asset path `' + assetPath + '` because this is registered as a controller path.');
				continue;
			}

			this.registerAssetRoute(server, assetPath);
		}
	}

	private registerAssetRoute(server: FastifyInstance, route: string) {
		const assetPath = path.join(this.rootPath, route);

		const handlerStream = (request: FastifyRequest, reply: FastifyReply, filePath: string) => {
			try {
				if (!fs.statSync(filePath)) {
					return reply.callNotFound();
				}
			} catch (error) {
				return reply.callNotFound();
			}

			const stream = fs.createReadStream(filePath);

			const mimeType = mime.lookup(filePath);

			if (!mimeType) {
				return reply.callNotFound();
			}

			reply.type(mimeType).send(stream);
		};

		server.get(route, {prefixTrailingSlash : 'no-slash'}, (request, reply) => handlerStream(request, reply, assetPath));
		server.head(route, {prefixTrailingSlash : 'no-slash'}, (request, reply) => handlerStream(request, reply, assetPath));

		Log.info('Asset route registered @ "' + route + '"');
	}


	private registerAssetViewHelper() {
		const viewManager = resolve<ViewManagerContract>('ViewManager');

		viewManager.registerGlobal('mix', (asset) => {
			let relativeAsset = path.join(this.assetDir, asset);

			let hotFileContents = null;
			if (fs.existsSync(path.join(this.assetPath, 'hot'))) {
				hotFileContents = fs.readFileSync(path.join(this.assetPath, 'hot'), {encoding : 'utf-8'}).trim();
			}

			let mixManifest   = null;
			try {
				mixManifest = JSON.parse(fs.readFileSync(path.join(this.assetPath, 'mix-manifest.json'), {encoding : 'utf-8'}));
			} catch (error) {
				// Probably a file does not exist error...
			}

			const assetVersionedName = mixManifest[relativeAsset.replace(this.assetDir, '')] ?? null;
			if (assetVersionedName) {
				if (hotFileContents !== null) {
					return (new URL(assetVersionedName, hotFileContents)).toString();
				}

				return path.join(this.assetDir, assetVersionedName);
			}


			if (!AssetManager.assetPaths.includes(relativeAsset)) {
				throw new Error(`The asset ${asset} that you're trying to load does not exist in your assets directory(${this.assetPath}). This is what we're looking for: ${relativeAsset}`);
			}

			return relativeAsset;
		});

		viewManager.registerGlobal('asset', (asset) => {
			let relativeAsset = path.join(this.assetDir, asset);

			if (!AssetManager.assetPaths.includes(relativeAsset)) {
				throw new Error(`The asset ${asset} that you're trying to load does not exist in your assets directory(${this.assetPath}). This is what we're looking for: ${relativeAsset}`);
			}

			return relativeAsset;
		});
	}
}
