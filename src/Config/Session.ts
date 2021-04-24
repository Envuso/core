import {DateTime} from "../Common/Utility/DateTime";
import {CookieConfiguration} from "../Routing/Context/CookieJar";


export default {

	cookie : <CookieConfiguration>{
		path     : '/',
		httpOnly : false,
		secure   : true,
		expires  : DateTime.now().add(5, 'years').toDate(),
		sameSite : true,
		domain   : null,
	},

	cookieName : 'session',

	encryptCookies : true,

};
