import "reflect-metadata";
import {FastifyRequest} from "fastify";
import {App, ConfigRepository} from "../AppContainer";
import {Auth, Authentication, BaseUserProvider, JwtAuthenticationProvider, UserProvider, VerifiedTokenInterface} from "../Authentication";
import {Authenticatable} from "../Common";
import {Config} from "../Config";
import {request, Request, RequestContext} from "../Routing";


const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();
};

const unloadApp = async function () {
	App.getInstance().container().reset();
	await App.getInstance().unload();
};

beforeEach(() => {
	return bootApp();
});
afterEach(() => {
	return unloadApp();
});


describe('jwt authentication', () => {

	test('it throws error with invalid authentication provider', async () => {
		const app = App.getInstance();

		app.resolve(ConfigRepository).set(
			'auth.authenticationProviders', [UserProvider]
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

		app.resolve(ConfigRepository).set('auth.authenticationProviders', [JwtAuthenticationProvider]);
		app.resolve(ConfigRepository).set('auth.userProvider', BaseUserProvider);

		const auth = app.resolve(Authentication);

		expect(auth.getAuthProvider(JwtAuthenticationProvider)).toBeInstanceOf(JwtAuthenticationProvider);
	});

	test('can obtain jwt from header', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		const req = new Request({
			headers : {
				'authorization' : 'Bearer 12345'
			}
		} as FastifyRequest);

		const tokenRes = auth
			.getAuthProvider(JwtAuthenticationProvider)
			.getAuthenticationInformation(req);

		expect(tokenRes).toEqual('12345');
	});

	test('can generate jwt', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		const token = auth
			.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider)
			.issueToken('1234');

		expect(token).toBeDefined();
	});

	test('can generate jwt with additional payload', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		const token = auth
			.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider)
			.issueToken('1234', {someInformation : ["yas", "woot"]});

		interface SomeTokenPayload extends VerifiedTokenInterface {
			someInformation : string[];
		}

		const tokenPayload = auth.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider)
			.validateAuthenticationInformation<SomeTokenPayload>(token);

		expect(token).toBeDefined();
		expect(tokenPayload.someInformation).toEqual(["yas", "woot"])
	});

	test('can verify jwt', async () => {
		const app          = App.getInstance();
		const auth         = app.resolve(Authentication);
		const authProvider = auth.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider);

		const token = authProvider.issueToken('1234');

		const verified = authProvider.validateAuthenticationInformation(token);

		expect(verified).toBeDefined();
		expect(verified.id).toEqual('1234');
	});

	test('can authenticate', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		RequestContext.bind(async () => {
			const authProvider = auth.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider);

			const jwt = authProvider.issueToken('12345');

			const req = new Request({
				headers : {
					'authorization' : 'Bearer ' + jwt
				}
			} as FastifyRequest);

			const authed = await authProvider.authoriseRequest(req);

			expect(authed).toBeInstanceOf(Authenticatable);

			auth.authoriseAs(authed);

			expect(auth.check()).toBeTruthy();
			expect(auth.user()).toBeInstanceOf(Authenticatable);
		});


	});

	test('can use request().user()', async () => {
		const app  = App.getInstance();
		const auth = app.resolve(Authentication);

		RequestContext.bind(async () => {
			const authProvider = auth.getAuthProvider<JwtAuthenticationProvider>(JwtAuthenticationProvider);

			const jwt = authProvider.issueToken('12345');

			const req = new Request({
				headers : {
					'authorization' : 'Bearer ' + jwt
				}
			} as FastifyRequest);

			const authed = await authProvider.authoriseRequest(req);

			expect(authed).toBeInstanceOf(Authenticatable);

			auth.authoriseAs(authed);

			expect(auth.check()).toBeTruthy();
			expect(auth.user()).toBeInstanceOf(Authenticatable);
			expect(request().user()).toBeInstanceOf(Authenticatable);
			expect(request().user()).toBeDefined();
		});


	});

});
