import {App} from "@src/App";
import {ConfigRepository} from "@src/Config/ConfigRepository";

beforeAll(() => {
	return App.bootInstance();
})

describe('test app binding', () => {

	test('app binds service provider', async () => {
		const app = App.getInstance();

		class TestingClass {
			public value = 1234;
		}

		app.bind((app) => {
			return new TestingClass();
		});

		const resolved = app.resolve(TestingClass);

		expect(resolved?.value).toBe(1234);
	});

	test('can get Config from app', async () => {
		const app = await App.getInstance();

		const config = app.resolve(ConfigRepository);

		expect(config.get('paths')).toBeDefined();
		expect(config.get('paths.root')).toBeDefined();
		expect(config.has('paths.root')).toBeTruthy();
	});

});

