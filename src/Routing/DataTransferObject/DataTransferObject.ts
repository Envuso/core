import {dotnotate} from "@zishone/dotnotate";
import {instanceToPlain, Exclude, plainToClassFromExist} from "class-transformer";
import {ClassTransformOptions} from "class-transformer/types/interfaces/class-transformer-options.interface";
import {validate, ValidationError} from "class-validator";
import {ValidationUtils} from "class-validator/cjs/validation/ValidationUtils.js";
import {constraintToString} from "class-validator/cjs/validation/ValidationUtils";
import {ValidatorOptions} from "class-validator/types/validation/ValidatorOptions";
import {config} from "../../AppContainer";
import {Log} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {DataTransferObjectContract} from "../../Contracts/Routing/DataTransferObject/DataTransferObjectContract";
import {RequestContext} from "../Context/RequestContext";
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
	public async validate(throwOnFailure: boolean = true) {
		const validationErrors = await validate(this, this.getValidationOptions());

		if (validationErrors.length) {
			Log.warn(validationErrors);
			this.__validationErrors = this.formatValidationErrors(validationErrors);
		}

		if (this.failed() && throwOnFailure) {
			this.handleValidationException();
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
	 * @return {Promise<DataTransferObject>}
	 * @param context
	 * @param validate
	 */
	public static async handleControllerBinding(context: RequestContextContract, validate: boolean): Promise<DataTransferObjectContract> {

		const dto = new this().serialize(context.request.all());

		// We need to ensure we also add files into our DTO so they can be handled/validated
		if (context.request.hasFiles()) {
			const files = context.request.filesKeyed();
			for (let key in files) {
				dto[key] = files[key];
			}
		}

		if (validate) {
			await dto.validate();
		}

		return dto;
	}

	/**
	 * Did the validation fail?
	 */
	public failed(): boolean {
		if (!this.__validationErrors) {
			return false;
		}

		return Object.keys(this.__validationErrors).length > 0;
	}

	public fieldDidFail(key: string): boolean {
		if (!this.failed()) {
			return false;
		}

		return !!this.__validationErrors[key];
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
		return instanceToPlain(this, {
			excludePrefixes : ['__']
		});
	}

	private handleValidationException() {
		const context = RequestContext.get();

		if (context.hasSession()) {
			context.session.store().flash('errors', this.__validationErrors);
		}

		throw new DtoValidationException(this.__validationErrors);
	}

	private formatValidationErrors(errors: ValidationError[]): { [key: string]: string } {
		const validationErrorsFormatted = {};

		for (let error of errors) {
			if (error.children.length) {
				validationErrorsFormatted[error.property] = this.formatValidationErrors(error.children);
				continue;
			}

			validationErrorsFormatted[error.property] = Object.values(error.constraints)[0] || null;
		}

		return dotnotate(validationErrorsFormatted);
	}
}


ValidationUtils.replaceMessageSpecialTokens = function replaceMessageSpecialTokens(message, validationArguments) {
	let messageString;
	if (message instanceof Function) {
		messageString = message(validationArguments);
	} else if (typeof message === 'string') {
		messageString = message;
	}
	if (messageString && Array.isArray(validationArguments.constraints)) {
		validationArguments.constraints.forEach((constraint, index) => {
			messageString = messageString.replace(new RegExp(`\\$constraint${index + 1}`, 'g'), constraintToString(constraint));
		});
	}
	if (messageString &&
		validationArguments.value !== undefined &&
		validationArguments.value !== null &&
		typeof validationArguments.value === 'string')
		messageString = messageString.replace(/\$value/g, validationArguments.value);
	if (messageString) {
		let propAsTitle = validationArguments.property.toString();
		propAsTitle = propAsTitle.replace(/\./g,' ')
		propAsTitle = propAsTitle.titleCase()

		messageString = messageString.replace(/\$property/g, propAsTitle);
	}
	if (messageString)
		messageString = messageString.replace(/\$target/g, validationArguments.targetName);
	return messageString;
};

