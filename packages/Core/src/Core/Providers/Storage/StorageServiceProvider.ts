
import Container from "@Core/Container";
import {ServiceProvider} from "@Core/Providers/ServiceProvider";
import {Storage} from "@Providers/Storage/Storage";
import {SpacesProvider} from "@Providers/Storage/StorageProviders/SpacesProvider";

import {injectable} from "inversify";

@injectable()
export class StorageServiceProvider extends ServiceProvider {

	public async registerBindings() {
		Container.bind<SpacesProvider>(SpacesProvider).to(SpacesProvider);
		Container.bind<Storage>(Storage).to(Storage);
	}

	public async boot() {

	}

}
