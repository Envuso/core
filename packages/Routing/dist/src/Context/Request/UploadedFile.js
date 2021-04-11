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
const app_1 = require("@envuso/app");
const common_1 = require("@envuso/common");
const storage_1 = require("@envuso/storage");
const fs = __importStar(require("fs"));
const http_status_codes_1 = require("http-status-codes");
const path_1 = __importDefault(require("path"));
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
        const tempPath = app_1.resolve(app_1.ConfigRepository).get('paths.temp');
        return path_1.default.join(tempPath, this.tempFileName);
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
                response = yield storage_1.Storage.put(location, {
                    tempFilePath: this.getTempFilePath(),
                    filename: this.file.filename,
                    storeAs: storeAs
                });
            }
            catch (error) {
                common_1.Log.error(error);
                this.getTempFilePath();
                throw new common_1.Exception('Something went wrong uploading the file', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
            }
            this.getTempFilePath();
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
}
exports.UploadedFile = UploadedFile;
//# sourceMappingURL=UploadedFile.js.map