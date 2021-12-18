import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator';
import {UploadedFile} from "../../Context/Request/UploadedFile";

@ValidatorConstraint({name : 'IsFileUpload', async : false})
export class IsFileUploadValidator implements ValidatorConstraintInterface {

	validate(value: any, args: ValidationArguments) {
		return value instanceof UploadedFile;
	}

	defaultMessage(args: ValidationArguments) {
		return '$property is not a file upload';
	}
}

/**
 * Checks that the value is an instance of FileUpload
 * This is useful when we want to use file uploads + data transfer objects
 *
 * @param {ValidationOptions} validationOptions
 * @returns {(object: Object, propertyName: string) => void}
 * @constructor
 */
export function IsFileUpload(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target       : object.constructor,
			propertyName : propertyName,
			options      : validationOptions,
			constraints  : [],
			validator    : IsFileUploadValidator,
		});
	};
}
