"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
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
exports.Authorization = void 0;
const tsyringe_1 = require("tsyringe");
const AppContainer_1 = require("../AppContainer");
const Authentication_1 = require("../Authentication");
const Common_1 = require("../Common");
const PolicyNotFound_1 = require("./Exceptions/PolicyNotFound");
const PolicyPermissionNotFound_1 = require("./Exceptions/PolicyPermissionNotFound");
let Authorization = class Authorization {
    static getPolicyForModel(model) {
        const policyConstructor = Reflect.getMetadata('authorization-policy', Common_1.Classes.getConstructor(model));
        if (!policyConstructor) {
            throw new PolicyNotFound_1.PolicyNotFound(model.constructor.name);
        }
        return new policyConstructor();
    }
    static getPermissionFromPolicy(model, permission) {
        const policy = this.getPolicyForModel(model);
        if (!policy[permission]) {
            throw new PolicyPermissionNotFound_1.PolicyPermissionNotFound(model.constructor.name, permission);
        }
        return policy[permission];
    }
    static can(permission, model, ...additional) {
        return __awaiter(this, void 0, void 0, function* () {
            const policyPermission = this.getPermissionFromPolicy(model, permission);
            return (yield policyPermission(AppContainer_1.resolve(Authentication_1.Authentication).user(), model, ...additional)) === true;
        });
    }
    static cannot(permission, model, ...additional) {
        return __awaiter(this, void 0, void 0, function* () {
            return (yield this.can(permission, model, ...additional)) === false;
        });
    }
};
Authorization = __decorate([
    tsyringe_1.injectable()
], Authorization);
exports.Authorization = Authorization;
//# sourceMappingURL=Authorization.js.map