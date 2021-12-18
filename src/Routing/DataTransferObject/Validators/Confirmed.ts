import {ValidatorConstraint, ValidatorConstraintInterface, ValidationArguments, ValidationOptions, registerDecorator} from 'class-validator';

@ValidatorConstraint({name : 'confirmed', async : false})
export class ConfirmedValidator implements ValidatorConstraintInterface {

	validate(text: string, args: ValidationArguments) {
		const confirmedProperty = args.object[args.property + '_confirmation'];

		if (!confirmedProperty) {
			return false;
		}

		return text === confirmedProperty;
	}

	defaultMessage(args: ValidationArguments) {
		return 'The $property confirmation does not match';
	}
}

/**
 * This will check that your value matches the specified value
 *
 * How it works:
 * If we wanted to validate a password matches the confirmation password, ie we enter the password twice;
 *
 * We should define "password" and "password_confirmation" on our DTO.
 *
 * If they both do not match, then an error will be thrown.
 * It would look something like this:
 *
 * class RegisterDTO extends DataTransferObject {
 *
 *     @Confirmed()
 *     password:string;
 *
 *     @Allow()
 *     password_confirmation:string;
 *
 * }
 *
 *
 * @param {ValidationOptions} validationOptions
 * @returns {(object: Object, propertyName: string) => void}
 * @constructor
 */
export function Confirmed(validationOptions?: ValidationOptions) {
	return function (object: Object, propertyName: string) {
		registerDecorator({
			target       : object.constructor,
			propertyName : propertyName,
			options      : validationOptions,
			constraints  : [],
			validator    : ConfirmedValidator,
		});
	};
}
