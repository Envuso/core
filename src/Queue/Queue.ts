import {Job} from "./Job";
import {DataTransferObject} from "../Routing";
import {FileLoader} from "../Common";

export class Queue {

	public static dispatch(job: Job<DataTransferObject>) {
		const serialized = job.serialize();
		const raw = JSON.parse(serialized);

		console.log(serialized);

		(async function () {
			const [jobFilePath, jobClassName] = raw.t.split(":");
			const modules = await FileLoader.importModulesFrom(jobFilePath);
			const jobModule = modules.find(module => module.name === jobClassName);

			if (!jobModule) {
				throw new Error(`Could not load Job with namespace "${raw.t}"`);
			}

			const job = jobModule.instance as typeof Job;
			const instance = job.deserialize(raw.d);
		})();
	}

}
