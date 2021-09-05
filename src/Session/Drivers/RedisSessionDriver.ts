import {Redis} from "../../Database";
import {SessionStorageDriver} from "./SessionStorageDriver";

export class RedisSessionDriver implements SessionStorageDriver {

	public destroy(id: string): Promise<boolean> {
		return Redis.getInstance().remove(`session:${id}`);
	}

	public async getSessionData(id: string): Promise<object> {
		const data = await Redis.getInstance().get<string>(`session:${id}`, JSON.stringify({}));

		return JSON.parse(data);
	}

	public writeSessionData(id: string, data: object): Promise<boolean> {
		return Redis.getInstance().put(`session:${id}`, JSON.stringify(data));
	}

}
