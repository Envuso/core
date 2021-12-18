import {FastifyReply, FastifyRequest} from "fastify";
import {DecoratorHelpers, METADATA} from "../../../Common";
import {RequestContextContract} from "../../../Contracts/Routing/Context/RequestContextContract";
import {DataTransferObject} from "../../DataTransferObject/DataTransferObject";
import {MethodParameterDecorator, ReflectControllerMethodParamData} from "./MethodParameterDecorator";

export class DataTransferObjectParam extends MethodParameterDecorator {

	private dtoParameter: typeof DataTransferObject;
	private validateOnRequest: boolean = true;

	constructor(
		dtoParameter: typeof DataTransferObject,
		validateOnRequest: boolean = true
	) {
		super(dtoParameter);
		this.dtoParameter      = dtoParameter;
		this.validateOnRequest = validateOnRequest;
	}

	public static handleParameter(reflector: ReflectControllerMethodParamData, validateOnRequest: boolean = true) {
		const paramTypes = DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);

		const dtoParameter: typeof DataTransferObject = paramTypes[reflector.parameterIndex];

		if (dtoParameter.prototype instanceof DataTransferObject) {
			const paramHandler = new DataTransferObjectParam(dtoParameter, validateOnRequest);
			this.setMetadata(reflector, paramHandler);
		}
	}

	private static setMetadata(reflector: ReflectControllerMethodParamData, dtoParam: DataTransferObjectParam) {
		const target = reflector.target[reflector.propertyKey];

		Reflect.defineMetadata(METADATA.REQUEST_METHOD_DTO, dtoParam, target);
	}

	static getMetadata(target: Function): DataTransferObjectParam | undefined {
		return Reflect.getMetadata(METADATA.REQUEST_METHOD_DTO, target);
	}

	async bind(request: FastifyRequest, response: FastifyReply, context: RequestContextContract) {
		return await this.dtoParameter.handleControllerBinding(
			context, this.validateOnRequest
		);
	}
}
