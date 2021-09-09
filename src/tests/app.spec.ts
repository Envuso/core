import "reflect-metadata";
import {constructor} from "tsyringe/dist/typings/types";
import {ServiceProvider} from "../AppContainer/ServiceProvider";
import {App} from "../AppContainer/App";
import {ConfigRepository} from "../AppContainer/Config/ConfigRepository";
import {AppContract} from "../Contracts/AppContainer/AppContract";
import {ConfigRepositoryContract} from "../Contracts/AppContainer/Config/ConfigRepositoryContract";

import {bootApp, unloadApp} from "./preptests";

beforeAll(() => bootApp());
afterAll(() => unloadApp());

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

			public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

			}

			public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
				app.bind(() => {
					return new TestingClass();
				});
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

			public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

			}

			public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
				app.bind(() => {
					return new TestingRegisterBootProviders();
				});
			}
		}

		app.resolve(ConfigRepository).put('app.providers', TestingRegisterBootProviders);

		await app.loadServiceProviders();

		expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();

	});

	test('app can register multiple service providers from config', async () => {
		const app = App.getInstance();

		class TestingRegisterBootProviders extends ServiceProvider {
			public value = 1234;

			public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

			}

			public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
				app.bind(() => {
					return new TestingRegisterBootProviders();
				});
			}
		}

		class TestingRegisterBootNUMBAHTWOProviders extends ServiceProvider {
			public value = 1234;

			public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

			}

			public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
				app.bind(() => {
					return new TestingRegisterBootNUMBAHTWOProviders();
				});
			}
		}

		app.resolve(ConfigRepository).put('app.providers', TestingRegisterBootProviders);
		app.resolve(ConfigRepository).put('app.providers', TestingRegisterBootNUMBAHTWOProviders);

		await app.loadServiceProviders();

		expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();
		expect(app.resolve(TestingRegisterBootNUMBAHTWOProviders)).toBeDefined();

	});

	test('app can access all service providers with "ServiceProvider" token after register', async () => {
		const app = App.getInstance();

		class TestingRegisterBootProviders extends ServiceProvider {
			public value = 1234;

			public async boot(app: AppContract, config: ConfigRepositoryContract): Promise<void> {

			}

			public async register(app: AppContract, config: ConfigRepositoryContract): Promise<void> {
				app.bind(() => {
					return new TestingRegisterBootProviders();
				});
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

		expect(config.get('Paths')).toBeDefined();
		expect(config.get('Paths.root')).toBeDefined();
		expect(config.has('Paths.root')).toBeTruthy();
	});

	test('can add to object config', async () => {
		const app = await App.getInstance();

		const config = app.resolve(ConfigRepository);

		config.set('App.providers', 'testing');

		expect(config.get('App.providers')).toBe('testing');
	});

	test('can add to put on array config', async () => {
		const app = await App.getInstance();

		const config = app.resolve(ConfigRepository);

		config.set('App.providers', []);
		config.put('App.providers', 'testing');

		expect(config.get('App.providers')).toContainEqual("testing");
	});

});

