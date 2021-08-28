import "reflect-metadata";
import {App} from "../AppContainer";
import {Cache} from "../Cache";
import {Config} from "../Config";


const bootApp = async function () {
	const app = await App.bootInstance({config : Config});
	await app.loadServiceProviders();
};

beforeAll(() => bootApp());


describe('cache', () => {

	test('can set key', async () => {
		const res = await Cache.put('SomeRandomValue', 10);

		expect(res).toEqual(true);
	});

	test('can get key', async () => {
		const value = await Cache.get('SomeRandomValue');

		expect(value).toEqual(10);
	});

	test('can remove key', async () => {
		await Cache.put('SomeRandomValueTwo', 2);

		const removed = await Cache.remove('SomeRandomValueTwo');
		const has     = await Cache.has('SomeRandomValueTwo');

		expect(removed).toEqual(true);
		expect(has).toEqual(false);
	});

});

