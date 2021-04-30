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
exports.Authenticatable = void 0;
const class_transformer_1 = require("class-transformer");
const AppContainer_1 = require("../../AppContainer");
const Authentication_1 = require("../../Authentication");
const Database_1 = require("../../Database");
const SocketServer_1 = require("../../Sockets/SocketServer");
class Authenticatable extends Database_1.Model {
    generateToken() {
        return AppContainer_1.resolve(Authentication_1.Authentication)
            .getAuthProvider(Authentication_1.JwtAuthenticationProvider)
            .issueToken(this._id);
    }
    sendSocketChannelEvent(channel, eventName, data) {
        AppContainer_1.resolve(SocketServer_1.SocketServer).sendToUserViaChannel(this._id.toString(), channel, eventName, data);
    }
    sendSocketEvent(eventName, data) {
        AppContainer_1.resolve(SocketServer_1.SocketServer).sendToUser(this._user._id.toString(), eventName, data);
    }
    setUser(user) {
        Object.assign(this, user);
        this._user = user;
        return this;
    }
    getUser() {
        return this._user;
    }
    toJSON() {
        const options = AppContainer_1.config('server.responseSerialization');
        const obj = class_transformer_1.classToPlainFromExist(this._user ? this._user : this, {}, options);
        if (this._user)
            Object.keys(obj).forEach(key => obj[key] = this[key]);
        return obj;
    }
}
__decorate([
    class_transformer_1.Exclude(),
    __metadata("design:type", Object)
], Authenticatable.prototype, "_user", void 0);
exports.Authenticatable = Authenticatable;
//# sourceMappingURL=Authenticatable.js.map