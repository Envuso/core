import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator';
import {UploadedFile} from "../../Context/Request/UploadedFile";

const isVideo = require('is-video');

@ValidatorConstraint({name : 'IsVideoFileUpload', async : false})
export class IsVideoFileUploadValidator implements ValidatorConstraintInterface {

	validate(value: any, args: ValidationArguments) {
		if (!(value instanceof UploadedFile)) {
			return false;
		}

		return isVideo(value.getTempFilePath());
	}

	defaultMessage(args: ValidationArguments) {
		return '$property is not a video file';
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
export function IsVideoFileUpload(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target       : object.constructor,
			propertyName : propertyName,
			options      : validationOptions,
			constraints  : [],
			validator    : IsVideoFileUploadValidator,
		});
	};
}
