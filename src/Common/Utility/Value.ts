import {ObjectId} from "mongodb";
import {ClassType} from "../../Database";

export class Value {

	public static isPrimitive(type: ClassType<any>) {
		return (type === ObjectId || type === String || type === Number || type === Boolean);
	}
}
