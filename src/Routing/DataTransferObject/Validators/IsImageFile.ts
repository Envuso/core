import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator';
import {UploadedFile} from "../../Context/Request/UploadedFile";

const isImage = require('is-image');

@ValidatorConstraint({name : 'IsImageFileUpload', async : false})
export class IsImageFileUploadValidator implements ValidatorConstraintInterface {

	validate(value: any, args: ValidationArguments) {
		if (!(value instanceof UploadedFile)) {
			return false;
		}

		return isImage(value.getTempFilePath());
	}

	defaultMessage(args: ValidationArguments) {
		return '$property is not an image file';
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
export function IsImageFileUpload(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target       : object.constructor,
			propertyName : propertyName,
			options      : validationOptions,
			constraints  : [],
			validator    : IsImageFileUploadValidator,
		});
	};
}
