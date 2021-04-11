////import Container, {LOGGER_IDENTIFIER} from "./Container";
////import {Config} from "@Config";
////import {FastifyInstance} from "fastify";
////import {Log, Server, ServiceProvider} from "@Core";
//
//import Container from "./Container";
//import { Config } from "@Config";
//import { ServiceProvider } from "./Providers/ServiceProvider";
//
//
//export class App {
//
//	/**
//	 * The Fastify Server wrapped with our own logic
//	 * @private
//	 */
////	private _server: Server;
//
//	/**
//	 * The instance of Fastify that {@see Server} is using
//	 *
//	 * @private
//	 */
////	private _httpServer: FastifyInstance;
//
//	registerProviders() {
//		for (const ProviderModule of Config.providers) {
//			console.log(ProviderModule);
//			Container.bind<ServiceProvider>(ProviderModule).to(ProviderModule);
//		}
//	}
//
//	async registerProviderBindings() {
////		for (const ProviderModule of Config.providers) {
////			await Container.get<ServiceProvider>(ProviderModule).registerBindings();
////
////			if (Container.isBound(LOGGER_IDENTIFIER))
////				Log.info('Bound and registered ' + ProviderModule.name + ' to the container.');
////		}
//	}
//
//	/**
//	 * Load all service providers and initialise the Http Server
//	 */
//	async boot() {
////		Container.bind('ROOT_DIR').toConstantValue(path.resolve(__dirname, '..'));
//
//
////		this._server     = Container.get(Server);
////		this._httpServer = await this._server.build();
////
////		await this._httpServer.listen(3000);
//
//
//	}
//
//	/**
//	 * Iterate through all providers in the {@see Config.providers}
//	 * config file and call boot() on them
//	 */
//	async bootProviders() {
////		for await (const ProviderModule of Config.providers) {
////			await Container.get<ServiceProvider>(ProviderModule).boot();
////		}
//	}
//
//	public async up() {
//
//	}
//
//	public down() {
////		const server = Container.get<Server>(Server)
////		server.cleanUpMetadata();
////		Container.unbindAll();
//	}
//}
//# sourceMappingURL=App.js.map