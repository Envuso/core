import type {AppContract} from "./AppContract";
import type {ConfigRepositoryContract} from "./Config/ConfigRepositoryContract";

export interface ServiceProviderContract {
	register(app: AppContract, config: ConfigRepositoryContract): Promise<void>;

	boot(app: AppContract, config: ConfigRepositoryContract): Promise<void>;
}
