import {AuthenticationServiceProvider} from "@envuso/authentication";
import {DatabaseServiceProvider} from "@envuso/database";
import {RouteServiceProvider} from "@envuso/routing";
import {StorageServiceProvider} from "@envuso/storage";
import {CacheServiceProvider} from "../src/Cache/CacheServiceProvider";
import {EncryptionServiceProvider} from "../src/Crypt/EncryptionServiceProvider";
import {ServerServiceProvider} from "../src/Server/ServerServiceProvider";

export default {

	appKey : '',

	providers : [
		CacheServiceProvider,
		EncryptionServiceProvider,
		DatabaseServiceProvider,
		StorageServiceProvider,
		RouteServiceProvider,
		AuthenticationServiceProvider,
		ServerServiceProvider
	],

}
