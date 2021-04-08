import {Container, ServiceProvider, SpacesProvider, Storage} from "@Core";
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
