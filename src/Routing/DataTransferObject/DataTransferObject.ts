
import {Exclude} from "class-transformer";
import {validateOrReject, ValidationError} from "class-validator";
import {Log} from "../../Common";
import {DtoValidationException} from "./DtoValidationException";


export class DataTransferObject {

	/**
	 * Validation errors returned by class-validator
	 *
	 * @private
	 */
	@Exclude()
	_validationErrors?: ValidationError[] = [];

	/**
	 * Validate the data transfer object using class-validator
	 */
	async validate() {
		try {
			await validateOrReject(this, {
				forbidUnknownValues : true,
				whitelist           : true,
				enableDebugMessages : true,
			})
		} catch (error) {
			Log.warn(error);

			if (Array.isArray(error)) {
				this._validationErrors = error;
			}
		}
	}

	/**
	 * If you didn't use auto validation, then you can
	 * call this method to throw the validation error
	 */
	throwIfFailed() {
		if (this.failed()) {
			throw new DtoValidationException(this._validationErrors);
		}
	}

	/**
	 * Did the validation fail?
	 */
	failed() {
		return !!this._validationErrors?.length;
	}

	/**
	 * Get the class-validator errors
	 */
	errors() {
		return this._validationErrors || [];
	}

}
