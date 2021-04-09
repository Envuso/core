import {constructor} from "tsyringe/dist/typings/types";
import {App} from "../src/App";
import {ConfigRepository} from "../src/Config/ConfigRepository";
import {ServiceProvider} from "../src/ServiceProvider";

beforeAll(() => {
	return App.bootInstance();
})

describe('test app binding', () => {

	test('app can bind class to container', async () => {
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

	test('app can bind class to container using custom key', async () => {
		const app = App.getInstance();

		class TestingClass {
			public value = 1234;
		}

		app.bind((app) => {
			return new TestingClass();
		}, 'Test');

		const resolved = app.resolve<TestingClass>('Test');

		expect(resolved?.value).toBe(1234);
	});

	test('app can bind class service provider to container', async () => {
		const app = App.getInstance();

		class TestingClass extends ServiceProvider {
			public value = 1234;

			public async boot(app: App, config: ConfigRepository): Promise<void> {

			}

			public async register(app: App, config: ConfigRepository): Promise<void> {
				app.bind(() => {
					return new TestingClass();
				})
			}
		}

		const testingClass = new TestingClass();
		await testingClass.register(app, app.resolve(ConfigRepository));

		const resolved = app.container().resolveAll('ServiceProvider');

		expect(resolved).toContainEqual(testingClass);
	});

	test('app can register service providers from config', async () => {
		const app = App.getInstance();

		class TestingRegisterBootProviders extends ServiceProvider {
			public value = 1234;

			public async boot(app: App, config: ConfigRepository): Promise<void> {

			}

			public async register(app: App, config: ConfigRepository): Promise<void> {
				app.bind(() => {
					return new TestingRegisterBootProviders();
				})
			}
		}

		app.resolve(ConfigRepository).put('app.providers', TestingRegisterBootProviders);

		await app.loadServiceProviders();

		expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();

	});

	test('app can access all service providers with "ServiceProvider" token after register', async () => {
		const app = App.getInstance();

		class TestingRegisterBootProviders extends ServiceProvider {
			public value = 1234;

			public async boot(app: App, config: ConfigRepository): Promise<void> {

			}

			public async register(app: App, config: ConfigRepository): Promise<void> {
				app.bind(() => {
					return new TestingRegisterBootProviders();
				})
			}
		}

		app.resolve(ConfigRepository).put('app.providers', TestingRegisterBootProviders);

		await app.loadServiceProviders();

		const providers = app.container().resolveAll<constructor<ServiceProvider>>('ServiceProvider');

		expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();
		expect(providers).toContainEqual(new TestingRegisterBootProviders());

	});

	test('can get Config from app', async () => {
		const app = await App.getInstance();

		const config = app.resolve(ConfigRepository);

		expect(config.get('paths')).toBeDefined();
		expect(config.get('paths.root')).toBeDefined();
		expect(config.has('paths.root')).toBeTruthy();
	});

	test('can add to object config', async () => {
		const app = await App.getInstance();

		const config = app.resolve(ConfigRepository);

		config.set('app.providers', 'testing');

		expect(config.get('app.providers')).toBe('testing');
	});

	test('can add to put on array config', async () => {
		const app = await App.getInstance();

		const config = app.resolve(ConfigRepository);

		config.set('app.providers', []);
		config.put('app.providers', 'testing');

		expect(config.get('app.providers')).toContainEqual("testing");
	});

});

