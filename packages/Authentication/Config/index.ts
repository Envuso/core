import {AuthenticationServiceProvider} from "../src/AuthenticationServiceProvider";
import {default as Auth} from './Auth';


export const Config = {
	app : {

		appKey : '1234',

		providers : [
			AuthenticationServiceProvider
		]
	},

	auth : Auth
}
