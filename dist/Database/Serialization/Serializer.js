"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.hydrateModel = exports.dehydrateModel = void 0;
const class_transformer_1 = require("class-transformer");
const mongodb_1 = require("mongodb");
function dehydrateModel(entity) {
    if (!entity)
        return entity;
    const refs = Reflect.getMetadata('mongo:refs', entity) || {};
    for (let name in refs) {
        const ref = refs[name];
        const reffedEntity = entity[name];
        if (!reffedEntity) {
            continue;
        }
        if (ref.array) {
            entity[ref._id] = reffedEntity.map((e) => new mongodb_1.ObjectId(e._id));
            continue;
        }
        entity[ref._id] = new mongodb_1.ObjectId(reffedEntity._id);
    }
    const plain = class_transformer_1.classToPlain(entity, {
        enableCircularCheck: true,
        excludePrefixes: ['_'],
        ignoreDecorators: true
    });
    //	const plain: any = Object.assign({}, entity);
    for (let name in refs) {
        delete plain[name];
    }
    const nested = Reflect.getMetadata('mongo:nested', entity) || [];
    for (let { name, array } of nested) {
        if (plain[name]) {
            if (!array) {
                plain[name] = dehydrateModel(plain[name]);
            }
            else {
                plain[name] = plain[name].map((e) => dehydrateModel(e));
            }
        }
    }
    const ignores = Reflect.getMetadata('mongo:ignore', entity) || {};
    for (const name in ignores) {
        delete plain[name];
    }
    return plain;
}
exports.dehydrateModel = dehydrateModel;
function hydrateModel(plain, type) {
    return plain ? class_transformer_1.plainToClass(type, plain, {
        ignoreDecorators: true,
    }) : null;
}
exports.hydrateModel = hydrateModel;
//# sourceMappingURL=Serializer.js.map