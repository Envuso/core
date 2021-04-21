import {CacheServiceProvider, EncryptionServiceProvider, ServerServiceProvider} from "../Core";
import {DatabaseServiceProvider} from "../Database";
import {RouteServiceProvider} from "../Routing";
import {AuthenticationServiceProvider} from "../Authentication";
import {StorageServiceProvider} from "../Storage";
import Auth from "./Auth";
import Database from "./Database";
import Server from "./Server";
import Storage from "./Storage";

export const Config = {
	app : {

		appKey : '1234',

		providers : [
			CacheServiceProvider,
			EncryptionServiceProvider,
			DatabaseServiceProvider,
			StorageServiceProvider,
			RouteServiceProvider,
			AuthenticationServiceProvider,
			ServerServiceProvider
		]
	},

	auth     : Auth,
	database : Database,
	storage  : Storage,
	server   : Server
};
