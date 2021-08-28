import {RequestContext, UploadedFile} from "../../Routing";
import {HookHandlerArgs, PreHandlerHook} from "../ServerHooks";

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

		await UploadedFile.addToRequest(request);
	}

}
