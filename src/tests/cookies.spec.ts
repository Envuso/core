import "./preptests";
import {app, config} from "../AppContainer";
import {Encryption} from "../Crypt";
import {Server} from "../Server/Server";

//container().resolve<Server>(Server);
describe('using cookies', () => {

	test('can add cookie to response', async () => {
		const server = app().container().resolve<Server>(Server);
		app().config().set('session.encryptCookies', false);

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
		app().config().set('session.encryptCookies', true);

		const res = await server._server.inject({
			method : 'GET',
			url    : '/testing/cookie/is-set',
		});

		const cookie: any = res.cookies.find((c: any) => c.name === 'hello');

		expect(Encryption.decrypt(cookie.value)).toBe('world');
		expect(res.body).toBe('true');
	});

	test('can share value with sessions', async () => {
		const server = app().container().resolve<Server>(Server);
		app().config().set('session.encryptCookies', true);

		const setres             = await server._server.inject({
			method : 'GET',
			url    : '/testing/session/set',
			query  : {
				value : 'yeet'
			}
		});

		const sessionCookie: any = setres.cookies.find((c: any) => c.name === 'session');
		const getres             = await server._server.inject({
			method  : 'GET',
			url     : '/testing/session/get',
			cookies : {
				session : sessionCookie.value
			}
		});

		expect(getres.body).toBe('yeet');
	});

});
