export const STUB_MODEL = `import {Exclude, Expose, Type} from "class-transformer";
import {IsEmail, IsNotEmpty} from "class-validator";
import {ModelEntity} from "@Providers/Model/ModelEntity";
import {ObjectId} from "mongodb";
import {Id} from "@Core/Decorators/ModelDecorators";
import {injectable} from "inversify";

@injectable()
export class {{name}} extends ModelEntity<{{name}}> {

	@Id
	id: ObjectId;

}`
