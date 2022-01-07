export enum DESIGN_META {
	DESIGN_PARAM_TYPES = 'design:paramtypes',
	DESIGN_TYPE        = 'design:type',
	DESIGN_PROPERTIES  = 'design:properties',
	DESIGN_RETURN_TYPE = 'design:returntype',
}

export class DecoratorHelpers {

	/**
	 * Get information about the types/parameters for the method/constructor
	 *
	 * @param target
	 * @param propertyKey
	 */
	static paramTypes(target: any, propertyKey?: string | symbol) {
		return Reflect.getMetadata(DESIGN_META.DESIGN_PARAM_TYPES, target, propertyKey);
	}

	/**
	 * Get the type of a property
	 *
	 * This is a property on a class. It will also return undefined if we do not have a decorator
	 * on the property(i think) or maybe undefined if we're trying to use this outside
	 * of when decorators are loaded.
	 *
	 * @param target
	 * @param propertyKey
	 */
	static propertyType(target: any, propertyKey: string | symbol) {
		return Reflect.getMetadata(DESIGN_META.DESIGN_TYPE, target, propertyKey);
	}

	/**
	 * Get the properties of a target
	 *
	 * If the target is a class constructor and method is the name of a method
	 * It will return the properties for the method?
	 *
	 * @param target
	 * @param method
	 */
	static properties(target: any, method?: string) {
		return Reflect.getMetadata(DESIGN_META.DESIGN_PROPERTIES, target, method);
	}

	/**
	 * Get the return type
	 *
	 * @param target
	 */
	static returnType(target: any) {
		return Reflect.getMetadata(DESIGN_META.DESIGN_RETURN_TYPE, target);
	}

	/**
	 * Get the names of all parameters specified in a function
	 * It seems we cannot use Reflect to obtain these, only the types
	 *
	 * @param func
	 */
	static getParameterNames(func: Function) {

		// String representation of the function code
		let str = func.toString();

		// Remove comments of the form /* ... */
		// Removing comments of the form //
		// Remove body of the function { ... }
		// removing '=>' if func is arrow function
		str = str.replace(/\/\*[\s\S]*?\*\//g, '')
			.replace(/\/\/(.)*/g, '')
			.replace(/{[\s\S]*}/, '')
			.replace(/=>/g, '')
			.trim();

		// Start parameter names after first '('
		const start = str.indexOf("(") + 1;

		// End parameter names is just before last ')'
		const end = str.length - 1;

		const result = str.substring(start, end).split(", ");

		const params = [];

		result.forEach(element => {

			// Removing any default value
			element = element.replace(/=[\s\S]*/g, '').trim();

			if (element.length > 0)
				params.push(element);
		});

		return params;
	}

	/**
	 * When we have some metadata defined which is an array of objects
	 * We always end up pulling the array, checking if it exists...
	 * If it doesn't, create an empty array, push the new object
	 * to it then finally, set the updated metadata again.
	 *
	 * This method solves that problem.
	 *
	 * @param {string} metadataKey
	 * @param {any[]} values
	 * @param target
	 */
	static pushToMetadata(metadataKey: string, values: any[], target: any) {
		const data: any[] = Reflect.getMetadata(metadataKey, target) || [];
		Reflect.defineMetadata(metadataKey, [...data, ...values], target);
	}

	/**
	 * This will add the key/value object to the defined metadata
	 * If none exists, it will be created.
	 *
	 * @param {string} metadataKey
	 * @param valueKey
	 * @param valueData
	 * @param target
	 */
	static addToMetadataObject(metadataKey: string, valueKey: string, valueData: any, target: any) {
		const data: any = Reflect.getMetadata(metadataKey, target) || {};

		data[valueKey] = valueData;

		Reflect.defineMetadata(metadataKey, data, target);
	}

	static get<T>(target: any, key: string | symbol): T {
		return Reflect.getMetadata(key, target) as T;
	}

	static getKeys(target: any) {
		return Reflect.getMetadataKeys(target);
	}
}
