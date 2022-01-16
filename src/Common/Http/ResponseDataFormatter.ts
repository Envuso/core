import {ObjectId} from "mongodb";
import {Model} from "../../Database";
import Obj from "../Utility/Obj";

export class ResponseDataFormatter {

	public static clean(data:any) {
		const formatted = Array.isArray(data) ? [] : {};

		if (Array.isArray(data) || Obj.isObject(data)) {
			for (let key in data) {

				if (data[key]?.toResponse) {
					formatted[key] = data[key].toResponse();
					continue;
				}

				if (data[key] instanceof Model) {
					formatted[key] = data[key].dehydrate();

					continue;
				}

				if (data[key] instanceof ObjectId) {
					formatted[key] = data[key].toString();

					continue;
				}

				if (typeof data[key] === 'string') {
					formatted[key] = data[key];
					continue;
				}

				if (Array.isArray(data[key]) || Obj.isObject(data[key])) {
					formatted[key] = this.clean(data[key]);
					continue;
				}

				formatted[key] = data[key];
			}
		} else {
			return data;
		}

		return formatted;
	}

}
