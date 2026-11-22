import {defaultMetadataStorage} from "class-transformer/cjs/storage";
import {ModelDecoratorMeta} from "./ModelDecorators";

/**
 * The property names a model declares.
 *
 * These used to come only from `Object.getOwnPropertyNames(new Model())`. Bun's legacy
 * decorator transform leaves out class fields that have a decorator and no initialiser
 * (`@id _id: ObjectId;`, `@hasMany(...) books;`, `@Exclude() password;`), so those were
 * missing: relations weren't attached by load(), and `_id` wasn't a field.
 *
 * Decorated properties are recovered from decorator metadata instead: class-transformer
 * records every @Type/@Transform/@Exclude/@Expose (our @id, @date and relation decorators
 * apply class-transformer transforms too), plus our own @ignore, @id and @nested metadata.
 */
export function modelFieldNames(modelClass: Function, instance: any): string[] {
	const names = new Set<string>(Object.getOwnPropertyNames(instance));

	for (const name of decoratedPropertyNames(modelClass)) {
		names.add(name);
	}

	return [...names];
}

function decoratedPropertyNames(modelClass: Function): string[] {
	const names = new Set<string>();
	const proto = modelClass.prototype;

	// class-transformer keeps per-class Maps of property name -> metadata. They're private,
	// so read them defensively: if a future version changes them we only lose this source
	const storage: any = defaultMetadataStorage;
	for (const mapName of ['_typeMetadatas', '_transformMetadatas', '_exposeMetadatas', '_excludeMetadatas']) {
		const byTarget: Map<Function, Map<string, unknown>> | undefined = storage?.[mapName];
		if (!(byTarget instanceof Map)) {
			continue;
		}

		for (const [target, properties] of byTarget) {
			if (target !== modelClass && !(proto instanceof target)) {
				continue;
			}
			for (const name of properties?.keys?.() ?? []) {
				if (typeof name === 'string') {
					names.add(name);
				}
			}
		}
	}

	for (const name of Object.keys(Reflect.getMetadata(ModelDecoratorMeta.IGNORED_PROPERTY, proto) ?? {})) {
		names.add(name);
	}
	for (const key of [ModelDecoratorMeta.MODEL_OBJECT_ID, 'mongo:nested']) {
		for (const entry of (Reflect.getMetadata(key, proto) ?? []) as { name: string }[]) {
			if (entry?.name) {
				names.add(entry.name);
			}
		}
	}

	return [...names];
}
