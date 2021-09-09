import {User} from "../App/Models/User";
import {DataTransferObject} from "../Routing";

export class JobSerializableData extends DataTransferObject {
	user: User;
	someString: string;
}
