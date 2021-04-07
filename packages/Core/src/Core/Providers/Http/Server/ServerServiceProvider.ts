import Container from "@Core/Container";
import {Log} from "@Providers/Log/Log";
import {ServiceProvider} from "@Providers/ServiceProvider";
import {FastifyInstance} from "fastify";
import {injectable} from "inversify";
import {Server} from "./Server";

@injectable()
export class ServerServiceProvider extends ServiceProvider {

	/**
	 * The Fastify Server wrapped with our own logic
	 * @public
	 */
	public server: Server;

	/**
	 * The instance of Fastify that {@see Server} is using	 *
	 * @public
	 */
	public httpServer: FastifyInstance;

	public registerBindings() {
		Container.bind(Server).to(Server).inSingletonScope();
	}

	async boot() {

	}

	async run() {
		this.server = Container.get<Server>(Server);

		this.httpServer = await this.server.build();

		await this.httpServer.listen(3000);

		Log.success('Server is running at http://127.0.0.1:3000');
	}

}
