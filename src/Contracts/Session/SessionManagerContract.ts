import type {SessionStorageDriver} from "../../Session/Drivers/SessionStorageDriver";
import type {SessionContract} from "./SessionContract";
import type {SessionConfiguration} from "./Types";

export interface SessionManagerContract {
	_config: SessionConfiguration;
	storageDriver: SessionStorageDriver;

	/**
	 * Load the session storage driver from our configuration file and initiate it.
	 */
	createStorageDriver(): void;

	/**
	 * Create a new session and define the storage driver
	 */
	driver(): SessionContract;
}
