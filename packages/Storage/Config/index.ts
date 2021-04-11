
import {StorageServiceProvider} from "../src/StorageServiceProvider";
import Storage from "./Storage";

export const Config = {
	app     : {
		providers : [
			StorageServiceProvider
		]
	},
	storage : Storage
}
