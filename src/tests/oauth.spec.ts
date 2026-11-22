import crypto from "crypto";
import {afterAll, beforeAll, describe, expect, test} from "bun:test";
import {app} from "../AppContainer/helpers";
import {BaseOAuthProvider} from "../OAuthProvider/BaseOAuthProvider";
import {Server} from "../Server/Server";
import {bootApp, unloadApp} from "./preptests";

// Mock token endpoint: records what the app sends in the code exchange
let tokenRequests: URLSearchParams[] = [];
const tokenServer = Bun.serve({
	port  : 0,
	async fetch(req) {
		tokenRequests.push(new URLSearchParams(await req.text()));
		return Response.json({access_token : 'access-token', token_type : 'bearer'});
	},
});
process.env.OAUTH_TEST_BASE = `http://127.0.0.1:${tokenServer.port}`;

beforeAll(() => bootApp());
afterAll(async () => {
	tokenServer.stop(true);
	await unloadApp();
});

const inject     = (opts: any) => app().container().resolve<Server>(Server)._server.inject(opts);
const cookieName = () => app().config().get<string, any>('Session.sessionCookie.name');

async function startLogin() {
	const res      = await inject({method : 'GET', url : '/testing/oauth/redirect'});
	const location = new URL(res.headers.location as string);
	const session  = res.cookies.find((c: any) => c.name === cookieName()).value;

	return {location, session};
}

const callback = (session: string, query: string) => inject({
	method  : 'GET', url : `/testing/oauth/callback?${query}`,
	cookies : {[cookieName()] : session}, headers : {accept : 'application/json'},
});

describe('oauth', () => {
	test('the authorize redirect carries state and an S256 PKCE challenge', async () => {
		const {location} = await startLogin();

		expect(location.searchParams.get('state')).toBeTruthy();
		expect(location.searchParams.get('code_challenge')).toBeTruthy();
		expect(location.searchParams.get('code_challenge_method')).toBe('S256');
	});

	test('a callback with the right state exchanges the code with the PKCE verifier', async () => {
		tokenRequests    = [];
		const {location, session} = await startLogin();
		const state      = location.searchParams.get('state');

		const res = await callback(session, `code=abc&state=${state}`);

		expect(res.json()).toEqual({ok : true, id : 'oauth-user'});

		const verifier = tokenRequests[0].get('code_verifier');
		expect(verifier).toBeTruthy();
		// The verifier hashes to the challenge sent in the redirect
		expect(crypto.createHash('sha256').update(verifier).digest('base64url')).toBe(location.searchParams.get('code_challenge'));
	});

	test('a wrong or missing state is rejected', async () => {
		const {session} = await startLogin();

		expect((await callback(session, 'code=abc&state=wrong')).json()).toEqual({ok : false, error : 'InvalidStateException'});

		const second = await startLogin();
		expect((await callback(second.session, 'code=abc')).json()).toEqual({ok : false, error : 'InvalidStateException'});
	});

	test('the state can only be used once', async () => {
		const {location, session} = await startLogin();
		const query = `code=abc&state=${location.searchParams.get('state')}`;

		expect((await callback(session, query)).json().ok).toBe(true);
		expect((await callback(session, query)).json()).toEqual({ok : false, error : 'InvalidStateException'});
	});

	test("with() can't override what the code exchange is checked against", () => {
		const provider = new BaseOAuthProvider({baseUrl : 'https://x', authorizeEndpoint : '/a', tokenEndpoint : '/t'}, 'x');

		expect(() => provider.with({redirect_uri : 'https://evil.example'})).toThrow(/can't be set/);
		expect(() => provider.with({client_id : 'other'})).toThrow(/can't be set/);
		expect(() => provider.with({prompt : 'consent'})).not.toThrow();
	});
});
