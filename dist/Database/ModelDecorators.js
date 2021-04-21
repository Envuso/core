"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.id = exports.ids = exports.ref = exports.ignore = exports.nested = void 0;
const tslib_1 = require("tslib");
const class_transformer_1 = require("class-transformer");
const mongodb_1 = require("mongodb");
const pluralize_1 = tslib_1.__importDefault(require("pluralize"));
function addRef(name, ref, target) {
    const refs = Reflect.getMetadata('mongo:refs', target) || {};
    refs[name] = ref;
    Reflect.defineMetadata('mongo:refs', refs, target);
}
function pushToMetadata(metadataKey, values, target) {
    const data = Reflect.getMetadata(metadataKey, target) || [];
    Reflect.defineMetadata(metadataKey, data.concat(values), target);
}
function isNotPrimitive(targetType, propertyKey) {
    if (targetType === mongodb_1.ObjectId || targetType === String || targetType === Number || targetType === Boolean) {
        throw new Error(`property '${propertyKey}' cannot have nested type '${targetType}'`);
    }
}
function nested(typeFunction) {
    return function (target, propertyKey) {
        const targetType = Reflect.getMetadata('design:type', target, propertyKey);
        isNotPrimitive(targetType, propertyKey);
        //		Type(() => typeFunction)(target, propertyKey);
        class_transformer_1.Transform((val) => {
            if (!val.value) {
                return null;
            }
            if (targetType === Array) {
                return val.value.map(v => class_transformer_1.plainToClass(typeFunction, v));
            }
            return class_transformer_1.plainToClass(typeFunction, val.value);
        }, { toClassOnly: true })(target, propertyKey);
        class_transformer_1.Transform((val) => {
            if (!val.value) {
                return null;
            }
            if (targetType === Array) {
                return val.value.map(v => class_transformer_1.classToPlain(v));
            }
            return class_transformer_1.classToPlain(val.value);
        }, { toPlainOnly: true })(target, propertyKey);
        pushToMetadata('mongo:nested', [{ name: propertyKey, typeFunction, array: targetType === Array }], target);
    };
}
exports.nested = nested;
function ignore(target, propertyKey) {
    const ignores = Reflect.getMetadata('mongo:ignore', target) || {};
    ignores[propertyKey] = true;
    Reflect.defineMetadata('mongo:ignore', ignores, target);
}
exports.ignore = ignore;
function ref(modelReference) {
    return function (target, propertyKey) {
        const targetType = Reflect.getMetadata('design:type', target, propertyKey);
        isNotPrimitive(targetType, propertyKey);
        const isArray = targetType === Array;
        const refId = pluralize_1.default(pluralize_1.default(propertyKey, 1) + (isArray ? 'Ids' : 'Id'), isArray ? 2 : 1);
        Reflect.defineMetadata('design:type', (isArray ? Array : mongodb_1.ObjectId), target, refId);
        const refInfo = {
            _id: refId,
            array: isArray,
            modelName: modelReference.name
        };
        addRef(propertyKey, refInfo, target);
        class_transformer_1.Transform((val) => {
            if (!val.value) {
                return null;
            }
            if (targetType === Array) {
                return val.value.map(v => class_transformer_1.plainToClass(modelReference, v));
            }
            return class_transformer_1.plainToClass(modelReference, val.value);
        }, { toClassOnly: true })(target, propertyKey);
        class_transformer_1.Transform((val) => {
            if (!val.value) {
                return null;
            }
            if (targetType === Array) {
                return val.value.map(v => class_transformer_1.classToPlain(v));
            }
            return class_transformer_1.classToPlain(val.value);
        }, { toPlainOnly: true })(target, propertyKey);
    };
}
exports.ref = ref;
function ids(target, propertyKey) {
    isNotPrimitive(target, propertyKey);
    class_transformer_1.Transform((val) => {
        if (!val.value) {
            return null;
        }
        return val.value.map(v => new mongodb_1.ObjectId(v));
    }, { toClassOnly: true })(target, propertyKey);
    class_transformer_1.Transform((val) => {
        if (!val.value) {
            return null;
        }
        return val.value.map(v => v.toString());
    }, { toPlainOnly: true })(target, propertyKey);
}
exports.ids = ids;
function id(target, propertyKey) {
    class_transformer_1.Transform(({ value }) => new mongodb_1.ObjectId(value), { toClassOnly: true })(target, propertyKey);
    class_transformer_1.Transform(({ value }) => value.toString(), { toPlainOnly: true })(target, propertyKey);
}
exports.id = id;
//# sourceMappingURL=ModelDecorators.js.map