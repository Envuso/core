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
exports.EncryptionServiceProvider = void 0;
const simple_crypto_js_1 = __importDefault(require("simple-crypto-js"));
const ServiceProvider_1 = require("../AppContainer/ServiceProvider");
const Common_1 = require("../Common");
class EncryptionServiceProvider extends ServiceProvider_1.ServiceProvider {
    register(app, config) {
        return __awaiter(this, void 0, void 0, function* () {
            if (!config.has('app.appKey')) {
                Common_1.Log.warn('There is no app key specified in the config(Config/App.ts). Encryption will not work without this.');
                return;
            }
            app.container().register(simple_crypto_js_1.default, {
                useFactory: (dependencyContainer) => {
                    return new simple_crypto_js_1.default(config.get('app.appKey'));
                }
            });
        });
    }
    boot() {
        return __awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.EncryptionServiceProvider = EncryptionServiceProvider;
//# sourceMappingURL=EncryptionServiceProvider.js.map