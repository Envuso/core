import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";
import {RedisOptions} from "ioredis";
import Environment from "../AppContainer/Config/Environment";

export default class RedisConfiguration extends ConfigurationCredentials implements RedisOptions {
	host      = Environment.get<string>("REDIS_HOST", "127.0.0.1");
	port      = Number(Environment.get("REDIS_PORT", 6379));
	password  = Environment.get<string>("REDIS_PASSWORD", null);
	db        = 0;
	keyPrefix = "envuso-";
}
