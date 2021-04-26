"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadedFile = void 0;
const fs = __importStar(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
const AppContainer_1 = require("../../../AppContainer");
const Common_1 = require("../../../Common");
const Storage_1 = require("../../../Storage");
const RequestContext_1 = require("../RequestContext");
const file_type_1 = __importDefault(require("file-type"));
const readChunk = __importStar(require("read-chunk"));
class UploadedFile {
    constructor(file, tempFileName) {
        this.file = file;
        this.tempFileName = tempFileName;
        this._extension = null;
        this._mimeType = null;
        this._fileStat = null;
    }
    /**
     * Get the mimetype of the uploaded file
     *
     * @returns {MimeType|null}
     */
    getMimeType() {
        return this._mimeType;
    }
    /**
     * This should only be used as a fallback if {@see getMimeType()} returns null
     *
     * It might not be a supported file type in this case.
     * @see https://github.com/sindresorhus/file-type#supported-file-types
     *
     * @returns {FileExtension}
     */
    getOriginalMimeType() {
        return this.file.mimetype;
    }
    /**
     * Get the encoder type for the file upload
     *
     * @returns {string}
     */
    getEncoding() {
        return this.file.encoding;
    }
    /**
     * Get the extension of the file, this is theoretically
     * safe and taken from the file contents directly.
     *
     * @returns {FileExtension | null}
     */
    getExtension() {
        return this._extension;
    }
    /**
     * Get the fs stat values
     *
     * @returns {Stats}
     */
    getFileStat() {
        return this._fileStat;
    }
    /**
     * Get the size of the file in bytes
     *
     * @returns {number}
     */
    getSize() {
        var _a;
        const stat = this.getFileStat();
        return (_a = stat === null || stat === void 0 ? void 0 : stat.size) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * This should only be used as a fallback if {@see getExtension()} returns null
     *
     * It might not be a supported file type in this case.
     * @see https://github.com/sindresorhus/file-type#supported-file-types
     *
     * @returns {FileExtension}
     */
    getOriginalExtension() {
        return this.file.filename.split(".").pop();
    }
    /**
     * Get the name of the field that this file was submitted via
     */
    getFieldName() {
        return this.file.fieldname;
    }
    /**
     * Get the temp file name assigned after uploading the file
     *
     * @returns {string}
     */
    getTempFileName() {
        return this.tempFileName;
    }
    /**
     * Get the absolute path of the temporary file
     */
    getTempFilePath() {
        const tempPath = AppContainer_1.resolve(AppContainer_1.ConfigRepository).get('paths.temp');
        return path_1.default.join(tempPath, this.tempFileName);
    }
    /**
     * Get the file name stored in temp storage
     *
     * @returns {string}
     */
    getOriginalFileName() {
        return this.file.filename;
    }
    /**
     * Get the file name without the extension
     *
     * @returns {string}
     */
    getFileNameWithoutExtension() {
        var _a;
        return (_a = this.getOriginalFileName().split('.').shift()) !== null && _a !== void 0 ? _a : null;
    }
    /**
     * Store the uploaded file in the specified directory.
     *
     * @param location
     */
    store(location) {
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
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
        return __awaiter(this, void 0, void 0, function* () {
            if (!request.isMultipart)
                return;
            const context = RequestContext_1.RequestContext.get();
            if (!context)
                return;
            yield context.request.setUploadedFile(yield request.file());
        });
    }
    /**
     * Should not be used, this is internal framework logic
     *
     * @returns {Promise<void>}
     * @private
     */
    setAdditionalInformation() {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filePath = path_1.default.join('storage', 'temp', this.tempFileName);
                const buffer = readChunk.sync(filePath, 0, 4100);
                const fileInformation = yield file_type_1.default.fromBuffer(buffer);
                this._extension = fileInformation === null || fileInformation === void 0 ? void 0 : fileInformation.ext;
                this._mimeType = fileInformation === null || fileInformation === void 0 ? void 0 : fileInformation.mime;
                // There's a chance the uploaded file isn't supported
                // https://github.com/sindresorhus/file-type#supported-file-types
                // In this case, we'll read the data from the upload
                // and probably make a bad decision to trust it...
                if (!this._extension) {
                    this._extension = this.getOriginalExtension();
                }
                if (!this._mimeType) {
                    this._mimeType = this.getOriginalMimeType();
                }
                this._fileStat = fs.statSync(this.getTempFilePath());
            }
            catch (error) {
                throw new Common_1.Exception('Something went wrong when trying to get mimetype/extension of uploaded file.');
            }
        });
    }
}
exports.UploadedFile = UploadedFile;
//# sourceMappingURL=UploadedFile.js.map