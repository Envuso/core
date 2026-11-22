import {RequestContext} from "../../Routing/Context/RequestContext";
import type {HookHandlerArgs} from "../ServerHooks/Hook";
import {PreHandlerHook} from "../ServerHooks/HookTypes/PreHandlerHook";

/**
 * If the current request is a multipart request(ie contains a file upload)
 * We'll add this file to our request and begin some automatic background processing.
 */
export class ProcessUploadedFilesHook extends PreHandlerHook {

	public async handleAsync({request, response, payload, error, done}: HookHandlerArgs): Promise<boolean> {
		//If this request is a cors preflight request... we don't want to handle our internal logic.
		if ((request as any).corsPreflightEnabled) {
			return;
		}

		if (!request.isMultipart()) {
			return;
		}

		const context = RequestContext.get();

		if (!context)
			return;

		// Every part, in order: request.file() only returned the first file, and undefined
		// for a multipart form without one (which then crashed)
		const fields: Record<string, any> = {};

		for await (const part of request.parts()) {
			if (part.type !== 'file') {
				fields[part.fieldname] = part.value;
				continue;
			}

			// An empty <input type="file"> still sends a part, with no filename
			if (!part.filename) {
				part.file.resume();
				continue;
			}

			await context.request.addUploadedFile(part);
		}

		context.request.setMultipartFields(fields);
	}

}
