import {ClassTransformOptions} from "class-transformer/types/interfaces/class-transformer-options.interface";
import {ValidatorOptions} from "class-validator/types/validation/ValidatorOptions";

export interface DataTransferObjectConstructorContract {
	new();

	serialize(body: object): DataTransferObjectContract;

	handleControllerBinding(body: object, validate: boolean): Promise<DataTransferObjectContract>;
}

export interface DataTransferObjectContract {

	/**
	 * Validate the data transfer object using class-validator
	 * If there's an error we'll map the validation errors to a more usable object.
	 */
	validate(): Promise<void>;

	/**
	 * Convert the request body to the DTO.
	 * This will serialize the object from plain object to an instance
	 * of the dto.
	 * It will use options from configuration or from {@see requestSerializationOptions}
	 *
	 * @param {object} body
	 * @return {DataTransferObject}
	 */
	serialize(body: object): DataTransferObjectContract;

	/**
	 * Did the validation fail?
	 */
	failed(): boolean;

	/**
	 * Get the class-validator errors
	 */
	errors(): { [key: string]: string } | null;

	getRequestSerializationOptions(): ClassTransformOptions

	/**
	 * Return an object here to override the value specified
	 * in the configuration file for a single DTO
	 *
	 * This is the config for: serialization.dataTransferObjects.requestSerializationOptions
	 *
	 * @return {ClassTransformOptions|null}
	 */
	requestSerializationOptions(): ClassTransformOptions | null

	/**
	 * Return an object here to override the value specified
	 * in the configuration file for a single DTO
	 *
	 * This is the config for: serialization.dataTransferObjects.validationOptions
	 *
	 * return {ValidatorOptions|null}
	 */
	validationOptions(): null | ValidatorOptions

	getValidationOptions(): ValidatorOptions

}
