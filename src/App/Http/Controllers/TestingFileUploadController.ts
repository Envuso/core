import {debug} from "winston";
import {response, request, DataTransferObject, controller, dto, get, destroy, patch, put, post} from "../../../Routing";
import {UploadedFile} from "../../../Routing/Context/Request/UploadedFile";
import {Controller} from "../../../Routing/Controller/Controller";
import {IsFileUpload} from "../../../Routing/DataTransferObject/Validators/IsFileUpload";
import {IsImageFileUpload} from "../../../Routing/DataTransferObject/Validators/IsImageFile";
import {IsVideoFileUpload} from "../../../Routing/DataTransferObject/Validators/IsVideoFile";

class ImageUploadDto extends DataTransferObject {

	@IsImageFileUpload()
	public file: UploadedFile;

}

class VideoUploadDto extends DataTransferObject {

	@IsVideoFileUpload()
	public file: UploadedFile;

}

@controller('/files')
export class TestingFileUploadController extends Controller {

	@post('/upload')
	async upload() {
		const req = request();

		const someValue = request('someValue');
		const file      = request().file('file');

	}

	@post('/upload/image')
	async uploadImage(@dto() dto: ImageUploadDto) {

		return {}
	}

	@post('/upload/video')
	async uploadVideo(@dto() dto: VideoUploadDto) {

	}

}
