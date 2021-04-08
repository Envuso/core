import {Config} from "@Config";
import {Multipart} from "fastify-multipart";
import {injectable} from "inversify";
import {Container, resolve, StorageProvider} from "@Core";


@injectable()
export class Storage {

	static defaultProvider(): StorageProvider {
		if (!Container.isBound(Config.storage.defaultProvider))
			return null;

		return resolve(Config.storage.defaultProvider);
	}

	public static files(directory: string) {
		return this.defaultProvider().files(directory);
	}

	public static directories(directory: string) {
		return this.defaultProvider().directories(directory);
	}

	public static makeDirectory(directory: string) {
		return this.defaultProvider().makeDirectory(directory);
	}

	public static deleteDirectory(directory: string) {
		return this.defaultProvider().deleteDirectory(directory);
	}

	public static fileExists(key: string) {
		return this.defaultProvider().fileExists(key);
	}

	public static get(location: string) {
		return this.defaultProvider().get(location);
	}

	public static put(location: string, file: Multipart) {
		return this.defaultProvider().put(location, file);
	}

	public static remove(location: string) {
		return this.defaultProvider().remove(location);
	}

	public static url(location: string) {
		return this.defaultProvider().url(location);
	}

	public static temporaryUrl(location: string, expiresInSeconds: number) {
		return this.defaultProvider().temporaryUrl(location, expiresInSeconds);
	}

}
