import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator';
import Obj from "../../../Common/Utility/Obj";

@ValidatorConstraint({name : 'Required', async : false})
export class RequiredValidator implements ValidatorConstraintInterface {

	validate(value: any, args: ValidationArguments) {
		return Obj.isNullOrUndefined(value) === false;
	}

	defaultMessage(args: ValidationArguments) {
		return '$property is not a video file';
	}
}

/**
 * Checks that the field is not undefined or null
 *
 * @param {ValidationOptions} validationOptions
 * @returns {(object: Object, propertyName: string) => void}
 * @constructor
 */
export function Required(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target       : object.constructor,
			propertyName : propertyName,
			options      : validationOptions,
			constraints  : [],
			validator    : RequiredValidator,
		});
	};
}
