"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedFile = void 0;
const tslib_1 = require("tslib");
const fs = tslib_1.__importStar(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const path_1 = tslib_1.__importDefault(require("path"));
const AppContainer_1 = require("../../../AppContainer");
const Common_1 = require("../../../Common");
const Storage_1 = require("../../../Storage");
const RequestContext_1 = require("../RequestContext");
class UploadedFile {
    constructor(file, tempFileName) {
        this.file = file;
        this.tempFileName = tempFileName;
    }
    /**
     * Get the name of the field that this file was submitted via
     */
    getFieldName() {
        return this.file.fieldname;
    }
    /**
     * Get the absolute path of the temporary file
     */
    getTempFilePath() {
        const tempPath = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('paths.temp');
        return path_1.default.join(tempPath, this.tempFileName);
    }
    /**
     * Store the uploaded file in the specified directory.
     *
     * @param location
     */
    store(location) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.storeFile(location);
        });
    }
    /**
     * Store the uploaded file in the specified directory using
     * a user specified file name, rather than generated.
     *
     * @param location
     * @param fileName
     */
    storeAs(location, fileName) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            return this.storeFile(location, fileName);
        });
    }
    /**
     * Store the file from the request on our default storage provider
     *
     * This method handles store() and storeAs() so there's less code for those methods.
     *
     * @param location
     * @param storeAs
     */
    storeFile(location, storeAs) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            let response = null;
            try {
                response = yield Storage_1.Storage.put(location, {
                    tempFilePath: this.getTempFilePath(),
                    filename: this.file.filename,
                    storeAs: storeAs
                });
            }
            catch (error) {
                Common_1.Log.error(error);
                this.deleteTempFile();
                throw new Common_1.Exception('Something went wrong uploading the file', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            this.deleteTempFile();
            return response;
        });
    }
    /**
     * If the temp file exists, it will be deleted.
     */
    deleteTempFile() {
        const tempFilePath = this.getTempFilePath();
        if (fs.existsSync(tempFilePath))
            fs.rmSync(tempFilePath);
    }
    /**
     * We will bind the uploaded file from the request into our request
     * context, so that it is ready to be processed and any async operations
     * have already been handled and are completed.
     *
     * @param request
     */
    static addToRequest(request) {
        return tslib_1.__awaiter(this, void 0, void 0, function* () {
            if (!request.isMultipart)
                return;
            const context = RequestContext_1.RequestContext.get();
            if (!context)
                return;
            yield context.request.setUploadedFile(yield request.file());
        });
    }
}
exports.UploadedFile = UploadedFile;
//# sourceMappingURL=UploadedFile.js.map