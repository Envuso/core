"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataTransferObjectParam = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const Common_1 = require("../../../Common");
const DataTransferObject_1 = require("../../DataTransferObject/DataTransferObject");
const MethodParameterDecorator_1 = require("./MethodParameterDecorator");
class DataTransferObjectParam extends MethodParameterDecorator_1.MethodParameterDecorator {
    constructor(dtoParameter, validateOnRequest = true) {
        super(dtoParameter);
        this.validateOnRequest = true;
        this.dtoParameter = dtoParameter;
        this.validateOnRequest = validateOnRequest;
    }
    static handleParameter(reflector, validateOnRequest = true) {
        const paramTypes = Common_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
        const dtoParameter = paramTypes[reflector.parameterIndex];
        if (dtoParameter.prototype instanceof DataTransferObject_1.DataTransferObject) {
            const paramHandler = new DataTransferObjectParam(dtoParameter, validateOnRequest);
            this.setMetadata(reflector, paramHandler);
        }
    }
    static setMetadata(reflector, dtoParam) {
        const target = reflector.target[reflector.propertyKey];
        Reflect.defineMetadata(Common_1.METADATA.REQUEST_METHOD_DTO, dtoParam, target);
    }
    static getMetadata(target) {
        return Reflect.getMetadata(Common_1.METADATA.REQUEST_METHOD_DTO, target);
    }
    bind(request, response) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            const dtoClass = class_transformer_1.plainToClass(this.dtoParameter, request.body);
            yield dtoClass.validate();
            if (this.validateOnRequest) {
                dtoClass.throwIfFailed();
            }
            return dtoClass;
        });
    }
    static canInject(target, key) {
        return !!this.getMetadata(target[key]);
    }
}
exports.DataTransferObjectParam = DataTransferObjectParam;
//# sourceMappingURL=DataTransferObjectParam.js.map