import {SessionContract} from "../Contracts/Session/SessionContract";
import {SessionManagerContract} from "../Contracts/Session/SessionManagerContract";
import {SessionConfiguration} from "../Contracts/Session/Types";
import {SessionStorageDriver} from "./Drivers/SessionStorageDriver";
import {Session} from "./Session";

export class SessionManager implements SessionManagerContract {

	public _config: SessionConfiguration;
	public storageDriver: SessionStorageDriver = null;

	constructor(config: SessionConfiguration) {
		this._config = config;

		this.createStorageDriver();
	}

	/**
	 * Load the session storage driver from our configuration file and initiate it.
	 */
	public createStorageDriver() {
		const storageDriver = this._config.sessionStorageDriver;

		if (!storageDriver) {
			throw new Error('Session storage driver is not defined in Config/Session.ts');
		}

		this.storageDriver = new storageDriver();
	}

	/**
	 * Create a new session and define the storage driver
	 */
	public driver(): SessionContract {
		return (new Session(this.storageDriver));
	}

}
