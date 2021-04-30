import {ServerOptions} from "ws";
import {JwtAuthenticationMiddleware} from "../Routing";

export default {

	/**
	 * Disable the websocket implementation
	 */
	enabled : true,

	middleware : [
		JwtAuthenticationMiddleware
	],

	/**
	 * cors configuration for the socket server
	 */
	cors : {
		enabled : true,
//		options : {
//			origin      : (origin: string, callback) => {
//				callback(null, true);
//			},
//			credentials : true,
//		}
	},

	options : {
		clientTracking : false
	} as ServerOptions

};
