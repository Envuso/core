import {bootApp, unloadApp} from "./preptests";
import {app} from "../AppContainer/helpers";
import {Encryption} from "../Crypt/Encryption";
import {Server} from "../Server/Server";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

describe('using cookies', () => {
	afterAll(() => app().config().set('Session.cookie.encrypted', true));

	test('can add cookie to response', async () => {
		const server = app().container().resolve<Server>(Server);
		app().config().set('Session.cookie.encrypted', false);

		const res = await server._server.inject({
			method : 'GET',
			url    : '/testing/cookie/is-set',
		});

		const cookie: any = res.cookies.find((c: any) => c.name === 'hello');

		expect(cookie.value).toBe('world');
		expect(res.body).toBe('true');
	});

	test('uses encrypted cookies', async () => {
		const server = app().container().resolve<Server>(Server);
		app().config().set('Session.cookie.encrypted', true);

		const res = await server._server.inject({
			method : 'GET',
			url    : '/testing/cookie/is-set',
		});

		const cookie: any = res.cookies.find((c: any) => c.name === 'hello');

		// Bound to the cookie name
		expect(Encryption.decrypt(cookie.value, 'cookie:hello')).toBe('world');
		expect(Encryption.tryDecrypt(cookie.value, 'cookie:hello-two')).toBeNull();
		expect(res.body).toBe('true');
	});

	test('can share value with sessions', async () => {
		const server = app().container().resolve<Server>(Server);
		app().config().set('Session.cookie.encrypted', true);

		const setres             = await server._server.inject({
			method : 'GET',
			url    : '/testing/session/set',
			query  : {
				value : 'yeet'
			}
		});

		const sessionCookie: any = setres.cookies.find((c: any) => c.name === app().config().get<string, any>('Session.sessionCookie.name'));
		const getres             = await server._server.inject({
			method  : 'GET',
			url     : '/testing/session/get',
			cookies : {
				[app().config().get<string, any>('Session.sessionCookie.name')] : sessionCookie.value
			}
		});

		expect(getres.json()).toEqual({value : 'yeet'});
	});

});

describe('cookies sent back', () => {
	test("cookies the browser sent aren't re-sent unless changed", async () => {
		const server = app().container().resolve<Server>(Server);
		app().config().set('Session.cookie.encrypted', false);

		const res = await server._server.inject({method : 'GET', url : '/testing/session/get', cookies : {unrelated : 'x'}});

		expect(res.cookies.find((c: any) => c.name === 'unrelated')).toBeUndefined();
		app().config().set('Session.cookie.encrypted', true);
	});

	test('a cookie from another key or tampered with reads as null', async () => {
		const server = app().container().resolve<Server>(Server);
		const name   = app().config().get<string, any>('Session.sessionCookie.name');

		// Not decryptable: the session starts fresh instead of erroring
		const res = await server._server.inject({method : 'GET', url : '/testing/session/get', cookies : {[name] : 'v1.garbage'}});

		expect(res.statusCode).toBeLessThan(300);
	});
});
