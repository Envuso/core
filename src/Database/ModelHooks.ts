import {DecoratorHelpers} from "../Common";
import {ModelDecoratorMeta} from "./ModelDecorators";
import {Model} from "./Mongo/Model";

export enum ModelHook {
	/**
	 * Before create will only be called when running .save() on a model
	 * which isn't inserted to the database yet, or when running .create()
	 *
	 * @type {ModelHook.BEFORE_CREATE}
	 */
	BEFORE_CREATE = 'beforeCreate',
	/**
	 * Before save hook will only be called when using .save()
	 *
	 * .save() will only trigger this hook if the model is doing an update.
	 *
	 * @type {ModelHook.BEFORE_SAVE}
	 */
	BEFORE_SAVE   = 'beforeSave',
	BEFORE_DELETE = 'beforeDelete',
}

export type ModelHookMetaData = {
	type: ModelHook;
	handler: <M extends Model<any>>(model: M) => Promise<M>
}

export type ModelHooksMeta = {
	beforeCreate?: ModelHookMetaData;
	beforeSave?: ModelHookMetaData;
	beforeDelete?: ModelHookMetaData;
}

export function hook(target: Object, propertyKey: string | symbol) {
	if (!(target instanceof Model)) {
		throw new Error('You can only define @hook decorator on models.');
	}

	let hookType: ModelHook = Object.values(ModelHook).find(i => i === propertyKey);

	if (!hookType) {
		throw new Error('Invalid hook method name. Available method names are: ' + JSON.stringify(Object.values(ModelHook)));
	}

	DecoratorHelpers.addToMetadataObject(
		ModelDecoratorMeta.MODEL_HOOK,
		hookType,
		{
			type    : hookType,
			handler : target[propertyKey]
		},
		target
	);
}
