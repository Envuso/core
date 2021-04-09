import {validateOrReject, ValidationError} from "class-validator";

interface DataTransferObjectContract {
	_validationErrors?: ValidationError[];

	/**
	 * Validate the data transfer object using class-validator
	 */
	validate(): Promise<void>;

	/**
	 * If you didn't use auto validation, then you can
	 * call this method to throw the validation error
	 */
	throwIfFailed(): void;

	/**
	 * Did the validation fail?
	 */
	failed(): boolean;

	/**
	 * Get the class-validator errors
	 */
	errors(): any;
}
