"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const App_1 = require("../src/App");
const ConfigRepository_1 = require("../src/Config/ConfigRepository");
const ServiceProvider_1 = require("../src/ServiceProvider");
beforeAll(() => {
    return App_1.App.bootInstance();
});
describe('test app binding', () => {
    test('app can bind class to container', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = App_1.App.getInstance();
        class TestingClass {
            constructor() {
                this.value = 1234;
            }
        }
        app.bind((app) => {
            return new TestingClass();
        });
        const resolved = app.resolve(TestingClass);
        expect(resolved === null || resolved === void 0 ? void 0 : resolved.value).toBe(1234);
    }));
    test('app can bind class to container using custom key', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = App_1.App.getInstance();
        class TestingClass {
            constructor() {
                this.value = 1234;
            }
        }
        app.bind((app) => {
            return new TestingClass();
        }, 'Test');
        const resolved = app.resolve('Test');
        expect(resolved === null || resolved === void 0 ? void 0 : resolved.value).toBe(1234);
    }));
    test('app can bind class service provider to container', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = App_1.App.getInstance();
        class TestingClass extends ServiceProvider_1.ServiceProvider {
            constructor() {
                super(...arguments);
                this.value = 1234;
            }
            boot(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            }
            register(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                    app.bind(() => {
                        return new TestingClass();
                    });
                });
            }
        }
        const testingClass = new TestingClass();
        yield testingClass.register(app, app.resolve(ConfigRepository_1.ConfigRepository));
        const resolved = app.container().resolveAll('ServiceProvider');
        expect(resolved).toContainEqual(testingClass);
    }));
    test('app can register service providers from config', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = App_1.App.getInstance();
        class TestingRegisterBootProviders extends ServiceProvider_1.ServiceProvider {
            constructor() {
                super(...arguments);
                this.value = 1234;
            }
            boot(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            }
            register(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                    app.bind(() => {
                        return new TestingRegisterBootProviders();
                    });
                });
            }
        }
        app.resolve(ConfigRepository_1.ConfigRepository).put('app.providers', TestingRegisterBootProviders);
        yield app.loadServiceProviders();
        expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();
    }));
    test('app can register multiple service providers from config', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = App_1.App.getInstance();
        class TestingRegisterBootProviders extends ServiceProvider_1.ServiceProvider {
            constructor() {
                super(...arguments);
                this.value = 1234;
            }
            boot(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            }
            register(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                    app.bind(() => {
                        return new TestingRegisterBootProviders();
                    });
                });
            }
        }
        class TestingRegisterBootNUMBAHTWOProviders extends ServiceProvider_1.ServiceProvider {
            constructor() {
                super(...arguments);
                this.value = 1234;
            }
            boot(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            }
            register(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                    app.bind(() => {
                        return new TestingRegisterBootNUMBAHTWOProviders();
                    });
                });
            }
        }
        app.resolve(ConfigRepository_1.ConfigRepository).put('app.providers', TestingRegisterBootProviders);
        app.resolve(ConfigRepository_1.ConfigRepository).put('app.providers', TestingRegisterBootNUMBAHTWOProviders);
        yield app.loadServiceProviders();
        expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();
        expect(app.resolve(TestingRegisterBootNUMBAHTWOProviders)).toBeDefined();
        expect(app.resolve('ServiceProvider').includes(new TestingRegisterBootProviders())).toBeTruthy();
        expect(app.resolve('ServiceProvider').includes(new TestingRegisterBootNUMBAHTWOProviders())).toBeTruthy();
    }));
    test('app can access all service providers with "ServiceProvider" token after register', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = App_1.App.getInstance();
        class TestingRegisterBootProviders extends ServiceProvider_1.ServiceProvider {
            constructor() {
                super(...arguments);
                this.value = 1234;
            }
            boot(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                });
            }
            register(app, config) {
                return __awaiter(this, void 0, void 0, function* () {
                    app.bind(() => {
                        return new TestingRegisterBootProviders();
                    });
                });
            }
        }
        app.resolve(ConfigRepository_1.ConfigRepository).put('app.providers', TestingRegisterBootProviders);
        yield app.loadServiceProviders();
        const providers = app.container().resolveAll('ServiceProvider');
        expect(app.resolve(TestingRegisterBootProviders)).toBeDefined();
        expect(providers).toContainEqual(new TestingRegisterBootProviders());
    }));
    test('can get Config from app', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield App_1.App.getInstance();
        const config = app.resolve(ConfigRepository_1.ConfigRepository);
        expect(config.get('paths')).toBeDefined();
        expect(config.get('paths.root')).toBeDefined();
        expect(config.has('paths.root')).toBeTruthy();
    }));
    test('can add to object config', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield App_1.App.getInstance();
        const config = app.resolve(ConfigRepository_1.ConfigRepository);
        config.set('app.providers', 'testing');
        expect(config.get('app.providers')).toBe('testing');
    }));
    test('can add to put on array config', () => __awaiter(void 0, void 0, void 0, function* () {
        const app = yield App_1.App.getInstance();
        const config = app.resolve(ConfigRepository_1.ConfigRepository);
        config.set('app.providers', []);
        config.put('app.providers', 'testing');
        expect(config.get('app.providers')).toContainEqual("testing");
    }));
});
//# sourceMappingURL=app.spec.js.map