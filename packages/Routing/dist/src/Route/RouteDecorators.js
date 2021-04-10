"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.headers = exports.body = exports.query = exports.param = exports.dto = void 0;
const DataTransferObjectParam_1 = require("./RequestInjection/DataTransferObjectParam");
const RequestBodyParam_1 = require("./RequestInjection/RequestBodyParam");
const RequestHeadersParam_1 = require("./RequestInjection/RequestHeadersParam");
const RouteParameterParam_1 = require("./RequestInjection/RouteParameterParam");
const RouteQueryParam_1 = require("./RequestInjection/RouteQueryParam");
function dto(validateOnRequest) {
    return function (target, propertyKey, parameterIndex) {
        DataTransferObjectParam_1.DataTransferObjectParam.handleParameter({ target, propertyKey, parameterIndex }, validateOnRequest);
    };
}
exports.dto = dto;
const param = function (target, propertyKey, parameterIndex) {
    RouteParameterParam_1.RouteParameterParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.param = param;
const query = function (target, propertyKey, parameterIndex) {
    RouteQueryParam_1.RouteQueryParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.query = query;
const body = function (target, propertyKey, parameterIndex) {
    RequestBodyParam_1.RequestBodyParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.body = body;
const headers = function (target, propertyKey, parameterIndex) {
    RequestHeadersParam_1.RequestHeadersParam.handleParameter({ target, propertyKey, parameterIndex });
};
exports.headers = headers;
//# sourceMappingURL=RouteDecorators.js.map