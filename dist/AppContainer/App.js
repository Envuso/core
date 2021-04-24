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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.App = void 0;
//import "reflect-metadata";
const Common_1 = require("../Common");
const path_1 = __importDefault(require("path"));
const tsyringe_1 = require("tsyringe");
const ConfigRepository_1 = require("./Config/ConfigRepository");
const FailedToBindException_1 = require("./Exceptions/FailedToBindException");
const ServiceProvider_1 = require("./ServiceProvider");
let instance = null;
class App {
    constructor() {
        /**
         * Once we've called {@see bootInstance} this will be true
         *
         * @private
         */
        this._booted = false;
        /**
         * We'll set some base configuration here so that it can be passed through
         * the boot process without having to constantly pass vars down the calls
         *
         * @private
         */
        this._baseConfiguration = {
            config: {},
            //		paths  : {}
        };
        this._container = tsyringe_1.container;
    }
    /**
     * Get an instance of the app
     */
    static getInstance() {
        if (!instance)
            throw new Error('App was not booted yet. Please call "await App.bootInstance()" first.');
        return instance;
    }
    /**
     * Boot up the App and bind our Config
     * Once called, we'll be able to access the app instance via {@see getInstance()}
     */
    static bootInstance(config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (instance)
                return instance;
            const app = new App();
            app._baseConfiguration = config;
            yield app.boot();
            instance = app;
            return app;
        });
    }
    /**
     * Load any base Config/services we need
     */
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
            if (this._booted)
                return;
            yield this.prepareConfiguration();
            this._booted = true;
        });
    }
    /**
     * Bind a service to the container
     *
     * @param binder
     * @param bindAs | Allows you to over-ride the key used to identify this instance in the
     *               | container, by default it will use constructor.name
     *               | This does not apply to classes that extend ServiceProvider
     */
    bind(binder, bindAs) {
        const result = binder(this, this.resolve(ConfigRepository_1.ConfigRepository));
        if (!(result === null || result === void 0 ? void 0 : result.constructor)) {
            throw new FailedToBindException_1.FailedToBindException(result);
        }
        if (result instanceof ServiceProvider_1.ServiceProvider) {
            this._container.register('ServiceProvider', { useValue: result });
            return;
        }
        this._container.register(bindAs !== null && bindAs !== void 0 ? bindAs : result.constructor.name, { useValue: result });
    }
    /**
     * Get the container instance
     */
    container() {
        return this._container;
    }
    /**
     * Get a service from the container
     *
     * @param key
     */
    resolve(key) {
        return this.container().resolve(key);
    }
    /**
     * Get all services from the container by the specified key
     *
     * @param key
     */
    resolveAll(key) {
        return this.container().resolveAll(key);
    }
    /**
     * Load any configuration defined in the
     * app and set the paths for our app
     *
     * @private
     */
    prepareConfiguration() {
        return __awaiter(this, void 0, void 0, function* () {
            this._container.registerSingleton(ConfigRepository_1.ConfigRepository);
            const configRepository = this._container.resolve(ConfigRepository_1.ConfigRepository);
            const cwd = process.cwd();
            const paths = {
                root: cwd,
                src: path_1.default.join(cwd, 'src'),
                config: path_1.default.join(cwd, 'Config', 'index.js'),
                controllers: path_1.default.join(cwd, 'src', 'App', 'Http', 'Controllers'),
                providers: path_1.default.join(cwd, 'src', 'App', 'Providers'),
                models: path_1.default.join(cwd, 'src', 'App', 'Models'),
                storage: path_1.default.join(cwd, 'storage'),
                temp: path_1.default.join(cwd, 'storage', 'temp'),
            };
            yield configRepository.loadConfigFrom(this._baseConfiguration.config);
            configRepository.set('paths', paths);
        });
    }
    /**
     * Will load all service providers from the app config
     */
    loadServiceProviders() {
        return __awaiter(this, void 0, void 0, function* () {
            const providers = this.resolve(ConfigRepository_1.ConfigRepository).get('app.providers');
            if (!providers) {
                throw new Error('No service providers found.');
            }
            for (let providerClass of providers) {
                const provider = new providerClass();
                this.bind(() => provider);
                yield provider.register(this, this.resolve(ConfigRepository_1.ConfigRepository));
                Common_1.Log.info('Provider registered: ' + provider.constructor.name);
            }
            const serviceProviders = this._container.resolveAll('ServiceProvider');
            for (let provider of serviceProviders) {
                yield provider.boot(this, this.resolve(ConfigRepository_1.ConfigRepository));
                Common_1.Log.info('Service provider booted: ' + provider.constructor.name);
            }
        });
    }
    /**
     * Get the app config repository a little easier
     */
    config() {
        return this.container().resolve(ConfigRepository_1.ConfigRepository);
    }
    /**
     * Is the app instance booted?
     */
    static isBooted() {
        const booted = instance === null || instance === void 0 ? void 0 : instance._booted;
        return booted === true;
    }
    /**
     * This will clear the container and allow the app to be booted again
     *
     * Basically, this shouldn't really need to be used in regular app logic
     * You're probably doing something wrong if you find the need to use it there...
     *
     * The reason this exists is so that when writing tests, you can start from a clean slate.
     */
    unload() {
        return __awaiter(this, void 0, void 0, function* () {
            this._booted = false;
            instance = null;
            this.config().reset();
            this.container().clearInstances();
            this.container().reset();
            Common_1.Log.warn('The app has been unloaded and is ready to be booted again.');
        });
    }
}
exports.App = App;
//# sourceMappingURL=App.js.map