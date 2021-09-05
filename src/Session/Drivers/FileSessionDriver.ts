import path from "path";
import {Log} from "../../Common";
import {Storage, StorageProviderContract} from "../../Storage";
import {FileDoesNotExistException} from "../../Storage/Exceptions/FileDoesNotExistException";
import {SessionStorageDriver} from "./SessionStorageDriver";

export class FileSessionDriver implements SessionStorageDriver {

	private storage: StorageProviderContract;

	constructor() {
		this.storage = Storage.onDemand<'local'>({
			driver : 'local',
			root   : path.join(process.cwd(), 'storage', 'sessions'),
		});
	}

	private fileName(id: string) {
		return `/session_${id}.json`;
	}

	public async destroy(id: string): Promise<boolean> {
		try {
			if (!await this.storage.fileExists(this.fileName(id))) {
				return true;
			}

			return this.storage.remove(this.fileName(id));
		} catch (error) {
			Log.exception(`Failed to destroy file session data(${this.fileName(id)}): `, error);

			return false;
		}
	}

	public async getSessionData(id: string): Promise<object> {
		let data = JSON.stringify({});

		try {
			data = await this.storage.get(this.fileName(id));
		} catch (error) {
			// If the file does not exist, we'll ignore it and return an empty object
			// If it's another error, let's re-throw it.
			if (!(error instanceof FileDoesNotExistException)) {
				Log.exception(`Failed to get file session data(${this.fileName(id)}): `, error);

				throw error;
			}

		}

		return JSON.parse(data);
	}

	public async writeSessionData(id: string, data: object): Promise<boolean> {
		try {
			const info = await this.storage.write(this.fileName(id), JSON.stringify(data));

			return info?.path !== undefined;
		} catch (error) {
			Log.exception(`Failed to write file session data(${this.fileName(id)}): `, error);

			return false;
		}
	}

}
