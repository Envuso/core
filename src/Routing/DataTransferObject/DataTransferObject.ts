import {classToPlain, Exclude, plainToClassFromExist} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces/class-transformer-options.interface";
import {validateOrReject} from "class-validator";
import {ValidatorOptions} from "class-validator/types/validation/ValidatorOptions";
import {config} from "../../AppContainer";
import {Log} from "../../Common";
import {DataTransferObjectContract} from "../../Contracts/Routing/DataTransferObject/DataTransferObjectContract";
import {Responsable} from "../Context/Response/Responsable";
import {DtoValidationException} from "./DtoValidationException";

export interface DataTransferObjectSerialization {
	requestSerializationOptions: ClassTransformOptions;
	validationOptions: ValidatorOptions;
}

export class DataTransferObject implements DataTransferObjectContract, Responsable {

	@Exclude()
	private __options: DataTransferObjectSerialization = null;

	/**
	 * Validation errors returned by class-validator
	 *
	 * @private
	 */
	@Exclude()
	private __validationErrors?: { [key: string]: string } = null;

	constructor() {
		this.__options = config('Serialization.dataTransferObjects', {
			requestSerializationOptions : {
				strategy        : 'exposeAll',
				excludePrefixes : ['__']
			},
			validationOptions           : {
				whitelist           : true,
				forbidUnknownValues : true,
				enableDebugMessages : true,
			}
		});
	}

	/**
	 * Validate the data transfer object using class-validator
	 * If there's an error we'll map the validation errors to a more usable object.
	 */
	public async validate() {
		try {
			await validateOrReject(this, this.getValidationOptions());
		} catch (error) {
			Log.warn(error);

			if (Array.isArray(error)) {
				const validationErrorsFormatted = {};

				for (let validationError of error) {
					validationErrorsFormatted[validationError.property] = Object.values(validationError.constraints)[0] || null;
				}

				this.__validationErrors = validationErrorsFormatted;
			}

		}

		if (this.failed()) {
			throw new DtoValidationException(this.__validationErrors);
		}
	}

	/**
	 * Convert the request body to the DTO.
	 * This will serialize the object from plain object to an instance
	 * of the dto.
	 * It will use options from configuration or from {@see requestSerializationOptions}
	 *
	 * @param {object} body
	 * @return {DataTransferObjectContract}
	 */
	public serialize(body: object): DataTransferObjectContract {
		return plainToClassFromExist(
			this, body, this.getRequestSerializationOptions()
		);
	}


	/**
	 * This is the logic for binding the serialized DTO to your controller method as a parameter.
	 *
	 * @param {object} body
	 * @param {boolean} validate
	 * @return {Promise<DataTransferObject>}
	 */
	public static async handleControllerBinding(body: object, validate: boolean): Promise<DataTransferObjectContract> {
		const dto = new this().serialize(body);

		if (validate) {
			await dto.validate();
		}

		return dto;
	}

	/**
	 * Did the validation fail?
	 */
	public failed(): boolean {
		if(!this.__validationErrors) {
			return false;
		}

		return Object.keys(this.__validationErrors).length > 0;
	}

	/**
	 * Get the class-validator errors
	 */
	public errors(): { [key: string]: string } | null {
		return this.__validationErrors ?? null;
	}

	public getRequestSerializationOptions(): ClassTransformOptions {
		return this.requestSerializationOptions() ?? this.__options.requestSerializationOptions;
	}

	/**
	 * Return an object here to override the value specified
	 * in the configuration file for a single DTO
	 *
	 * This is the config for: serialization.dataTransferObjects.requestSerializationOptions
	 *
	 * @return {ClassTransformOptions|null}
	 */
	public requestSerializationOptions(): ClassTransformOptions | null {
		return null;
	}

	/**
	 * Return an object here to override the value specified
	 * in the configuration file for a single DTO
	 *
	 * This is the config for: serialization.dataTransferObjects.validationOptions
	 *
	 * return {ValidatorOptions|null}
	 */
	public validationOptions(): null | ValidatorOptions {
		return null;
	}

	public getValidationOptions(): ValidatorOptions {
		return this.validationOptions() ?? this.__options.validationOptions;
	}

	public toResponse(): object {
		return classToPlain(this, {
			excludePrefixes : ['__']
		});
	}
}
