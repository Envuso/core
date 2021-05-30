"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const class_transformer_1 = require("class-transformer");
const mongodb_1 = require("mongodb");
const Common_1 = require("../../Common");
const Database_1 = require("../../Database");
const UserPolicy_1 = require("../Policies/UserPolicy");
let User = class User extends Common_1.Authenticatable {
    constructor() {
        super(...arguments);
        this.something = 'hello';
    }
};
__decorate([
    Database_1.id,
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "_id", void 0);
__decorate([
    Database_1.id,
    __metadata("design:type", mongodb_1.ObjectId)
], User.prototype, "someUserId", void 0);
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", String)
], User.prototype, "password", void 0);
User = __decorate([
    Database_1.policy(UserPolicy_1.UserPolicy)
], User);
exports.User = User;
//# sourceMappingURL=User.js.map