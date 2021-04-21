"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EncryptionServiceProvider = void 0;
const tslib_1 = require("tslib");
const simple_crypto_js_1 = tslib_1.__importDefault(require("simple-crypto-js"));
const AppContainer_1 = require("../../AppContainer");
const Common_1 = require("../../Common");
class EncryptionServiceProvider extends AppContainer_1.ServiceProvider {
    register(app, config) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
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
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
        });
    }
}
exports.EncryptionServiceProvider = EncryptionServiceProvider;
//# sourceMappingURL=EncryptionServiceProvider.js.map