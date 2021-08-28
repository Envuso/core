import {DateTime} from "../Common";
import {CookieConfiguration} from "../Routing";


export default {

	cookie : <CookieConfiguration>{
		path     : '/',
		httpOnly : false,
		secure   : true,
		expires  : DateTime.now().addYears(5).toDate(),
		sameSite : true,
		domain   : null,
	},

	cookieName : 'session',

	encryptCookies : true,

};
