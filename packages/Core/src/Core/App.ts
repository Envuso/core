import {ServerServiceProvider} from "@Providers/Http/Server/ServerServiceProvider";
import {Log} from "@Providers/Log/Log";
import {FastifyInstance} from "fastify";
import Container, {LOGGER_IDENTIFIER} from "./Container";
import {Server} from "@Providers/Http/Server/Server";
import {ServiceProvider} from "@Providers/ServiceProvider";
import {Config} from "@Config";

export class App {

	/**
	 * The Fastify Server wrapped with our own logic
	 * @private
	 */
	private _server: Server;

	/**
	 * The instance of Fastify that {@see Server} is using
	 *
	 * @private
	 */
	private _httpServer: FastifyInstance;

	registerProviders() {
		for (const ProviderModule of Config.providers) {
			Container.bind<ServiceProvider>(ProviderModule).to(ProviderModule);
		}
	}

	/**
	 * Lets get all the aidss
	 *
	 * @category Aids
	 */
	async registerProviderBindings() {
		for (const ProviderModule of Config.providers) {
			await Container.get<ServiceProvider>(ProviderModule).registerBindings();

			if (Container.isBound(LOGGER_IDENTIFIER))
				Log.info('Bound and registered ' + ProviderModule.name + ' to the container.');
		}
	}

	/**
	 * Load all service providers and initialise the Http Server
	 */
	async boot() {
//		Container.bind('ROOT_DIR').toConstantValue(path.resolve(__dirname, '..'));


//		this._server     = Container.get(Server);
//		this._httpServer = await this._server.build();
//
//		await this._httpServer.listen(3000);


	}

	/**
	 * Iterate through all providers in the {@see Config.providers}
	 * config file and call boot() on them
	 */
	async bootProviders() {
		for await (const ProviderModule of Config.providers) {
			await Container.get<ServiceProvider>(ProviderModule).boot();
		}
	}

	public async up() {

	}

	public down() {
		const server = Container.get<Server>(Server)
		server.cleanUpMetadata();
		Container.unbindAll();
	}
}
