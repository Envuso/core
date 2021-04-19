import {App, ConfigRepository} from "@envuso/app";
import {Authenticatable} from "@envuso/common/dist";
import {Request, RequestContext} from "@envuso/routing/dist";
import {FastifyRequest} from "fastify";
import {Config} from "../Config/index";
import {Authentication} from "../src/Authentication";
import {JwtAuthenticationProvider} from "../src/JwtAuthentication/JwtAuthenticationProvider";
import {BaseUserProvider} from "../src/UserProvider/BaseUserProvider";
import {UserProvider} from "../src/UserProvider/UserProvider";


const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();
}

const unloadApp = async function () {
	App.getInstance().container().reset();
	await App.getInstance().unload();
}

beforeEach(() => {
	return bootApp();
})
afterEach(() => {
	return unloadApp();
})


describe('authentication package', () => {

	test('can create authentication', async () => {
		const app = App.getInstance();

		const auth = app.resolve(Authentication);

		expect(auth.getUserProvider()).toBeDefined();
		expect(auth.getAuthProvider()).toBeDefined();
	})

});

describe('jwt authentication', () => {

	test('it throws error with invalid authentication provider', async () => {
		const app = App.getInstance();

		app.resolve(ConfigRepository).set(
			'auth.authenticationProvider', UserProvider
		);

		expect(() => {
			app.resolve(Authentication);
		}).toThrow();
	});

	test('it throws error with invalid user provider', async () => {
		const app = App.getInstance();

		app.resolve(ConfigRepository).set(
			'auth.userProvider', JwtAuthenticationProvider
		);

		expect(() => {
			app.resolve(Authentication);
		}).toThrow();
	});

	test('can bind jwt authentication adapter', async () => {
		const app = App.getInstance();

		app.resolve(ConfigRepository).set('auth.authenticationProvider', JwtAuthenticationProvider);
		app.resolve(ConfigRepository).set('auth.userProvider', BaseUserProvider);

		const auth = app.resolve(Authentication);

		expect(auth.getAuthProvider()).toBeInstanceOf(JwtAuthenticationProvider);
	});

	test('can obtain jwt from header', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		const req = new Request({
			headers : {
				'authorization' : 'Bearer 12345'
			}
		} as FastifyRequest);

		const tokenRes = auth.getAuthProvider().getAuthenticationCredential(req);

		expect(tokenRes).toEqual('12345');
	})

	test('can generate jwt', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		const token = auth.getAuthProvider<JwtAuthenticationProvider>().issueToken('1234');

		expect(token).toBeDefined();
	});

	test('can verify jwt', async () => {
		const app          = App.getInstance();
		const auth         = app.resolve(Authentication);
		const authProvider = auth.getAuthProvider<JwtAuthenticationProvider>();

		const token = authProvider.issueToken('1234');

		const verified = authProvider.verifyAuthenticationCredential(token);

		expect(verified).toBeDefined();
		expect(verified.id).toEqual('1234');
	});

	test('can authenticate', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		RequestContext.bind(async () => {
			const authProvider = auth.getAuthProvider<JwtAuthenticationProvider>();

			const jwt = authProvider.issueToken('12345');

			const req = new Request({
				headers : {
					'authorization' : 'Bearer ' + jwt
				}
			} as FastifyRequest);

			const authed = await authProvider.authoriseRequest(req);

			expect(authed).toBeInstanceOf(Authenticatable);

			auth.authoriseAs(<typeof Authenticatable>authed);

			expect(auth.check()).toBeTruthy();
			expect(auth.user()).toBeInstanceOf(Authenticatable);
		});


	})

});
