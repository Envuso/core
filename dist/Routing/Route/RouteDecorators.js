"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headers = exports.body = exports.query = exports.param = exports.dto = void 0;
const RequestInjection_1 = require("./RequestInjection");
function dto(validateOnRequest) {
    return function (target, propertyKey, parameterIndex) {
        RequestInjection_1.DataTransferObjectParam.handleParameter({ target, propertyKey, parameterIndex }, validateOnRequest);
    };
}
exports.dto = dto;
const param = function (target, propertyKey, parameterIndex) {
    RequestInjection_1.RouteParameterParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.param = param;
const query = function (target, propertyKey, parameterIndex) {
    RequestInjection_1.RouteQueryParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.query = query;
const body = function (target, propertyKey, parameterIndex) {
    RequestInjection_1.RequestBodyParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.body = body;
const headers = function (target, propertyKey, parameterIndex) {
    RequestInjection_1.RequestHeadersParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.headers = headers;
//# sourceMappingURL=RouteDecorators.js.map