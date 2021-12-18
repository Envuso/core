import {SessionStorageDriver} from "../../Session/Drivers/SessionStorageDriver";
import {SessionContract} from "./SessionContract";
import {SessionConfiguration} from "./Types";

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
