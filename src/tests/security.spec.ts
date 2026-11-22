import {app} from "../AppContainer/helpers";
import {BaseUserProvider} from "../Authentication/UserProvider/BaseUserProvider";
import {assertStrongAppKey} from "../Crypt/AppKey";
import {Csrf} from "../Security/Csrf";
import {Server} from "../Server/Server";
import {Session} from "../Session/Session";
import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

const inject = (opts: any) => app().container().resolve<Server>(Server)._server.inject(opts);
const cookieName    = () => app().config().get<string, any>('Session.sessionCookie.name');
const sessionCookie = (res: any) => res.cookies.find((c: any) => c.name === app().config().get<string, any>('Session.sessionCookie.name'))?.value;

describe('app key', () => {
	test('a missing, empty or short key is rejected', () => {
		expect(() => assertStrongAppKey(undefined)).toThrow(/No app key/);
		expect(() => assertStrongAppKey('  ')).toThrow(/No app key/);
		expect(() => assertStrongAppKey('1234')).toThrow(/too short/);
	});

	test('a long key is accepted', () => {
		expect(() => assertStrongAppKey('x'.repeat(32))).not.toThrow();
	});
});

describe('csrf', () => {
	test('tokens verify against their own secret only', async () => {
		const csrf   = new Csrf();
		const secret = await csrf.secret();
		const token  = csrf.create(secret);

		expect(csrf.verify(secret, token)).toBe(true);
		expect(csrf.verify(await csrf.secret(), token)).toBe(false);
		expect(csrf.verify(secret, 'x-' + token.split('-')[1])).toBe(false);
		expect(csrf.verify(secret, null)).toBe(false);
	});

	async function sessionWithToken() {
		const res = await inject({method : 'GET', url : '/testing/session/csrf'});

		return {cookie : sessionCookie(res), token : res.json().token as string};
	}

	test('a POST without a token is rejected', async () => {
		const {cookie} = await sessionWithToken();
		const res      = await inject({method : 'POST', url : '/testing/session/csrf-protected', cookies : {[cookieName()] : cookie}});

		expect(res.statusCode).toBe(403);
	});

	test('a POST with a wrong token is rejected', async () => {
		const {cookie} = await sessionWithToken();
		const res      = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected', cookies : {[cookieName()] : cookie},
			headers : {'x-csrf-token' : 'abc-def'},
		});

		expect(res.statusCode).toBe(403);
	});

	test("another session's token is rejected", async () => {
		const mine  = await sessionWithToken();
		const other = await sessionWithToken();
		const res   = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected', cookies : {[cookieName()] : mine.cookie},
			headers : {'x-csrf-token' : other.token},
		});

		expect(res.statusCode).toBe(403);
	});

	test('the session token is accepted as a header or a body field', async () => {
		const {cookie, token} = await sessionWithToken();

		const viaHeader = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected', cookies : {[cookieName()] : cookie},
			headers : {'x-csrf-token' : token},
		});
		expect(viaHeader.statusCode).toBeLessThan(300);

		const viaBody = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected', cookies : {[cookieName()] : cookie},
			payload : {_token : token},
		});
		expect(viaBody.statusCode).toBeLessThan(300);
	});
});

describe('sessions', () => {
	test('a session id the server never issued is replaced', async () => {
		const driver = {
			getSessionData   : async (id: string) => id === 'b'.repeat(32) ? {existing : true} : {},
			writeSessionData : async () => true,
			destroy          : async () => true,
		};
		const chosen = await new Session(driver as any).create('a'.repeat(32));
		const known  = await new Session(driver as any).create('b'.repeat(32));

		expect(chosen.getId()).not.toBe('a'.repeat(32));
		expect(known.getId()).toBe('b'.repeat(32));
	});

	test('malformed session ids are rejected', async () => {
		const session = app().container().resolve<any>('SessionManager').driver();

		expect(session.isValidSessionId('../../etc/passwd'.padEnd(32, 'x'))).toBe(false);
		expect(session.isValidSessionId(session.generateSessionId())).toBe(true);
	});

	test('logging in rotates the session id and CSRF token, and drops the old session', async () => {

		const before = await inject({method : 'GET', url : '/testing/session/set', query : {value : 'kept'}});
		const oldId  = sessionCookie(before);
		const oldTok = (await inject({method : 'GET', url : '/testing/session/csrf', cookies : {[cookieName()] : oldId}})).json().token;

		const login = await inject({method : 'GET', url : '/testing/session/login-as', query : {id : 'user-1'}, cookies : {[cookieName()] : oldId}});
		const newId = sessionCookie(login);

		expect(newId).toBeDefined();
		expect(newId).not.toBe(oldId);

		// Data survives the rotation, the token doesn't
		const after = await inject({method : 'GET', url : '/testing/session/get', cookies : {[cookieName()] : newId}});
		expect(after.json().value).toBe('kept');
		const newTok = (await inject({method : 'GET', url : '/testing/session/csrf', cookies : {[cookieName()] : newId}})).json().token;
		expect(newTok).not.toBe(oldTok);

		// The pre-login id no longer resolves to that session
		const stale = await inject({method : 'GET', url : '/testing/session/get', cookies : {[cookieName()] : oldId}});
		expect(stale.json().value ?? null).toBeNull();
	});
});

