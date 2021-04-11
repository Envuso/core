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
const app_1 = require("@envuso/app");
const UserModel_1 = require("../src/App/Models/UserModel");
const bootApp = function () {
    return __awaiter(this, void 0, void 0, function* () {
        const app = yield app_1.App.bootInstance();
        yield app.loadServiceProviders();
    });
};
beforeAll(() => {
    return bootApp();
});
describe('models', () => {
    test('model can use be initiated', () => __awaiter(void 0, void 0, void 0, function* () {
        const m = new UserModel_1.UserModel();
        m.something = 'lel';
        expect(m).toBeInstanceOf(UserModel_1.UserModel);
    }));
    test('model can be saved', () => __awaiter(void 0, void 0, void 0, function* () {
        const m = new UserModel_1.UserModel();
        m.something = 'reee';
        yield m.save();
        expect(m._id).toBeDefined();
    }));
    test('model can be updated', () => __awaiter(void 0, void 0, void 0, function* () {
        const m = new UserModel_1.UserModel();
        m.something = 'lol';
        yield m.save();
        expect(m.something).toBe('lol');
        const model = yield UserModel_1.UserModel.find(m._id);
        yield model.update({ something: 'lel' });
        expect(m._id).toBeDefined();
        expect(model.something).toBe('lel');
    }));
    test('model where first', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel_1.UserModel
            .where({ something: 'lel' })
            .first();
        expect(user).toBeDefined();
    }));
    test('model find', () => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield UserModel_1.UserModel.findOne({ something: 'lel' });
        expect(user).toBeDefined();
    }));
});
//# sourceMappingURL=model.spec.js.map