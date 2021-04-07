import {ServiceProvider} from "../ServiceProvider";
import {init} from "node-cache-redis";
import {Config} from "@Config";
import {injectable} from "inversify";
import Container from "../../Container";
import {Cache} from "./Cache";

@injectable()
export class CacheServiceProvider extends ServiceProvider {

	registerBindings(){
		init({
			name         : "cache:",
			redisOptions : {
				host : Config.database.redis.host,
				port : Config.database.redis.port,
			}
		});

		Container.bind<Cache>(Cache).to(Cache);
	}

	boot() {


	}

}
