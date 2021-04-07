import {Multipart} from "fastify-multipart";
import {injectable} from "inversify";

export interface UploadedFileInformation {
	url: string;
	path: string;
	originalName: string;
}

@injectable()
export abstract class StorageProvider {

	abstract files(directory: string);

	abstract directories(directory: string): Promise<string[]>;

	abstract makeDirectory(directory: string);

	abstract deleteDirectory(directory: string);

	abstract fileExists(key: string);

	abstract put(location: string, file: Multipart): Promise<UploadedFileInformation>;

	abstract remove(location: string);

	abstract get(location: string);

	abstract url(location: string);

	abstract temporaryUrl(location: string, expiresInSeconds: number);

}