describe('session cookie', () => {
	test('is httpOnly and lives 7 days from when it is set', async () => {
		const res    = await inject({method : 'GET', url : '/testing/session/csrf'});
		const cookie = res.cookies.find((c: any) => c.name === cookieName());

		expect(cookie.httpOnly).toBe(true);
		expect(Math.abs(cookie.maxAge - 60 * 60 * 24 * 7)).toBeLessThan(5);
	});
});

describe('xsrf cookie', () => {
	const xsrf = (res: any) => res.cookies.find((c: any) => c.name === 'XSRF-TOKEN');

	test('carries the session token, readable by JavaScript and unencrypted', async () => {
		const res    = await inject({method : 'GET', url : '/testing/session/csrf'});
		const cookie = xsrf(res);

		expect(cookie).toBeDefined();
		expect(cookie.httpOnly).not.toBe(true);
		expect(decodeURIComponent(cookie.value)).toBe(res.json().token);
	});

	test('sent back as X-XSRF-TOKEN (what axios/Inertia do) it passes the CSRF check', async () => {
		const first = await inject({method : 'GET', url : '/testing/session/csrf'});
		const res   = await inject({
			method  : 'POST', url : '/testing/session/csrf-protected',
			cookies : {[cookieName()] : sessionCookie(first), 'XSRF-TOKEN' : xsrf(first).value},
			headers : {'x-xsrf-token' : xsrf(first).value},
		});

		expect(res.statusCode).toBeLessThan(300);
	});

	test('after login it holds the new token', async () => {
		const first = await inject({method : 'GET', url : '/testing/session/csrf'});
		const login = await inject({method : 'GET', url : '/testing/session/login-as', query : {id : 'user-2'}, cookies : {[cookieName()] : sessionCookie(first)}});
		const after = await inject({method : 'GET', url : '/testing/session/csrf', cookies : {[cookieName()] : sessionCookie(login)}});

		expect(decodeURIComponent(xsrf(login).value)).not.toBe(decodeURIComponent(xsrf(first).value));
		expect(decodeURIComponent(xsrf(login).value)).toBe(after.json().token);
	});
});

describe('cors', () => {
	const preflight = (origin: string) => inject({
		method  : 'OPTIONS', url : '/testing/session/csrf',
		headers : {origin, 'access-control-request-method' : 'GET'},
	});

	test('an unlisted origin is not allowed (any origin was, with credentials)', async () => {
		const res = await preflight('https://evil.example');

		expect(res.headers['access-control-allow-origin']).toBeUndefined();
	});

	test('APP_URL is allowed by default', async () => {
		const appUrl = process.env.APP_URL.replace(/\/$/, '');
		const res    = await preflight(appUrl);

		expect(res.headers['access-control-allow-origin']).toBe(appUrl);
		expect(res.headers['access-control-allow-credentials']).toBe('true');
	});
});

describe('disableCookieEncryption', () => {
	test('listed cookies are sent as-is', async () => {
		app().config().set('Server.disableCookieEncryption', ['hello']);

		const res    = await inject({method : 'GET', url : '/testing/cookie/is-set'});
		const cookie = res.cookies.find((c: any) => c.name === 'hello');

		expect(cookie.value).toBe('world');
		app().config().set('Server.disableCookieEncryption', []);
	});
});

describe('user provider fallback', () => {
	test('BaseUserProvider refuses to authenticate', async () => {
		const provider = new BaseUserProvider();

		expect(provider.verifyLoginCredentials({email : 'a@b.c', password : 'x'} as any)).rejects.toThrow(/no user provider/);
		expect(provider.getUser('123')).rejects.toThrow(/no user provider/);
	});
});
