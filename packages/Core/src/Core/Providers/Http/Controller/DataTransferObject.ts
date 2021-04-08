import {ValidationException} from "@App/Exceptions/ValidationException";
import {validateOrReject, ValidationError} from "class-validator";
import {Log} from "@Core";

export class DataTransferObject {

	/**
	 * Validation errors returned by class-validator
	 *
	 * @private
	 */
	private _validationErrors?: ValidationError[];

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
			Log.warn(error.toString(false), true);

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
			throw new ValidationException(this._validationErrors);
		}
	}

	/**
	 * Did the validation fail?
	 */
	failed() {
		return !!this._validationErrors;
	}

	/**
	 * Get the class-validator errors
	 */
	errors() {
		if (!this._validationErrors) return null;

		return this._validationErrors;
	}

}
