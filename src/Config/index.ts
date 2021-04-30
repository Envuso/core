import {
	EncryptionServiceProvider,
	AuthenticationServiceProvider,
	RouteServiceProvider,
	StorageServiceProvider,
	CacheServiceProvider,
	DatabaseServiceProvider,
	ServerServiceProvider,

} from '../';

import Auth from "./Auth";
import Database from "./Database";
import Server from "./Server";
import Session from "./Session";
import Storage from "./Storage";
import Websockets from "./Websockets";

export const Config = {
	app : {

		appKey : '1234',

		providers : [
			DatabaseServiceProvider,
			CacheServiceProvider,
			EncryptionServiceProvider,
			AuthenticationServiceProvider,
			RouteServiceProvider,
			StorageServiceProvider,
			ServerServiceProvider,
		]
	},

	auth       : Auth,
	database   : Database,
	storage    : Storage,
	server     : Server,
	session    : Session,
	websockets : Websockets
};
