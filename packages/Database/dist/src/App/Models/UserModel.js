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
exports.UserModel = void 0;
const mongodb_1 = require("mongodb");
const ModelDecorators_1 = require("../../ModelDecorators");
const Model_1 = require("../../Mongo/Model");
class UserModel extends Model_1.Model {
    constructor() {
        super(...arguments);
        this.something = 'hello';
    }
}
__decorate([
    ModelDecorators_1.id,
    __metadata("design:type", mongodb_1.ObjectId)
], UserModel.prototype, "_id", void 0);
exports.UserModel = UserModel;
//# sourceMappingURL=UserModel.js.map