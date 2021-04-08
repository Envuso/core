/******/ (() => { // webpackBootstrap
/******/ 	var __webpack_modules__ = ({

/***/ "./src/App/Exceptions/Exception.ts":
/*!*****************************************!*\
  !*** ./src/App/Exceptions/Exception.ts ***!
  \*****************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _wrapNativeSuper(Class) { var _cache = typeof Map === "function" ? new Map() : undefined; _wrapNativeSuper = function _wrapNativeSuper(Class) { if (Class === null || !_isNativeFunction(Class)) return Class; if (typeof Class !== "function") { throw new TypeError("Super expression must either be null or a function"); } if (typeof _cache !== "undefined") { if (_cache.has(Class)) return _cache.get(Class); _cache.set(Class, Wrapper); } function Wrapper() { return _construct(Class, arguments, _getPrototypeOf(this).constructor); } Wrapper.prototype = Object.create(Class.prototype, { constructor: { value: Wrapper, enumerable: false, writable: true, configurable: true } }); return _setPrototypeOf(Wrapper, Class); }; return _wrapNativeSuper(Class); }

function _construct(Parent, args, Class) { if (_isNativeReflectConstruct()) { _construct = Reflect.construct; } else { _construct = function _construct(Parent, args, Class) { var a = [null]; a.push.apply(a, args); var Constructor = Function.bind.apply(Parent, a); var instance = new Constructor(); if (Class) _setPrototypeOf(instance, Class.prototype); return instance; }; } return _construct.apply(null, arguments); }

function _isNativeReflectConstruct() { if (typeof Reflect === "undefined" || !Reflect.construct) return false; if (Reflect.construct.sham) return false; if (typeof Proxy === "function") return true; try { Boolean.prototype.valueOf.call(Reflect.construct(Boolean, [], function () {})); return true; } catch (e) { return false; } }

function _isNativeFunction(fn) { return Function.toString.call(fn).indexOf("[native code]") !== -1; }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

function _getPrototypeOf(o) { _getPrototypeOf = Object.setPrototypeOf ? Object.getPrototypeOf : function _getPrototypeOf(o) { return o.__proto__ || Object.getPrototypeOf(o); }; return _getPrototypeOf(o); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Exception = void 0;

const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");

let Exception = /*#__PURE__*/function (_Error) {
  _inheritsLoose(Exception, _Error);

  function Exception(message, code = http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR) {
    var _this;

    _this = _Error.call(this, message) || this;
    _this.response = {};
    _this._code = code;
    _this.response = {
      message: _this.message //errors  : {}

    };
    return _this;
  }

  var _proto = Exception.prototype;

  _proto.code = function code() {
    return this._code;
  };

  return Exception;
}( /*#__PURE__*/_wrapNativeSuper(Error));

exports.Exception = Exception;

/***/ }),

/***/ "./src/App/Exceptions/ExceptionHandler.ts":
/*!************************************************!*\
  !*** ./src/App/Exceptions/ExceptionHandler.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ExceptionHandler = void 0;

const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Exception_1 = __webpack_require__(/*! ./Exception */ "./src/App/Exceptions/Exception.ts");

const UnauthorisedException_1 = __webpack_require__(/*! ./UnauthorisedException */ "./src/App/Exceptions/UnauthorisedException.ts");

const ValidationException_1 = __webpack_require__(/*! ./ValidationException */ "./src/App/Exceptions/ValidationException.ts");

let ExceptionHandler = /*#__PURE__*/function () {
  function ExceptionHandler() {}

  ExceptionHandler.transform = function transform(exception, response) {
    if (exception instanceof ValidationException_1.ValidationException) {
      return this.responseFor(exception, response);
    }

    if (exception instanceof UnauthorisedException_1.UnauthorisedException) {
      return this.responseFor(exception, response);
    }

    if (exception instanceof jsonwebtoken_1.JsonWebTokenError) {
      exception = new UnauthorisedException_1.UnauthorisedException(exception.message);
    }

    if (exception instanceof jsonwebtoken_1.TokenExpiredError) {
      exception = new UnauthorisedException_1.UnauthorisedException(exception.message);
    }

    if (exception instanceof Exception_1.Exception) {
      return response.status(exception.code()).send(exception.response);
    }

    _Core_1.Log.error(exception.toString());

    console.trace(exception);
    return response.status(500).send(exception);
  };

  ExceptionHandler.responseFor = function responseFor(exception, response) {
    return response.status(exception.code()).send(exception.response);
  };

  return ExceptionHandler;
}();

exports.ExceptionHandler = ExceptionHandler;

/***/ }),

/***/ "./src/App/Exceptions/UnauthorisedException.ts":
/*!*****************************************************!*\
  !*** ./src/App/Exceptions/UnauthorisedException.ts ***!
  \*****************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.UnauthorisedException = void 0;

const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");

const Exception_1 = __webpack_require__(/*! ./Exception */ "./src/App/Exceptions/Exception.ts");

let UnauthorisedException = /*#__PURE__*/function (_Exception_1$Exceptio) {
  _inheritsLoose(UnauthorisedException, _Exception_1$Exceptio);

  function UnauthorisedException(message) {
    return _Exception_1$Exceptio.call(this, message !== null && message !== void 0 ? message : 'Unauthorised.', http_status_codes_1.StatusCodes.UNAUTHORIZED) || this;
  }

  return UnauthorisedException;
}(Exception_1.Exception);

exports.UnauthorisedException = UnauthorisedException;

/***/ }),

/***/ "./src/App/Exceptions/ValidationException.ts":
/*!***************************************************!*\
  !*** ./src/App/Exceptions/ValidationException.ts ***!
  \***************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ValidationException = void 0;

const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");

const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");

const Exception_1 = __webpack_require__(/*! ./Exception */ "./src/App/Exceptions/Exception.ts");

let ValidationException = /*#__PURE__*/function (_Exception_1$Exceptio) {
  _inheritsLoose(ValidationException, _Exception_1$Exceptio);

  function ValidationException(errors) {
    var _this;

    _this = _Exception_1$Exceptio.call(this, "Woops something went wrong.", http_status_codes_1.StatusCodes.UNPROCESSABLE_ENTITY) || this;
    _this.errors = {}; //		if (validator instanceof Validator) {
    //			this.processErrors(validator.errors.all());
    //			return;
    //		}

    _this.errors = errors;
    _this.response = {
      message: _this.message,
      errors: _this.processErrors()
    };
    return _this;
  }

  ValidationException.message = function message(_message) {
    const exception = new ValidationException([_message]);
    exception.message = _message;
    return exception;
  };

  var _proto = ValidationException.prototype;

  _proto.processErrors = function processErrors() {
    let errors = {};

    if (Array.isArray(this.errors)) {
      if (!this.errors.length) {
        return errors;
      }

      const firstError = this.errors[0] || null;

      if (!firstError) {
        return errors;
      }

      if (firstError instanceof class_validator_1.ValidationError) {
        for (let error of this.errors) {
          errors[error.property] = Object.values(error.constraints)[0] || null;
        }

        return errors;
      }

      return errors;
    }

    errors = Object.assign(Object.assign({}, this.errors), errors);
    return errors; //		Object.keys(this.errors).forEach(errorKey => {
    //			if (this.errors[errorKey] instanceof ValidationError) {
    //				errors[errorKey] =
    //			}
    //
    //			errors[errorKey] = validationErrors[errorKey][0];
    //		});
    //
    //		this.errors = errors;
  };

  return ValidationException;
}(Exception_1.Exception);

exports.ValidationException = ValidationException;

/***/ }),

/***/ "./src/App/Http/Controllers/Auth/AuthController.ts":
/*!*********************************************************!*\
  !*** ./src/App/Http/Controllers/Auth/AuthController.ts ***!
  \*********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __param = this && this.__param || function (paramIndex, decorator) {
  return function (target, key) {
    decorator(target, key, paramIndex);
  };
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AuthController = void 0;

const ValidationException_1 = __webpack_require__(/*! @App/Exceptions/ValidationException */ "./src/App/Exceptions/ValidationException.ts");

const AuthorizationMiddleware_1 = __webpack_require__(/*! @App/Http/Middleware/AuthorizationMiddleware */ "./src/App/Http/Middleware/AuthorizationMiddleware.ts");

const User_1 = __webpack_require__(/*! @App/Models/User */ "./src/App/Models/User.ts");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");

let LoginBody = /*#__PURE__*/function (_Core_1$DataTransferO) {
  _inheritsLoose(LoginBody, _Core_1$DataTransferO);

  function LoginBody() {
    return _Core_1$DataTransferO.apply(this, arguments) || this;
  }

  return LoginBody;
}(_Core_1.DataTransferObject);

__decorate([class_validator_1.IsEmail(), class_validator_1.IsNotEmpty(), __metadata("design:type", String)], LoginBody.prototype, "email", void 0);

__decorate([class_validator_1.Length(8, 255), __metadata("design:type", String)], LoginBody.prototype, "password", void 0);

let RegistrationBody = /*#__PURE__*/function (_LoginBody) {
  _inheritsLoose(RegistrationBody, _LoginBody);

  function RegistrationBody() {
    return _LoginBody.apply(this, arguments) || this;
  }

  return RegistrationBody;
}(LoginBody);

__decorate([class_validator_1.IsNotEmpty(), class_validator_1.Length(3, 25), __metadata("design:type", String)], RegistrationBody.prototype, "displayName", void 0);

__decorate([class_transformer_1.Transform(({
  value
}) => value.toLowerCase()), class_validator_1.IsString(), class_validator_1.IsAlphanumeric(), class_validator_1.Length(3, 20), __metadata("design:type", String)], RegistrationBody.prototype, "name", void 0);

let AuthController = /*#__PURE__*/function (_Core_1$Controller) {
  _inheritsLoose(AuthController, _Core_1$Controller);

  function AuthController() {
    return _Core_1$Controller.apply(this, arguments) || this;
  }

  var _proto = AuthController.prototype;

  _proto.login = function login(loginBody) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield _Core_1.Auth.attempt(loginBody))) {
        throw new ValidationException_1.ValidationException({
          message: 'Invalid credentials'
        });
      }

      return _Core_1.response().json({
        user: _Core_1.Auth.user(),
        token: _Core_1.Auth.user().generateToken()
      });
    });
  };

  _proto.register = function register(registration) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!(yield _Core_1.Auth.canRegisterAs(registration))) {
        throw new ValidationException_1.ValidationException({
          username: 'Username is in use.'
        });
      }

      const user = yield User_1.User.create({
        name: registration.name,
        email: registration.email,
        password: yield _Core_1.Hash.make(registration.password),
        displayName: registration.displayName,
        createdAt: new Date()
      });

      _Core_1.Auth.loginAs(user);

      return {
        user: _Core_1.Auth.user(),
        token: _Core_1.Auth.user().generateToken()
      };
    });
  };

  _proto.authedUser = function authedUser() {
    return __awaiter(this, void 0, void 0, function* () {
      return {
        contextUser: _Core_1.HttpContext.get().user,
        authUser: _Core_1.Auth.user()
      };
    });
  };

  return AuthController;
}(_Core_1.Controller);

__decorate([_Core_1.post('/login'), __param(0, _Core_1.dto()), __metadata("design:type", Function), __metadata("design:paramtypes", [LoginBody]), __metadata("design:returntype", Promise)], AuthController.prototype, "login", null);

__decorate([_Core_1.post('/register'), __param(0, _Core_1.dto()), __metadata("design:type", Function), __metadata("design:paramtypes", [RegistrationBody]), __metadata("design:returntype", Promise)], AuthController.prototype, "register", null);

__decorate([_Core_1.middleware(new AuthorizationMiddleware_1.AuthorizationMiddleware()), _Core_1.get('/user'), __metadata("design:type", Function), __metadata("design:paramtypes", []), __metadata("design:returntype", Promise)], AuthController.prototype, "authedUser", null);

AuthController = __decorate([_Core_1.controller('/auth')], AuthController);
exports.AuthController = AuthController;

/***/ }),

/***/ "./src/App/Http/Middleware/AuthorizationMiddleware.ts":
/*!************************************************************!*\
  !*** ./src/App/Http/Middleware/AuthorizationMiddleware.ts ***!
  \************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AuthorizationMiddleware = void 0;

const UnauthorisedException_1 = __webpack_require__(/*! @App/Exceptions/UnauthorisedException */ "./src/App/Exceptions/UnauthorisedException.ts");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let AuthorizationMiddleware = /*#__PURE__*/function (_Core_1$Middleware) {
  _inheritsLoose(AuthorizationMiddleware, _Core_1$Middleware);

  function AuthorizationMiddleware() {
    return _Core_1$Middleware.apply(this, arguments) || this;
  }

  var _proto = AuthorizationMiddleware.prototype;

  _proto.handler = function handler(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      yield _Core_1.resolve(_Core_1.AuthProvider).authoriseRequest(request, response);

      if (!_Core_1.Auth.check()) {
        throw new UnauthorisedException_1.UnauthorisedException();
      }
    });
  };

  return AuthorizationMiddleware;
}(_Core_1.Middleware);

AuthorizationMiddleware = __decorate([inversify_1.injectable()], AuthorizationMiddleware);
exports.AuthorizationMiddleware = AuthorizationMiddleware;

/***/ }),

/***/ "./src/App/Models/User.ts":
/*!********************************!*\
  !*** ./src/App/Models/User.ts ***!
  \********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.User = void 0;

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let User = /*#__PURE__*/function (_Core_1$ModelEntity) {
  _inheritsLoose(User, _Core_1$ModelEntity);

  function User() {
    return _Core_1$ModelEntity.apply(this, arguments) || this;
  }

  return User;
}(_Core_1.ModelEntity);

__decorate([_Core_1.Id, __metadata("design:type", mongodb_1.ObjectId)], User.prototype, "_id", void 0);

__decorate([class_validator_1.IsEmail(), class_validator_1.IsNotEmpty(), __metadata("design:type", String)], User.prototype, "email", void 0);

__decorate([class_transformer_1.Exclude({
  toPlainOnly: true
}), __metadata("design:type", String)], User.prototype, "password", void 0);

__decorate([class_transformer_1.Type(() => Number), __metadata("design:type", Number)], User.prototype, "something", void 0);

User = __decorate([inversify_1.injectable()], User);
exports.User = User;

/***/ }),

/***/ "./src/Config/app.ts":
/*!***************************!*\
  !*** ./src/Config/app.ts ***!
  \***************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.app = void 0;
exports.app = {
  hostname: process.env.APP_HOST,
  port: process.env.PORT,
  appKey: process.env.APP_KEY
};

/***/ }),

/***/ "./src/Config/auth.ts":
/*!****************************!*\
  !*** ./src/Config/auth.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.auth = void 0;
exports.auth = {
  primaryLoginCredential: 'email',
  jwtSigningOptions: {
    expiresIn: "24h",
    algorithm: "HS256"
  },
  jwtVerifyOptions: {
    ignoreExpiration: false,
    algorithms: ["HS256"]
  }
};

/***/ }),

/***/ "./src/Config/database.ts":
/*!********************************!*\
  !*** ./src/Config/database.ts ***!
  \********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.database = void 0;
exports.database = {
  mongo: {
    connectionUrl: process.env.MONGODB_CONNECTION_URL
  },
  redis: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT)
  }
};

/***/ }),

/***/ "./src/Config/http.ts":
/*!****************************!*\
  !*** ./src/Config/http.ts ***!
  \****************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.http = void 0;
exports.http = {
  /**
   * Before we return a response we serialize the result, mainly
   * so that class transformer can do it's work, but also to help
   * with random errors that occur from circular references.
   *
   * excludeExtraneousValues can induce results that you might not
   * expect but helps prevent internal references used in your code
   * and the framework from being returned in a response.
   *
   * Disable at your own will.
   */
  responseSerialization: {
    enableCircularCheck: true,
    //		excludeExtraneousValues : true,
    excludePrefixes: ['_'],
    strategy: "exposeAll"
  }
};

/***/ }),

/***/ "./src/Config/index.ts":
/*!*****************************!*\
  !*** ./src/Config/index.ts ***!
  \*****************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Config = void 0;

const http_1 = __webpack_require__(/*! ./http */ "./src/Config/http.ts");

const app_1 = __webpack_require__(/*! ./app */ "./src/Config/app.ts");

const auth_1 = __webpack_require__(/*! ./auth */ "./src/Config/auth.ts");

const database_1 = __webpack_require__(/*! ./database */ "./src/Config/database.ts");

const providers_1 = __webpack_require__(/*! ./providers */ "./src/Config/providers.ts");

const storage_1 = __webpack_require__(/*! ./storage */ "./src/Config/storage.ts");

exports.Config = {
  app: app_1.app,
  database: database_1.database,
  providers: providers_1.providers,
  serverProviders: providers_1.serverProviders,
  storage: storage_1.storage,
  auth: auth_1.auth,
  http: http_1.http
};

/***/ }),

/***/ "./src/Config/providers.ts":
/*!*********************************!*\
  !*** ./src/Config/providers.ts ***!
  \*********************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.serverProviders = exports.providers = void 0;

const fastify_multipart_1 = __importDefault(__webpack_require__(/*! fastify-multipart */ "fastify-multipart"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");
/**
 * These are our service providers, they are the
 * core functionality of the framework.
 *
 * You can remove a provider and replace it with your
 * own, or completely disable some functionality.
 */


exports.providers = [_Core_1.EncryptionServiceProvider, _Core_1.LogServiceProvider, _Core_1.CacheServiceProvider, _Core_1.StorageServiceProvider, _Core_1.ModelServiceProvider, _Core_1.AuthServiceProvider, _Core_1.ControllerServiceProvider, _Core_1.ServerServiceProvider];
/**
 * Server providers are Fastify Plugins that you register to the server when it's booted.
 */

exports.serverProviders = [[fastify_multipart_1.default, {}]];

/***/ }),

/***/ "./src/Config/storage.ts":
/*!*******************************!*\
  !*** ./src/Config/storage.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.storage = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

exports.storage = {
  defaultProvider: _Core_1.SpacesProvider,
  spaces: {
    bucket: process.env.SPACES_BUCKET,
    url: process.env.SPACES_URL,
    endpoint: process.env.SPACES_ENDPOINT,
    credentials: {
      accessKeyId: process.env.SPACES_KEY,
      secretAccessKey: process.env.SPACES_SECRET
    }
  }
};

/***/ }),

/***/ "./src/Core/App.ts":
/*!*************************!*\
  !*** ./src/Core/App.ts ***!
  \*************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __asyncValues = this && this.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.App = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Container_1 = __importStar(__webpack_require__(/*! ./Container */ "./src/Core/Container.ts"));

let App = /*#__PURE__*/function () {
  function App() {}

  var _proto = App.prototype;

  _proto.registerProviders = function registerProviders() {
    for (const ProviderModule of _Config_1.Config.providers) {
      Container_1.default.bind(ProviderModule).to(ProviderModule);
    }
  }
  /**
   * Lets get all the aidss
   *
   * @category Aids
   */
  ;

  _proto.registerProviderBindings = function registerProviderBindings() {
    return __awaiter(this, void 0, void 0, function* () {
      for (const ProviderModule of _Config_1.Config.providers) {
        yield Container_1.default.get(ProviderModule).registerBindings();
        if (Container_1.default.isBound(Container_1.LOGGER_IDENTIFIER)) _Core_1.Log.info('Bound and registered ' + ProviderModule.name + ' to the container.');
      }
    });
  }
  /**
   * Load all service providers and initialise the Http Server
   */
  ;

  _proto.boot = function boot() {
    return __awaiter(this, void 0, void 0, function* () {//		Container.bind('ROOT_DIR').toConstantValue(path.resolve(__dirname, '..'));
      //		this._server     = Container.get(Server);
      //		this._httpServer = await this._server.build();
      //
      //		await this._httpServer.listen(3000);
    });
  }
  /**
   * Iterate through all providers in the {@see Config.providers}
   * config file and call boot() on them
   */
  ;

  _proto.bootProviders = function bootProviders() {
    var e_1, _a;

    return __awaiter(this, void 0, void 0, function* () {
      try {
        for (var _b = __asyncValues(_Config_1.Config.providers), _c; _c = yield _b.next(), !_c.done;) {
          const ProviderModule = _c.value;
          yield Container_1.default.get(ProviderModule).boot();
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }
    });
  };

  _proto.up = function up() {
    return __awaiter(this, void 0, void 0, function* () {});
  };

  _proto.down = function down() {
    const server = Container_1.default.get(_Core_1.Server);
    server.cleanUpMetadata();
    Container_1.default.unbindAll();
  };

  return App;
}();

exports.App = App;

/***/ }),

/***/ "./src/Core/Bootstrap.ts":
/*!*******************************!*\
  !*** ./src/Core/Bootstrap.ts ***!
  \*******************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.whenBootstrapped = void 0;

const dotenv_1 = __webpack_require__(/*! dotenv */ "dotenv");

dotenv_1.config();

__webpack_require__(/*! reflect-metadata */ "reflect-metadata");

__webpack_require__(/*! regenerator-runtime */ "regenerator-runtime");

const node_fetch_1 = __importDefault(__webpack_require__(/*! node-fetch */ "node-fetch"));

global.fetch = node_fetch_1.default;

const whenBootstrapped = () => __awaiter(void 0, void 0, void 0, function* () {});

exports.whenBootstrapped = whenBootstrapped;

/***/ }),

/***/ "./src/Core/Container.ts":
/*!*******************************!*\
  !*** ./src/Core/Container.ts ***!
  \*******************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LOGGER_IDENTIFIER = exports.CONTAINER_IDENTIFIER = exports.HTTP_REQUEST_IDENTIFIER = exports.HTTP_CONTEXT_IDENTIFIER = exports.AUTHED_USER_IDENTIFIER = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const Container = new inversify_1.Container();
exports.AUTHED_USER_IDENTIFIER = Symbol('AuthorisedUser');
exports.HTTP_CONTEXT_IDENTIFIER = Symbol('HttpContext');
exports.HTTP_REQUEST_IDENTIFIER = Symbol('HttpRequest');
exports.CONTAINER_IDENTIFIER = Symbol('Container');
exports.LOGGER_IDENTIFIER = Symbol('Logger');
exports.default = Container;

/***/ }),

/***/ "./src/Core/DecoratorData.ts":
/*!***********************************!*\
  !*** ./src/Core/DecoratorData.ts ***!
  \***********************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CONTROLLER_METHOD_PARAMS = exports.METADATA = exports.DESIGN_META = void 0;
var DESIGN_META;

(function (DESIGN_META) {
  DESIGN_META["DESIGN_PARAM_TYPES"] = "design:paramtypes";
  DESIGN_META["DESIGN_TYPE"] = "design:type";
  DESIGN_META["DESIGN_PROPERTIES"] = "design:properties";
  DESIGN_META["DESIGN_RETURN_TYPE"] = "design:returntype";
})(DESIGN_META = exports.DESIGN_META || (exports.DESIGN_META = {}));
/**
 * All of our reflect metadata accessor names
 */


var METADATA;

(function (METADATA) {
  METADATA["CONTROLLER"] = "controller";
  METADATA["CONTROLLER_METHODS"] = "controller-methods";
  METADATA["HTTP_CONTEXT"] = "http-context";
  METADATA["MIDDLEWARE"] = "middleware";
  METADATA["REQUEST_METHOD_DTO"] = "request-method-dto";
  METADATA["REQUEST_METHOD_FASTIFY_REQUEST"] = "request-method-fastify-request";
  METADATA["REQUEST_METHOD_ROUTE_PARAMETER"] = "request-method-route-parameter";
  METADATA["REQUEST_METHOD_QUERY_PARAMETER"] = "request-method-query-parameter";
  METADATA["REQUEST_METHOD_BODY"] = "request-method-body";
  METADATA["REQUEST_METHOD_HEADERS"] = "request-method-headers";
  METADATA["MODEL"] = "MODEL";
})(METADATA = exports.METADATA || (exports.METADATA = {}));
/**
 * We set all of our controller request param meta keys here
 * Otherwise it will bork because it will try to use other things
 */


exports.CONTROLLER_METHOD_PARAMS = [METADATA.REQUEST_METHOD_DTO, METADATA.REQUEST_METHOD_FASTIFY_REQUEST, METADATA.REQUEST_METHOD_ROUTE_PARAMETER, METADATA.REQUEST_METHOD_QUERY_PARAMETER, METADATA.REQUEST_METHOD_BODY, METADATA.REQUEST_METHOD_HEADERS];

/***/ }),

/***/ "./src/Core/Decorators/Controller.ts":
/*!*******************************************!*\
  !*** ./src/Core/Decorators/Controller.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.controller = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const DecoratorData_1 = __webpack_require__(/*! ../DecoratorData */ "./src/Core/DecoratorData.ts"); //export const currentUser      = lazyInject(AUTHED_USER_IDENTIFIER);
//export const currentRequest   = lazyInject(HTTP_REQUEST_IDENTIFIER);
//export const requestContainer = inject(CONTAINER_IDENTIFIER);


function controller(path = '') {
  return function (target) {
    const currentMetadata = {
      path: path,
      target: target
    };
    inversify_1.decorate(inversify_1.injectable(), target);
    Reflect.defineMetadata(DecoratorData_1.METADATA.CONTROLLER, currentMetadata, target); // We need to create an array that contains the metadata of all
    // the controllers in the application, the metadata cannot be
    // attached to a controller. It needs to be attached to a global
    // We attach metadata to the Reflect object itself to avoid
    // declaring additional globals. Also, the Reflect is available
    // in both node and web browsers.

    const previousMetadata = Reflect.getMetadata(DecoratorData_1.METADATA.CONTROLLER, Reflect) || [];
    const newMetadata = [currentMetadata, ...previousMetadata];
    Reflect.defineMetadata(DecoratorData_1.METADATA.CONTROLLER, newMetadata, Reflect);
  };
}

exports.controller = controller;

/***/ }),

/***/ "./src/Core/Decorators/DecoratorHelpers.ts":
/*!*************************************************!*\
  !*** ./src/Core/Decorators/DecoratorHelpers.ts ***!
  \*************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.DecoratorHelpers = void 0;

const DecoratorData_1 = __webpack_require__(/*! ../DecoratorData */ "./src/Core/DecoratorData.ts");

let DecoratorHelpers = /*#__PURE__*/function () {
  function DecoratorHelpers() {}

  /**
   * Get information about the types/parameters for the method/constructor
   *
   * @param target
   * @param propertyKey
   */
  DecoratorHelpers.paramTypes = function paramTypes(target, propertyKey) {
    return Reflect.getMetadata(DecoratorData_1.DESIGN_META.DESIGN_PARAM_TYPES, target, propertyKey);
  }
  /**
   * Get the type of a property
   *
   * @param target
   * @param propertyKey
   */
  ;

  DecoratorHelpers.propertyType = function propertyType(target, propertyKey) {
    return Reflect.getMetadata(DecoratorData_1.DESIGN_META.DESIGN_TYPE, target, propertyKey);
  }
  /**
   * Get the properties of a target
   *
   * If the target is a class constructor and method is the name of a method
   * It will return the properties for the method?
   *
   * @param target
   * @param method
   */
  ;

  DecoratorHelpers.properties = function properties(target, method) {
    return Reflect.getMetadata(DecoratorData_1.DESIGN_META.DESIGN_PROPERTIES, target, method);
  }
  /**
   * Get the return type
   *
   * @param target
   */
  ;

  DecoratorHelpers.returnType = function returnType(target) {
    return Reflect.getMetadata(DecoratorData_1.DESIGN_META.DESIGN_RETURN_TYPE, target);
  }
  /**
   * Get the names of all parameters specified in a function
   * It seems we cannot use Reflect to obtain these, only the types
   *
   * @param func
   */
  ;

  DecoratorHelpers.getParameterNames = function getParameterNames(func) {
    // String representation of the function code
    let str = func.toString(); // Remove comments of the form /* ... */
    // Removing comments of the form //
    // Remove body of the function { ... }
    // removing '=>' if func is arrow function

    str = str.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/(.)*/g, '').replace(/{[\s\S]*}/, '').replace(/=>/g, '').trim(); // Start parameter names after first '('

    const start = str.indexOf("(") + 1; // End parameter names is just before last ')'

    const end = str.length - 1;
    const result = str.substring(start, end).split(", ");
    const params = [];
    result.forEach(element => {
      // Removing any default value
      element = element.replace(/=[\s\S]*/g, '').trim();
      if (element.length > 0) params.push(element);
    });
    return params;
  };

  return DecoratorHelpers;
}();

exports.DecoratorHelpers = DecoratorHelpers;

/***/ }),

/***/ "./src/Core/Decorators/Middleware.ts":
/*!*******************************************!*\
  !*** ./src/Core/Decorators/Middleware.ts ***!
  \*******************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.middleware = void 0;

const Middleware_1 = __webpack_require__(/*! ../Providers/Http/Controller/Middleware */ "./src/Core/Providers/Http/Controller/Middleware.ts");

function middleware(middleware) {
  return function (target, propertyKey, descriptor) {
    const middlewares = [];
    const meta = Middleware_1.Middleware.getMetadata(target);

    if (meta === null || meta === void 0 ? void 0 : meta.middlewares) {
      middlewares.push(...meta.middlewares);
    }

    middlewares.push(middleware);
    let bindTarget = descriptor === null || descriptor === void 0 ? void 0 : descriptor.value;

    if (!bindTarget) {
      bindTarget = target;
    }

    Middleware_1.Middleware.setMetadata(bindTarget, middlewares);
  };
}

exports.middleware = middleware;

/***/ }),

/***/ "./src/Core/Decorators/ModelDecorators.ts":
/*!************************************************!*\
  !*** ./src/Core/Decorators/ModelDecorators.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Id = exports.Ids = exports.ref = exports.indexes = exports.index = exports.ignore = exports.nested = void 0;

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");

const pluralize_1 = __importDefault(__webpack_require__(/*! pluralize */ "pluralize"));

function addRef(name, ref, target) {
  const refs = Reflect.getMetadata('mongo:refs', target) || {};
  refs[name] = ref;
  Reflect.defineMetadata('mongo:refs', refs, target);
}

function pushToMetadata(metadataKey, values, target) {
  const data = Reflect.getMetadata(metadataKey, target) || [];
  Reflect.defineMetadata(metadataKey, data.concat(values), target);
}

function isNotPrimitive(targetType, propertyKey) {
  if (targetType === mongodb_1.ObjectId || targetType === String || targetType === Number || targetType === Boolean) {
    throw new Error(`property '${propertyKey}' cannot have nested type '${targetType}'`);
  }
}

function nested(typeFunction) {
  return function (target, propertyKey) {
    const targetType = Reflect.getMetadata('design:type', target, propertyKey);
    isNotPrimitive(targetType, propertyKey); //		Type(() => typeFunction)(target, propertyKey);

    class_transformer_1.Transform(val => {
      if (!val.value) {
        return null;
      }

      if (targetType === Array) {
        return val.value.map(v => class_transformer_1.plainToClass(typeFunction, v));
      }

      return class_transformer_1.plainToClass(typeFunction, val.value);
    }, {
      toClassOnly: true
    })(target, propertyKey);
    class_transformer_1.Transform(val => {
      if (!val.value) {
        return null;
      }

      if (targetType === Array) {
        return val.value.map(v => class_transformer_1.classToPlain(v));
      }

      return class_transformer_1.classToPlain(val.value);
    }, {
      toPlainOnly: true
    })(target, propertyKey);
    pushToMetadata('mongo:nested', [{
      name: propertyKey,
      typeFunction,
      array: targetType === Array
    }], target);
  };
}

exports.nested = nested;

function ignore(target, propertyKey) {
  const ignores = Reflect.getMetadata('mongo:ignore', target) || {};
  ignores[propertyKey] = true;
  Reflect.defineMetadata('mongo:ignore', ignores, target);
}

exports.ignore = ignore;

function index(type = 1, options = {}) {
  return function (target, propertyKey) {
    if (!propertyKey) {
      throw new Error('@index decorator can only be applied to class properties');
    }

    const indexOptions = Object.assign(Object.assign({
      name: propertyKey
    }, options), {
      key: {
        [propertyKey]: type
      }
    });
    pushToMetadata('mongo:indexes', [indexOptions], target);
  };
}

exports.index = index;

function indexes(options) {
  return function (target) {
    pushToMetadata('mongo:indexes', options, target.prototype);
  };
}

exports.indexes = indexes;

function ref(modelReference) {
  return function (target, propertyKey) {
    const targetType = Reflect.getMetadata('design:type', target, propertyKey);
    isNotPrimitive(targetType, propertyKey);
    const isArray = targetType === Array;
    const refId = pluralize_1.default(pluralize_1.default(propertyKey, 1) + (isArray ? 'Ids' : 'Id'), isArray ? 2 : 1);
    Reflect.defineMetadata('design:type', isArray ? Array : mongodb_1.ObjectId, target, refId);
    const refInfo = {
      _id: refId,
      array: isArray,
      modelName: modelReference.name
    };
    addRef(propertyKey, refInfo, target);
    class_transformer_1.Transform(val => {
      if (!val.value) {
        return null;
      }

      if (targetType === Array) {
        return val.value.map(v => class_transformer_1.plainToClass(modelReference, v));
      }

      return class_transformer_1.plainToClass(modelReference, val.value);
    }, {
      toClassOnly: true
    })(target, propertyKey);
    class_transformer_1.Transform(val => {
      if (!val.value) {
        return null;
      }

      if (targetType === Array) {
        return val.value.map(v => class_transformer_1.classToPlain(v));
      }

      return class_transformer_1.classToPlain(val.value);
    }, {
      toPlainOnly: true
    })(target, propertyKey);
  };
}

exports.ref = ref;

function Ids(target, propertyKey) {
  isNotPrimitive(target, propertyKey);
  class_transformer_1.Transform(val => {
    if (!val.value) {
      return null;
    }

    return val.value.map(v => new mongodb_1.ObjectId(v));
  }, {
    toClassOnly: true
  })(target, propertyKey);
  class_transformer_1.Transform(val => {
    if (!val.value) {
      return null;
    }

    return val.value.map(v => v.toString());
  }, {
    toPlainOnly: true
  })(target, propertyKey);
}

exports.Ids = Ids;

function Id(target, propertyKey) {
  class_transformer_1.Transform(({
    value
  }) => new mongodb_1.ObjectId(value), {
    toClassOnly: true
  })(target, propertyKey);
  class_transformer_1.Transform(({
    value
  }) => value.toString(), {
    toPlainOnly: true
  })(target, propertyKey);
}

exports.Id = Id;
5;

/***/ }),

/***/ "./src/Core/Decorators/Route.ts":
/*!**************************************!*\
  !*** ./src/Core/Decorators/Route.ts ***!
  \**************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.httpMethod = exports.delete_ = exports.remove = exports.destroy = exports.head = exports.patch = exports.put = exports.post = exports.get = exports.all = void 0;

const DecoratorData_1 = __webpack_require__(/*! ../DecoratorData */ "./src/Core/DecoratorData.ts");

const DecoratorHelpers_1 = __webpack_require__(/*! ./DecoratorHelpers */ "./src/Core/Decorators/DecoratorHelpers.ts");

function all(path) {
  return httpMethod("all", path);
}

exports.all = all;

function get(path) {
  return httpMethod("get", path);
}

exports.get = get;

function post(path) {
  return httpMethod("post", path);
}

exports.post = post;

function put(path) {
  return httpMethod("put", path);
}

exports.put = put;

function patch(path) {
  return httpMethod("patch", path);
}

exports.patch = patch;

function head(path) {
  return httpMethod("head", path);
}

exports.head = head;
/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */

function destroy(path) {
  return httpMethod("delete", path);
}

exports.destroy = destroy;
/**
 * DELETE http method
 * You can also use @delete_
 * We can't use the name delete in JS/TS.
 * @param path
 */

function remove(path) {
  return httpMethod("delete", path);
}

exports.remove = remove;
/**
 * DELETE http method
 * If you don't like to use "destroy"/"remove"
 * @param path
 */

function delete_(path) {
  return httpMethod("delete", path);
}

exports.delete_ = delete_;

function httpMethod(method, path) {
  return function (target, key, value) {
    const controllerMethod = target[key];
    const parameterNames = DecoratorHelpers_1.DecoratorHelpers.getParameterNames(controllerMethod);
    const parameterTypes = DecoratorHelpers_1.DecoratorHelpers.paramTypes(target, key);
    const parameters = parameterNames.map((name, index) => {
      var _a;

      return {
        name: name,
        type: (_a = parameterTypes[index]) !== null && _a !== void 0 ? _a : null
      };
    });
    const metadata = {
      key,
      method,
      path,
      target,
      parameters
    };
    const metadataList = Reflect.getMetadata(DecoratorData_1.METADATA.CONTROLLER_METHODS, target.constructor) || [];

    if (!Reflect.hasMetadata(DecoratorData_1.METADATA.CONTROLLER_METHODS, target.constructor)) {
      Reflect.defineMetadata(DecoratorData_1.METADATA.CONTROLLER_METHODS, metadataList, target.constructor);
    }

    metadataList.push(metadata);
    Reflect.defineMetadata(DecoratorData_1.METADATA.CONTROLLER_METHODS, metadataList, target.constructor);
  };
}

exports.httpMethod = httpMethod;

/***/ }),

/***/ "./src/Core/Decorators/RouteMethod.ts":
/*!********************************************!*\
  !*** ./src/Core/Decorators/RouteMethod.ts ***!
  \********************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.headers = exports.body = exports.query = exports.param = exports.dto = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

function dto(validateOnRequest) {
  return function (target, propertyKey, parameterIndex) {
    _Core_1.DataTransferObjectParam.handleParameter({
      target,
      propertyKey,
      parameterIndex
    }, validateOnRequest);
  };
}

exports.dto = dto; //export const request = function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
//	RequestParam.handleParameter({target, propertyKey, parameterIndex});
//}

const param = function (target, propertyKey, parameterIndex) {
  _Core_1.RouteParameterParam.handleParameter({
    target,
    propertyKey,
    parameterIndex
  });
};

exports.param = param;

const query = function (target, propertyKey, parameterIndex) {
  _Core_1.RouteQueryParam.handleParameter({
    target,
    propertyKey,
    parameterIndex
  });
};

exports.query = query;

const body = function (target, propertyKey, parameterIndex) {
  _Core_1.RequestBodyParam.handleParameter({
    target,
    propertyKey,
    parameterIndex
  });
};

exports.body = body;

const headers = function (target, propertyKey, parameterIndex) {
  _Core_1.RequestHeadersParam.handleParameter({
    target,
    propertyKey,
    parameterIndex
  });
};

exports.headers = headers;

/***/ }),

/***/ "./src/Core/Decorators/index.ts":
/*!**************************************!*\
  !*** ./src/Core/Decorators/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Controller */ "./src/Core/Decorators/Controller.ts"), exports);

__exportStar(__webpack_require__(/*! ./DecoratorHelpers */ "./src/Core/Decorators/DecoratorHelpers.ts"), exports);

__exportStar(__webpack_require__(/*! ./Middleware */ "./src/Core/Decorators/Middleware.ts"), exports);

__exportStar(__webpack_require__(/*! ./ModelDecorators */ "./src/Core/Decorators/ModelDecorators.ts"), exports);

__exportStar(__webpack_require__(/*! ./Route */ "./src/Core/Decorators/Route.ts"), exports);

__exportStar(__webpack_require__(/*! ./RouteMethod */ "./src/Core/Decorators/RouteMethod.ts"), exports);

/***/ }),

/***/ "./src/Core/Exceptions/Models/InvalidRefSpecified.ts":
/*!***********************************************************!*\
  !*** ./src/Core/Exceptions/Models/InvalidRefSpecified.ts ***!
  \***********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.InvalidRefSpecified = void 0;

const Exception_1 = __webpack_require__(/*! @App/Exceptions/Exception */ "./src/App/Exceptions/Exception.ts");

let InvalidRefSpecified = /*#__PURE__*/function (_Exception_1$Exceptio) {
  _inheritsLoose(InvalidRefSpecified, _Exception_1$Exceptio);

  function InvalidRefSpecified(entityName, ref) {
    return _Exception_1$Exceptio.call(this, 'Ref ' + ref + ' is not defined on model(entity) ' + entityName) || this;
  }

  return InvalidRefSpecified;
}(Exception_1.Exception);

exports.InvalidRefSpecified = InvalidRefSpecified;

/***/ }),

/***/ "./src/Core/Exceptions/index.ts":
/*!**************************************!*\
  !*** ./src/Core/Exceptions/index.ts ***!
  \**************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Models/InvalidRefSpecified */ "./src/Core/Exceptions/Models/InvalidRefSpecified.ts"), exports);

/***/ }),

/***/ "./src/Core/Helpers.ts":
/*!*****************************!*\
  !*** ./src/Core/Helpers.ts ***!
  \*****************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.response = exports.request = exports.app = exports.resolve = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Container_1 = __importDefault(__webpack_require__(/*! ./Container */ "./src/Core/Container.ts")); // Helper methods to resolve from the container a little easier/cleaner


const resolve = identifier => Container_1.default.get(identifier);

exports.resolve = resolve;
exports.app = exports.resolve;

const request = () => _Core_1.HttpContext.request();

exports.request = request;

const response = () => _Core_1.HttpContext.response();

exports.response = response; //export const config = (key: string) => {
//	const baseConf = _.get(Config, key);
//
//	if (!baseConf) {
//		return _.get(Config, key);
//	}
//}

/***/ }),

/***/ "./src/Core/Providers/Auth/Auth.ts":
/*!*****************************************!*\
  !*** ./src/Core/Providers/Auth/Auth.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Auth = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const HttpContext_1 = __webpack_require__(/*! ../Http/Context/HttpContext */ "./src/Core/Providers/Http/Context/HttpContext.ts");

const AuthProvider_1 = __webpack_require__(/*! ./AuthProvider */ "./src/Core/Providers/Auth/AuthProvider.ts");

let Auth = /*#__PURE__*/function () {
  function Auth() {}
  /**
   * Attempt to login with the credentials
   *
   * @param credentials
   */


  Auth.attempt = function attempt(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
      const authProvider = _Core_1.resolve(AuthProvider_1.AuthProvider);

      const user = yield authProvider.verifyCredentials(credentials);

      if (!user) {
        return false;
      }

      this.loginAs(user);
      return true;
    });
  }
  /**
   * Force login to x user
   *
   * @param user
   */
  ;

  Auth.loginAs = function loginAs(user) {
    _Core_1.resolve(AuthProvider_1.AuthProvider).authoriseAs(user);
  }
  /**
   * Check the credentials to see if the user can register with them
   * Basically, if x email/username is in use.
   * @param credentials
   */
  ;

  Auth.canRegisterAs = function canRegisterAs(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield _Core_1.resolve(AuthProvider_1.AuthProvider).userFromCredentials(credentials);
      return user === null;
    });
  }
  /**
   * Check if there is an authed user
   */
  ;

  Auth.check = function check() {
    return !!this.user();
  }
  /**
   * Get the currently authed user(if any) from the current Http Context
   */
  ;

  Auth.user = function user() {
    return HttpContext_1.HttpContext.get().user; //		return RequestStore.get().context().container.get<AuthorisedUser>(TYPE.User);
  };

  return Auth;
}();

Auth = __decorate([inversify_1.injectable(), __metadata("design:paramtypes", [])], Auth);
exports.Auth = Auth;

/***/ }),

/***/ "./src/Core/Providers/Auth/AuthProvider.ts":
/*!*************************************************!*\
  !*** ./src/Core/Providers/Auth/AuthProvider.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AuthProvider = void 0;

const User_1 = __webpack_require__(/*! @App/Models/User */ "./src/App/Models/User.ts");

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Hash_1 = __webpack_require__(/*! ../Crypt/Hash */ "./src/Core/Providers/Crypt/Hash.ts");

const Auth_1 = __webpack_require__(/*! ./Auth */ "./src/Core/Providers/Auth/Auth.ts");

let AuthProvider = /*#__PURE__*/function () {
  function AuthProvider() {}

  var _proto = AuthProvider.prototype;

  //	@inject(JwtAuthProvider)
  //	private jwtAuthProvider: JwtAuthProvider;

  /**
   * Attempt to authorise this request using JWT, there
   * is no JWT or it's invalid, this will return null
   *
   * @param request
   * @param reply
   */
  _proto.authoriseRequest = function authoriseRequest(request, reply) {
    return __awaiter(this, void 0, void 0, function* () {
      const token = _Core_1.resolve(_Core_1.JwtAuthProvider).getTokenFromHeader(request);

      if (!token) {
        return null;
      }

      const verifiedToken = _Core_1.resolve(_Core_1.JwtAuthProvider).verifyToken(request);

      if (!verifiedToken) {
        return null;
      }

      const userId = (verifiedToken === null || verifiedToken === void 0 ? void 0 : verifiedToken.id) || null;

      if (!userId) {
        return null;
      }

      const user = yield User_1.User.find(userId);
      this.authoriseAs(user);
      return Auth_1.Auth.user();
    });
  }
  /**
   * Gets the user from the credentials.
   * Primarily uses the {@see Config.auth.primaryLoginCredential} to check if
   * a user has registered with this already, if they have, it will return the user.
   *
   * @param credentials
   */
  ;

  _proto.userFromCredentials = function userFromCredentials(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
      const primaryCredentialName = _Config_1.Config.auth.primaryLoginCredential;
      const primaryCredential = credentials[primaryCredentialName];
      const userCall = {};
      userCall[primaryCredentialName] = primaryCredential.toLowerCase();
      const user = yield User_1.User.where(userCall).first();

      if (!user) {
        return null;
      }

      return user;
    });
  }
  /**
   * If we can get the user from {@see userFromCredentials} then we will compare
   * that users hashed password with the provided password
   *
   * @param credentials
   */
  ;

  _proto.verifyCredentials = function verifyCredentials(credentials) {
    return __awaiter(this, void 0, void 0, function* () {
      const user = yield this.userFromCredentials(credentials);

      if (!user) {
        return null;
      }

      if (!Hash_1.Hash.check(credentials.password, user.password)) {
        return null;
      }

      return user;
    });
  }
  /**
   * Authorise as x user. This will force auth the
   * provided user for this request basically.
   *
   * @param user
   */
  ;

  _proto.authoriseAs = function authoriseAs(user) {
    _Core_1.HttpContext.get().setUser(user); //		RequestStore.get().context()
    //			.container
    //			.bind<AuthorisedUser>(TYPE.User)
    //			.toConstantValue(new AuthorisedUser(user));

  };

  _proto.jwtProvider = function jwtProvider() {
    return _Core_1.resolve(_Core_1.JwtAuthProvider);
  };

  return AuthProvider;
}();

AuthProvider = __decorate([inversify_1.injectable()], AuthProvider);
exports.AuthProvider = AuthProvider;

/***/ }),

/***/ "./src/Core/Providers/Auth/AuthServiceProvider.ts":
/*!********************************************************!*\
  !*** ./src/Core/Providers/Auth/AuthServiceProvider.ts ***!
  \********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AuthServiceProvider = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const Container_1 = __importDefault(__webpack_require__(/*! ../../Container */ "./src/Core/Container.ts"));

const ServiceProvider_1 = __webpack_require__(/*! ../ServiceProvider */ "./src/Core/Providers/ServiceProvider.ts");

const AuthProvider_1 = __webpack_require__(/*! ./AuthProvider */ "./src/Core/Providers/Auth/AuthProvider.ts");

const JwtAuthProvider_1 = __webpack_require__(/*! ./JwtAuthProvider */ "./src/Core/Providers/Auth/JwtAuthProvider.ts");

let AuthServiceProvider = /*#__PURE__*/function (_ServiceProvider_1$Se) {
  _inheritsLoose(AuthServiceProvider, _ServiceProvider_1$Se);

  function AuthServiceProvider() {
    return _ServiceProvider_1$Se.call(this) || this;
  }

  var _proto = AuthServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    Container_1.default.bind(JwtAuthProvider_1.JwtAuthProvider).to(JwtAuthProvider_1.JwtAuthProvider);
    Container_1.default.bind(AuthProvider_1.AuthProvider).to(AuthProvider_1.AuthProvider);
  };

  _proto.boot = function boot() {};

  return AuthServiceProvider;
}(ServiceProvider_1.ServiceProvider);

AuthServiceProvider = __decorate([inversify_1.injectable(), __metadata("design:paramtypes", [])], AuthServiceProvider);
exports.AuthServiceProvider = AuthServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Auth/AuthorisedUser.ts":
/*!***************************************************!*\
  !*** ./src/Core/Providers/Auth/AuthorisedUser.ts ***!
  \***************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _assertThisInitialized(self) { if (self === void 0) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return self; }

function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.AuthorisedUser = void 0;

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const User_1 = __webpack_require__(/*! @App/Models/User */ "./src/App/Models/User.ts");

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const Helpers_1 = __webpack_require__(/*! ../../Helpers */ "./src/Core/Helpers.ts");

const AuthProvider_1 = __webpack_require__(/*! ./AuthProvider */ "./src/Core/Providers/Auth/AuthProvider.ts");

let AuthorisedUser = /*#__PURE__*/function (_User_1$User) {
  _inheritsLoose(AuthorisedUser, _User_1$User);

  function AuthorisedUser(user) {
    var _this;

    _this = _User_1$User.call(this) || this;
    Object.assign(_assertThisInitialized(_this), user);
    return _this;
  }

  var _proto = AuthorisedUser.prototype;

  _proto.generateToken = function generateToken() {
    return Helpers_1.resolve(AuthProvider_1.AuthProvider).jwtProvider().generateToken(this._id);
  }
  /**
   * When this model instance is returned in a
   * response, we'll make sure to use classToPlain so
   * that any @Exclude() properties etc are taken care of.
   */
  ;

  _proto.toJSON = function toJSON() {
    return class_transformer_1.classToPlain(this, _Config_1.Config.http.responseSerialization);
  };

  return AuthorisedUser;
}(User_1.User);

AuthorisedUser = __decorate([inversify_1.injectable(), __metadata("design:paramtypes", [User_1.User])], AuthorisedUser);
exports.AuthorisedUser = AuthorisedUser;

/***/ }),

/***/ "./src/Core/Providers/Auth/JwtAuthProvider.ts":
/*!****************************************************!*\
  !*** ./src/Core/Providers/Auth/JwtAuthProvider.ts ***!
  \****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.JwtAuthProvider = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const jsonwebtoken_1 = __webpack_require__(/*! jsonwebtoken */ "jsonwebtoken");

let JwtAuthProvider = /*#__PURE__*/function () {
  function JwtAuthProvider() {}

  var _proto = JwtAuthProvider.prototype;

  _proto.getTokenFromHeader = function getTokenFromHeader(req) {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return null;
    }

    const tokenParts = authHeader.split(" ");

    if (tokenParts.length !== 2) {
      return null;
    }

    const type = tokenParts[0];
    const token = tokenParts[1];

    if (!token || !type) {
      return null;
    }

    if (type && token && type === "Bearer") {
      return token;
    }

    return null;
  };

  _proto.generateToken = function generateToken(userId) {
    return jsonwebtoken_1.sign({
      id: userId
    }, _Config_1.Config.app.appKey, _Config_1.Config.auth.jwtSigningOptions);
  };

  _proto.verifyToken = function verifyToken(request, token) {
    if (!token) {
      token = this.getTokenFromHeader(request);
    }

    if (!token) {
      return null;
    }

    return jsonwebtoken_1.verify(token, _Config_1.Config.app.appKey, _Config_1.Config.auth.jwtVerifyOptions);
  };

  return JwtAuthProvider;
}();

JwtAuthProvider = __decorate([inversify_1.injectable()], JwtAuthProvider);
exports.JwtAuthProvider = JwtAuthProvider;

/***/ }),

/***/ "./src/Core/Providers/Auth/index.ts":
/*!******************************************!*\
  !*** ./src/Core/Providers/Auth/index.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Auth */ "./src/Core/Providers/Auth/Auth.ts"), exports);

__exportStar(__webpack_require__(/*! ./AuthProvider */ "./src/Core/Providers/Auth/AuthProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./AuthServiceProvider */ "./src/Core/Providers/Auth/AuthServiceProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./AuthorisedUser */ "./src/Core/Providers/Auth/AuthorisedUser.ts"), exports);

__exportStar(__webpack_require__(/*! ./JwtAuthProvider */ "./src/Core/Providers/Auth/JwtAuthProvider.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Cache/Cache.ts":
/*!*******************************************!*\
  !*** ./src/Core/Providers/Cache/Cache.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Cache = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const node_cache_redis_1 = __webpack_require__(/*! node-cache-redis */ "node-cache-redis");

let Cache = /*#__PURE__*/function () {
  function Cache() {}

  var _proto = Cache.prototype;

  _proto.get = function get(key, defaultValue = null) {
    return __awaiter(this, void 0, void 0, function* () {
      const value = yield node_cache_redis_1.get(key);
      return value !== null && value !== void 0 ? value : defaultValue;
    });
  };

  _proto.put = function put(key, value, ttl) {
    return __awaiter(this, void 0, void 0, function* () {
      yield node_cache_redis_1.set(key, value, ttl);
    });
  };

  _proto.remove = function remove(key) {
    return __awaiter(this, void 0, void 0, function* () {
      yield node_cache_redis_1.del([key]);
    });
  };

  _proto.has = function has(key) {
    return __awaiter(this, void 0, void 0, function* () {
      return !!(yield this.get(key, undefined));
    });
  };

  return Cache;
}();

Cache = __decorate([inversify_1.injectable()], Cache);
exports.Cache = Cache;

/***/ }),

/***/ "./src/Core/Providers/Cache/CacheServiceProvider.ts":
/*!**********************************************************!*\
  !*** ./src/Core/Providers/Cache/CacheServiceProvider.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.CacheServiceProvider = void 0;

const ServiceProvider_1 = __webpack_require__(/*! ../ServiceProvider */ "./src/Core/Providers/ServiceProvider.ts");

const node_cache_redis_1 = __webpack_require__(/*! node-cache-redis */ "node-cache-redis");

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const Container_1 = __importDefault(__webpack_require__(/*! ../../Container */ "./src/Core/Container.ts"));

const Cache_1 = __webpack_require__(/*! ./Cache */ "./src/Core/Providers/Cache/Cache.ts");

let CacheServiceProvider = /*#__PURE__*/function (_ServiceProvider_1$Se) {
  _inheritsLoose(CacheServiceProvider, _ServiceProvider_1$Se);

  function CacheServiceProvider() {
    return _ServiceProvider_1$Se.apply(this, arguments) || this;
  }

  var _proto = CacheServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    node_cache_redis_1.init({
      name: "cache:",
      redisOptions: {
        host: _Config_1.Config.database.redis.host,
        port: _Config_1.Config.database.redis.port
      }
    });
    Container_1.default.bind(Cache_1.Cache).to(Cache_1.Cache);
  };

  _proto.boot = function boot() {};

  return CacheServiceProvider;
}(ServiceProvider_1.ServiceProvider);

CacheServiceProvider = __decorate([inversify_1.injectable()], CacheServiceProvider);
exports.CacheServiceProvider = CacheServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Cache/index.ts":
/*!*******************************************!*\
  !*** ./src/Core/Providers/Cache/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Cache */ "./src/Core/Providers/Cache/Cache.ts"), exports);

__exportStar(__webpack_require__(/*! ./CacheServiceProvider */ "./src/Core/Providers/Cache/CacheServiceProvider.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Crypt/Encryption.ts":
/*!************************************************!*\
  !*** ./src/Core/Providers/Crypt/Encryption.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Encryption = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const simple_crypto_js_1 = __importDefault(__webpack_require__(/*! simple-crypto-js */ "simple-crypto-js"));

let Encryption = /*#__PURE__*/function () {
  function Encryption() {}

  Encryption.encrypt = function encrypt(content) {
    return _Core_1.resolve(simple_crypto_js_1.default).encrypt(content);
  };

  Encryption.decrypt = function decrypt(content) {
    return _Core_1.resolve(simple_crypto_js_1.default).decrypt(content);
  };

  Encryption.random = function random(length) {
    return simple_crypto_js_1.default.generateRandomString(length);
  };

  return Encryption;
}();

exports.Encryption = Encryption;

/***/ }),

/***/ "./src/Core/Providers/Crypt/EncryptionServiceProvider.ts":
/*!***************************************************************!*\
  !*** ./src/Core/Providers/Crypt/EncryptionServiceProvider.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.EncryptionServiceProvider = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const simple_crypto_js_1 = __importDefault(__webpack_require__(/*! simple-crypto-js */ "simple-crypto-js"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let EncryptionServiceProvider = /*#__PURE__*/function (_Core_1$ServiceProvid) {
  _inheritsLoose(EncryptionServiceProvider, _Core_1$ServiceProvid);

  function EncryptionServiceProvider() {
    return _Core_1$ServiceProvid.apply(this, arguments) || this;
  }

  var _proto = EncryptionServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    const crypt = new simple_crypto_js_1.default(_Config_1.Config.app.appKey);

    _Core_1.Container.bind(simple_crypto_js_1.default).toConstantValue(crypt);
  };

  _proto.boot = function boot() {};

  return EncryptionServiceProvider;
}(_Core_1.ServiceProvider);

EncryptionServiceProvider = __decorate([inversify_1.injectable()], EncryptionServiceProvider);
exports.EncryptionServiceProvider = EncryptionServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Crypt/Hash.ts":
/*!******************************************!*\
  !*** ./src/Core/Providers/Crypt/Hash.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Hash = void 0;

const bcrypt_1 = __importDefault(__webpack_require__(/*! bcrypt */ "bcrypt"));

let Hash = /*#__PURE__*/function () {
  function Hash() {}

  Hash.make = function make(content, rounds = 10) {
    return bcrypt_1.default.hash(content, 10);
  };

  Hash.check = function check(content, hashedContent) {
    return bcrypt_1.default.compareSync(content, hashedContent);
  };

  return Hash;
}();

exports.Hash = Hash;

/***/ }),

/***/ "./src/Core/Providers/Crypt/index.ts":
/*!*******************************************!*\
  !*** ./src/Core/Providers/Crypt/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Encryption */ "./src/Core/Providers/Crypt/Encryption.ts"), exports);

__exportStar(__webpack_require__(/*! ./EncryptionServiceProvider */ "./src/Core/Providers/Crypt/EncryptionServiceProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./Hash */ "./src/Core/Providers/Crypt/Hash.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/Context/HttpContext.ts":
/*!********************************************************!*\
  !*** ./src/Core/Providers/Http/Context/HttpContext.ts ***!
  \********************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HttpContext = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let HttpContext = /*#__PURE__*/function () {
  function HttpContext(request, response) {
    this.request = new _Core_1.HttpRequest(request);
    this.response = new _Core_1.HttpResponse(response);
  }
  /**
   * We use async localstorage to help have context around the app without direct
   * access to our fastify request. We also bind this context class to the fastify request
   *
   * @param done
   */


  var _proto = HttpContext.prototype;

  _proto.bind = function bind(done) {
    this.container = _Core_1.Container.createChild(); // We bind the context to the current request, so it's obtainable
    // throughout the lifecycle of this request, this isn't bound to
    // our wrapper request class, only the original fastify request

    Reflect.defineMetadata(_Core_1.METADATA.HTTP_CONTEXT, this, this.request.fastifyRequest);

    _Core_1.HttpContextStore.getInstance().bind(this.request.fastifyRequest, done);
  }
  /**
   * Get the current request context.
   * This will return an instance of this class.
   */
  ;

  HttpContext.get = function get() {
    return _Core_1.HttpContextStore.getInstance().context();
  }
  /**
   * Return the Fastify Request wrapper
   */
  ;

  HttpContext.request = function request() {
    return this.get().request;
  }
  /**
   * Return the Fastify Reply wrapper, this implements our
   * own helper methods to make things a little easier
   */
  ;

  HttpContext.response = function response() {
    return this.get().response;
  }
  /**
   * Set the currently authed user on the context(this will essentially authorise this user)
   * @param user
   */
  ;

  _proto.setUser = function setUser(user) {
    const authedUser = new _Core_1.AuthorisedUser(user);
    this.container.bind(_Core_1.AuthorisedUser).toConstantValue(authedUser);
    this.user = authedUser;
  };

  return HttpContext;
}();

exports.HttpContext = HttpContext;

/***/ }),

/***/ "./src/Core/Providers/Http/Context/HttpContextStore.ts":
/*!*************************************************************!*\
  !*** ./src/Core/Providers/Http/Context/HttpContextStore.ts ***!
  \*************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HttpContextStore = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const async_hooks_1 = __webpack_require__(/*! async_hooks */ "async_hooks");

let instance = null;

let HttpContextStore = /*#__PURE__*/function () {
  function HttpContextStore() {
    this._store = new async_hooks_1.AsyncLocalStorage();
    instance = this;
  }

  HttpContextStore.getInstance = function getInstance() {
    if (instance) {
      return instance;
    }

    return new HttpContextStore();
  };

  var _proto = HttpContextStore.prototype;

  _proto.context = function context() {
    return this._store.getStore();
  };

  _proto.bind = function bind(request, done) {
    this._store.run(Reflect.getMetadata(_Core_1.METADATA.HTTP_CONTEXT, request), done);
  };

  return HttpContextStore;
}();

exports.HttpContextStore = HttpContextStore;

/***/ }),

/***/ "./src/Core/Providers/Http/Context/Request/FileUpload.ts":
/*!***************************************************************!*\
  !*** ./src/Core/Providers/Http/Context/Request/FileUpload.ts ***!
  \***************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __asyncValues = this && this.__asyncValues || function (o) {
  if (!Symbol.asyncIterator) throw new TypeError("Symbol.asyncIterator is not defined.");
  var m = o[Symbol.asyncIterator],
      i;
  return m ? m.call(o) : (o = typeof __values === "function" ? __values(o) : o[Symbol.iterator](), i = {}, verb("next"), verb("throw"), verb("return"), i[Symbol.asyncIterator] = function () {
    return this;
  }, i);

  function verb(n) {
    i[n] = o[n] && function (v) {
      return new Promise(function (resolve, reject) {
        v = o[n](v), settle(resolve, reject, v.done, v.value);
      });
    };
  }

  function settle(resolve, reject, d, v) {
    Promise.resolve(v).then(function (v) {
      resolve({
        value: v,
        done: d
      });
    }, reject);
  }
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.FileUpload = void 0;

const Exception_1 = __webpack_require__(/*! @App/Exceptions/Exception */ "./src/App/Exceptions/Exception.ts");

const fs = __importStar(__webpack_require__(/*! fs */ "fs"));

const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");

const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const stream_1 = __webpack_require__(/*! stream */ "stream");

const util = __importStar(__webpack_require__(/*! util */ "util"));

const pump = util.promisify(stream_1.pipeline);

let FileUpload = /*#__PURE__*/function () {
  function FileUpload(request, field) {
    this.request = request;
    this.field = field;
  }

  var _proto = FileUpload.prototype;

  _proto.store = function store(location) {
    var e_1, _a;

    return __awaiter(this, void 0, void 0, function* () {
      let file = null;

      try {
        for (var _b = __asyncValues(this.request.fastifyRequest.files()), _c; _c = yield _b.next(), !_c.done;) {
          let upload = _c.value;

          if (upload.fieldname === this.field) {
            file = upload;
            break;
          }
        }
      } catch (e_1_1) {
        e_1 = {
          error: e_1_1
        };
      } finally {
        try {
          if (_c && !_c.done && (_a = _b.return)) yield _a.call(_b);
        } finally {
          if (e_1) throw e_1.error;
        }
      }

      if (!file) {
        throw new Exception_1.Exception('File not found on request.', http_status_codes_1.StatusCodes.BAD_REQUEST);
      }

      const tempName = _Core_1.Encryption.random() + '.' + file.filename.split('.').pop();
      const tempPath = path_1.default.join(__dirname, '..', 'storage', 'temp', tempName);
      yield pump(file.file, fs.createWriteStream(tempPath));
      file.filepath = tempPath;

      try {
        const response = yield _Core_1.Storage.put(location, file);
        if (fs.existsSync(tempPath)) fs.rmSync(tempPath);
        return response;
      } catch (error) {
        _Core_1.Log.error(error);

        throw new Exception_1.Exception('Something went wrong uploading the file', http_status_codes_1.StatusCodes.INTERNAL_SERVER_ERROR);
      }
    });
  };

  return FileUpload;
}();

exports.FileUpload = FileUpload;

/***/ }),

/***/ "./src/Core/Providers/Http/Context/Request/HttpRequest.ts":
/*!****************************************************************!*\
  !*** ./src/Core/Providers/Http/Context/Request/HttpRequest.ts ***!
  \****************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HttpRequest = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let HttpRequest = /*#__PURE__*/function () {
  function HttpRequest(request) {
    this._request = request;
  }

  var _proto = HttpRequest.prototype;

  _proto.file = function file(field) {
    return new _Core_1.FileUpload(this, field);
  };

  _createClass(HttpRequest, [{
    key: "fastifyRequest",
    get: function () {
      return this._request;
    }
  }]);

  return HttpRequest;
}();

exports.HttpRequest = HttpRequest;

/***/ }),

/***/ "./src/Core/Providers/Http/Context/Request/index.ts":
/*!**********************************************************!*\
  !*** ./src/Core/Providers/Http/Context/Request/index.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./FileUpload */ "./src/Core/Providers/Http/Context/Request/FileUpload.ts"), exports);

__exportStar(__webpack_require__(/*! ./HttpRequest */ "./src/Core/Providers/Http/Context/Request/HttpRequest.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/Context/Response/HttpResponse.ts":
/*!******************************************************************!*\
  !*** ./src/Core/Providers/Http/Context/Response/HttpResponse.ts ***!
  \******************************************************************/
/***/ ((__unused_webpack_module, exports, __webpack_require__) => {

"use strict";


function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HttpResponse = void 0;

const ValidationException_1 = __webpack_require__(/*! @App/Exceptions/ValidationException */ "./src/App/Exceptions/ValidationException.ts");

const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");

let HttpResponse = /*#__PURE__*/function () {
  function HttpResponse(response) {
    this._response = response;
  }

  var _proto = HttpResponse.prototype;

  /**
   * Apply a header to the response, this applies directly to the fastify response
   *
   * @param header
   * @param value
   */
  _proto.header = function header(_header, value) {
    this.fastifyReply.header(_header, value);
    return this;
  }
  /**
   * Set the data & status code to return
   *
   * @param data
   * @param code
   */
  ;

  _proto.setResponse = function setResponse(data, code) {
    this._data = data;
    this._code = code;
    return this;
  }
  /**
   * Set the status code... can be chained with other methods.
   *
   * @param code
   */
  ;

  _proto.setCode = function setCode(code) {
    this._code = code;
    return this;
  }
  /**
   * Send the data/status code manually
   */
  ;

  _proto.send = function send() {
    return this.fastifyReply.status(this.code).send(this.data);
  }
  /**
   * Send a redirect response to x url
   *
   * @param url
   */
  ;

  _proto.redirect = function redirect(url) {
    return this.setResponse(null, http_status_codes_1.StatusCodes.TEMPORARY_REDIRECT).header('Location', url);
  }
  /**
   * Send a not found response
   *
   * @param data
   */
  ;

  _proto.notFound = function notFound(data) {
    return this.setResponse(data, http_status_codes_1.StatusCodes.NOT_FOUND);
  }
  /**
   * Send a bad request response
   *
   * @param data
   */
  ;

  _proto.badRequest = function badRequest(data) {
    return this.setResponse(data, http_status_codes_1.StatusCodes.BAD_REQUEST);
  }
  /**
   * Send a validation failure response
   * NOTE: This will throw a {@see ValidationException}, just to keep things structured.
   * @param data
   */
  ;

  _proto.validationFailure = function validationFailure(data) {
    throw new ValidationException_1.ValidationException(data); //		return this.setResponse(data, StatusCodes.UNPROCESSABLE_ENTITY);
  }
  /**
   * Return json data
   *
   * @param data
   * @param code
   */
  ;

  _proto.json = function json(data, code) {
    return this.setResponse(data || {}, code || http_status_codes_1.StatusCodes.OK);
  };

  _createClass(HttpResponse, [{
    key: "fastifyReply",
    get: function () {
      return this._response;
    }
  }, {
    key: "code",
    get: function () {
      var _a;

      return (_a = this._code) !== null && _a !== void 0 ? _a : 200;
    },
    set: function (code) {
      this._code = code;
    }
  }, {
    key: "data",
    get: function () {
      var _a;

      return (_a = this._data) !== null && _a !== void 0 ? _a : {};
    },
    set: function (data) {
      this._data = data;
    }
  }]);

  return HttpResponse;
}();

exports.HttpResponse = HttpResponse;

/***/ }),

/***/ "./src/Core/Providers/Http/Context/Response/index.ts":
/*!***********************************************************!*\
  !*** ./src/Core/Providers/Http/Context/Response/index.ts ***!
  \***********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./HttpResponse */ "./src/Core/Providers/Http/Context/Response/HttpResponse.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/Context/index.ts":
/*!**************************************************!*\
  !*** ./src/Core/Providers/Http/Context/index.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./HttpContext */ "./src/Core/Providers/Http/Context/HttpContext.ts"), exports);

__exportStar(__webpack_require__(/*! ./HttpContextStore */ "./src/Core/Providers/Http/Context/HttpContextStore.ts"), exports);

__exportStar(__webpack_require__(/*! ./Request */ "./src/Core/Providers/Http/Context/Request/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Response */ "./src/Core/Providers/Http/Context/Response/index.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Controller.ts":
/*!**********************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Controller.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Controller = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const DecoratorData_1 = __webpack_require__(/*! ../../../DecoratorData */ "./src/Core/DecoratorData.ts");

let Controller = /*#__PURE__*/function () {
  function Controller() {}

  var _proto = Controller.prototype;

  //	@currentRequest
  //	protected readonly request: FastifyRequest;
  //	@currentUser
  //	protected readonly user: AuthorisedUser;
  //	@requestContainer
  //	protected readonly container: Container;
  _proto.getMetadata = function getMetadata() {
    return Reflect.getMetadata(DecoratorData_1.METADATA.CONTROLLER, this.constructor);
  };

  _proto.getMethodMetadata = function getMethodMetadata() {
    return Reflect.getMetadata(DecoratorData_1.METADATA.CONTROLLER_METHODS, this.constructor);
  };

  return Controller;
}();

Controller = __decorate([inversify_1.injectable()], Controller);
exports.Controller = Controller;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/ControllerServiceProvider.ts":
/*!*************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/ControllerServiceProvider.ts ***!
  \*************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ControllerServiceProvider = void 0;

const glob_1 = __webpack_require__(/*! glob */ "glob");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Container_1 = __importStar(__webpack_require__(/*! ../../../Container */ "./src/Core/Container.ts"));

const Controller_1 = __webpack_require__(/*! ./Controller */ "./src/Core/Providers/Http/Controller/Controller.ts");

let ControllerServiceProvider = /*#__PURE__*/function (_Core_1$ServiceProvid) {
  _inheritsLoose(ControllerServiceProvider, _Core_1$ServiceProvid);

  function ControllerServiceProvider() {
    return _Core_1$ServiceProvid.apply(this, arguments) || this;
  }

  var _proto = ControllerServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {};

  _proto.boot = function boot() {
    this.bindContextToContainer(Container_1.default);
    glob_1.glob.sync(path_1.default.join('src', 'App', 'Http', 'Controllers', '**', '*.ts'), {
      follow: true
    }).map(file => {
      const loc = file.replace('src/App/Http/Controllers/', '').replace('.ts', '');
      Promise.resolve().then(() => __importStar(__webpack_require__("./src/App/Http/Controllers sync recursive ^\\.\\/.*$")(`./${loc}`))).then(module => this.loadController(module, loc)).catch(error => {
        _Core_1.Log.warn('[' + this.constructor.name + '] Failed to load controller: ' + file);

        _Core_1.Log.error(error);
      });
    });
  };

  _proto.bindContextToContainer = function bindContextToContainer(container, context) {
    if (!context) {
      context = {};
    }

    container.bind(Container_1.HTTP_CONTEXT_IDENTIFIER).toConstantValue(context);
    container.bind(Container_1.AUTHED_USER_IDENTIFIER).toConstantValue(context.user);
    container.bind(Container_1.HTTP_REQUEST_IDENTIFIER).toConstantValue(context.request);
    container.bind(Container_1.CONTAINER_IDENTIFIER).toConstantValue(container);
  };

  _proto.loadController = function loadController(module, file) {
    //const controllerModule = require(path.resolve(file))
    const controllerName = Object.keys(module)[0] || null;

    if (!controllerName) {
      throw new Error('There was an error loading controller: ' + file);
    }

    const controller = module[controllerName];
    const name = controller.name;

    if (Container_1.default.isBoundNamed(Controller_1.Controller, name)) {
      throw new Error(`Two controllers cannot have the same name: ${name}`);
    }

    Container_1.default.bind(Controller_1.Controller).to(controller).whenTargetNamed(name);

    _Core_1.Log.info('Controller Loaded: ' + file);
  };

  _proto.allControllers = function allControllers() {
    if (!Container_1.default.isBound(Controller_1.Controller)) {
      _Core_1.Log.warn('No controllers have been bound to the container...');

      return;
    }

    return Container_1.default.getAll(Controller_1.Controller) || [];
  };

  return ControllerServiceProvider;
}(_Core_1.ServiceProvider);

ControllerServiceProvider = __decorate([inversify_1.injectable()], ControllerServiceProvider);
exports.ControllerServiceProvider = ControllerServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/DataTransferObject.ts":
/*!******************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/DataTransferObject.ts ***!
  \******************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.DataTransferObject = void 0;

const ValidationException_1 = __webpack_require__(/*! @App/Exceptions/ValidationException */ "./src/App/Exceptions/ValidationException.ts");

const class_validator_1 = __webpack_require__(/*! class-validator */ "class-validator");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let DataTransferObject = /*#__PURE__*/function () {
  function DataTransferObject() {}

  var _proto = DataTransferObject.prototype;

  /**
   * Validate the data transfer object using class-validator
   */
  _proto.validate = function validate() {
    return __awaiter(this, void 0, void 0, function* () {
      try {
        yield class_validator_1.validateOrReject(this, {
          forbidUnknownValues: true,
          whitelist: true,
          enableDebugMessages: true
        });
      } catch (error) {
        _Core_1.Log.warn(error.toString(false), true);

        if (Array.isArray(error)) {
          this._validationErrors = error;
        }
      }
    });
  }
  /**
   * If you didn't use auto validation, then you can
   * call this method to throw the validation error
   */
  ;

  _proto.throwIfFailed = function throwIfFailed() {
    if (this.failed()) {
      throw new ValidationException_1.ValidationException(this._validationErrors);
    }
  }
  /**
   * Did the validation fail?
   */
  ;

  _proto.failed = function failed() {
    return !!this._validationErrors;
  }
  /**
   * Get the class-validator errors
   */
  ;

  _proto.errors = function errors() {
    if (!this._validationErrors) return null;
    return this._validationErrors;
  };

  return DataTransferObject;
}();

exports.DataTransferObject = DataTransferObject;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts":
/*!******************************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts ***!
  \******************************************************************************************/
/***/ (function(__unused_webpack_module, exports) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ControllerRequestParamDecorator = void 0;

let ControllerRequestParamDecorator = /*#__PURE__*/function () {
  function ControllerRequestParamDecorator(paramType) {
    this.expectedParamType = paramType;
  }

  ControllerRequestParamDecorator.getMethodMetadata = function getMethodMetadata(target, metadata) {
    return Reflect.getMetadata(metadata, target);
  };

  ControllerRequestParamDecorator.hasInjectableParams = function hasInjectableParams(metadata, target, key) {
    return !!this.getMethodMetadata(target[key], metadata);
  };

  var _proto = ControllerRequestParamDecorator.prototype;

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      return undefined;
    });
  };

  _proto.canBind = function canBind(target, param, parameterIndex) {
    return this.expectedParamType.prototype === param.prototype;
  };

  return ControllerRequestParamDecorator;
}();

exports.ControllerRequestParamDecorator = ControllerRequestParamDecorator;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/DataTransferObjectParam.ts":
/*!**********************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/DataTransferObjectParam.ts ***!
  \**********************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.DataTransferObjectParam = void 0;

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const DecoratorData_1 = __webpack_require__(/*! ../../../../DecoratorData */ "./src/Core/DecoratorData.ts");

const DecoratorHelpers_1 = __webpack_require__(/*! ../../../../Decorators/DecoratorHelpers */ "./src/Core/Decorators/DecoratorHelpers.ts");

const DataTransferObject_1 = __webpack_require__(/*! ../DataTransferObject */ "./src/Core/Providers/Http/Controller/DataTransferObject.ts");

const ControllerRequestParamDecorator_1 = __webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts");

let DataTransferObjectParam = /*#__PURE__*/function (_ControllerRequestPar) {
  _inheritsLoose(DataTransferObjectParam, _ControllerRequestPar);

  function DataTransferObjectParam(dtoParameter, validateOnRequest = true) {
    var _this;

    _this = _ControllerRequestPar.call(this, dtoParameter) || this;
    _this.validateOnRequest = true;
    _this.dtoParameter = dtoParameter;
    _this.validateOnRequest = validateOnRequest;
    return _this;
  }

  DataTransferObjectParam.handleParameter = function handleParameter(reflector, validateOnRequest = true) {
    const paramTypes = DecoratorHelpers_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
    const dtoParameter = paramTypes[reflector.parameterIndex];

    if (dtoParameter.prototype instanceof DataTransferObject_1.DataTransferObject) {
      const paramHandler = new DataTransferObjectParam(dtoParameter, validateOnRequest);
      this.setMetadata(reflector, paramHandler);
    }
  };

  DataTransferObjectParam.setMetadata = function setMetadata(reflector, dtoParam) {
    const target = reflector.target[reflector.propertyKey];
    Reflect.defineMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_DTO, dtoParam, target);
  };

  DataTransferObjectParam.getMetadata = function getMetadata(target) {
    return Reflect.getMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_DTO, target);
  };

  var _proto = DataTransferObjectParam.prototype;

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      const dtoClass = class_transformer_1.plainToClass(this.dtoParameter, request.body);
      yield dtoClass.validate();

      if (this.validateOnRequest) {
        dtoClass.throwIfFailed();
      }

      return dtoClass;
    });
  };

  DataTransferObjectParam.canInject = function canInject(target, key) {
    return !!this.getMetadata(target[key]);
  };

  return DataTransferObjectParam;
}(ControllerRequestParamDecorator_1.ControllerRequestParamDecorator);

exports.DataTransferObjectParam = DataTransferObjectParam;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/RequestBodyParam.ts":
/*!***************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/RequestBodyParam.ts ***!
  \***************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RequestBodyParam = void 0;

const DecoratorData_1 = __webpack_require__(/*! ../../../../DecoratorData */ "./src/Core/DecoratorData.ts");

const ControllerRequestParamDecorator_1 = __webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts");

let RequestBodyParam = /*#__PURE__*/function (_ControllerRequestPar) {
  _inheritsLoose(RequestBodyParam, _ControllerRequestPar);

  function RequestBodyParam(parameterIndex) {
    var _this;

    _this = _ControllerRequestPar.call(this, null) || this;
    _this.parameterIndex = parameterIndex;
    return _this;
  }

  RequestBodyParam.handleParameter = function handleParameter(reflector, validateOnRequest = true) {
    this.setMetadata(reflector, new RequestBodyParam(reflector.parameterIndex));
  };

  RequestBodyParam.setMetadata = function setMetadata(reflector, dtoParam) {
    const target = reflector.target[reflector.propertyKey];
    Reflect.defineMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_BODY, dtoParam, target);
  };

  RequestBodyParam.getMetadata = function getMetadata(target) {
    return Reflect.getMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_BODY, target);
  };

  var _proto = RequestBodyParam.prototype;

  _proto.canBind = function canBind(target, param, parameterIndex) {
    return parameterIndex === this.parameterIndex;
  };

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      return request.body;
    });
  };

  return RequestBodyParam;
}(ControllerRequestParamDecorator_1.ControllerRequestParamDecorator);

exports.RequestBodyParam = RequestBodyParam;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/RequestHeadersParam.ts":
/*!******************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/RequestHeadersParam.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RequestHeadersParam = void 0;

const DecoratorData_1 = __webpack_require__(/*! ../../../../DecoratorData */ "./src/Core/DecoratorData.ts");

const ControllerRequestParamDecorator_1 = __webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts");

let RequestHeadersParam = /*#__PURE__*/function (_ControllerRequestPar) {
  _inheritsLoose(RequestHeadersParam, _ControllerRequestPar);

  function RequestHeadersParam(parameterIndex) {
    var _this;

    _this = _ControllerRequestPar.call(this, null) || this;
    _this.parameterIndex = parameterIndex;
    return _this;
  }

  RequestHeadersParam.handleParameter = function handleParameter(reflector) {
    this.setMetadata(reflector, new RequestHeadersParam(reflector.parameterIndex));
  };

  RequestHeadersParam.setMetadata = function setMetadata(reflector, dtoParam) {
    const target = reflector.target[reflector.propertyKey];
    Reflect.defineMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_HEADERS, dtoParam, target);
  };

  RequestHeadersParam.getMetadata = function getMetadata(target) {
    return Reflect.getMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_HEADERS, target);
  };

  var _proto = RequestHeadersParam.prototype;

  _proto.canBind = function canBind(target, param, parameterIndex) {
    return parameterIndex === this.parameterIndex;
  };

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      return request.headers;
    });
  };

  return RequestHeadersParam;
}(ControllerRequestParamDecorator_1.ControllerRequestParamDecorator);

exports.RequestHeadersParam = RequestHeadersParam;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/RequestParam.ts":
/*!***********************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/RequestParam.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RequestParam = void 0;

const DecoratorData_1 = __webpack_require__(/*! ../../../../DecoratorData */ "./src/Core/DecoratorData.ts");

const ControllerRequestParamDecorator_1 = __webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts");

let RequestParam = /*#__PURE__*/function (_ControllerRequestPar) {
  _inheritsLoose(RequestParam, _ControllerRequestPar);

  function RequestParam() {
    return _ControllerRequestPar.call(this, null) || this;
  }

  RequestParam.handleParameter = function handleParameter(reflector) {
    const paramHandler = new RequestParam();
    this.setMetadata(reflector, paramHandler);
  };

  RequestParam.setMetadata = function setMetadata(reflector, param) {
    const target = reflector.target[reflector.propertyKey];
    Reflect.defineMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST, param, target);
  };

  RequestParam.getMetadata = function getMetadata(target) {
    return Reflect.getMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_FASTIFY_REQUEST, target);
  };

  var _proto = RequestParam.prototype;

  _proto.canBind = function canBind(target, param, parameterIndex) {
    return this instanceof RequestParam;
  };

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      return request;
    });
  };

  return RequestParam;
}(ControllerRequestParamDecorator_1.ControllerRequestParamDecorator);

exports.RequestParam = RequestParam;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/RouteParameterParam.ts":
/*!******************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/RouteParameterParam.ts ***!
  \******************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RouteParameterParam = void 0;

const DecoratorData_1 = __webpack_require__(/*! ../../../../DecoratorData */ "./src/Core/DecoratorData.ts");

const DecoratorHelpers_1 = __webpack_require__(/*! ../../../../Decorators/DecoratorHelpers */ "./src/Core/Decorators/DecoratorHelpers.ts");

const ControllerRequestParamDecorator_1 = __webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts");

let RouteParameterParam = /*#__PURE__*/function (_ControllerRequestPar) {
  _inheritsLoose(RouteParameterParam, _ControllerRequestPar);

  function RouteParameterParam(parameterName, type, paramIndex) {
    var _this;

    _this = _ControllerRequestPar.call(this, type) || this;
    _this.parameterName = parameterName;
    _this.paramIndex = paramIndex;
    return _this;
  }

  RouteParameterParam.handleParameter = function handleParameter(reflector) {
    const types = DecoratorHelpers_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);
    const parameterNames = DecoratorHelpers_1.DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);
    const routeParameterParam = new RouteParameterParam(parameterNames[reflector.parameterIndex], types[reflector.parameterIndex], reflector.parameterIndex);
    this.setMetadata(reflector, routeParameterParam);
  };

  RouteParameterParam.setMetadata = function setMetadata(reflector, param) {
    const target = reflector.target[reflector.propertyKey];
    Reflect.defineMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER, param, target);
  };

  RouteParameterParam.getMetadata = function getMetadata(target) {
    return Reflect.getMetadata(DecoratorData_1.METADATA.REQUEST_METHOD_ROUTE_PARAMETER, target);
  };

  var _proto = RouteParameterParam.prototype;

  _proto.canBind = function canBind(target, param, parameterIndex) {
    if (parameterIndex !== this.paramIndex) {
      return false;
    }

    return this.expectedParamType === param;
  };

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      const paramValue = request.params[this.parameterName];
      const param = this.expectedParamType(paramValue);
      return param !== null && param !== void 0 ? param : null;
    });
  };

  return RouteParameterParam;
}(ControllerRequestParamDecorator_1.ControllerRequestParamDecorator);

exports.RouteParameterParam = RouteParameterParam;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/RouteQueryParam.ts":
/*!**************************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/RouteQueryParam.ts ***!
  \**************************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.RouteQueryParam = void 0;

const Exception_1 = __webpack_require__(/*! @App/Exceptions/Exception */ "./src/App/Exceptions/Exception.ts");

const http_status_codes_1 = __webpack_require__(/*! http-status-codes */ "http-status-codes");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const ControllerRequestParamDecorator_1 = __webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts");

let RouteQueryParam = /*#__PURE__*/function (_ControllerRequestPar) {
  _inheritsLoose(RouteQueryParam, _ControllerRequestPar);

  function RouteQueryParam(parameterName, type, paramIndex) {
    var _this;

    _this = _ControllerRequestPar.call(this, type) || this;
    _this.parameterName = parameterName;
    _this.paramIndex = paramIndex;
    return _this;
  }

  RouteQueryParam.handleParameter = function handleParameter(reflector) {
    const types = _Core_1.DecoratorHelpers.paramTypes(reflector.target, reflector.propertyKey);

    const parameterNames = _Core_1.DecoratorHelpers.getParameterNames(reflector.target[reflector.propertyKey]);

    const routeParameterParam = new RouteQueryParam(parameterNames[reflector.parameterIndex], types[reflector.parameterIndex], reflector.parameterIndex);
    this.setMetadata(reflector, routeParameterParam);
  };

  RouteQueryParam.setMetadata = function setMetadata(reflector, param) {
    const target = reflector.target[reflector.propertyKey];
    Reflect.defineMetadata(_Core_1.METADATA.REQUEST_METHOD_QUERY_PARAMETER, param, target);
  };

  RouteQueryParam.getMetadata = function getMetadata(target) {
    return Reflect.getMetadata(_Core_1.METADATA.REQUEST_METHOD_QUERY_PARAMETER, target);
  };

  var _proto = RouteQueryParam.prototype;

  _proto.canBind = function canBind(target, param, parameterIndex) {
    if (parameterIndex !== this.paramIndex) {
      return false;
    }

    const res = this.expectedParamType === param;
    return res; //		return this instanceof RouteQueryParam;
  };

  _proto.bind = function bind(request, response) {
    return __awaiter(this, void 0, void 0, function* () {
      const paramValue = request.query[this.parameterName];
      const param = this.expectedParamType(paramValue);

      if (!param) {
        throw new Exception_1.Exception(`Expected type of ${typeof param} for param ${this.parameterName} but ${typeof paramValue} cannot be cast to ${typeof param}`, http_status_codes_1.StatusCodes.BAD_REQUEST);
      }

      return param !== null && param !== void 0 ? param : null;
    });
  };

  return RouteQueryParam;
}(ControllerRequestParamDecorator_1.ControllerRequestParamDecorator);

exports.RouteQueryParam = RouteQueryParam;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Decorators/index.ts":
/*!****************************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Decorators/index.ts ***!
  \****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./ControllerRequestParamDecorator */ "./src/Core/Providers/Http/Controller/Decorators/ControllerRequestParamDecorator.ts"), exports);

__exportStar(__webpack_require__(/*! ./DataTransferObjectParam */ "./src/Core/Providers/Http/Controller/Decorators/DataTransferObjectParam.ts"), exports);

__exportStar(__webpack_require__(/*! ./RequestBodyParam */ "./src/Core/Providers/Http/Controller/Decorators/RequestBodyParam.ts"), exports);

__exportStar(__webpack_require__(/*! ./RequestHeadersParam */ "./src/Core/Providers/Http/Controller/Decorators/RequestHeadersParam.ts"), exports);

__exportStar(__webpack_require__(/*! ./RequestParam */ "./src/Core/Providers/Http/Controller/Decorators/RequestParam.ts"), exports);

__exportStar(__webpack_require__(/*! ./RouteParameterParam */ "./src/Core/Providers/Http/Controller/Decorators/RouteParameterParam.ts"), exports);

__exportStar(__webpack_require__(/*! ./RouteQueryParam */ "./src/Core/Providers/Http/Controller/Decorators/RouteQueryParam.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Middleware.ts":
/*!**********************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Middleware.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Middleware = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const DecoratorData_1 = __webpack_require__(/*! ../../../DecoratorData */ "./src/Core/DecoratorData.ts");

let Middleware = /*#__PURE__*/function () {
  function Middleware() {}

  Middleware.getMetadata = function getMetadata(controller) {
    return Reflect.getMetadata(DecoratorData_1.METADATA.MIDDLEWARE, controller);
  };

  Middleware.setMetadata = function setMetadata(controller, middlewares) {
    return Reflect.defineMetadata(DecoratorData_1.METADATA.MIDDLEWARE, {
      middlewares
    }, controller);
  };

  return Middleware;
}();

Middleware = __decorate([inversify_1.injectable()], Middleware);
exports.Middleware = Middleware;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/Route.ts":
/*!*****************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/Route.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Route = void 0;

const ExceptionHandler_1 = __webpack_require__(/*! @App/Exceptions/ExceptionHandler */ "./src/App/Exceptions/ExceptionHandler.ts");

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const chalk_console_1 = __importDefault(__webpack_require__(/*! chalk-console */ "chalk-console"));

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const http_status_codes_1 = __importDefault(__webpack_require__(/*! http-status-codes */ "http-status-codes"));

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Controller_1 = __webpack_require__(/*! ./Controller */ "./src/Core/Providers/Http/Controller/Controller.ts");

const Middleware_1 = __webpack_require__(/*! ./Middleware */ "./src/Core/Providers/Http/Controller/Middleware.ts");

let Route = /*#__PURE__*/function () {
  function Route(controllerConstructor, controllerMetadata, controllerMethodMetadata, metadata) {
    this.controllerConstructor = controllerConstructor;
    this.controllerMetadata = controllerMetadata;
    this.controllerMethodMetadata = controllerMethodMetadata;
    this.metadata = metadata;
  }
  /**
   * Returns all the fastify route arguments needed to
   * bind this route to the fastify instance
   */


  var _proto = Route.prototype;

  _proto.getFastifyRouteOptions = function getFastifyRouteOptions() {
    const handler = this.resolveHandlerFactory();
    const routePath = this.getRoutePath();
    const middlewareAdapter = this.getMiddlewareAdapter(routePath);
    return [routePath, middlewareAdapter, handler];
  }
  /**
   * Load the middleware for this route and return it as a fastify pre-handler
   *
   * @param routePath
   * @private
   */
  ;

  _proto.getMiddlewareAdapter = function getMiddlewareAdapter(routePath) {
    const controllerMiddlewareMeta = Middleware_1.Middleware.getMetadata(this.controllerConstructor);
    const methodMiddlewareMeta = Middleware_1.Middleware.getMetadata(this.metadata.target[this.metadata.key]);
    const middlewares = [...((controllerMiddlewareMeta === null || controllerMiddlewareMeta === void 0 ? void 0 : controllerMiddlewareMeta.middlewares) || []), ...((methodMiddlewareMeta === null || methodMiddlewareMeta === void 0 ? void 0 : methodMiddlewareMeta.middlewares) || [])];
    middlewares.forEach(mw => {
      _Core_1.Log.info(mw.constructor.name + ' was loaded for ' + routePath);
    });
    return {
      preHandler: (request, response) => __awaiter(this, void 0, void 0, function* () {
        for (const middleware of middlewares) {
          try {
            yield middleware.handler(request, response);
          } catch (exception) {
            return ExceptionHandler_1.ExceptionHandler.transform(exception, response);
          }
        }
      })
    };
  }
  /**
   * Parse the controller & method route, allows us to define routes without a leading /
   */
  ;

  _proto.getRoutePath = function getRoutePath() {
    const routes = [this.controllerMetadata.path, this.metadata.path];

    for (let route in routes) {
      routes[route] = routes[route].replace('/', '');
    }

    let route = routes.join('/');

    if (!route.startsWith('/')) {
      route = '/' + route;
    }

    return route; //		if (!this.controllerMetadata.path.startsWith('/')) {
    //			this.controllerMetadata.path = '/' + this.controllerMetadata.path;
    //		}
    //
    //		if (!this.metadata.path.startsWith('/')) {
    //			this.metadata.path = '/' + this.metadata.path;
    //		}
    //
    //		if (this.controllerMethodMetadata.length === 1 && this.controllerMetadata.path === '/') {
    //			this.metadata.path = '';
    //		}
    //
    //		let path = `${this.controllerMetadata.path}${this.metadata.path}`;
    //
    //		if (path.endsWith('/')) {
    //			path = path.substring(0, path.length - 1);
    //		}
    //
    //		return path;
  }
  /**
   * Handle the request to the controller method
   *
   * @private
   */
  ;

  _proto.resolveHandlerFactory = function resolveHandlerFactory() {
    return (request, response) => __awaiter(this, void 0, void 0, function* () {
      try {
        const routeParameters = yield this.injectRouteDecorators(request, response);
        const httpContext = Reflect.getMetadata(_Core_1.METADATA.HTTP_CONTEXT, request);
        const value = yield httpContext.container.getNamed(Controller_1.Controller, this.controllerMetadata.target.name)[this.metadata.key](...routeParameters);

        if (response.sent) {
          chalk_console_1.default.warn('Res was already sent');
          return;
        }

        return this.getResponseResult(value);
      } catch (error) {
        return ExceptionHandler_1.ExceptionHandler.transform(error, response);
      }
    });
  }
  /**
   * Handle any controller method parameter injection
   * Route model binding, data transfer objects, request, response etc...
   *
   * @param request
   * @param response
   * @private
   */
  ;

  _proto.injectRouteDecorators = function injectRouteDecorators(request, response) {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      const paramArgs = [];

      const params = _Core_1.DecoratorHelpers.paramTypes(this.metadata.target, this.metadata.key);

      if (!params) {
        return [request, response];
      }

      for (let index in this.metadata.parameters) {
        const parameter = this.metadata.parameters[index];

        if (parameter.type.prototype instanceof _Core_1.ModelEntity) {
          const identifier = request.params[parameter.name];
          const model = (_a = yield parameter.type.query().findById(new mongodb_1.ObjectId(identifier))) !== null && _a !== void 0 ? _a : null;
          paramArgs.push(model);
          continue;
        }

        for (const metadataKey of _Core_1.CONTROLLER_METHOD_PARAMS) {
          const methodMeta = _Core_1.ControllerRequestParamDecorator.getMethodMetadata(this.metadata.target[this.metadata.key], metadataKey);

          if (!methodMeta) {
            continue;
          }

          if (methodMeta.canBind(this.metadata.target[this.metadata.key], parameter.type, Number(index))) {
            paramArgs.push(yield methodMeta.bind(request, response));
            break;
          }
        }
      } //		for (let paramIndex in params) {
      //			const param = params[paramIndex];
      //
      //			for (const metadataKey of CONTROLLER_METHOD_PARAMS) {
      //
      //				const methodMeta: ControllerRequestParamDecorator = ControllerRequestParamDecorator.getMethodMetadata(
      //					this.metadata.target[this.metadata.key],
      //					metadataKey
      //				);
      //
      //				if (!methodMeta) {
      //					continue;
      //				}
      //
      //				if (methodMeta.canBind(this.metadata.target[this.metadata.key], param, Number(paramIndex))) {
      //					paramArgs.push(await methodMeta.bind(request, response));
      //					break;
      //				}
      //
      //			}
      //		}
      //paramArgs.push(request, response);


      return paramArgs;
    });
  }
  /**
   * Get the result of the response from the controller action.
   *
   * If the controller responded with undefined/null, we'll send a no content response
   * If there was an object returned directly from the controller, we'll create a new response and send it.
   *
   * Otherwise, we'll send the response of the {@see HttpContext}
   *
   * @param controllerResponse
   * @private
   */
  ;

  _proto.getResponseResult = function getResponseResult(controllerResponse) {
    const response = _Core_1.HttpContext.response();

    if (controllerResponse === undefined || controllerResponse === null) {
      return response.setResponse(null, http_status_codes_1.default.NO_CONTENT).send();
    }

    if (!(controllerResponse instanceof _Core_1.HttpResponse)) {
      return response.setResponse(class_transformer_1.classToPlain(controllerResponse, _Config_1.Config.http.responseSerialization), http_status_codes_1.default.ACCEPTED).send();
    }

    const conf = _Config_1.Config.http.responseSerialization;
    controllerResponse.data = class_transformer_1.serialize(controllerResponse.data, conf);
    return controllerResponse.send();
  };

  _proto.replaceCircularReferenceInResponse = function replaceCircularReferenceInResponse(val, cache = null) {
    cache = cache || new WeakSet();

    if (val && typeof val === 'object') {
      if (cache.has(val)) return '[Circular]';
      cache.add(val);
      const obj = Array.isArray(val) ? [] : {};

      for (const idx in val) {
        obj[idx] = this.replaceCircularReferenceInResponse(val[idx], cache);
      }

      cache.delete(val);
      return obj;
    }

    return val;
  };

  return Route;
}();

Route = __decorate([inversify_1.injectable(), __metadata("design:paramtypes", [Function, Object, Array, Object])], Route);
exports.Route = Route;

/***/ }),

/***/ "./src/Core/Providers/Http/Controller/index.ts":
/*!*****************************************************!*\
  !*** ./src/Core/Providers/Http/Controller/index.ts ***!
  \*****************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Controller */ "./src/Core/Providers/Http/Controller/Controller.ts"), exports);

__exportStar(__webpack_require__(/*! ./ControllerServiceProvider */ "./src/Core/Providers/Http/Controller/ControllerServiceProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./DataTransferObject */ "./src/Core/Providers/Http/Controller/DataTransferObject.ts"), exports);

__exportStar(__webpack_require__(/*! ./Decorators */ "./src/Core/Providers/Http/Controller/Decorators/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Middleware */ "./src/Core/Providers/Http/Controller/Middleware.ts"), exports);

__exportStar(__webpack_require__(/*! ./Route */ "./src/Core/Providers/Http/Controller/Route.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/Server/Server.ts":
/*!**************************************************!*\
  !*** ./src/Core/Providers/Http/Server/Server.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Server = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const chalk_console_1 = __importDefault(__webpack_require__(/*! chalk-console */ "chalk-console"));

const fastify_1 = __importDefault(__webpack_require__(/*! fastify */ "fastify"));

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const middie_1 = __importDefault(__webpack_require__(/*! middie */ "middie"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const DecoratorData_1 = __webpack_require__(/*! ../../../DecoratorData */ "./src/Core/DecoratorData.ts");

const HttpContext_1 = __webpack_require__(/*! ../Context/HttpContext */ "./src/Core/Providers/Http/Context/HttpContext.ts");

const ControllerServiceProvider_1 = __webpack_require__(/*! ../Controller/ControllerServiceProvider */ "./src/Core/Providers/Http/Controller/ControllerServiceProvider.ts");

const Route_1 = __webpack_require__(/*! ../Controller/Route */ "./src/Core/Providers/Http/Controller/Route.ts");

let Server = /*#__PURE__*/function () {
  function Server() {}

  var _proto = Server.prototype;

  /**
   * Initialise fastify, add all routes to the application and apply any middlewares
   */
  _proto.build = function build() {
    return __awaiter(this, void 0, void 0, function* () {
      if (this._app) throw new Error('Server has already been built');
      this._app = fastify_1.default({//logger : true
      });
      yield this._app.register(middie_1.default);

      this._app.addHook('onError', (request, reply, error, done) => {
        chalk_console_1.default.error(error);
        done();
      }); // The very first middleware to be invoked
      // it creates a new httpContext and attaches it to the
      // current request as metadata using Reflect
      //		this._app.addHook('preHandler', async (request: FastifyRequest, response: FastifyReply) => {
      //
      //
      //			Reflect.defineMetadata(
      //				METADATA.HTTP_CONTEXT,
      //				(new HttpContext(request, response)).prepare(),
      //				request
      //			);
      //		});


      this._app.addHook('preHandler', (request, response, done) => {
        new HttpContext_1.HttpContext(request, response).bind(done);
      });

      this.registerPlugins();
      this.registerControllers();
      return this._app;
    });
  }
  /**
   * Register all controller routes inside fastify
   *
   * @private
   */
  ;

  _proto.registerControllers = function registerControllers() {
    this._app.register((instance, opts, done) => {
      this.controllerProvider.allControllers().forEach(controller => {
        const controllerMetadata = controller.getMetadata();
        const methodMetadata = controller.getMethodMetadata();

        if (controllerMetadata && methodMetadata) {
          methodMetadata.forEach(metadata => {
            const appRoute = new Route_1.Route(controller.constructor, controllerMetadata, methodMetadata, metadata);

            _Core_1.Log.info(`Route Loaded: ${controller.constructor.name}(${metadata.method.toUpperCase()} ${appRoute.getRoutePath()})`);

            this._app[metadata.method](...appRoute.getFastifyRouteOptions());
          });
        }
      });
      done();
    });
  };

  _proto.cleanUpMetadata = function cleanUpMetadata() {
    Reflect.defineMetadata(DecoratorData_1.METADATA.CONTROLLER, [], Reflect);
  };

  _proto.registerPlugins = function registerPlugins() {
    const providers = _Config_1.Config.serverProviders;
    providers.forEach(provider => {
      this._app.register(provider[0], provider[1]);
    });
  };

  _createClass(Server, [{
    key: "app",
    get: function () {
      return this._app;
    }
  }]);

  return Server;
}();

__decorate([inversify_1.inject(ControllerServiceProvider_1.ControllerServiceProvider), __metadata("design:type", ControllerServiceProvider_1.ControllerServiceProvider
/**
 * Initialise fastify, add all routes to the application and apply any middlewares
 */
)], Server.prototype, "controllerProvider", void 0);

Server = __decorate([inversify_1.injectable()], Server);
exports.Server = Server;

/***/ }),

/***/ "./src/Core/Providers/Http/Server/ServerServiceProvider.ts":
/*!*****************************************************************!*\
  !*** ./src/Core/Providers/Http/Server/ServerServiceProvider.ts ***!
  \*****************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ServerServiceProvider = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Server_1 = __webpack_require__(/*! ./Server */ "./src/Core/Providers/Http/Server/Server.ts");

let ServerServiceProvider = /*#__PURE__*/function (_Core_1$ServiceProvid) {
  _inheritsLoose(ServerServiceProvider, _Core_1$ServiceProvid);

  function ServerServiceProvider() {
    return _Core_1$ServiceProvid.apply(this, arguments) || this;
  }

  var _proto = ServerServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    _Core_1.Container.bind(Server_1.Server).to(Server_1.Server).inSingletonScope();
  };

  _proto.boot = function boot() {
    return __awaiter(this, void 0, void 0, function* () {});
  };

  _proto.run = function run() {
    return __awaiter(this, void 0, void 0, function* () {
      this.server = _Core_1.Container.get(Server_1.Server);
      this.httpServer = yield this.server.build();
      yield this.httpServer.listen(3000);

      _Core_1.Log.success('Server is running at http://127.0.0.1:3000');
    });
  };

  return ServerServiceProvider;
}(_Core_1.ServiceProvider);

ServerServiceProvider = __decorate([inversify_1.injectable()], ServerServiceProvider);
exports.ServerServiceProvider = ServerServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Http/Server/index.ts":
/*!*************************************************!*\
  !*** ./src/Core/Providers/Http/Server/index.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Server */ "./src/Core/Providers/Http/Server/Server.ts"), exports);

__exportStar(__webpack_require__(/*! ./ServerServiceProvider */ "./src/Core/Providers/Http/Server/ServerServiceProvider.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Http/index.ts":
/*!******************************************!*\
  !*** ./src/Core/Providers/Http/index.ts ***!
  \******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Context/Request */ "./src/Core/Providers/Http/Context/Request/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Context/Response */ "./src/Core/Providers/Http/Context/Response/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Context */ "./src/Core/Providers/Http/Context/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Controller/Decorators */ "./src/Core/Providers/Http/Controller/Decorators/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Controller */ "./src/Core/Providers/Http/Controller/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Server */ "./src/Core/Providers/Http/Server/index.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Log/Log.ts":
/*!***************************************!*\
  !*** ./src/Core/Providers/Log/Log.ts ***!
  \***************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Log = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let Log = /*#__PURE__*/function () {
  function Log() {}

  Log.log = function log(message, ...args) {
    //@ts-ignore
    if (global.disableConsoleLogs) {
      return;
    }

    _Core_1.resolve(_Core_1.LOGGER_IDENTIFIER).log('log', message, Object.assign({}, args));
  };

  Log.success = function success(message, ...args) {
    //@ts-ignore
    if (global.disableConsoleLogs) {
      return;
    }

    _Core_1.resolve(_Core_1.LOGGER_IDENTIFIER).log('success', message, Object.assign({}, args));
  };

  Log.warn = function warn(message, ...args) {
    //@ts-ignore
    if (global.disableConsoleLogs) {
      return;
    }

    _Core_1.resolve(_Core_1.LOGGER_IDENTIFIER).warn(message, Object.assign({}, args));
  };

  Log.error = function error(message, ...args) {
    //@ts-ignore
    if (global.disableConsoleLogs) {
      return;
    }

    _Core_1.resolve(_Core_1.LOGGER_IDENTIFIER).error(message, Object.assign({}, args));
  };

  Log.info = function info(message, ...args) {
    //@ts-ignore
    if (global.disableConsoleLogs) {
      return;
    }

    _Core_1.resolve(_Core_1.LOGGER_IDENTIFIER).info(message, Object.assign({}, args));
  };

  return Log;
}();

Log = __decorate([inversify_1.injectable()], Log);
exports.Log = Log;

/***/ }),

/***/ "./src/Core/Providers/Log/LogServiceProvider.ts":
/*!******************************************************!*\
  !*** ./src/Core/Providers/Log/LogServiceProvider.ts ***!
  \******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __rest = this && this.__rest || function (s, e) {
  var t = {};

  for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0) t[p] = s[p];

  if (s != null && typeof Object.getOwnPropertySymbols === "function") for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
    if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i])) t[p[i]] = s[p[i]];
  }
  return t;
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.LogServiceProvider = void 0;

const chalk_1 = __importDefault(__webpack_require__(/*! chalk */ "chalk"));

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const winston_1 = __webpack_require__(/*! winston */ "winston");

const winston_daily_rotate_file_1 = __importDefault(__webpack_require__(/*! winston-daily-rotate-file */ "winston-daily-rotate-file"));

const {
  combine,
  timestamp,
  label,
  prettyPrint,
  printf,
  colorize,
  cli,
  ms
} = winston_1.format;

let LogServiceProvider = /*#__PURE__*/function (_Core_1$ServiceProvid) {
  _inheritsLoose(LogServiceProvider, _Core_1$ServiceProvid);

  function LogServiceProvider() {
    return _Core_1$ServiceProvid.apply(this, arguments) || this;
  }

  var _proto = LogServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    const rotateFile = new winston_daily_rotate_file_1.default({
      dirname: "./storage/logs",
      filename: "%DATE%-app.log",
      format: combine(winston_1.format.timestamp({
        format: 'M/D HH:mm:ss.SSS'
      }), winston_1.format.ms(), printf(_a => {
        var {
          level,
          message,
          label,
          ms,
          timestamp
        } = _a,
            metadata = __rest(_a, ["level", "message", "label", "ms", "timestamp"]);

        if (ms) {
          if (ms.replace("ms", "").replace("+", "").replace("s", "") > 100) {
            ms = `${ms}`;
          } else {
            ms = `${ms}`;
          }
        }

        let msg = `[${timestamp}][${level} ${ms}] : ${message}`;

        if (metadata && Object.keys(metadata).length) {
          try {
            msg += '\n';
            msg += JSON.stringify(metadata, null, "    ");
          } catch (error) {}
        }

        return msg;
      })),
      zippedArchive: true,
      maxSize: "20m",
      maxFiles: "14d"
    });
    const myFormat = printf(_a => {
      var {
        level,
        message,
        label,
        ms,
        timestamp
      } = _a,
          metadata = __rest(_a, ["level", "message", "label", "ms", "timestamp"]);

      if (ms) {
        if (ms.replace("ms", "").replace("+", "").replace("s", "") > 100) {
          ms = chalk_1.default.redBright`${ms}`;
        } else {
          ms = chalk_1.default.greenBright`${ms}`;
        }
      }

      timestamp = chalk_1.default.gray(`[${timestamp}]`);
      let levelColor = chalk_1.default.white;
      let messageColor = chalk_1.default.white;

      switch (level) {
        case 'log':
          levelColor = chalk_1.default.bgGray.whiteBright.bold;
          break;

        case 'warn':
          levelColor = chalk_1.default.bgYellow.whiteBright.bold;
          break;

        case 'error':
          levelColor = chalk_1.default.bgRed.whiteBright.bold;
          break;

        case 'success':
          levelColor = chalk_1.default.bgGreen.whiteBright.bold;
          break;

        case 'info':
          levelColor = chalk_1.default.bgBlue.whiteBright.bold;
          break;
      }

      switch (level) {
        case 'log':
          messageColor = chalk_1.default.gray;
          break;

        case 'warn':
          messageColor = chalk_1.default.yellow;
          break;

        case 'error':
          messageColor = chalk_1.default.red;
          break;

        case 'success':
          messageColor = chalk_1.default.green;
          break;

        case 'info':
          messageColor = chalk_1.default.blue;
          break;
      }

      level = levelColor` ${level.toUpperCase()} `;
      const levelWrap = chalk_1.default.gray`${level}`;
      message = messageColor`${message}`;
      let msg = `${timestamp} ${levelWrap} ${message} ${ms}`;

      if (metadata && Object.keys(metadata).length) {
        try {
          msg += '\n';
          msg += JSON.stringify(metadata, null, "    ");
        } catch (error) {}
      }

      return msg;
    });
    const cliTransport = new winston_1.transports.Console({
      handleExceptions: true,
      format: combine(winston_1.format.timestamp({
        format: 'HH:mm:ss'
      }), ms(), myFormat)
    });
    const logger = winston_1.createLogger({
      levels: {
        debug: 0,
        success: 1,
        info: 2,
        warn: 3,
        error: 4
      },
      level: 'error',
      exitOnError: false,
      handleExceptions: false,
      exceptionHandlers: [cliTransport, rotateFile],
      transports: [cliTransport, rotateFile]
    });

    _Core_1.Container.bind(_Core_1.LOGGER_IDENTIFIER).toConstantValue(logger);

    _Core_1.Log.info('...');

    _Core_1.Log.info('...');

    _Core_1.Log.success('Application is booting...');
  };

  _proto.boot = function boot() {};

  return LogServiceProvider;
}(_Core_1.ServiceProvider);

LogServiceProvider = __decorate([inversify_1.injectable()], LogServiceProvider);
exports.LogServiceProvider = LogServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Log/index.ts":
/*!*****************************************!*\
  !*** ./src/Core/Providers/Log/index.ts ***!
  \*****************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Log */ "./src/Core/Providers/Log/Log.ts"), exports);

__exportStar(__webpack_require__(/*! ./LogServiceProvider */ "./src/Core/Providers/Log/LogServiceProvider.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Model/ModelEntity.ts":
/*!*************************************************!*\
  !*** ./src/Core/Providers/Model/ModelEntity.ts ***!
  \*************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

var ModelEntity_1;
Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ModelEntity = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const pluralize_1 = __importDefault(__webpack_require__(/*! pluralize */ "pluralize"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Container_1 = __importDefault(__webpack_require__(/*! ../../Container */ "./src/Core/Container.ts")); //export function model<T extends ModelEntity<T>>(constructor: T) {
////	return class extends constructor {
////
////		static repository(): Repository<T> {
////			return Container.get<Repository<T>>(this.constructor);
////		}
////
////	};
//	Reflect.defineMetadata(METADATA.MODEL, {type : constructor}, constructor);
//
////	Object.defineProperty(constructor.constructor.prototype, 'where', (attributes : Partial<T>) => {
////		const meta = Reflect.getMetadata(METADATA.MODEL, this);
////
////		console.log(meta);
////	})
//
////	return function(descriptor : any) {
////
////	}
//}


let ModelEntity = ModelEntity_1 = /*#__PURE__*/function () {
  function ModelEntity() {
    /**
     * We'll store the result of the recent mongo request if there
     * is one. This way we always have access to it, and can return
     * generic true/false types of responses for some operations.
     */
    this._recentMongoResponse = null;
    this._queryBuilder = new _Core_1.QueryBuilder(this);
  }

  var _proto = ModelEntity.prototype;

  _proto.queryBuilder = function queryBuilder() {
    return this._queryBuilder;
  }
  /**
   * A helper method used to return a correct type...
   * We're still getting used to generics.
   *
   * @private
   */
  ;

  _proto.modelInstance = function modelInstance() {
    return this;
  }
  /**
   * Get an instance of the mongo repository
   */
  ;

  _proto.repository = function repository() {
    return Container_1.default.get(this.constructor);
  }
  /**
   * Save any changes made to the model
   *
   * For ex:
   * const user = await User.find(123);
   * user.name = 'Sam';
   * await user.save()
   *
   * @return this
   */
  ;

  _proto.save = function save() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.repository().save(this.modelInstance());
      return this;
    });
  };

  _proto.refresh = function refresh() {
    return __awaiter(this, void 0, void 0, function* () {
      const newVersion = yield this.repository().findById(this._id);
      Object.assign(this, newVersion);
    });
  }
  /**
   * Delete the current model instance from the collection
   */
  ;

  _proto.delete = function _delete() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.repository().remove(this.modelInstance());
    });
  };

  ModelEntity.count = function count() {
    return __awaiter(this, void 0, void 0, function* () {
      return this.where({}).count();
    });
  }
  /**
   * Get an instance of query builder, similar to using collection.find()
   * But... our query builder returns a couple of helper methods, first(), get()
   * {@see QueryBuilder}
   *
   * @param attributes
   */
  ;

  ModelEntity.where = function where(attributes) {
    //		const builder = new QueryBuilder<T>(new this());
    const model = new this();
    return model.queryBuilder().where(attributes);
  };

  ModelEntity.with = function _with(...refs) {
    const model = new this();
    return model.queryBuilder().with(...refs);
  }
  /**
   * Find an item using it's id and return it as a model.
   *
   * @param id
   */
  ;

  ModelEntity.find = function find(id) {
    const model = new this(); //		const builder = new QueryBuilder<T>(model);

    return model.repository().findById(id); //		return builder
    //			.
    //			.where<T>({_id : new ObjectId(id)})
    //			.first();
  }
  /**
   * Basically an alias of the {@see QueryBuilder.orderByDesc()}
   * that allows us to order and call get() or first()
   *
   * @param key
   */
  ;

  ModelEntity.orderByDesc = function orderByDesc(key) {
    return new _Core_1.QueryBuilder(new this()).orderByDesc(key);
  }
  /**
   * Basically an alias of the {@see QueryBuilder.orderByAsc()}
   * that allows us to order and call get() or first()
   *
   * @param key
   */
  ;

  ModelEntity.orderByAsc = function orderByAsc(key) {
    return new _Core_1.QueryBuilder(new this()).orderByAsc(key);
  }
  /**
   * Create a new instance of this model and store it in the collection
   *
   * @TODO: Need to figure a solution for using generics with static methods.
   *
   * @param {Partial<M>} attributes
   */
  ;

  ModelEntity.create = function create(attributes) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.query().insert(attributes);
      return yield this.find(attributes['_id']);
    });
  }
  /**
   * Get an instance of the underlying mongo repository for this model
   */
  ;

  ModelEntity.query = function query() {
    //@ts-ignore
    return Container_1.default.get(this);
  };

  _proto.mongoResponse = function mongoResponse() {
    return this._recentMongoResponse;
  };

  _proto.setMongoResponse = function setMongoResponse(response) {
    this._recentMongoResponse = response;
  }
  /**
   * Will return a correctly formatted name for the underlying mongo collection
   */
  ;

  _proto.collectionName = function collectionName(many = false) {
    return ModelEntity_1.formatNameForCollection(this.constructor.name, many);
  };

  ModelEntity.formatNameForCollection = function formatNameForCollection(str, many = false) {
    return String(pluralize_1.default(str, many ? 2 : 1)).toLowerCase();
  }
  /**
   * When this model instance is returned in a
   * response, we'll make sure to use classToPlain so
   * that any @Exclude() properties etc are taken care of.
   */
  ;

  _proto.toJSON = function toJSON() {
    return class_transformer_1.classToPlain(this.modelInstance(), _Config_1.Config.http.responseSerialization);
  };

  return ModelEntity;
}();

ModelEntity = ModelEntity_1 = __decorate([inversify_1.injectable(), __metadata("design:paramtypes", [])], ModelEntity);
exports.ModelEntity = ModelEntity;

/***/ }),

/***/ "./src/Core/Providers/Model/ModelServiceProvider.ts":
/*!**********************************************************!*\
  !*** ./src/Core/Providers/Model/ModelServiceProvider.ts ***!
  \**********************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ModelServiceProvider = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const glob_1 = __webpack_require__(/*! glob */ "glob");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");

const path_1 = __importDefault(__webpack_require__(/*! path */ "path"));

const pluralize_1 = __importDefault(__webpack_require__(/*! pluralize */ "pluralize"));

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const Container_1 = __importDefault(__webpack_require__(/*! ../../Container */ "./src/Core/Container.ts"));

const ServiceProvider_1 = __webpack_require__(/*! ../ServiceProvider */ "./src/Core/Providers/ServiceProvider.ts");

let ModelServiceProvider = /*#__PURE__*/function (_ServiceProvider_1$Se) {
  _inheritsLoose(ModelServiceProvider, _ServiceProvider_1$Se);

  function ModelServiceProvider() {
    var _this;

    _this = _ServiceProvider_1$Se.apply(this, arguments) || this;
    _this.models = [];
    return _this;
  }

  var _proto = ModelServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    return __awaiter(this, void 0, void 0, function* () {
      const models = this.getModels();

      for (let model of models) {
        try {
          const module = yield Promise.resolve().then(() => __importStar(__webpack_require__("./src/App/Models sync recursive ^\\.\\/.*$")(`./${model.location}`)));
          this.loadModel(module, model.name);
        } catch (error) {
          _Core_1.Log.warn('[' + this.constructor.name + '] Failed to load model: ' + model.originalLocation);

          _Core_1.Log.error(error);
        }
      }
    });
  };

  _proto.boot = function boot() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.setupDatabase();
      this.setupEntityRepositories();
    });
  };

  _proto.getModels = function getModels() {
    const models = glob_1.glob.sync(path_1.default.join('src', 'App', 'Models', '**', '*.ts'), {
      follow: true
    });
    return models.map(model => {
      const location = model.replace('src/App/Models/', '').replace('.ts', '');
      const name = location.split('/').pop();
      return {
        name,
        location,
        import: `@App/Models/${location}`,
        originalLocation: model
      };
    });
  };

  _proto.setupDatabase = function setupDatabase() {
    return __awaiter(this, void 0, void 0, function* () {
      const client = new mongodb_1.MongoClient(_Config_1.Config.database.mongo.connectionUrl, {
        useNewUrlParser: true,
        useUnifiedTopology: true
      });
      const connection = yield client.connect();
      Container_1.default.bind(mongodb_1.MongoClient).toConstantValue(connection);
    });
  };

  _proto.setupEntityRepositories = function setupEntityRepositories() {
    const models = Container_1.default.getAll(_Core_1.ModelEntity);

    for (let model of models) {
      const repository = new _Core_1.Repository(model.constructor, Container_1.default.get(mongodb_1.MongoClient), pluralize_1.default(model.constructor.name.toLowerCase()));
      Container_1.default.bind(model.constructor).toConstantValue(repository);
    }
  };

  _proto.loadModel = function loadModel(module, loc) {
    const modelName = Object.keys(module)[0] || null;

    if (!modelName) {
      throw new Error('There was an error loading model: ' + loc);
    }

    const model = module[modelName];
    Container_1.default.bind(_Core_1.ModelEntity).to(model).whenTargetNamed(modelName);

    _Core_1.Log.info('Model loaded: ' + loc);
  };

  _proto.modelExists = function modelExists(name) {
    return this.models.find(model => model.name === name);
  };

  return ModelServiceProvider;
}(ServiceProvider_1.ServiceProvider);

ModelServiceProvider = __decorate([inversify_1.injectable()], ModelServiceProvider);
exports.ModelServiceProvider = ModelServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Model/QueryBuilder.ts":
/*!**************************************************!*\
  !*** ./src/Core/Providers/Model/QueryBuilder.ts ***!
  \**************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.QueryBuilder = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let QueryBuilder = /*#__PURE__*/function () {
  function QueryBuilder(model) {
    this._collectionFilter = null;
    this._collectionAggregation = [];
    this._collectionOrder = null;
    this._model = model;
  }
  /**
   * Similar to using collection.find()
   *
   * @param attributes
   */


  var _proto = QueryBuilder.prototype;

  _proto.where = function where(attributes) {
    this._collectionFilter = attributes;
    return this;
  };

  _proto.with = function _with(...refsToLoad) {
    const refs = Reflect.getMetadata('mongo:refs', this._model) || {};

    for (let ref of refsToLoad) {
      const refInfo = refs[ref];

      if (!refInfo) {
        throw new _Core_1.InvalidRefSpecified(this._model.constructor.name, String(ref));
      }

      this._collectionAggregation.push({
        $lookup: {
          from: _Core_1.ModelEntity.formatNameForCollection(refInfo.modelName, true),
          localField: refInfo._id,
          foreignField: '_id',
          as: ref
        }
      });

      if (!refInfo.array) {
        this._collectionAggregation.push({
          $unwind: {
            path: '$' + _Core_1.ModelEntity.formatNameForCollection(refInfo.modelName, refInfo.array),
            preserveNullAndEmptyArrays: true
          }
        });
      }
    }

    return this;
  }
  /**
   * Allows us to specify an order of descending, which is applied to the cursor
   *
   * @param key
   */
  ;

  _proto.orderByDesc = function orderByDesc(key) {
    this._collectionOrder = {
      key: String(key),
      direction: -1
    };
    return this;
  }
  /**
   * Allows us to specify an order of ascending, which is applied to the cursor
   *
   * @param key
   */
  ;

  _proto.orderByAsc = function orderByAsc(key) {
    this._collectionOrder = {
      key: String(key),
      direction: 1
    };
    return this;
  }
  /**
   * When a filter has been specified with where(). It will apply to
   * {@see _collectionFilter} then when we make other calls, like
   * .get(), .first() or .count() it will resolve the cursor
   * or use it to make further mongodb calls.
   *
   * @private
   */
  ;

  _proto.resolveFilter = function resolveFilter() {
    var _a, _b;

    const options = {};

    if (this._collectionOrder && ((_a = this._collectionOrder) === null || _a === void 0 ? void 0 : _a.direction)) {
      options.sort = {};
      options.sort[this._collectionOrder.key] = this._collectionOrder.direction;
    }

    if ((_b = this._collectionAggregation) === null || _b === void 0 ? void 0 : _b.length) {
      const aggregation = [{
        $match: this._collectionFilter
      }, ...this._collectionAggregation];
      this._builderResult = this._model.repository().c.aggregate(aggregation);
      return this._builderResult;
    }

    this._builderResult = this._model.repository().c.find(this._collectionFilter, options);
    return this._builderResult;
  }
  /**
   * Get the first result in the mongo Cursor
   */
  ;

  _proto.first = function first() {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.resolveFilter();
      const result = yield this._builderResult.limit(1).next();
      if (!result) return null;
      return this._model.repository().hydrate(result);
    });
  }
  /**
   * Get all items from the collection that match the query
   */
  ;

  _proto.get = function get() {
    return __awaiter(this, void 0, void 0, function* () {
      const cursor = yield this.resolveFilter();
      const results = yield cursor.toArray();
      return results.map(result => this._model.repository().hydrate(result));
    });
  }
  /**
   * Update many items in the collection, will use the filter specified by .where()
   * You can specify {returnMongoResponse : true} in the options to return the mongo result
   * of this operation, otherwise, this method will return true/false if it succeeded or failed.
   *
   * @param attributes
   * @param options
   * @return boolean | UpdateWriteOpResult
   */
  ;

  _proto.update = function update(attributes, options) {
    var _a;

    return __awaiter(this, void 0, void 0, function* () {
      const response = yield this._model.repository().c.updateMany(this._collectionFilter, {
        $set: attributes
      }, options);

      if (options === null || options === void 0 ? void 0 : options.returnMongoResponse) {
        return response;
      }

      this._model.setMongoResponse(response);

      return !!((_a = response === null || response === void 0 ? void 0 : response.result) === null || _a === void 0 ? void 0 : _a.ok);
    });
  }
  /**
   * Get an instance of the underlying mongo cursor
   */
  ;

  _proto.cursor = function cursor() {
    return __awaiter(this, void 0, void 0, function* () {
      return this._builderResult;
    });
  }
  /**
   * Returns the count of items, filters if one was specified with .where()
   */
  ;

  _proto.count = function count() {
    return this._model.repository().count(this._collectionFilter);
  };

  return QueryBuilder;
}();

exports.QueryBuilder = QueryBuilder;

/***/ }),

/***/ "./src/Core/Providers/Model/Repository.ts":
/*!************************************************!*\
  !*** ./src/Core/Providers/Model/Repository.ts ***!
  \************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } }

function _createClass(Constructor, protoProps, staticProps) { if (protoProps) _defineProperties(Constructor.prototype, protoProps); if (staticProps) _defineProperties(Constructor, staticProps); return Constructor; }

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Repository = exports.dehydrate = void 0;

const class_transformer_1 = __webpack_require__(/*! class-transformer */ "class-transformer");

const mongodb_1 = __webpack_require__(/*! mongodb */ "mongodb");

function dehydrate(entity) {
  // const plain = classToPlain(entity) as any;
  if (!entity) return entity;
  const refs = Reflect.getMetadata('mongo:refs', entity) || {};

  for (let name in refs) {
    const ref = refs[name];
    const reffedEntity = entity[name];

    if (reffedEntity) {
      if (ref.array) {
        entity[ref._id] = reffedEntity.map(e => new mongodb_1.ObjectId(e._id));
        continue;
      }

      entity[ref._id] = new mongodb_1.ObjectId(reffedEntity._id);
    }
  }

  const plain = Object.assign({}, entity);

  for (let name in refs) {
    delete plain[name];
  }

  const nested = Reflect.getMetadata('mongo:nested', entity) || [];

  for (let {
    name,
    array
  } of nested) {
    if (plain[name]) {
      if (!array) {
        plain[name] = dehydrate(plain[name]);
      } else {
        plain[name] = plain[name].map(e => dehydrate(e));
      }
    }
  }

  const ignores = Reflect.getMetadata('mongo:ignore', entity) || {};

  for (const name in ignores) {
    delete plain[name];
  }

  return plain;
}

exports.dehydrate = dehydrate;

let Repository = /*#__PURE__*/function () {
  function Repository(Type, mongo, collection, options = {}) {
    this.Type = Type;
    this.collection = mongo.db(options.databaseName).collection(collection);
    if (options.autoIndex) this.createIndexes(true);
  }
  /**
   * Underlying mongodb collection (use with caution)
   * any of methods from this will not return hydrated objects
   */


  var _proto = Repository.prototype;

  _proto.createIndexes = function createIndexes(forceBackground = false) {
    return __awaiter(this, void 0, void 0, function* () {
      const indexes = Reflect.getMetadata('mongo:indexes', this.Type.prototype) || [];
      if (indexes.length == 0) return null;

      if (forceBackground) {
        for (let index of indexes) {
          index.background = true;
        }
      }

      return this.collection.createIndexes(indexes);
    });
  };

  _proto.insert = function insert(entity) {
    return __awaiter(this, void 0, void 0, function* () {
      const plain = dehydrate(entity);
      const res = yield this.collection.insertOne(plain);
      entity._id = res.insertedId;
    });
  };

  _proto.update = function update(entity, options = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      const plain = dehydrate(entity);
      yield this.collection.replaceOne({
        _id: entity._id //(entity as any)[this.idField]

      }, plain, options);
    });
  };

  _proto.save = function save(entity) {
    return __awaiter(this, void 0, void 0, function* () {
      if (!entity._id) yield this.insert(entity);else yield this.update(entity);
    });
  };

  _proto.findOne = function findOne(query = {}) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.hydrate(yield this.collection.findOne(query));
    });
  };

  _proto.findById = function findById(id) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.findOne({
        _id: new mongodb_1.ObjectId(id)
      });
    });
  };

  _proto.findManyById = function findManyById(ids) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.find({
        _id: {
          $in: ids.map(id => new mongodb_1.ObjectId(id))
        }
      }).toArray();
    });
  };

  _proto.remove = function remove(entity) {
    return __awaiter(this, void 0, void 0, function* () {
      yield this.c.deleteOne({
        _id: entity._id
      });
    });
  }
  /**
   * calls mongodb.find function and returns its cursor with attached map function that hydrates results
   * mongodb.find: http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#find
   */
  ;

  _proto.find = function find(query, options) {
    return this.collection.find(query, options).map(doc => this.hydrate(doc));
  }
  /**
   * Gets the number of documents matching the filter.
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#estimatedDocumentCount
   * http://mongodb.github.io/node-mongodb-native/3.1/api/Collection.html#countDocuments
   * @returns integer
   * @param query
   */
  ;

  _proto.count = function count(query) {
    return __awaiter(this, void 0, void 0, function* () {
      return this.collection.countDocuments(query);
    });
  };

  _proto.hydrate = function hydrate(plain) {
    return plain ? class_transformer_1.plainToClass(this.Type, plain) : null;
  };

  _createClass(Repository, [{
    key: "c",
    get: function () {
      return this.collection;
    }
  }]);

  return Repository;
}();

exports.Repository = Repository;

/***/ }),

/***/ "./src/Core/Providers/Model/index.ts":
/*!*******************************************!*\
  !*** ./src/Core/Providers/Model/index.ts ***!
  \*******************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./ModelEntity */ "./src/Core/Providers/Model/ModelEntity.ts"), exports);

__exportStar(__webpack_require__(/*! ./ModelServiceProvider */ "./src/Core/Providers/Model/ModelServiceProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./QueryBuilder */ "./src/Core/Providers/Model/QueryBuilder.ts"), exports);

__exportStar(__webpack_require__(/*! ./Repository */ "./src/Core/Providers/Model/Repository.ts"), exports);

__exportStar(__webpack_require__(/*! ./interfaces */ "./src/Core/Providers/Model/interfaces.ts"), exports);

/***/ }),

/***/ "./src/Core/Providers/Model/interfaces.ts":
/*!************************************************!*\
  !*** ./src/Core/Providers/Model/interfaces.ts ***!
  \************************************************/
/***/ ((__unused_webpack_module, exports) => {

"use strict";


Object.defineProperty(exports, "__esModule", ({
  value: true
}));

/***/ }),

/***/ "./src/Core/Providers/ServiceProvider.ts":
/*!***********************************************!*\
  !*** ./src/Core/Providers/ServiceProvider.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.ServiceProvider = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

let ServiceProvider = function ServiceProvider() {};

ServiceProvider = __decorate([inversify_1.injectable()], ServiceProvider);
exports.ServiceProvider = ServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Storage/Storage.ts":
/*!***********************************************!*\
  !*** ./src/Core/Providers/Storage/Storage.ts ***!
  \***********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.Storage = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

let Storage = /*#__PURE__*/function () {
  function Storage() {}

  Storage.defaultProvider = function defaultProvider() {
    if (!_Core_1.Container.isBound(_Config_1.Config.storage.defaultProvider)) return null;
    return _Core_1.resolve(_Config_1.Config.storage.defaultProvider);
  };

  Storage.files = function files(directory) {
    return this.defaultProvider().files(directory);
  };

  Storage.directories = function directories(directory) {
    return this.defaultProvider().directories(directory);
  };

  Storage.makeDirectory = function makeDirectory(directory) {
    return this.defaultProvider().makeDirectory(directory);
  };

  Storage.deleteDirectory = function deleteDirectory(directory) {
    return this.defaultProvider().deleteDirectory(directory);
  };

  Storage.fileExists = function fileExists(key) {
    return this.defaultProvider().fileExists(key);
  };

  Storage.get = function get(location) {
    return this.defaultProvider().get(location);
  };

  Storage.put = function put(location, file) {
    return this.defaultProvider().put(location, file);
  };

  Storage.remove = function remove(location) {
    return this.defaultProvider().remove(location);
  };

  Storage.url = function url(location) {
    return this.defaultProvider().url(location);
  };

  Storage.temporaryUrl = function temporaryUrl(location, expiresInSeconds) {
    return this.defaultProvider().temporaryUrl(location, expiresInSeconds);
  };

  return Storage;
}();

Storage = __decorate([inversify_1.injectable()], Storage);
exports.Storage = Storage;

/***/ }),

/***/ "./src/Core/Providers/Storage/StorageProvider.ts":
/*!*******************************************************!*\
  !*** ./src/Core/Providers/Storage/StorageProvider.ts ***!
  \*******************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StorageProvider = void 0;

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

let StorageProvider = function StorageProvider() {};

StorageProvider = __decorate([inversify_1.injectable()], StorageProvider);
exports.StorageProvider = StorageProvider;

/***/ }),

/***/ "./src/Core/Providers/Storage/StorageProviders/SpacesProvider.ts":
/*!***********************************************************************!*\
  !*** ./src/Core/Providers/Storage/StorageProviders/SpacesProvider.ts ***!
  \***********************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __setModuleDefault = this && this.__setModuleDefault || (Object.create ? function (o, v) {
  Object.defineProperty(o, "default", {
    enumerable: true,
    value: v
  });
} : function (o, v) {
  o["default"] = v;
});

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __importStar = this && this.__importStar || function (mod) {
  if (mod && mod.__esModule) return mod;
  var result = {};
  if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);

  __setModuleDefault(result, mod);

  return result;
};

var __metadata = this && this.__metadata || function (k, v) {
  if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.SpacesProvider = void 0;

const _Config_1 = __webpack_require__(/*! @Config */ "./src/Config/index.ts");

const aws_sdk_1 = __webpack_require__(/*! aws-sdk */ "aws-sdk");

const fs = __importStar(__webpack_require__(/*! fs */ "fs"));

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const stream_1 = __webpack_require__(/*! stream */ "stream");

const util = __importStar(__webpack_require__(/*! util */ "util"));

const pump = util.promisify(stream_1.pipeline);

let SpacesProvider = /*#__PURE__*/function (_Core_1$StorageProvid) {
  _inheritsLoose(SpacesProvider, _Core_1$StorageProvid);

  function SpacesProvider() {
    var _this;

    _this = _Core_1$StorageProvid.call(this) || this;
    _this.spaces = new aws_sdk_1.S3(_Config_1.Config.storage.spaces);
    return _this;
  }

  var _proto = SpacesProvider.prototype;

  _proto.files = function files(directory) {
    if (!directory.endsWith('/')) {
      directory += '/';
    }

    return new Promise((resolve, reject) => {
      this.spaces.listObjectsV2({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        //Delimiter : '/',
        Prefix: directory
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(data);
      });
    });
  };

  _proto.directories = function directories(directory) {
    if (!directory.endsWith('/')) {
      directory += '/';
    }

    return new Promise((resolve, reject) => {
      this.spaces.listObjectsV2({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Delimiter: directory //				Prefix : directory

      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(data.CommonPrefixes.map(d => d.Prefix));
      });
    });
  };

  _proto.makeDirectory = function makeDirectory(directory) {
    if (!directory.endsWith('/')) {
      directory += '/';
    }

    return new Promise((resolve, reject) => {
      this.spaces.putObject({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Key: directory,
        Body: '',
        ACL: 'public-read'
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(!!data.ETag);
      });
    });
  };

  _proto.deleteDirectory = function deleteDirectory(directory) {
    if (!directory.endsWith('/')) {
      directory += '/';
    }

    return new Promise((resolve, reject) => {
      this.spaces.deleteObject({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Key: directory
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(data);
      });
    });
  };

  _proto.fileExists = function fileExists(key) {
    return new Promise((resolve, reject) => {
      this.spaces.headObject({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Key: key
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(!!data.ContentLength);
      });
    });
  };

  _proto.get = function get(location) {
    return new Promise((resolve, reject) => {
      this.spaces.getObject({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Key: location
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(Buffer.from(data.Body).toString());
      });
    });
  };

  _proto.put = function put(location, file) {
    return new Promise((resolve, reject) => {
      const extension = file.filename.split(".").pop();
      const newName = _Core_1.Encryption.random() + "." + extension;
      const fileStream = fs.createReadStream(file.filepath);
      const fileKey = location + "/" + (file.storeAs ? file.storeAs : newName);
      this.spaces.putObject({
        ACL: "public-read",
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Key: fileKey,
        Body: fileStream
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve({
          url: `${_Config_1.Config.storage.spaces.url}/${fileKey}`,
          path: fileKey,
          originalName: file.filename
        });
      });
    });
  };

  _proto.remove = function remove(location) {
    return new Promise((resolve, reject) => {
      this.spaces.deleteObject({
        Bucket: _Config_1.Config.storage.spaces.bucket,
        Key: location
      }, (error, data) => {
        if (error) {
          return reject(error);
        }

        resolve(true);
      });
    });
  };

  _proto.url = function url(location) {
    let path = _Config_1.Config.storage.spaces.url;

    if (location.startsWith('/')) {
      location = location.slice(1);
    }

    if (path.endsWith('/')) {
      path = path.slice(0, -1);
    }

    return path + '/' + location;
  };

  _proto.temporaryUrl = function temporaryUrl(location, expiresInSeconds) {
    return this.spaces.getSignedUrlPromise("getObject", {
      Bucket: _Config_1.Config.storage.spaces.bucket,
      Key: location,
      Expires: expiresInSeconds
    });
  };

  return SpacesProvider;
}(_Core_1.StorageProvider);

SpacesProvider = __decorate([inversify_1.injectable(), __metadata("design:paramtypes", [])], SpacesProvider);
exports.SpacesProvider = SpacesProvider;

/***/ }),

/***/ "./src/Core/Providers/Storage/StorageServiceProvider.ts":
/*!**************************************************************!*\
  !*** ./src/Core/Providers/Storage/StorageServiceProvider.ts ***!
  \**************************************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


function _inheritsLoose(subClass, superClass) { subClass.prototype = Object.create(superClass.prototype); subClass.prototype.constructor = subClass; _setPrototypeOf(subClass, superClass); }

function _setPrototypeOf(o, p) { _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) { o.__proto__ = p; return o; }; return _setPrototypeOf(o, p); }

var __decorate = this && this.__decorate || function (decorators, target, key, desc) {
  var c = arguments.length,
      r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc,
      d;
  if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
  return c > 3 && r && Object.defineProperty(target, key, r), r;
};

var __awaiter = this && this.__awaiter || function (thisArg, _arguments, P, generator) {
  function adopt(value) {
    return value instanceof P ? value : new P(function (resolve) {
      resolve(value);
    });
  }

  return new (P || (P = Promise))(function (resolve, reject) {
    function fulfilled(value) {
      try {
        step(generator.next(value));
      } catch (e) {
        reject(e);
      }
    }

    function rejected(value) {
      try {
        step(generator["throw"](value));
      } catch (e) {
        reject(e);
      }
    }

    function step(result) {
      result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected);
    }

    step((generator = generator.apply(thisArg, _arguments || [])).next());
  });
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.StorageServiceProvider = void 0;

const _Core_1 = __webpack_require__(/*! @Core */ "./src/Core/index.ts");

const inversify_1 = __webpack_require__(/*! inversify */ "inversify");

let StorageServiceProvider = /*#__PURE__*/function (_Core_1$ServiceProvid) {
  _inheritsLoose(StorageServiceProvider, _Core_1$ServiceProvid);

  function StorageServiceProvider() {
    return _Core_1$ServiceProvid.apply(this, arguments) || this;
  }

  var _proto = StorageServiceProvider.prototype;

  _proto.registerBindings = function registerBindings() {
    return __awaiter(this, void 0, void 0, function* () {
      _Core_1.Container.bind(_Core_1.SpacesProvider).to(_Core_1.SpacesProvider);

      _Core_1.Container.bind(_Core_1.Storage).to(_Core_1.Storage);
    });
  };

  _proto.boot = function boot() {
    return __awaiter(this, void 0, void 0, function* () {});
  };

  return StorageServiceProvider;
}(_Core_1.ServiceProvider);

StorageServiceProvider = __decorate([inversify_1.injectable()], StorageServiceProvider);
exports.StorageServiceProvider = StorageServiceProvider;

/***/ }),

/***/ "./src/Core/Providers/Storage/index.ts":
/*!*********************************************!*\
  !*** ./src/Core/Providers/Storage/index.ts ***!
  \*********************************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Storage */ "./src/Core/Providers/Storage/Storage.ts"), exports);

__exportStar(__webpack_require__(/*! ./StorageProvider */ "./src/Core/Providers/Storage/StorageProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./StorageProviders/SpacesProvider */ "./src/Core/Providers/Storage/StorageProviders/SpacesProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./StorageServiceProvider */ "./src/Core/Providers/Storage/StorageServiceProvider.ts"), exports);

/***/ }),

/***/ "./src/Core/index.ts":
/*!***************************!*\
  !*** ./src/Core/index.ts ***!
  \***************************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

var __importDefault = this && this.__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));
exports.HTTP_REQUEST_IDENTIFIER = exports.AUTHED_USER_IDENTIFIER = exports.HTTP_CONTEXT_IDENTIFIER = exports.LOGGER_IDENTIFIER = exports.CONTAINER_IDENTIFIER = exports.Container = exports.whenBootstrapped = void 0;

__exportStar(__webpack_require__(/*! ./App */ "./src/Core/App.ts"), exports);

var Bootstrap_1 = __webpack_require__(/*! ./Bootstrap */ "./src/Core/Bootstrap.ts");

Object.defineProperty(exports, "whenBootstrapped", ({
  enumerable: true,
  get: function () {
    return Bootstrap_1.whenBootstrapped;
  }
}));

var Container_1 = __webpack_require__(/*! ./Container */ "./src/Core/Container.ts");

Object.defineProperty(exports, "Container", ({
  enumerable: true,
  get: function () {
    return __importDefault(Container_1).default;
  }
}));
Object.defineProperty(exports, "CONTAINER_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return Container_1.CONTAINER_IDENTIFIER;
  }
}));
Object.defineProperty(exports, "LOGGER_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return Container_1.LOGGER_IDENTIFIER;
  }
}));
Object.defineProperty(exports, "HTTP_CONTEXT_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return Container_1.HTTP_CONTEXT_IDENTIFIER;
  }
}));
Object.defineProperty(exports, "AUTHED_USER_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return Container_1.AUTHED_USER_IDENTIFIER;
  }
}));
Object.defineProperty(exports, "HTTP_REQUEST_IDENTIFIER", ({
  enumerable: true,
  get: function () {
    return Container_1.HTTP_REQUEST_IDENTIFIER;
  }
}));

__exportStar(__webpack_require__(/*! ./DecoratorData */ "./src/Core/DecoratorData.ts"), exports);

__exportStar(__webpack_require__(/*! ./Decorators */ "./src/Core/Decorators/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Exceptions/Models/InvalidRefSpecified */ "./src/Core/Exceptions/Models/InvalidRefSpecified.ts"), exports);

__exportStar(__webpack_require__(/*! ./Exceptions */ "./src/Core/Exceptions/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Helpers */ "./src/Core/Helpers.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Auth */ "./src/Core/Providers/Auth/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Cache */ "./src/Core/Providers/Cache/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Crypt */ "./src/Core/Providers/Crypt/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http/Context/Request */ "./src/Core/Providers/Http/Context/Request/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http/Context/Response */ "./src/Core/Providers/Http/Context/Response/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http/Context */ "./src/Core/Providers/Http/Context/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http/Controller/Decorators */ "./src/Core/Providers/Http/Controller/Decorators/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http/Controller */ "./src/Core/Providers/Http/Controller/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http/Server */ "./src/Core/Providers/Http/Server/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Http */ "./src/Core/Providers/Http/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Log */ "./src/Core/Providers/Log/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Model */ "./src/Core/Providers/Model/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/ServiceProvider */ "./src/Core/Providers/ServiceProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Storage/StorageProviders/SpacesProvider */ "./src/Core/Providers/Storage/StorageProviders/SpacesProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./Providers/Storage */ "./src/Core/Providers/Storage/index.ts"), exports);

/***/ }),

/***/ "./src/index.ts":
/*!**********************!*\
  !*** ./src/index.ts ***!
  \**********************/
/***/ (function(__unused_webpack_module, exports, __webpack_require__) {

"use strict";


var __createBinding = this && this.__createBinding || (Object.create ? function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  Object.defineProperty(o, k2, {
    enumerable: true,
    get: function () {
      return m[k];
    }
  });
} : function (o, m, k, k2) {
  if (k2 === undefined) k2 = k;
  o[k2] = m[k];
});

var __exportStar = this && this.__exportStar || function (m, exports) {
  for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};

Object.defineProperty(exports, "__esModule", ({
  value: true
}));

__exportStar(__webpack_require__(/*! ./Core/Decorators */ "./src/Core/Decorators/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Exceptions/Models/InvalidRefSpecified */ "./src/Core/Exceptions/Models/InvalidRefSpecified.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Exceptions */ "./src/Core/Exceptions/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Auth */ "./src/Core/Providers/Auth/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Cache */ "./src/Core/Providers/Cache/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Crypt */ "./src/Core/Providers/Crypt/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http/Context/Request */ "./src/Core/Providers/Http/Context/Request/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http/Context/Response */ "./src/Core/Providers/Http/Context/Response/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http/Context */ "./src/Core/Providers/Http/Context/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http/Controller/Decorators */ "./src/Core/Providers/Http/Controller/Decorators/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http/Controller */ "./src/Core/Providers/Http/Controller/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http/Server */ "./src/Core/Providers/Http/Server/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Http */ "./src/Core/Providers/Http/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Log */ "./src/Core/Providers/Log/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Model */ "./src/Core/Providers/Model/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/ServiceProvider */ "./src/Core/Providers/ServiceProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Storage/StorageProviders/SpacesProvider */ "./src/Core/Providers/Storage/StorageProviders/SpacesProvider.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core/Providers/Storage */ "./src/Core/Providers/Storage/index.ts"), exports);

__exportStar(__webpack_require__(/*! ./Core */ "./src/Core/index.ts"), exports);

/***/ }),

/***/ "./src/App/Http/Controllers sync recursive ^\\.\\/.*$":
/*!*************************************************!*\
  !*** ./src/App/Http/Controllers/ sync ^\.\/.*$ ***!
  \*************************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./Auth/AuthController": "./src/App/Http/Controllers/Auth/AuthController.ts",
	"./Auth/AuthController.ts": "./src/App/Http/Controllers/Auth/AuthController.ts"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/App/Http/Controllers sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "./src/App/Models sync recursive ^\\.\\/.*$":
/*!***************************************!*\
  !*** ./src/App/Models/ sync ^\.\/.*$ ***!
  \***************************************/
/***/ ((module, __unused_webpack_exports, __webpack_require__) => {

var map = {
	"./User": "./src/App/Models/User.ts",
	"./User.ts": "./src/App/Models/User.ts"
};


function webpackContext(req) {
	var id = webpackContextResolve(req);
	return __webpack_require__(id);
}
function webpackContextResolve(req) {
	if(!__webpack_require__.o(map, req)) {
		var e = new Error("Cannot find module '" + req + "'");
		e.code = 'MODULE_NOT_FOUND';
		throw e;
	}
	return map[req];
}
webpackContext.keys = function webpackContextKeys() {
	return Object.keys(map);
};
webpackContext.resolve = webpackContextResolve;
module.exports = webpackContext;
webpackContext.id = "./src/App/Models sync recursive ^\\.\\/.*$";

/***/ }),

/***/ "async_hooks":
/*!******************************!*\
  !*** external "async_hooks" ***!
  \******************************/
/***/ ((module) => {

"use strict";
module.exports = require("async_hooks");;

/***/ }),

/***/ "aws-sdk":
/*!**************************!*\
  !*** external "aws-sdk" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("aws-sdk");;

/***/ }),

/***/ "bcrypt":
/*!*************************!*\
  !*** external "bcrypt" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("bcrypt");;

/***/ }),

/***/ "chalk":
/*!************************!*\
  !*** external "chalk" ***!
  \************************/
/***/ ((module) => {

"use strict";
module.exports = require("chalk");;

/***/ }),

/***/ "chalk-console":
/*!********************************!*\
  !*** external "chalk-console" ***!
  \********************************/
/***/ ((module) => {

"use strict";
module.exports = require("chalk-console");;

/***/ }),

/***/ "class-transformer":
/*!************************************!*\
  !*** external "class-transformer" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-transformer");;

/***/ }),

/***/ "class-validator":
/*!**********************************!*\
  !*** external "class-validator" ***!
  \**********************************/
/***/ ((module) => {

"use strict";
module.exports = require("class-validator");;

/***/ }),

/***/ "dotenv":
/*!*************************!*\
  !*** external "dotenv" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("dotenv");;

/***/ }),

/***/ "fastify":
/*!**************************!*\
  !*** external "fastify" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("fastify");;

/***/ }),

/***/ "fastify-multipart":
/*!************************************!*\
  !*** external "fastify-multipart" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("fastify-multipart");;

/***/ }),

/***/ "fs":
/*!*********************!*\
  !*** external "fs" ***!
  \*********************/
/***/ ((module) => {

"use strict";
module.exports = require("fs");;

/***/ }),

/***/ "glob":
/*!***********************!*\
  !*** external "glob" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("glob");;

/***/ }),

/***/ "http-status-codes":
/*!************************************!*\
  !*** external "http-status-codes" ***!
  \************************************/
/***/ ((module) => {

"use strict";
module.exports = require("http-status-codes");;

/***/ }),

/***/ "inversify":
/*!****************************!*\
  !*** external "inversify" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("inversify");;

/***/ }),

/***/ "jsonwebtoken":
/*!*******************************!*\
  !*** external "jsonwebtoken" ***!
  \*******************************/
/***/ ((module) => {

"use strict";
module.exports = require("jsonwebtoken");;

/***/ }),

/***/ "middie":
/*!*************************!*\
  !*** external "middie" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("middie");;

/***/ }),

/***/ "mongodb":
/*!**************************!*\
  !*** external "mongodb" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("mongodb");;

/***/ }),

/***/ "node-cache-redis":
/*!***********************************!*\
  !*** external "node-cache-redis" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("node-cache-redis");;

/***/ }),

/***/ "node-fetch":
/*!*****************************!*\
  !*** external "node-fetch" ***!
  \*****************************/
/***/ ((module) => {

"use strict";
module.exports = require("node-fetch");;

/***/ }),

/***/ "path":
/*!***********************!*\
  !*** external "path" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("path");;

/***/ }),

/***/ "pluralize":
/*!****************************!*\
  !*** external "pluralize" ***!
  \****************************/
/***/ ((module) => {

"use strict";
module.exports = require("pluralize");;

/***/ }),

/***/ "reflect-metadata":
/*!***********************************!*\
  !*** external "reflect-metadata" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("reflect-metadata");;

/***/ }),

/***/ "regenerator-runtime":
/*!**************************************!*\
  !*** external "regenerator-runtime" ***!
  \**************************************/
/***/ ((module) => {

"use strict";
module.exports = require("regenerator-runtime");;

/***/ }),

/***/ "simple-crypto-js":
/*!***********************************!*\
  !*** external "simple-crypto-js" ***!
  \***********************************/
/***/ ((module) => {

"use strict";
module.exports = require("simple-crypto-js");;

/***/ }),

/***/ "stream":
/*!*************************!*\
  !*** external "stream" ***!
  \*************************/
/***/ ((module) => {

"use strict";
module.exports = require("stream");;

/***/ }),

/***/ "util":
/*!***********************!*\
  !*** external "util" ***!
  \***********************/
/***/ ((module) => {

"use strict";
module.exports = require("util");;

/***/ }),

/***/ "winston":
/*!**************************!*\
  !*** external "winston" ***!
  \**************************/
/***/ ((module) => {

"use strict";
module.exports = require("winston");;

/***/ }),

/***/ "winston-daily-rotate-file":
/*!********************************************!*\
  !*** external "winston-daily-rotate-file" ***!
  \********************************************/
/***/ ((module) => {

"use strict";
module.exports = require("winston-daily-rotate-file");;

/***/ })

/******/ 	});
/************************************************************************/
/******/ 	// The module cache
/******/ 	var __webpack_module_cache__ = {};
/******/ 	
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/ 		// Check if module is in cache
/******/ 		var cachedModule = __webpack_module_cache__[moduleId];
/******/ 		if (cachedModule !== undefined) {
/******/ 			return cachedModule.exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = __webpack_module_cache__[moduleId] = {
/******/ 			// no module.id needed
/******/ 			// no module.loaded needed
/******/ 			exports: {}
/******/ 		};
/******/ 	
/******/ 		// Execute the module function
/******/ 		__webpack_modules__[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/ 	
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/ 	
/************************************************************************/
/******/ 	/* webpack/runtime/hasOwnProperty shorthand */
/******/ 	(() => {
/******/ 		__webpack_require__.o = (obj, prop) => (Object.prototype.hasOwnProperty.call(obj, prop))
/******/ 	})();
/******/ 	
/************************************************************************/
/******/ 	
/******/ 	// startup
/******/ 	// Load entry module and return exports
/******/ 	// This entry module is referenced by other modules so it can't be inlined
/******/ 	var __webpack_exports__ = __webpack_require__("./src/index.ts");
/******/ 	
/******/ })()
;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQXBwL0V4Y2VwdGlvbnMvRXhjZXB0aW9uLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9BcHAvRXhjZXB0aW9ucy9FeGNlcHRpb25IYW5kbGVyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9BcHAvRXhjZXB0aW9ucy9VbmF1dGhvcmlzZWRFeGNlcHRpb24udHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0FwcC9FeGNlcHRpb25zL1ZhbGlkYXRpb25FeGNlcHRpb24udHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0FwcC9IdHRwL0NvbnRyb2xsZXJzL0F1dGgvQXV0aENvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0FwcC9IdHRwL01pZGRsZXdhcmUvQXV0aG9yaXphdGlvbk1pZGRsZXdhcmUudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0FwcC9Nb2RlbHMvVXNlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29uZmlnL2FwcC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29uZmlnL2F1dGgudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvbmZpZy9kYXRhYmFzZS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29uZmlnL2h0dHAudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvbmZpZy9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29uZmlnL3Byb3ZpZGVycy50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29uZmlnL3N0b3JhZ2UudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvQXBwLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL0Jvb3RzdHJhcC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Db250YWluZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvRGVjb3JhdG9yRGF0YS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9EZWNvcmF0b3JzL0NvbnRyb2xsZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvRGVjb3JhdG9ycy9EZWNvcmF0b3JIZWxwZXJzLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL0RlY29yYXRvcnMvTWlkZGxld2FyZS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9EZWNvcmF0b3JzL01vZGVsRGVjb3JhdG9ycy50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9EZWNvcmF0b3JzL1JvdXRlLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL0RlY29yYXRvcnMvUm91dGVNZXRob2QudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvRGVjb3JhdG9ycy9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9FeGNlcHRpb25zL01vZGVscy9JbnZhbGlkUmVmU3BlY2lmaWVkLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL0V4Y2VwdGlvbnMvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvSGVscGVycy50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQXV0aC9BdXRoLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9BdXRoL0F1dGhQcm92aWRlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQXV0aC9BdXRoU2VydmljZVByb3ZpZGVyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9BdXRoL0F1dGhvcmlzZWRVc2VyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9BdXRoL0p3dEF1dGhQcm92aWRlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQXV0aC9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQ2FjaGUvQ2FjaGUudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0NhY2hlL0NhY2hlU2VydmljZVByb3ZpZGVyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9DYWNoZS9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQ3J5cHQvRW5jcnlwdGlvbi50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQ3J5cHQvRW5jcnlwdGlvblNlcnZpY2VQcm92aWRlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQ3J5cHQvSGFzaC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvQ3J5cHQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udGV4dC9IdHRwQ29udGV4dC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250ZXh0L0h0dHBDb250ZXh0U3RvcmUudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udGV4dC9SZXF1ZXN0L0ZpbGVVcGxvYWQudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udGV4dC9SZXF1ZXN0L0h0dHBSZXF1ZXN0LnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9IdHRwL0NvbnRleHQvUmVxdWVzdC9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250ZXh0L1Jlc3BvbnNlL0h0dHBSZXNwb25zZS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250ZXh0L1Jlc3BvbnNlL2luZGV4LnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9IdHRwL0NvbnRleHQvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlci9Db250cm9sbGVyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9IdHRwL0NvbnRyb2xsZXIvQ29udHJvbGxlclNlcnZpY2VQcm92aWRlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL0RhdGFUcmFuc2Zlck9iamVjdC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL0RlY29yYXRvcnMvQ29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL0RlY29yYXRvcnMvRGF0YVRyYW5zZmVyT2JqZWN0UGFyYW0udHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlci9EZWNvcmF0b3JzL1JlcXVlc3RCb2R5UGFyYW0udHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlci9EZWNvcmF0b3JzL1JlcXVlc3RIZWFkZXJzUGFyYW0udHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlci9EZWNvcmF0b3JzL1JlcXVlc3RQYXJhbS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL0RlY29yYXRvcnMvUm91dGVQYXJhbWV0ZXJQYXJhbS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL0RlY29yYXRvcnMvUm91dGVRdWVyeVBhcmFtLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9IdHRwL0NvbnRyb2xsZXIvRGVjb3JhdG9ycy9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL01pZGRsZXdhcmUudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlci9Sb3V0ZS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL2luZGV4LnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9IdHRwL1NlcnZlci9TZXJ2ZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvU2VydmVyL1NlcnZlclNlcnZpY2VQcm92aWRlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvSHR0cC9TZXJ2ZXIvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0h0dHAvaW5kZXgudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0xvZy9Mb2cudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0xvZy9Mb2dTZXJ2aWNlUHJvdmlkZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL0xvZy9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvTW9kZWwvTW9kZWxFbnRpdHkudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL01vZGVsL01vZGVsU2VydmljZVByb3ZpZGVyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9Nb2RlbC9RdWVyeUJ1aWxkZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL01vZGVsL1JlcG9zaXRvcnkudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL01vZGVsL2luZGV4LnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9TZXJ2aWNlUHJvdmlkZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL1N0b3JhZ2UvU3RvcmFnZS50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvU3RvcmFnZS9TdG9yYWdlUHJvdmlkZXIudHMiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlLy4vc3JjL0NvcmUvUHJvdmlkZXJzL1N0b3JhZ2UvU3RvcmFnZVByb3ZpZGVycy9TcGFjZXNQcm92aWRlci50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvLi9zcmMvQ29yZS9Qcm92aWRlcnMvU3RvcmFnZS9TdG9yYWdlU2VydmljZVByb3ZpZGVyLnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL1Byb3ZpZGVycy9TdG9yYWdlL2luZGV4LnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9Db3JlL2luZGV4LnRzIiwid2VicGFjazovL0BlbnZ1c28vY29yZS8uL3NyYy9pbmRleC50cyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvL1VzZXJzL3NhbS9Db2RlL0ZyYW1ld29yay9Db3JlL3NyYy9BcHAvSHR0cC9Db250cm9sbGVyc3xzeW5jfC9eXFwuXFwvLiokLyIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvL1VzZXJzL3NhbS9Db2RlL0ZyYW1ld29yay9Db3JlL3NyYy9BcHAvTW9kZWxzfHN5bmN8L15cXC5cXC8uKiQvIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcImFzeW5jX2hvb2tzXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiYXdzLXNka1wiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcImJjcnlwdFwiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcImNoYWxrXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiY2hhbGstY29uc29sZVwiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcImNsYXNzLXRyYW5zZm9ybWVyXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiY2xhc3MtdmFsaWRhdG9yXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiZG90ZW52XCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiZmFzdGlmeVwiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcImZhc3RpZnktbXVsdGlwYXJ0XCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiZnNcIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJnbG9iXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwiaHR0cC1zdGF0dXMtY29kZXNcIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJpbnZlcnNpZnlcIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJqc29ud2VidG9rZW5cIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJtaWRkaWVcIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJtb25nb2RiXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwibm9kZS1jYWNoZS1yZWRpc1wiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcIm5vZGUtZmV0Y2hcIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJwYXRoXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwicGx1cmFsaXplXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwicmVmbGVjdC1tZXRhZGF0YVwiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcInJlZ2VuZXJhdG9yLXJ1bnRpbWVcIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJzaW1wbGUtY3J5cHRvLWpzXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwic3RyZWFtXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL2V4dGVybmFsIFwidXRpbFwiIiwid2VicGFjazovL0BlbnZ1c28vY29yZS9leHRlcm5hbCBcIndpbnN0b25cIiIsIndlYnBhY2s6Ly9AZW52dXNvL2NvcmUvZXh0ZXJuYWwgXCJ3aW5zdG9uLWRhaWx5LXJvdGF0ZS1maWxlXCIiLCJ3ZWJwYWNrOi8vQGVudnVzby9jb3JlL3dlYnBhY2svYm9vdHN0cmFwIiwid2VicGFjazovL0BlbnZ1c28vY29yZS93ZWJwYWNrL3J1bnRpbWUvaGFzT3duUHJvcGVydHkgc2hvcnRoYW5kIiwid2VicGFjazovL0BlbnZ1c28vY29yZS93ZWJwYWNrL3N0YXJ0dXAiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQUFBOztJQUVhLFM7OztBQU1aLHFCQUFZLE9BQVosRUFBNkIsT0FBb0IsZ0NBQVkscUJBQTdELEVBQWtGO0FBQUE7O0FBQ2pGLDhCQUFNLE9BQU47QUFMTSxxQkFBZ0IsRUFBaEI7QUFNTixVQUFLLEtBQUwsR0FBYSxJQUFiO0FBRUEsVUFBSyxRQUFMLEdBQWdCO0FBQ2YsYUFBTyxFQUFHLE1BQUssT0FEQSxDQUVmOztBQUZlLEtBQWhCO0FBSmlGO0FBUWpGOzs7O1NBRUQsSSxHQUFBLGdCQUFJO0FBQ0gsV0FBTyxLQUFLLEtBQVo7QUFDQSxHOzs7aUNBbEI2QixLOztBQUEvQiw4Qjs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDREE7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0FBQ0E7O0lBRWEsZ0I7OzttQkFFTCxTLEdBQVAsbUJBQWlCLFNBQWpCLEVBQW1DLFFBQW5DLEVBQXlEO0FBRXhELFFBQUksU0FBUyxZQUFZLHlDQUF6QixFQUE4QztBQUM3QyxhQUFPLEtBQUssV0FBTCxDQUFpQixTQUFqQixFQUE0QixRQUE1QixDQUFQO0FBQ0E7O0FBRUQsUUFBSSxTQUFTLFlBQVksNkNBQXpCLEVBQWdEO0FBQy9DLGFBQU8sS0FBSyxXQUFMLENBQWlCLFNBQWpCLEVBQTRCLFFBQTVCLENBQVA7QUFDQTs7QUFFRCxRQUFJLFNBQVMsWUFBWSxnQ0FBekIsRUFBNEM7QUFDM0MsZUFBUyxHQUFHLElBQUksNkNBQUosQ0FBMEIsU0FBUyxDQUFDLE9BQXBDLENBQVo7QUFDQTs7QUFFRCxRQUFJLFNB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QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQTs7QUFDQSxnRjs7Ozs7Ozs7OztBQ2xCQTtBQUNBO0FBQ0E7QUFDQTs7O0FBR0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLDJFOzs7Ozs7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBOzs7QUFHQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUU7Ozs7Ozs7Ozs7O0FDdkJBLHlDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLG1DOzs7Ozs7Ozs7OztBQ0FBLDJDOzs7Ozs7Ozs7OztBQ0FBLCtDOzs7Ozs7Ozs7OztBQ0FBLDZDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLCtDOzs7Ozs7Ozs7OztBQ0FBLGdDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLCtDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLDBDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLDhDOzs7Ozs7Ozs7OztBQ0FBLHdDOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLHVDOzs7Ozs7Ozs7OztBQ0FBLDhDOzs7Ozs7Ozs7OztBQ0FBLGlEOzs7Ozs7Ozs7OztBQ0FBLDhDOzs7Ozs7Ozs7OztBQ0FBLG9DOzs7Ozs7Ozs7OztBQ0FBLGtDOzs7Ozs7Ozs7OztBQ0FBLHFDOzs7Ozs7Ozs7OztBQ0FBLHVEOzs7Ozs7VUNBQTtVQUNBOztVQUVBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBO1VBQ0E7VUFDQTtVQUNBOztVQUVBO1VBQ0E7O1VBRUE7VUFDQTtVQUNBOzs7OztXQ3RCQSx3Rjs7Ozs7VUNBQTtVQUNBO1VBQ0E7VUFDQSIsImZpbGUiOiJtYWluLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IHtTdGF0dXNDb2Rlc30gZnJvbSBcImh0dHAtc3RhdHVzLWNvZGVzXCI7XG5cbmV4cG9ydCBjbGFzcyBFeGNlcHRpb24gZXh0ZW5kcyBFcnJvciB7XG5cblx0cHVibGljIHJlc3BvbnNlOiBhbnkgPSB7fTtcblxuXHRwcml2YXRlIF9jb2RlOiBTdGF0dXNDb2RlcztcblxuXHRjb25zdHJ1Y3RvcihtZXNzYWdlOiBzdHJpbmcsIGNvZGU6IFN0YXR1c0NvZGVzID0gU3RhdHVzQ29kZXMuSU5URVJOQUxfU0VSVkVSX0VSUk9SKSB7XG5cdFx0c3VwZXIobWVzc2FnZSk7XG5cdFx0dGhpcy5fY29kZSA9IGNvZGU7XG5cblx0XHR0aGlzLnJlc3BvbnNlID0ge1xuXHRcdFx0bWVzc2FnZSA6IHRoaXMubWVzc2FnZSxcblx0XHRcdC8vZXJyb3JzICA6IHt9XG5cdFx0fVxuXHR9XG5cblx0Y29kZSgpIHtcblx0XHRyZXR1cm4gdGhpcy5fY29kZTtcblx0fVxuXG59XG4iLCJpbXBvcnQge0Zhc3RpZnlSZXBseX0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7SnNvbldlYlRva2VuRXJyb3IsIFRva2VuRXhwaXJlZEVycm9yfSBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQge0xvZ30gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQge0V4Y2VwdGlvbn0gZnJvbSBcIi4vRXhjZXB0aW9uXCI7XG5pbXBvcnQge1VuYXV0aG9yaXNlZEV4Y2VwdGlvbn0gZnJvbSBcIi4vVW5hdXRob3Jpc2VkRXhjZXB0aW9uXCI7XG5pbXBvcnQge1ZhbGlkYXRpb25FeGNlcHRpb259IGZyb20gXCIuL1ZhbGlkYXRpb25FeGNlcHRpb25cIjtcblxuZXhwb3J0IGNsYXNzIEV4Y2VwdGlvbkhhbmRsZXIge1xuXG5cdHN0YXRpYyB0cmFuc2Zvcm0oZXhjZXB0aW9uOiBFcnJvciwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXG5cdFx0aWYgKGV4Y2VwdGlvbiBpbnN0YW5jZW9mIFZhbGlkYXRpb25FeGNlcHRpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLnJlc3BvbnNlRm9yKGV4Y2VwdGlvbiwgcmVzcG9uc2UpO1xuXHRcdH1cblxuXHRcdGlmIChleGNlcHRpb24gaW5zdGFuY2VvZiBVbmF1dGhvcmlzZWRFeGNlcHRpb24pIHtcblx0XHRcdHJldHVybiB0aGlzLnJlc3BvbnNlRm9yKGV4Y2VwdGlvbiwgcmVzcG9uc2UpO1xuXHRcdH1cblxuXHRcdGlmIChleGNlcHRpb24gaW5zdGFuY2VvZiBKc29uV2ViVG9rZW5FcnJvcikge1xuXHRcdFx0ZXhjZXB0aW9uID0gbmV3IFVuYXV0aG9yaXNlZEV4Y2VwdGlvbihleGNlcHRpb24ubWVzc2FnZSk7XG5cdFx0fVxuXG5cdFx0aWYgKGV4Y2VwdGlvbiBpbnN0YW5jZW9mIFRva2VuRXhwaXJlZEVycm9yKSB7XG5cdFx0XHRleGNlcHRpb24gPSBuZXcgVW5hdXRob3Jpc2VkRXhjZXB0aW9uKGV4Y2VwdGlvbi5tZXNzYWdlKTtcblx0XHR9XG5cblx0XHRpZiAoZXhjZXB0aW9uIGluc3RhbmNlb2YgRXhjZXB0aW9uKSB7XG5cdFx0XHRyZXR1cm4gcmVzcG9uc2Uuc3RhdHVzKGV4Y2VwdGlvbi5jb2RlKCkpLnNlbmQoZXhjZXB0aW9uLnJlc3BvbnNlKTtcblx0XHR9XG5cblx0XHRMb2cuZXJyb3IoZXhjZXB0aW9uLnRvU3RyaW5nKCkpO1xuXHRcdGNvbnNvbGUudHJhY2UoZXhjZXB0aW9uKTtcblxuXHRcdHJldHVybiByZXNwb25zZS5zdGF0dXMoNTAwKS5zZW5kKGV4Y2VwdGlvbik7XG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyByZXNwb25zZUZvcihleGNlcHRpb246IEV4Y2VwdGlvbiwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXHRcdHJldHVybiByZXNwb25zZVxuXHRcdFx0LnN0YXR1cyhleGNlcHRpb24uY29kZSgpKVxuXHRcdFx0LnNlbmQoZXhjZXB0aW9uLnJlc3BvbnNlKTtcblx0fVxufVxuIiwiaW1wb3J0IHtTdGF0dXNDb2Rlc30gZnJvbSBcImh0dHAtc3RhdHVzLWNvZGVzXCI7XG5pbXBvcnQge0V4Y2VwdGlvbn0gZnJvbSBcIi4vRXhjZXB0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBVbmF1dGhvcmlzZWRFeGNlcHRpb24gZXh0ZW5kcyBFeGNlcHRpb24ge1xuXG5cdGNvbnN0cnVjdG9yKG1lc3NhZ2U/OiBzdHJpbmcpIHtcblx0XHRzdXBlcihtZXNzYWdlID8/ICdVbmF1dGhvcmlzZWQuJywgU3RhdHVzQ29kZXMuVU5BVVRIT1JJWkVEKTtcblx0fVxuXG59XG4iLCJpbXBvcnQge1ZhbGlkYXRpb25FcnJvcn0gZnJvbSBcImNsYXNzLXZhbGlkYXRvclwiO1xuaW1wb3J0IHtTdGF0dXNDb2Rlc30gZnJvbSBcImh0dHAtc3RhdHVzLWNvZGVzXCI7XG5pbXBvcnQge0V4Y2VwdGlvbn0gZnJvbSBcIi4vRXhjZXB0aW9uXCI7XG5cbmV4cG9ydCBjbGFzcyBWYWxpZGF0aW9uRXhjZXB0aW9uIGV4dGVuZHMgRXhjZXB0aW9uIHtcblxuXHRwcml2YXRlIGVycm9yczogYW55ID0ge307XG5cblx0Y29uc3RydWN0b3IoZXJyb3JzOiBBcnJheTxWYWxpZGF0aW9uRXJyb3I+IHwgeyBba2V5OiBzdHJpbmddOiBzdHJpbmcgfSkge1xuXHRcdHN1cGVyKFwiV29vcHMgc29tZXRoaW5nIHdlbnQgd3JvbmcuXCIsIFN0YXR1c0NvZGVzLlVOUFJPQ0VTU0FCTEVfRU5USVRZKTtcblxuLy9cdFx0aWYgKHZhbGlkYXRvciBpbnN0YW5jZW9mIFZhbGlkYXRvcikge1xuLy9cdFx0XHR0aGlzLnByb2Nlc3NFcnJvcnModmFsaWRhdG9yLmVycm9ycy5hbGwoKSk7XG4vL1x0XHRcdHJldHVybjtcbi8vXHRcdH1cblxuXHRcdHRoaXMuZXJyb3JzID0gZXJyb3JzO1xuXG5cdFx0dGhpcy5yZXNwb25zZSA9IHtcblx0XHRcdG1lc3NhZ2UgOiB0aGlzLm1lc3NhZ2UsXG5cdFx0XHRlcnJvcnMgIDogdGhpcy5wcm9jZXNzRXJyb3JzKClcblx0XHR9O1xuXHR9XG5cblx0c3RhdGljIG1lc3NhZ2UobWVzc2FnZSkge1xuXHRcdGNvbnN0IGV4Y2VwdGlvbiA9IG5ldyBWYWxpZGF0aW9uRXhjZXB0aW9uKFtcblx0XHRcdG1lc3NhZ2Vcblx0XHRdKTtcblxuXHRcdGV4Y2VwdGlvbi5tZXNzYWdlID0gbWVzc2FnZTtcblxuXHRcdHJldHVybiBleGNlcHRpb247XG5cdH1cblxuXHRwcml2YXRlIHByb2Nlc3NFcnJvcnMoKSB7XG5cdFx0bGV0IGVycm9ycyA9IHt9O1xuXG5cdFx0aWYgKEFycmF5LmlzQXJyYXkodGhpcy5lcnJvcnMpKSB7XG5cdFx0XHRpZiAoIXRoaXMuZXJyb3JzLmxlbmd0aCkge1xuXHRcdFx0XHRyZXR1cm4gZXJyb3JzO1xuXHRcdFx0fVxuXG5cdFx0XHRjb25zdCBmaXJzdEVycm9yID0gdGhpcy5lcnJvcnNbMF0gfHwgbnVsbDtcblxuXHRcdFx0aWYgKCFmaXJzdEVycm9yKSB7XG5cdFx0XHRcdHJldHVybiBlcnJvcnM7XG5cdFx0XHR9XG5cblx0XHRcdGlmIChmaXJzdEVycm9yIGluc3RhbmNlb2YgVmFsaWRhdGlvbkVycm9yKSB7XG5cdFx0XHRcdGZvciAobGV0IGVycm9yIG9mIHRoaXMuZXJyb3JzKSB7XG5cdFx0XHRcdFx0ZXJyb3JzW2Vycm9yLnByb3BlcnR5XSA9IE9iamVjdC52YWx1ZXMoZXJyb3IuY29uc3RyYWludHMpWzBdIHx8IG51bGw7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXR1cm4gZXJyb3JzO1xuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gZXJyb3JzO1xuXHRcdH1cblxuXHRcdGVycm9ycyA9IHsuLi50aGlzLmVycm9ycywgLi4uZXJyb3JzfTtcblxuXHRcdHJldHVybiBlcnJvcnM7XG5cbi8vXHRcdE9iamVjdC5rZXlzKHRoaXMuZXJyb3JzKS5mb3JFYWNoKGVycm9yS2V5ID0+IHtcbi8vXHRcdFx0aWYgKHRoaXMuZXJyb3JzW2Vycm9yS2V5XSBpbnN0YW5jZW9mIFZhbGlkYXRpb25FcnJvcikge1xuLy9cdFx0XHRcdGVycm9yc1tlcnJvcktleV0gPVxuLy9cdFx0XHR9XG4vL1xuLy9cdFx0XHRlcnJvcnNbZXJyb3JLZXldID0gdmFsaWRhdGlvbkVycm9yc1tlcnJvcktleV1bMF07XG4vL1x0XHR9KTtcbi8vXG4vL1x0XHR0aGlzLmVycm9ycyA9IGVycm9ycztcblx0fVxuXG5cbn1cbiIsImltcG9ydCB7QXV0aENyZWRlbnRpYWxDb250cmFjdH0gZnJvbSBcIkBBcHAvQ29udHJhY3RzL0F1dGhDb250cmFjdHNcIjtcbmltcG9ydCB7VmFsaWRhdGlvbkV4Y2VwdGlvbn0gZnJvbSBcIkBBcHAvRXhjZXB0aW9ucy9WYWxpZGF0aW9uRXhjZXB0aW9uXCI7XG5pbXBvcnQge0F1dGhvcml6YXRpb25NaWRkbGV3YXJlfSBmcm9tIFwiQEFwcC9IdHRwL01pZGRsZXdhcmUvQXV0aG9yaXphdGlvbk1pZGRsZXdhcmVcIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIkBBcHAvTW9kZWxzL1VzZXJcIjtcbmltcG9ydCB7QXV0aCwgY29udHJvbGxlciwgQ29udHJvbGxlciwgRGF0YVRyYW5zZmVyT2JqZWN0LCBkdG8sIGdldCwgSGFzaCwgSHR0cENvbnRleHQsIG1pZGRsZXdhcmUsIHBvc3QsIHJlc3BvbnNlfSBmcm9tIFwiQENvcmVcIjtcbmltcG9ydCB7VHJhbnNmb3JtfSBmcm9tIFwiY2xhc3MtdHJhbnNmb3JtZXJcIjtcbmltcG9ydCB7SXNBbHBoYW51bWVyaWMsIElzRW1haWwsIElzTm90RW1wdHksIElzU3RyaW5nLCBMZW5ndGh9IGZyb20gXCJjbGFzcy12YWxpZGF0b3JcIjtcblxuXG5jbGFzcyBMb2dpbkJvZHkgZXh0ZW5kcyBEYXRhVHJhbnNmZXJPYmplY3QgaW1wbGVtZW50cyBBdXRoQ3JlZGVudGlhbENvbnRyYWN0IHtcblx0QElzRW1haWwoKVxuXHRASXNOb3RFbXB0eSgpXG5cdHB1YmxpYyBlbWFpbDogc3RyaW5nO1xuXG5cdEBMZW5ndGgoOCwgMjU1KVxuXHRwYXNzd29yZDogc3RyaW5nO1xufVxuXG5jbGFzcyBSZWdpc3RyYXRpb25Cb2R5IGV4dGVuZHMgTG9naW5Cb2R5IHtcblxuXHRASXNOb3RFbXB0eSgpXG5cdEBMZW5ndGgoMywgMjUpXG5cdGRpc3BsYXlOYW1lPzogc3RyaW5nO1xuXG5cdEBUcmFuc2Zvcm0oKHt2YWx1ZX0pID0+IHZhbHVlLnRvTG93ZXJDYXNlKCkpXG5cdEBJc1N0cmluZygpXG5cdEBJc0FscGhhbnVtZXJpYygpXG5cdEBMZW5ndGgoMywgMjApXG5cdG5hbWU6IHN0cmluZztcbn1cblxuQGNvbnRyb2xsZXIoJy9hdXRoJylcbmV4cG9ydCBjbGFzcyBBdXRoQ29udHJvbGxlciBleHRlbmRzIENvbnRyb2xsZXIge1xuXG5cdEBwb3N0KCcvbG9naW4nKVxuXHRhc3luYyBsb2dpbihAZHRvKCkgbG9naW5Cb2R5OiBMb2dpbkJvZHkpIHtcblxuXHRcdGlmICghYXdhaXQgQXV0aC5hdHRlbXB0KGxvZ2luQm9keSkpIHtcblx0XHRcdHRocm93IG5ldyBWYWxpZGF0aW9uRXhjZXB0aW9uKHtcblx0XHRcdFx0bWVzc2FnZSA6ICdJbnZhbGlkIGNyZWRlbnRpYWxzJ1xuXHRcdFx0fSk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJlc3BvbnNlKCkuanNvbih7XG5cdFx0XHR1c2VyICA6IEF1dGgudXNlcigpLFxuXHRcdFx0dG9rZW4gOiBBdXRoLnVzZXIoKS5nZW5lcmF0ZVRva2VuKClcblx0XHR9KTtcblx0fVxuXG5cdEBwb3N0KCcvcmVnaXN0ZXInKVxuXHRhc3luYyByZWdpc3RlcihAZHRvKCkgcmVnaXN0cmF0aW9uOiBSZWdpc3RyYXRpb25Cb2R5KSB7XG5cblx0XHRpZiAoIWF3YWl0IEF1dGguY2FuUmVnaXN0ZXJBcyhyZWdpc3RyYXRpb24pKSB7XG5cdFx0XHR0aHJvdyBuZXcgVmFsaWRhdGlvbkV4Y2VwdGlvbih7XG5cdFx0XHRcdHVzZXJuYW1lIDogJ1VzZXJuYW1lIGlzIGluIHVzZS4nXG5cdFx0XHR9KTtcblx0XHR9XG5cblx0XHRjb25zdCB1c2VyID0gYXdhaXQgVXNlci5jcmVhdGU8VXNlcj4oe1xuXHRcdFx0bmFtZSAgICAgICAgOiByZWdpc3RyYXRpb24ubmFtZSxcblx0XHRcdGVtYWlsICAgICAgIDogcmVnaXN0cmF0aW9uLmVtYWlsLFxuXHRcdFx0cGFzc3dvcmQgICAgOiBhd2FpdCBIYXNoLm1ha2UocmVnaXN0cmF0aW9uLnBhc3N3b3JkKSxcblx0XHRcdGRpc3BsYXlOYW1lIDogcmVnaXN0cmF0aW9uLmRpc3BsYXlOYW1lLFxuXHRcdFx0Y3JlYXRlZEF0ICAgOiBuZXcgRGF0ZSgpLFxuXHRcdH0pO1xuXG5cdFx0QXV0aC5sb2dpbkFzKHVzZXIpO1xuXG5cdFx0cmV0dXJuIHtcblx0XHRcdHVzZXIgIDogQXV0aC51c2VyKCksXG5cdFx0XHR0b2tlbiA6IEF1dGgudXNlcigpLmdlbmVyYXRlVG9rZW4oKVxuXHRcdH1cblx0fVxuXG5cdEBtaWRkbGV3YXJlKG5ldyBBdXRob3JpemF0aW9uTWlkZGxld2FyZSgpKVxuXHRAZ2V0KCcvdXNlcicpXG5cdGFzeW5jIGF1dGhlZFVzZXIoKSB7XG5cdFx0cmV0dXJuIHtcblx0XHRcdGNvbnRleHRVc2VyIDogSHR0cENvbnRleHQuZ2V0KCkudXNlcixcblx0XHRcdGF1dGhVc2VyICAgIDogQXV0aC51c2VyKClcblx0XHR9XG5cdH1cblxufVxuIiwiaW1wb3J0IHtVbmF1dGhvcmlzZWRFeGNlcHRpb259IGZyb20gXCJAQXBwL0V4Y2VwdGlvbnMvVW5hdXRob3Jpc2VkRXhjZXB0aW9uXCI7XG5pbXBvcnQge0Zhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3R9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7QXV0aCwgQXV0aFByb3ZpZGVyLCBNaWRkbGV3YXJlLCByZXNvbHZlfSBmcm9tIFwiQENvcmVcIjtcblxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aG9yaXphdGlvbk1pZGRsZXdhcmUgZXh0ZW5kcyBNaWRkbGV3YXJlIHtcblxuXHRwdWJsaWMgYXN5bmMgaGFuZGxlcihyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXHRcdGF3YWl0IHJlc29sdmUoQXV0aFByb3ZpZGVyKS5hdXRob3Jpc2VSZXF1ZXN0KHJlcXVlc3QsIHJlc3BvbnNlKTtcblxuXHRcdGlmICghQXV0aC5jaGVjaygpKSB7XG5cdFx0XHR0aHJvdyBuZXcgVW5hdXRob3Jpc2VkRXhjZXB0aW9uKCk7XG5cdFx0fVxuXHR9XG5cbn1cbiIsImltcG9ydCB7RXhjbHVkZSwgVHlwZX0gZnJvbSBcImNsYXNzLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQge0lzRW1haWwsIElzTm90RW1wdHl9IGZyb20gXCJjbGFzcy12YWxpZGF0b3JcIjtcbmltcG9ydCB7aW5qZWN0YWJsZX0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHtPYmplY3RJZH0gZnJvbSBcIm1vbmdvZGJcIjtcbmltcG9ydCB7SWQsIE1vZGVsRW50aXR5fSBmcm9tIFwiQENvcmVcIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIFVzZXIgZXh0ZW5kcyBNb2RlbEVudGl0eTxVc2VyPiB7XG5cblx0QElkXG5cdF9pZDogT2JqZWN0SWQ7XG5cblx0QElzRW1haWwoKVxuXHRASXNOb3RFbXB0eSgpXG5cdGVtYWlsOiBzdHJpbmc7XG5cblx0bmFtZTogc3RyaW5nO1xuXG5cdGRpc3BsYXlOYW1lOiBzdHJpbmc7XG5cblx0QEV4Y2x1ZGUoe3RvUGxhaW5Pbmx5IDogdHJ1ZX0pXG5cdHBhc3N3b3JkOiBzdHJpbmc7XG5cblx0Y3JlYXRlZEF0OiBEYXRlO1xuXG5cdEBUeXBlKCgpID0+IE51bWJlcilcblx0c29tZXRoaW5nOiBudW1iZXI7XG59XG5cblxuXG4iLCJleHBvcnQgY29uc3QgYXBwID0ge1xuXHRob3N0bmFtZSA6IHByb2Nlc3MuZW52LkFQUF9IT1NULFxuXHRwb3J0IDogcHJvY2Vzcy5lbnYuUE9SVCxcblx0YXBwS2V5IDogcHJvY2Vzcy5lbnYuQVBQX0tFWSxcbn07XG4iLCJpbXBvcnQge1NpZ25PcHRpb25zLCBWZXJpZnlPcHRpb25zfSBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQge1ByaW1hcnlBdXRoQ3JlZGVudGlhbH0gZnJvbSBcIkBBcHAvQ29udHJhY3RzL0F1dGhDb250cmFjdHNcIjtcblxuZXhwb3J0IGNvbnN0IGF1dGggPSB7XG5cblx0cHJpbWFyeUxvZ2luQ3JlZGVudGlhbCA6ICdlbWFpbCcgYXMgUHJpbWFyeUF1dGhDcmVkZW50aWFsLFxuXG5cdGp3dFNpZ25pbmdPcHRpb25zIDoge1xuXHRcdGV4cGlyZXNJbiA6IFwiMjRoXCIsXG5cdFx0YWxnb3JpdGhtIDogXCJIUzI1NlwiLFxuXHR9IGFzIFNpZ25PcHRpb25zLFxuXG5cdGp3dFZlcmlmeU9wdGlvbnMgOiB7XG5cdFx0aWdub3JlRXhwaXJhdGlvbiA6IGZhbHNlLFxuXHRcdGFsZ29yaXRobXMgICAgICAgOiBbXCJIUzI1NlwiXSxcblx0fSBhcyBWZXJpZnlPcHRpb25zXG5cblxufVxuIiwiZXhwb3J0IGNvbnN0IGRhdGFiYXNlID0ge1xuXHRtb25nbyA6IHtcblx0XHRjb25uZWN0aW9uVXJsIDogcHJvY2Vzcy5lbnYuTU9OR09EQl9DT05ORUNUSU9OX1VSTFxuXHR9LFxuXHRyZWRpcyA6IHtcblx0XHRob3N0IDogcHJvY2Vzcy5lbnYuUkVESVNfSE9TVCxcblx0XHRwb3J0IDogTnVtYmVyKHByb2Nlc3MuZW52LlJFRElTX1BPUlQpXG5cdH1cbn07XG5cbiIsImltcG9ydCB7Q2xhc3NUcmFuc2Zvcm1PcHRpb25zfSBmcm9tIFwiY2xhc3MtdHJhbnNmb3JtZXIvdHlwZXMvaW50ZXJmYWNlc1wiO1xuXG5leHBvcnQgY29uc3QgaHR0cCA9IHtcblxuXHQvKipcblx0ICogQmVmb3JlIHdlIHJldHVybiBhIHJlc3BvbnNlIHdlIHNlcmlhbGl6ZSB0aGUgcmVzdWx0LCBtYWlubHlcblx0ICogc28gdGhhdCBjbGFzcyB0cmFuc2Zvcm1lciBjYW4gZG8gaXQncyB3b3JrLCBidXQgYWxzbyB0byBoZWxwXG5cdCAqIHdpdGggcmFuZG9tIGVycm9ycyB0aGF0IG9jY3VyIGZyb20gY2lyY3VsYXIgcmVmZXJlbmNlcy5cblx0ICpcblx0ICogZXhjbHVkZUV4dHJhbmVvdXNWYWx1ZXMgY2FuIGluZHVjZSByZXN1bHRzIHRoYXQgeW91IG1pZ2h0IG5vdFxuXHQgKiBleHBlY3QgYnV0IGhlbHBzIHByZXZlbnQgaW50ZXJuYWwgcmVmZXJlbmNlcyB1c2VkIGluIHlvdXIgY29kZVxuXHQgKiBhbmQgdGhlIGZyYW1ld29yayBmcm9tIGJlaW5nIHJldHVybmVkIGluIGEgcmVzcG9uc2UuXG5cdCAqXG5cdCAqIERpc2FibGUgYXQgeW91ciBvd24gd2lsbC5cblx0ICovXG5cdHJlc3BvbnNlU2VyaWFsaXphdGlvbiA6IHtcblx0XHRlbmFibGVDaXJjdWxhckNoZWNrIDogdHJ1ZSxcbi8vXHRcdGV4Y2x1ZGVFeHRyYW5lb3VzVmFsdWVzIDogdHJ1ZSxcblx0XHRleGNsdWRlUHJlZml4ZXMgOiBbJ18nXSxcblx0XHRzdHJhdGVneSAgICAgICAgOiBcImV4cG9zZUFsbFwiXG5cdH0gYXMgQ2xhc3NUcmFuc2Zvcm1PcHRpb25zXG5cbn1cbiIsImltcG9ydCB7Q2xhc3NUcmFuc2Zvcm1PcHRpb25zfSBmcm9tIFwiY2xhc3MtdHJhbnNmb3JtZXJcIjtcbmltcG9ydCB7RmFzdGlmeVBsdWdpbiwgRmFzdGlmeVBsdWdpbk9wdGlvbnN9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge1NpZ25PcHRpb25zLCBWZXJpZnlPcHRpb25zfSBmcm9tIFwianNvbndlYnRva2VuXCI7XG5pbXBvcnQge2h0dHB9IGZyb20gXCIuL2h0dHBcIjtcbmltcG9ydCB7YXBwfSBmcm9tIFwiLi9hcHBcIjtcbmltcG9ydCB7YXV0aH0gZnJvbSBcIi4vYXV0aFwiO1xuaW1wb3J0IHtkYXRhYmFzZX0gZnJvbSBcIi4vZGF0YWJhc2VcIjtcbmltcG9ydCB7cHJvdmlkZXJzLCBzZXJ2ZXJQcm92aWRlcnN9IGZyb20gXCIuL3Byb3ZpZGVyc1wiO1xuaW1wb3J0IHtzdG9yYWdlfSBmcm9tIFwiLi9zdG9yYWdlXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgQ29uZmlnSW50ZXJmYWNlIHtcblx0YXBwOiB7XG5cdFx0aG9zdG5hbWU6IHN0cmluZztcblx0XHRwb3J0OiBzdHJpbmc7XG5cdFx0YXBwS2V5OiBzdHJpbmdcblx0fTtcblxuXHRkYXRhYmFzZToge1xuXHRcdG1vbmdvOiB7XG5cdFx0XHRjb25uZWN0aW9uVXJsOiBzdHJpbmc7XG5cdFx0fTtcblx0XHRyZWRpczoge1xuXHRcdFx0cG9ydDogbnVtYmVyO1xuXHRcdFx0aG9zdDogc3RyaW5nXG5cdFx0fTtcblx0fTtcblxuXHRwcm92aWRlcnM6IGFueVtdO1xuXG5cdHNlcnZlclByb3ZpZGVyczogQXJyYXk8W0Zhc3RpZnlQbHVnaW4sIEZhc3RpZnlQbHVnaW5PcHRpb25zXT47XG5cblx0c3RvcmFnZToge1xuXHRcdHNwYWNlczoge1xuXHRcdFx0YnVja2V0OiBzdHJpbmc7XG5cdFx0XHRlbmRwb2ludDogc3RyaW5nO1xuXHRcdFx0Y3JlZGVudGlhbHM6IHtcblx0XHRcdFx0YWNjZXNzS2V5SWQ6IHN0cmluZztcblx0XHRcdFx0c2VjcmV0QWNjZXNzS2V5OiBzdHJpbmdcblx0XHRcdH07XG5cdFx0XHR1cmw6IHN0cmluZ1xuXHRcdH07XG5cdFx0ZGVmYXVsdFByb3ZpZGVyOiBhbnlcblx0fTtcblxuXHRhdXRoOiB7XG5cdFx0and0U2lnbmluZ09wdGlvbnM6IFNpZ25PcHRpb25zO1xuXHRcdGp3dFZlcmlmeU9wdGlvbnM6IFZlcmlmeU9wdGlvbnM7XG5cdFx0cHJpbWFyeUxvZ2luQ3JlZGVudGlhbDogXCJlbWFpbFwiIHwgXCJwYXNzd29yZFwiXG5cdH07XG5cblx0aHR0cDoge1xuXHRcdHJlc3BvbnNlU2VyaWFsaXphdGlvbjogQ2xhc3NUcmFuc2Zvcm1PcHRpb25zXG5cdH07XG5cbn1cblxuZXhwb3J0IGNvbnN0IENvbmZpZzogQ29uZmlnSW50ZXJmYWNlID0ge1xuXHRhcHAsXG5cdGRhdGFiYXNlLFxuXHRwcm92aWRlcnMsXG5cdHNlcnZlclByb3ZpZGVycyxcblx0c3RvcmFnZSxcblx0YXV0aCxcblx0aHR0cCxcbn1cblxuXG4iLCJpbXBvcnQge0Zhc3RpZnlQbHVnaW4sIEZhc3RpZnlQbHVnaW5PcHRpb25zfSBmcm9tIFwiZmFzdGlmeVwiO1xuXG5pbXBvcnQge2RlZmF1bHQgYXMgRmFzdGlmeU11bHRpcGFydCwgRmFzdGlmeU11bHRpcGFydE9wdGlvbnN9IGZyb20gXCJmYXN0aWZ5LW11bHRpcGFydFwiO1xuaW1wb3J0IHtcblx0QXV0aFNlcnZpY2VQcm92aWRlcixcblx0Q2FjaGVTZXJ2aWNlUHJvdmlkZXIsXG5cdENvbnRyb2xsZXJTZXJ2aWNlUHJvdmlkZXIsXG5cdEVuY3J5cHRpb25TZXJ2aWNlUHJvdmlkZXIsXG5cdExvZ1NlcnZpY2VQcm92aWRlcixcblx0TW9kZWxTZXJ2aWNlUHJvdmlkZXIsXG5cdFNlcnZlclNlcnZpY2VQcm92aWRlcixcblx0U3RvcmFnZVNlcnZpY2VQcm92aWRlclxufSBmcm9tIFwiQENvcmVcIjtcblxuLyoqXG4gKiBUaGVzZSBhcmUgb3VyIHNlcnZpY2UgcHJvdmlkZXJzLCB0aGV5IGFyZSB0aGVcbiAqIGNvcmUgZnVuY3Rpb25hbGl0eSBvZiB0aGUgZnJhbWV3b3JrLlxuICpcbiAqIFlvdSBjYW4gcmVtb3ZlIGEgcHJvdmlkZXIgYW5kIHJlcGxhY2UgaXQgd2l0aCB5b3VyXG4gKiBvd24sIG9yIGNvbXBsZXRlbHkgZGlzYWJsZSBzb21lIGZ1bmN0aW9uYWxpdHkuXG4gKi9cbmV4cG9ydCBjb25zdCBwcm92aWRlcnMgPSBbXG5cblx0RW5jcnlwdGlvblNlcnZpY2VQcm92aWRlcixcblx0TG9nU2VydmljZVByb3ZpZGVyLFxuXHRDYWNoZVNlcnZpY2VQcm92aWRlcixcblx0U3RvcmFnZVNlcnZpY2VQcm92aWRlcixcblx0TW9kZWxTZXJ2aWNlUHJvdmlkZXIsXG5cdEF1dGhTZXJ2aWNlUHJvdmlkZXIsXG5cdENvbnRyb2xsZXJTZXJ2aWNlUHJvdmlkZXIsXG5cdFNlcnZlclNlcnZpY2VQcm92aWRlcixcblxuXTtcblxuLyoqXG4gKiBTZXJ2ZXIgcHJvdmlkZXJzIGFyZSBGYXN0aWZ5IFBsdWdpbnMgdGhhdCB5b3UgcmVnaXN0ZXIgdG8gdGhlIHNlcnZlciB3aGVuIGl0J3MgYm9vdGVkLlxuICovXG5leHBvcnQgY29uc3Qgc2VydmVyUHJvdmlkZXJzOiBBcnJheTxbRmFzdGlmeVBsdWdpbiwgRmFzdGlmeVBsdWdpbk9wdGlvbnNdPiA9IFtcblx0W1xuXHRcdEZhc3RpZnlNdWx0aXBhcnQsXG5cdFx0e30gYXMgRmFzdGlmeU11bHRpcGFydE9wdGlvbnNcblx0XVxuXVxuIiwiaW1wb3J0IHtTcGFjZXNQcm92aWRlcn0gZnJvbSBcIkBDb3JlXCI7XG5cbmV4cG9ydCBjb25zdCBzdG9yYWdlID0ge1xuXG5cdGRlZmF1bHRQcm92aWRlciA6IFNwYWNlc1Byb3ZpZGVyLFxuXG5cdHNwYWNlcyA6IHtcblx0XHRidWNrZXQgICAgICA6IHByb2Nlc3MuZW52LlNQQUNFU19CVUNLRVQsXG5cdFx0dXJsICAgICAgICAgOiBwcm9jZXNzLmVudi5TUEFDRVNfVVJMLFxuXHRcdGVuZHBvaW50ICAgIDogcHJvY2Vzcy5lbnYuU1BBQ0VTX0VORFBPSU5ULFxuXHRcdGNyZWRlbnRpYWxzIDoge1xuXHRcdFx0YWNjZXNzS2V5SWQgICAgIDogcHJvY2Vzcy5lbnYuU1BBQ0VTX0tFWSxcblx0XHRcdHNlY3JldEFjY2Vzc0tleSA6IHByb2Nlc3MuZW52LlNQQUNFU19TRUNSRVQsXG5cdFx0fVxuXHR9XG5cbn1cbiIsImltcG9ydCB7Q29uZmlnfSBmcm9tIFwiQENvbmZpZ1wiO1xuaW1wb3J0IHtGYXN0aWZ5SW5zdGFuY2V9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge0xvZywgU2VydmVyLCBTZXJ2aWNlUHJvdmlkZXJ9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IENvbnRhaW5lciwge0xPR0dFUl9JREVOVElGSUVSfSBmcm9tIFwiLi9Db250YWluZXJcIjtcblxuZXhwb3J0IGNsYXNzIEFwcCB7XG5cblx0LyoqXG5cdCAqIFRoZSBGYXN0aWZ5IFNlcnZlciB3cmFwcGVkIHdpdGggb3VyIG93biBsb2dpY1xuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfc2VydmVyOiBTZXJ2ZXI7XG5cblx0LyoqXG5cdCAqIFRoZSBpbnN0YW5jZSBvZiBGYXN0aWZ5IHRoYXQge0BzZWUgU2VydmVyfSBpcyB1c2luZ1xuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBfaHR0cFNlcnZlcjogRmFzdGlmeUluc3RhbmNlO1xuXG5cdHJlZ2lzdGVyUHJvdmlkZXJzKCkge1xuXHRcdGZvciAoY29uc3QgUHJvdmlkZXJNb2R1bGUgb2YgQ29uZmlnLnByb3ZpZGVycykge1xuXHRcdFx0Q29udGFpbmVyLmJpbmQ8U2VydmljZVByb3ZpZGVyPihQcm92aWRlck1vZHVsZSkudG8oUHJvdmlkZXJNb2R1bGUpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBMZXRzIGdldCBhbGwgdGhlIGFpZHNzXG5cdCAqXG5cdCAqIEBjYXRlZ29yeSBBaWRzXG5cdCAqL1xuXHRhc3luYyByZWdpc3RlclByb3ZpZGVyQmluZGluZ3MoKSB7XG5cdFx0Zm9yIChjb25zdCBQcm92aWRlck1vZHVsZSBvZiBDb25maWcucHJvdmlkZXJzKSB7XG5cdFx0XHRhd2FpdCBDb250YWluZXIuZ2V0PFNlcnZpY2VQcm92aWRlcj4oUHJvdmlkZXJNb2R1bGUpLnJlZ2lzdGVyQmluZGluZ3MoKTtcblxuXHRcdFx0aWYgKENvbnRhaW5lci5pc0JvdW5kKExPR0dFUl9JREVOVElGSUVSKSlcblx0XHRcdFx0TG9nLmluZm8oJ0JvdW5kIGFuZCByZWdpc3RlcmVkICcgKyBQcm92aWRlck1vZHVsZS5uYW1lICsgJyB0byB0aGUgY29udGFpbmVyLicpO1xuXHRcdH1cblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkIGFsbCBzZXJ2aWNlIHByb3ZpZGVycyBhbmQgaW5pdGlhbGlzZSB0aGUgSHR0cCBTZXJ2ZXJcblx0ICovXG5cdGFzeW5jIGJvb3QoKSB7XG4vL1x0XHRDb250YWluZXIuYmluZCgnUk9PVF9ESVInKS50b0NvbnN0YW50VmFsdWUocGF0aC5yZXNvbHZlKF9fZGlybmFtZSwgJy4uJykpO1xuXG5cbi8vXHRcdHRoaXMuX3NlcnZlciAgICAgPSBDb250YWluZXIuZ2V0KFNlcnZlcik7XG4vL1x0XHR0aGlzLl9odHRwU2VydmVyID0gYXdhaXQgdGhpcy5fc2VydmVyLmJ1aWxkKCk7XG4vL1xuLy9cdFx0YXdhaXQgdGhpcy5faHR0cFNlcnZlci5saXN0ZW4oMzAwMCk7XG5cblxuXHR9XG5cblx0LyoqXG5cdCAqIEl0ZXJhdGUgdGhyb3VnaCBhbGwgcHJvdmlkZXJzIGluIHRoZSB7QHNlZSBDb25maWcucHJvdmlkZXJzfVxuXHQgKiBjb25maWcgZmlsZSBhbmQgY2FsbCBib290KCkgb24gdGhlbVxuXHQgKi9cblx0YXN5bmMgYm9vdFByb3ZpZGVycygpIHtcblx0XHRmb3IgYXdhaXQgKGNvbnN0IFByb3ZpZGVyTW9kdWxlIG9mIENvbmZpZy5wcm92aWRlcnMpIHtcblx0XHRcdGF3YWl0IENvbnRhaW5lci5nZXQ8U2VydmljZVByb3ZpZGVyPihQcm92aWRlck1vZHVsZSkuYm9vdCgpO1xuXHRcdH1cblx0fVxuXG5cdHB1YmxpYyBhc3luYyB1cCgpIHtcblxuXHR9XG5cblx0cHVibGljIGRvd24oKSB7XG5cdFx0Y29uc3Qgc2VydmVyID0gQ29udGFpbmVyLmdldDxTZXJ2ZXI+KFNlcnZlcilcblx0XHRzZXJ2ZXIuY2xlYW5VcE1ldGFkYXRhKCk7XG5cdFx0Q29udGFpbmVyLnVuYmluZEFsbCgpO1xuXHR9XG59XG4iLCJpbXBvcnQge2NvbmZpZ30gZnJvbSBcImRvdGVudlwiO1xuXG5jb25maWcoKTtcblxuaW1wb3J0IFwicmVmbGVjdC1tZXRhZGF0YVwiO1xuaW1wb3J0IFwicmVnZW5lcmF0b3ItcnVudGltZVwiO1xuXG5pbXBvcnQgZmV0Y2ggZnJvbSBcIm5vZGUtZmV0Y2hcIjtcblxuZGVjbGFyZSB2YXIgZ2xvYmFsOiBhbnk7XG5nbG9iYWwuZmV0Y2ggPSBmZXRjaDtcblxuZXhwb3J0IGNvbnN0IHdoZW5Cb290c3RyYXBwZWQgPSBhc3luYyAoKSA9PiB7XG5cbn07XG4iLCJpbXBvcnQge0NvbnRhaW5lciBhcyBJb2NDb250YWluZXJ9IGZyb20gXCJpbnZlcnNpZnlcIjtcblxuXG5jb25zdCBDb250YWluZXIgPSBuZXcgSW9jQ29udGFpbmVyKCk7XG5cbmV4cG9ydCBjb25zdCBBVVRIRURfVVNFUl9JREVOVElGSUVSICA9IFN5bWJvbCgnQXV0aG9yaXNlZFVzZXInKTtcbmV4cG9ydCBjb25zdCBIVFRQX0NPTlRFWFRfSURFTlRJRklFUiA9IFN5bWJvbCgnSHR0cENvbnRleHQnKTtcbmV4cG9ydCBjb25zdCBIVFRQX1JFUVVFU1RfSURFTlRJRklFUiA9IFN5bWJvbCgnSHR0cFJlcXVlc3QnKTtcbmV4cG9ydCBjb25zdCBDT05UQUlORVJfSURFTlRJRklFUiA9IFN5bWJvbCgnQ29udGFpbmVyJyk7XG5leHBvcnQgY29uc3QgTE9HR0VSX0lERU5USUZJRVIgICAgPSBTeW1ib2woJ0xvZ2dlcicpO1xuXG5leHBvcnQgZGVmYXVsdCBDb250YWluZXI7XG4iLCJleHBvcnQgZW51bSBERVNJR05fTUVUQSB7XG5cdERFU0lHTl9QQVJBTV9UWVBFUyA9ICdkZXNpZ246cGFyYW10eXBlcycsXG5cdERFU0lHTl9UWVBFICAgICAgICA9ICdkZXNpZ246dHlwZScsXG5cdERFU0lHTl9QUk9QRVJUSUVTICA9ICdkZXNpZ246cHJvcGVydGllcycsXG5cdERFU0lHTl9SRVRVUk5fVFlQRSA9ICdkZXNpZ246cmV0dXJudHlwZScsXG59XG5cbi8qKlxuICogQWxsIG9mIG91ciByZWZsZWN0IG1ldGFkYXRhIGFjY2Vzc29yIG5hbWVzXG4gKi9cbmV4cG9ydCBlbnVtIE1FVEFEQVRBIHtcblx0Q09OVFJPTExFUiAgICAgICAgICAgICAgICAgICAgID0gJ2NvbnRyb2xsZXInLFxuXHRDT05UUk9MTEVSX01FVEhPRFMgICAgICAgICAgICAgPSAnY29udHJvbGxlci1tZXRob2RzJyxcblx0SFRUUF9DT05URVhUICAgICAgICAgICAgICAgICAgID0gJ2h0dHAtY29udGV4dCcsXG5cdE1JRERMRVdBUkUgICAgICAgICAgICAgICAgICAgICA9ICdtaWRkbGV3YXJlJyxcblx0UkVRVUVTVF9NRVRIT0RfRFRPICAgICAgICAgICAgID0gJ3JlcXVlc3QtbWV0aG9kLWR0bycsXG5cdFJFUVVFU1RfTUVUSE9EX0ZBU1RJRllfUkVRVUVTVCA9ICdyZXF1ZXN0LW1ldGhvZC1mYXN0aWZ5LXJlcXVlc3QnLFxuXHRSRVFVRVNUX01FVEhPRF9ST1VURV9QQVJBTUVURVIgPSAncmVxdWVzdC1tZXRob2Qtcm91dGUtcGFyYW1ldGVyJyxcblx0UkVRVUVTVF9NRVRIT0RfUVVFUllfUEFSQU1FVEVSID0gJ3JlcXVlc3QtbWV0aG9kLXF1ZXJ5LXBhcmFtZXRlcicsXG5cdFJFUVVFU1RfTUVUSE9EX0JPRFkgICAgICAgICAgICA9ICdyZXF1ZXN0LW1ldGhvZC1ib2R5Jyxcblx0UkVRVUVTVF9NRVRIT0RfSEVBREVSUyAgICAgICAgID0gJ3JlcXVlc3QtbWV0aG9kLWhlYWRlcnMnLFxuXHRNT0RFTCAgICAgICAgICAgICAgICAgICAgICAgICAgPSAnTU9ERUwnLFxufVxuXG4vKipcbiAqIFdlIHNldCBhbGwgb2Ygb3VyIGNvbnRyb2xsZXIgcmVxdWVzdCBwYXJhbSBtZXRhIGtleXMgaGVyZVxuICogT3RoZXJ3aXNlIGl0IHdpbGwgYm9yayBiZWNhdXNlIGl0IHdpbGwgdHJ5IHRvIHVzZSBvdGhlciB0aGluZ3NcbiAqL1xuZXhwb3J0IGNvbnN0IENPTlRST0xMRVJfTUVUSE9EX1BBUkFNUzogQXJyYXk8TUVUQURBVEE+ID0gW1xuXHRNRVRBREFUQS5SRVFVRVNUX01FVEhPRF9EVE8sXG5cdE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX0ZBU1RJRllfUkVRVUVTVCxcblx0TUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfUk9VVEVfUEFSQU1FVEVSLFxuXHRNRVRBREFUQS5SRVFVRVNUX01FVEhPRF9RVUVSWV9QQVJBTUVURVIsXG5cdE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX0JPRFksXG5cdE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX0hFQURFUlNcbl07XG4iLCJpbXBvcnQge2RlY29yYXRlLCBpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge01FVEFEQVRBfSBmcm9tIFwiLi4vRGVjb3JhdG9yRGF0YVwiO1xuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyb2xsZXJNZXRhZGF0YSB7XG5cdHBhdGg6IHN0cmluZztcblx0dGFyZ2V0OiBhbnk7XG59XG5cbi8vZXhwb3J0IGNvbnN0IGN1cnJlbnRVc2VyICAgICAgPSBsYXp5SW5qZWN0KEFVVEhFRF9VU0VSX0lERU5USUZJRVIpO1xuLy9leHBvcnQgY29uc3QgY3VycmVudFJlcXVlc3QgICA9IGxhenlJbmplY3QoSFRUUF9SRVFVRVNUX0lERU5USUZJRVIpO1xuLy9leHBvcnQgY29uc3QgcmVxdWVzdENvbnRhaW5lciA9IGluamVjdChDT05UQUlORVJfSURFTlRJRklFUik7XG5cbmV4cG9ydCBmdW5jdGlvbiBjb250cm9sbGVyKHBhdGg6IHN0cmluZyA9ICcnKSB7XG5cdHJldHVybiBmdW5jdGlvbiAodGFyZ2V0OiBhbnkpIHtcblxuXHRcdGNvbnN0IGN1cnJlbnRNZXRhZGF0YTogQ29udHJvbGxlck1ldGFkYXRhID0ge1xuXHRcdFx0cGF0aCAgIDogcGF0aCxcblx0XHRcdHRhcmdldCA6IHRhcmdldFxuXHRcdH07XG5cblx0XHRkZWNvcmF0ZShpbmplY3RhYmxlKCksIHRhcmdldCk7XG5cdFx0UmVmbGVjdC5kZWZpbmVNZXRhZGF0YShNRVRBREFUQS5DT05UUk9MTEVSLCBjdXJyZW50TWV0YWRhdGEsIHRhcmdldCk7XG5cblx0XHQvLyBXZSBuZWVkIHRvIGNyZWF0ZSBhbiBhcnJheSB0aGF0IGNvbnRhaW5zIHRoZSBtZXRhZGF0YSBvZiBhbGxcblx0XHQvLyB0aGUgY29udHJvbGxlcnMgaW4gdGhlIGFwcGxpY2F0aW9uLCB0aGUgbWV0YWRhdGEgY2Fubm90IGJlXG5cdFx0Ly8gYXR0YWNoZWQgdG8gYSBjb250cm9sbGVyLiBJdCBuZWVkcyB0byBiZSBhdHRhY2hlZCB0byBhIGdsb2JhbFxuXHRcdC8vIFdlIGF0dGFjaCBtZXRhZGF0YSB0byB0aGUgUmVmbGVjdCBvYmplY3QgaXRzZWxmIHRvIGF2b2lkXG5cdFx0Ly8gZGVjbGFyaW5nIGFkZGl0aW9uYWwgZ2xvYmFscy4gQWxzbywgdGhlIFJlZmxlY3QgaXMgYXZhaWxhYmxlXG5cdFx0Ly8gaW4gYm90aCBub2RlIGFuZCB3ZWIgYnJvd3NlcnMuXG5cdFx0Y29uc3QgcHJldmlvdXNNZXRhZGF0YTogQ29udHJvbGxlck1ldGFkYXRhW10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKFxuXHRcdFx0TUVUQURBVEEuQ09OVFJPTExFUixcblx0XHRcdFJlZmxlY3Rcblx0XHQpIHx8IFtdO1xuXG5cdFx0Y29uc3QgbmV3TWV0YWRhdGEgPSBbY3VycmVudE1ldGFkYXRhLCAuLi5wcmV2aW91c01ldGFkYXRhXTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXG5cdFx0XHRNRVRBREFUQS5DT05UUk9MTEVSLFxuXHRcdFx0bmV3TWV0YWRhdGEsXG5cdFx0XHRSZWZsZWN0XG5cdFx0KTtcblxuXHR9O1xufVxuXG5cbiIsImltcG9ydCB7REVTSUdOX01FVEF9IGZyb20gXCIuLi9EZWNvcmF0b3JEYXRhXCI7XG5cbmV4cG9ydCBjbGFzcyBEZWNvcmF0b3JIZWxwZXJzIHtcblxuXHQvKipcblx0ICogR2V0IGluZm9ybWF0aW9uIGFib3V0IHRoZSB0eXBlcy9wYXJhbWV0ZXJzIGZvciB0aGUgbWV0aG9kL2NvbnN0cnVjdG9yXG5cdCAqXG5cdCAqIEBwYXJhbSB0YXJnZXRcblx0ICogQHBhcmFtIHByb3BlcnR5S2V5XG5cdCAqL1xuXHRzdGF0aWMgcGFyYW1UeXBlcyh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk/OiBzdHJpbmcgfCBzeW1ib2wpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YShERVNJR05fTUVUQS5ERVNJR05fUEFSQU1fVFlQRVMsIHRhcmdldCwgcHJvcGVydHlLZXkpXG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSB0eXBlIG9mIGEgcHJvcGVydHlcblx0ICpcblx0ICogQHBhcmFtIHRhcmdldFxuXHQgKiBAcGFyYW0gcHJvcGVydHlLZXlcblx0ICovXG5cdHN0YXRpYyBwcm9wZXJ0eVR5cGUodGFyZ2V0OiBhbnksIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wpIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YShERVNJR05fTUVUQS5ERVNJR05fVFlQRSwgdGFyZ2V0LCBwcm9wZXJ0eUtleSlcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHByb3BlcnRpZXMgb2YgYSB0YXJnZXRcblx0ICpcblx0ICogSWYgdGhlIHRhcmdldCBpcyBhIGNsYXNzIGNvbnN0cnVjdG9yIGFuZCBtZXRob2QgaXMgdGhlIG5hbWUgb2YgYSBtZXRob2Rcblx0ICogSXQgd2lsbCByZXR1cm4gdGhlIHByb3BlcnRpZXMgZm9yIHRoZSBtZXRob2Q/XG5cdCAqXG5cdCAqIEBwYXJhbSB0YXJnZXRcblx0ICogQHBhcmFtIG1ldGhvZFxuXHQgKi9cblx0c3RhdGljIHByb3BlcnRpZXModGFyZ2V0OiBhbnksIG1ldGhvZD86IHN0cmluZykge1xuXHRcdHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKERFU0lHTl9NRVRBLkRFU0lHTl9QUk9QRVJUSUVTLCB0YXJnZXQsIG1ldGhvZClcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgdGhlIHJldHVybiB0eXBlXG5cdCAqXG5cdCAqIEBwYXJhbSB0YXJnZXRcblx0ICovXG5cdHN0YXRpYyByZXR1cm5UeXBlKHRhcmdldDogYW55KSB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoREVTSUdOX01FVEEuREVTSUdOX1JFVFVSTl9UWVBFLCB0YXJnZXQpXG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBuYW1lcyBvZiBhbGwgcGFyYW1ldGVycyBzcGVjaWZpZWQgaW4gYSBmdW5jdGlvblxuXHQgKiBJdCBzZWVtcyB3ZSBjYW5ub3QgdXNlIFJlZmxlY3QgdG8gb2J0YWluIHRoZXNlLCBvbmx5IHRoZSB0eXBlc1xuXHQgKlxuXHQgKiBAcGFyYW0gZnVuY1xuXHQgKi9cblx0c3RhdGljIGdldFBhcmFtZXRlck5hbWVzKGZ1bmM6IEZ1bmN0aW9uKSB7XG5cblx0XHQvLyBTdHJpbmcgcmVwcmVzZW50YXRpb24gb2YgdGhlIGZ1bmN0aW9uIGNvZGVcblx0XHRsZXQgc3RyID0gZnVuYy50b1N0cmluZygpO1xuXG5cdFx0Ly8gUmVtb3ZlIGNvbW1lbnRzIG9mIHRoZSBmb3JtIC8qIC4uLiAqL1xuXHRcdC8vIFJlbW92aW5nIGNvbW1lbnRzIG9mIHRoZSBmb3JtIC8vXG5cdFx0Ly8gUmVtb3ZlIGJvZHkgb2YgdGhlIGZ1bmN0aW9uIHsgLi4uIH1cblx0XHQvLyByZW1vdmluZyAnPT4nIGlmIGZ1bmMgaXMgYXJyb3cgZnVuY3Rpb25cblx0XHRzdHIgPSBzdHIucmVwbGFjZSgvXFwvXFwqW1xcc1xcU10qP1xcKlxcLy9nLCAnJylcblx0XHRcdC5yZXBsYWNlKC9cXC9cXC8oLikqL2csICcnKVxuXHRcdFx0LnJlcGxhY2UoL3tbXFxzXFxTXSp9LywgJycpXG5cdFx0XHQucmVwbGFjZSgvPT4vZywgJycpXG5cdFx0XHQudHJpbSgpO1xuXG5cdFx0Ly8gU3RhcnQgcGFyYW1ldGVyIG5hbWVzIGFmdGVyIGZpcnN0ICcoJ1xuXHRcdGNvbnN0IHN0YXJ0ID0gc3RyLmluZGV4T2YoXCIoXCIpICsgMTtcblxuXHRcdC8vIEVuZCBwYXJhbWV0ZXIgbmFtZXMgaXMganVzdCBiZWZvcmUgbGFzdCAnKSdcblx0XHRjb25zdCBlbmQgPSBzdHIubGVuZ3RoIC0gMTtcblxuXHRcdGNvbnN0IHJlc3VsdCA9IHN0ci5zdWJzdHJpbmcoc3RhcnQsIGVuZCkuc3BsaXQoXCIsIFwiKTtcblxuXHRcdGNvbnN0IHBhcmFtcyA9IFtdO1xuXG5cdFx0cmVzdWx0LmZvckVhY2goZWxlbWVudCA9PiB7XG5cblx0XHRcdC8vIFJlbW92aW5nIGFueSBkZWZhdWx0IHZhbHVlXG5cdFx0XHRlbGVtZW50ID0gZWxlbWVudC5yZXBsYWNlKC89W1xcc1xcU10qL2csICcnKS50cmltKCk7XG5cblx0XHRcdGlmIChlbGVtZW50Lmxlbmd0aCA+IDApXG5cdFx0XHRcdHBhcmFtcy5wdXNoKGVsZW1lbnQpO1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIHBhcmFtcztcblx0fVxuXG5cbn1cbiIsImltcG9ydCB7TWlkZGxld2FyZSBhcyBCYXNlTWlkZGxld2FyZSwgTWlkZGxld2FyZX0gZnJvbSBcIi4uL1Byb3ZpZGVycy9IdHRwL0NvbnRyb2xsZXIvTWlkZGxld2FyZVwiO1xuXG5leHBvcnQgdHlwZSBSb3V0ZU1pZGRsZXdhcmUgPSBCYXNlTWlkZGxld2FyZTtcblxuXG5leHBvcnQgZnVuY3Rpb24gbWlkZGxld2FyZShtaWRkbGV3YXJlOiBSb3V0ZU1pZGRsZXdhcmUpOiBhbnkge1xuXHRyZXR1cm4gZnVuY3Rpb24gKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleT86IHN0cmluZywgZGVzY3JpcHRvcj86IFByb3BlcnR5RGVzY3JpcHRvcikge1xuXHRcdGNvbnN0IG1pZGRsZXdhcmVzID0gW107XG5cdFx0Y29uc3QgbWV0YSAgICAgICAgPSBNaWRkbGV3YXJlLmdldE1ldGFkYXRhKHRhcmdldCk7XG5cblx0XHRpZiAobWV0YT8ubWlkZGxld2FyZXMpIHtcblx0XHRcdG1pZGRsZXdhcmVzLnB1c2goLi4ubWV0YS5taWRkbGV3YXJlcyk7XG5cdFx0fVxuXG5cdFx0bWlkZGxld2FyZXMucHVzaChtaWRkbGV3YXJlKTtcblxuXHRcdGxldCBiaW5kVGFyZ2V0ID0gZGVzY3JpcHRvcj8udmFsdWU7XG5cblx0XHRpZiAoIWJpbmRUYXJnZXQpIHtcblx0XHRcdGJpbmRUYXJnZXQgPSB0YXJnZXQ7XG5cdFx0fVxuXG5cdFx0TWlkZGxld2FyZS5zZXRNZXRhZGF0YShiaW5kVGFyZ2V0LCBtaWRkbGV3YXJlcyk7XG5cdH1cbn1cbiIsImltcG9ydCB7Y2xhc3NUb1BsYWluLCBwbGFpblRvQ2xhc3MsIFRyYW5zZm9ybX0gZnJvbSBcImNsYXNzLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQge0luZGV4U3BlY2lmaWNhdGlvbiwgT2JqZWN0SWR9IGZyb20gXCJtb25nb2RiXCI7XG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSc7XG5pbXBvcnQge0NsYXNzVHlwZSwgSW5kZXhPcHRpb25zLCBOZXN0ZWQsIFJlZiwgU2ltcGxlSW5kZXhPcHRpb25zfSBmcm9tIFwiQENvcmVcIjtcblxuXG5mdW5jdGlvbiBhZGRSZWYobmFtZTogc3RyaW5nLCByZWY6IFJlZiwgdGFyZ2V0OiBhbnkpIHtcblx0Y29uc3QgcmVmcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ21vbmdvOnJlZnMnLCB0YXJnZXQpIHx8IHt9O1xuXHRyZWZzW25hbWVdID0gcmVmO1xuXHRSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdtb25nbzpyZWZzJywgcmVmcywgdGFyZ2V0KTtcbn1cblxuZnVuY3Rpb24gcHVzaFRvTWV0YWRhdGEobWV0YWRhdGFLZXk6IHN0cmluZywgdmFsdWVzOiBhbnlbXSwgdGFyZ2V0OiBhbnkpIHtcblx0Y29uc3QgZGF0YTogYW55W10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKG1ldGFkYXRhS2V5LCB0YXJnZXQpIHx8IFtdO1xuXHRSZWZsZWN0LmRlZmluZU1ldGFkYXRhKG1ldGFkYXRhS2V5LCBkYXRhLmNvbmNhdCh2YWx1ZXMpLCB0YXJnZXQpO1xufVxuXG5mdW5jdGlvbiBpc05vdFByaW1pdGl2ZSh0YXJnZXRUeXBlOiBDbGFzc1R5cGU8YW55PiwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXHRpZiAodGFyZ2V0VHlwZSA9PT0gT2JqZWN0SWQgfHwgdGFyZ2V0VHlwZSA9PT0gU3RyaW5nIHx8IHRhcmdldFR5cGUgPT09IE51bWJlciB8fCB0YXJnZXRUeXBlID09PSBCb29sZWFuKSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKGBwcm9wZXJ0eSAnJHtwcm9wZXJ0eUtleX0nIGNhbm5vdCBoYXZlIG5lc3RlZCB0eXBlICcke3RhcmdldFR5cGV9J2ApO1xuXHR9XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBuZXN0ZWQodHlwZUZ1bmN0aW9uOiBhbnkpIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXHRcdGNvbnN0IHRhcmdldFR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXHRcdGlzTm90UHJpbWl0aXZlKHRhcmdldFR5cGUsIHByb3BlcnR5S2V5KTtcblxuLy9cdFx0VHlwZSgoKSA9PiB0eXBlRnVuY3Rpb24pKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG5cdFx0VHJhbnNmb3JtKCh2YWwpID0+IHtcblx0XHRcdGlmICghdmFsLnZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGFyZ2V0VHlwZSA9PT0gQXJyYXkpIHtcblx0XHRcdFx0cmV0dXJuIHZhbC52YWx1ZS5tYXAodiA9PiBwbGFpblRvQ2xhc3ModHlwZUZ1bmN0aW9uLCB2KSlcblx0XHRcdH1cblxuXHRcdFx0cmV0dXJuIHBsYWluVG9DbGFzcyh0eXBlRnVuY3Rpb24sIHZhbC52YWx1ZSlcblx0XHR9LCB7dG9DbGFzc09ubHkgOiB0cnVlfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cblx0XHRUcmFuc2Zvcm0oKHZhbCkgPT4ge1xuXHRcdFx0aWYgKCF2YWwudmFsdWUpIHtcblx0XHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0XHR9XG5cdFx0XHRpZiAodGFyZ2V0VHlwZSA9PT0gQXJyYXkpIHtcblx0XHRcdFx0cmV0dXJuIHZhbC52YWx1ZS5tYXAodiA9PiBjbGFzc1RvUGxhaW4odikpXG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBjbGFzc1RvUGxhaW4odmFsLnZhbHVlKVxuXHRcdH0sIHt0b1BsYWluT25seSA6IHRydWV9KSh0YXJnZXQsIHByb3BlcnR5S2V5KTtcblxuXG5cdFx0cHVzaFRvTWV0YWRhdGEoJ21vbmdvOm5lc3RlZCcsIFt7bmFtZSA6IHByb3BlcnR5S2V5LCB0eXBlRnVuY3Rpb24sIGFycmF5IDogdGFyZ2V0VHlwZSA9PT0gQXJyYXl9IGFzIE5lc3RlZF0sIHRhcmdldCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGlnbm9yZSh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IGFueSkge1xuXHRjb25zdCBpZ25vcmVzICAgICAgICA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ21vbmdvOmlnbm9yZScsIHRhcmdldCkgfHwge307XG5cdGlnbm9yZXNbcHJvcGVydHlLZXldID0gdHJ1ZTtcblx0UmVmbGVjdC5kZWZpbmVNZXRhZGF0YSgnbW9uZ286aWdub3JlJywgaWdub3JlcywgdGFyZ2V0KTtcbn1cblxuXG5leHBvcnQgZnVuY3Rpb24gaW5kZXg8VCA9IGFueT4odHlwZTogbnVtYmVyIHwgc3RyaW5nID0gMSwgb3B0aW9uczogU2ltcGxlSW5kZXhPcHRpb25zPFQ+ID0ge30pIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXHRcdGlmICghcHJvcGVydHlLZXkpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignQGluZGV4IGRlY29yYXRvciBjYW4gb25seSBiZSBhcHBsaWVkIHRvIGNsYXNzIHByb3BlcnRpZXMnKTtcblx0XHR9XG5cblx0XHRjb25zdCBpbmRleE9wdGlvbnM6IEluZGV4U3BlY2lmaWNhdGlvbiA9IHtcblx0XHRcdG5hbWUgOiBwcm9wZXJ0eUtleSxcblx0XHRcdC4uLm9wdGlvbnMsXG5cdFx0XHRrZXkgOiB7W3Byb3BlcnR5S2V5XSA6IHR5cGV9IGFzIGFueSxcblx0XHR9O1xuXHRcdHB1c2hUb01ldGFkYXRhKCdtb25nbzppbmRleGVzJywgW2luZGV4T3B0aW9uc10sIHRhcmdldCk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGluZGV4ZXM8VCA9IGFueT4ob3B0aW9uczogSW5kZXhPcHRpb25zPFQ+W10pIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSkge1xuXHRcdHB1c2hUb01ldGFkYXRhKCdtb25nbzppbmRleGVzJywgb3B0aW9ucywgdGFyZ2V0LnByb3RvdHlwZSk7XG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHJlZihtb2RlbFJlZmVyZW5jZTogQ2xhc3NUeXBlPGFueT4pIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXHRcdGNvbnN0IHRhcmdldFR5cGUgPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdkZXNpZ246dHlwZScsIHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXHRcdGlzTm90UHJpbWl0aXZlKHRhcmdldFR5cGUsIHByb3BlcnR5S2V5KTtcblxuXHRcdGNvbnN0IGlzQXJyYXkgPSB0YXJnZXRUeXBlID09PSBBcnJheTtcblx0XHRjb25zdCByZWZJZCAgID0gcGx1cmFsaXplKHBsdXJhbGl6ZShwcm9wZXJ0eUtleSwgMSkgKyAoaXNBcnJheSA/ICdJZHMnIDogJ0lkJyksIGlzQXJyYXkgPyAyIDogMSk7XG5cblx0XHRSZWZsZWN0LmRlZmluZU1ldGFkYXRhKCdkZXNpZ246dHlwZScsIChpc0FycmF5ID8gQXJyYXkgOiBPYmplY3RJZCksIHRhcmdldCwgcmVmSWQpO1xuXG5cdFx0Y29uc3QgcmVmSW5mbyA9IHtcblx0XHRcdF9pZCAgICAgICA6IHJlZklkLFxuXHRcdFx0YXJyYXkgICAgIDogaXNBcnJheSxcblx0XHRcdG1vZGVsTmFtZSA6IG1vZGVsUmVmZXJlbmNlLm5hbWVcblx0XHR9XG5cdFx0YWRkUmVmKHByb3BlcnR5S2V5LCByZWZJbmZvLCB0YXJnZXQpO1xuXG5cdFx0VHJhbnNmb3JtKCh2YWwpID0+IHtcblx0XHRcdGlmICghdmFsLnZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXG5cdFx0XHRpZiAodGFyZ2V0VHlwZSA9PT0gQXJyYXkpIHtcblx0XHRcdFx0cmV0dXJuIHZhbC52YWx1ZS5tYXAodiA9PiBwbGFpblRvQ2xhc3MobW9kZWxSZWZlcmVuY2UsIHYpKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gcGxhaW5Ub0NsYXNzKG1vZGVsUmVmZXJlbmNlLCB2YWwudmFsdWUpXG5cdFx0fSwge3RvQ2xhc3NPbmx5IDogdHJ1ZX0pKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG5cdFx0VHJhbnNmb3JtKCh2YWwpID0+IHtcblx0XHRcdGlmICghdmFsLnZhbHVlKSB7XG5cdFx0XHRcdHJldHVybiBudWxsO1xuXHRcdFx0fVxuXHRcdFx0aWYgKHRhcmdldFR5cGUgPT09IEFycmF5KSB7XG5cdFx0XHRcdHJldHVybiB2YWwudmFsdWUubWFwKHYgPT4gY2xhc3NUb1BsYWluKHYpKVxuXHRcdFx0fVxuXG5cdFx0XHRyZXR1cm4gY2xhc3NUb1BsYWluKHZhbC52YWx1ZSlcblx0XHR9LCB7dG9QbGFpbk9ubHkgOiB0cnVlfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cblx0fTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElkcyh0YXJnZXQ6IGFueSwgcHJvcGVydHlLZXk6IHN0cmluZykge1xuXG5cdGlzTm90UHJpbWl0aXZlKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG5cdFRyYW5zZm9ybSgodmFsKSA9PiB7XG5cdFx0aWYgKCF2YWwudmFsdWUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWwudmFsdWUubWFwKHYgPT4gbmV3IE9iamVjdElkKHYpKVxuXHR9LCB7dG9DbGFzc09ubHkgOiB0cnVlfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cdFRyYW5zZm9ybSgodmFsKSA9PiB7XG5cdFx0aWYgKCF2YWwudmFsdWUpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWwudmFsdWUubWFwKHYgPT4gdi50b1N0cmluZygpKVxuXHR9LCB7dG9QbGFpbk9ubHkgOiB0cnVlfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIElkKHRhcmdldDogYW55LCBwcm9wZXJ0eUtleTogc3RyaW5nKSB7XG5cblx0VHJhbnNmb3JtKCh7dmFsdWV9KSA9PiBuZXcgT2JqZWN0SWQodmFsdWUpLCB7dG9DbGFzc09ubHkgOiB0cnVlfSkodGFyZ2V0LCBwcm9wZXJ0eUtleSk7XG5cdFRyYW5zZm9ybSgoe3ZhbHVlfSkgPT4gdmFsdWUudG9TdHJpbmcoKSwge3RvUGxhaW5Pbmx5IDogdHJ1ZX0pKHRhcmdldCwgcHJvcGVydHlLZXkpO1xuXG59XG5cbjVcbiIsImltcG9ydCB7TUVUQURBVEF9IGZyb20gXCIuLi9EZWNvcmF0b3JEYXRhXCI7XG5pbXBvcnQge0NvbnRyb2xsZXJNZXRhZGF0YX0gZnJvbSBcIi4vQ29udHJvbGxlclwiO1xuaW1wb3J0IHtEZWNvcmF0b3JIZWxwZXJzfSBmcm9tIFwiLi9EZWNvcmF0b3JIZWxwZXJzXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgSGFuZGxlckRlY29yYXRvciB7XG5cdCh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpOiB2b2lkO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyb2xsZXJNZXRob2RQYXJhbWV0ZXJNZXRhZGF0YSB7XG5cdG5hbWU6IHN0cmluZztcblx0dHlwZTogYW55O1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIENvbnRyb2xsZXJNZXRob2RNZXRhZGF0YSBleHRlbmRzIENvbnRyb2xsZXJNZXRhZGF0YSB7XG5cdG1ldGhvZDogc3RyaW5nO1xuXHRrZXk6IHN0cmluZztcblx0cGFyYW1ldGVyczogQ29udHJvbGxlck1ldGhvZFBhcmFtZXRlck1ldGFkYXRhW107XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBhbGwocGF0aDogc3RyaW5nKTogSGFuZGxlckRlY29yYXRvciB7XG5cdHJldHVybiBodHRwTWV0aG9kKFwiYWxsXCIsIHBhdGgpO1xufVxuXG5leHBvcnQgZnVuY3Rpb24gZ2V0KHBhdGg6IHN0cmluZyk6IEhhbmRsZXJEZWNvcmF0b3Ige1xuXHRyZXR1cm4gaHR0cE1ldGhvZChcImdldFwiLCBwYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHBvc3QocGF0aDogc3RyaW5nKTogSGFuZGxlckRlY29yYXRvciB7XG5cdHJldHVybiBodHRwTWV0aG9kKFwicG9zdFwiLCBwYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIHB1dChwYXRoOiBzdHJpbmcpOiBIYW5kbGVyRGVjb3JhdG9yIHtcblx0cmV0dXJuIGh0dHBNZXRob2QoXCJwdXRcIiwgcGF0aCk7XG59XG5cbmV4cG9ydCBmdW5jdGlvbiBwYXRjaChwYXRoOiBzdHJpbmcpOiBIYW5kbGVyRGVjb3JhdG9yIHtcblx0cmV0dXJuIGh0dHBNZXRob2QoXCJwYXRjaFwiLCBwYXRoKTtcbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGhlYWQocGF0aDogc3RyaW5nKTogSGFuZGxlckRlY29yYXRvciB7XG5cdHJldHVybiBodHRwTWV0aG9kKFwiaGVhZFwiLCBwYXRoKTtcbn1cblxuLyoqXG4gKiBERUxFVEUgaHR0cCBtZXRob2RcbiAqIFlvdSBjYW4gYWxzbyB1c2UgQGRlbGV0ZV9cbiAqIFdlIGNhbid0IHVzZSB0aGUgbmFtZSBkZWxldGUgaW4gSlMvVFMuXG4gKiBAcGFyYW0gcGF0aFxuICovXG5leHBvcnQgZnVuY3Rpb24gZGVzdHJveShwYXRoOiBzdHJpbmcpOiBIYW5kbGVyRGVjb3JhdG9yIHtcblx0cmV0dXJuIGh0dHBNZXRob2QoXCJkZWxldGVcIiwgcGF0aCk7XG59XG5cbi8qKlxuICogREVMRVRFIGh0dHAgbWV0aG9kXG4gKiBZb3UgY2FuIGFsc28gdXNlIEBkZWxldGVfXG4gKiBXZSBjYW4ndCB1c2UgdGhlIG5hbWUgZGVsZXRlIGluIEpTL1RTLlxuICogQHBhcmFtIHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIHJlbW92ZShwYXRoOiBzdHJpbmcpOiBIYW5kbGVyRGVjb3JhdG9yIHtcblx0cmV0dXJuIGh0dHBNZXRob2QoXCJkZWxldGVcIiwgcGF0aCk7XG59XG5cbi8qKlxuICogREVMRVRFIGh0dHAgbWV0aG9kXG4gKiBJZiB5b3UgZG9uJ3QgbGlrZSB0byB1c2UgXCJkZXN0cm95XCIvXCJyZW1vdmVcIlxuICogQHBhcmFtIHBhdGhcbiAqL1xuZXhwb3J0IGZ1bmN0aW9uIGRlbGV0ZV8ocGF0aDogc3RyaW5nKTogSGFuZGxlckRlY29yYXRvciB7XG5cdHJldHVybiBodHRwTWV0aG9kKFwiZGVsZXRlXCIsIHBhdGgpO1xufVxuXG5cbmV4cG9ydCBmdW5jdGlvbiBodHRwTWV0aG9kKG1ldGhvZDogc3RyaW5nLCBwYXRoOiBzdHJpbmcpOiBIYW5kbGVyRGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcsIHZhbHVlOiBhbnkpIHtcblxuXHRcdGNvbnN0IGNvbnRyb2xsZXJNZXRob2QgPSB0YXJnZXRba2V5XTtcblx0XHRjb25zdCBwYXJhbWV0ZXJOYW1lcyAgID0gRGVjb3JhdG9ySGVscGVycy5nZXRQYXJhbWV0ZXJOYW1lcyhjb250cm9sbGVyTWV0aG9kKTtcblx0XHRjb25zdCBwYXJhbWV0ZXJUeXBlcyAgID0gRGVjb3JhdG9ySGVscGVycy5wYXJhbVR5cGVzKHRhcmdldCwga2V5KTtcblxuXHRcdGNvbnN0IHBhcmFtZXRlcnMgPSBwYXJhbWV0ZXJOYW1lcy5tYXAoKG5hbWUsIGluZGV4KSA9PiAoe1xuXHRcdFx0bmFtZSA6IG5hbWUsXG5cdFx0XHR0eXBlIDogcGFyYW1ldGVyVHlwZXNbaW5kZXhdID8/IG51bGxcblx0XHR9KSlcblxuXHRcdGNvbnN0IG1ldGFkYXRhOiBDb250cm9sbGVyTWV0aG9kTWV0YWRhdGEgPSB7XG5cdFx0XHRrZXksXG5cdFx0XHRtZXRob2QsXG5cdFx0XHRwYXRoLFxuXHRcdFx0dGFyZ2V0LFxuXHRcdFx0cGFyYW1ldGVyc1xuXHRcdH07XG5cblx0XHRjb25zdCBtZXRhZGF0YUxpc3Q6IENvbnRyb2xsZXJNZXRob2RNZXRhZGF0YVtdID0gUmVmbGVjdC5nZXRNZXRhZGF0YShNRVRBREFUQS5DT05UUk9MTEVSX01FVEhPRFMsIHRhcmdldC5jb25zdHJ1Y3RvcikgfHwgW107XG5cblx0XHRpZiAoIVJlZmxlY3QuaGFzTWV0YWRhdGEoTUVUQURBVEEuQ09OVFJPTExFUl9NRVRIT0RTLCB0YXJnZXQuY29uc3RydWN0b3IpKSB7XG5cdFx0XHRSZWZsZWN0LmRlZmluZU1ldGFkYXRhKE1FVEFEQVRBLkNPTlRST0xMRVJfTUVUSE9EUywgbWV0YWRhdGFMaXN0LCB0YXJnZXQuY29uc3RydWN0b3IpO1xuXHRcdH1cblxuXHRcdG1ldGFkYXRhTGlzdC5wdXNoKG1ldGFkYXRhKTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuQ09OVFJPTExFUl9NRVRIT0RTLCBtZXRhZGF0YUxpc3QsIHRhcmdldC5jb25zdHJ1Y3Rvcik7XG5cdH07XG59XG4iLCJpbXBvcnQge0RhdGFUcmFuc2Zlck9iamVjdFBhcmFtLCBSZXF1ZXN0Qm9keVBhcmFtLCBSZXF1ZXN0SGVhZGVyc1BhcmFtLCBSb3V0ZVBhcmFtZXRlclBhcmFtLCBSb3V0ZVF1ZXJ5UGFyYW19IGZyb20gXCJAQ29yZVwiO1xuXG5cbmV4cG9ydCBmdW5jdGlvbiBkdG8odmFsaWRhdGVPblJlcXVlc3Q/OiBib29sZWFuKTogUGFyYW1ldGVyRGVjb3JhdG9yIHtcblx0cmV0dXJuIGZ1bmN0aW9uICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg6IG51bWJlcikge1xuXHRcdERhdGFUcmFuc2Zlck9iamVjdFBhcmFtLmhhbmRsZVBhcmFtZXRlcihcblx0XHRcdHt0YXJnZXQsIHByb3BlcnR5S2V5LCBwYXJhbWV0ZXJJbmRleH0sIHZhbGlkYXRlT25SZXF1ZXN0XG5cdFx0KTtcblx0fVxufVxuXG4vL2V4cG9ydCBjb25zdCByZXF1ZXN0ID0gZnVuY3Rpb24gKHRhcmdldDogT2JqZWN0LCBwcm9wZXJ0eUtleTogc3RyaW5nIHwgc3ltYm9sLCBwYXJhbWV0ZXJJbmRleDogbnVtYmVyKSB7XG4vL1x0UmVxdWVzdFBhcmFtLmhhbmRsZVBhcmFtZXRlcih7dGFyZ2V0LCBwcm9wZXJ0eUtleSwgcGFyYW1ldGVySW5kZXh9KTtcbi8vfVxuXG5leHBvcnQgY29uc3QgcGFyYW0gPSBmdW5jdGlvbiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHBhcmFtZXRlckluZGV4OiBudW1iZXIpIHtcblx0Um91dGVQYXJhbWV0ZXJQYXJhbS5oYW5kbGVQYXJhbWV0ZXIoe3RhcmdldCwgcHJvcGVydHlLZXksIHBhcmFtZXRlckluZGV4fSk7XG59XG5cbmV4cG9ydCBjb25zdCBxdWVyeSA9IGZ1bmN0aW9uICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg6IG51bWJlcikge1xuXHRSb3V0ZVF1ZXJ5UGFyYW0uaGFuZGxlUGFyYW1ldGVyKHt0YXJnZXQsIHByb3BlcnR5S2V5LCBwYXJhbWV0ZXJJbmRleH0pO1xufVxuXG5leHBvcnQgY29uc3QgYm9keSA9IGZ1bmN0aW9uICh0YXJnZXQ6IE9iamVjdCwgcHJvcGVydHlLZXk6IHN0cmluZyB8IHN5bWJvbCwgcGFyYW1ldGVySW5kZXg6IG51bWJlcikge1xuXHRSZXF1ZXN0Qm9keVBhcmFtLmhhbmRsZVBhcmFtZXRlcih7dGFyZ2V0LCBwcm9wZXJ0eUtleSwgcGFyYW1ldGVySW5kZXh9KTtcbn1cblxuZXhwb3J0IGNvbnN0IGhlYWRlcnMgPSBmdW5jdGlvbiAodGFyZ2V0OiBPYmplY3QsIHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2wsIHBhcmFtZXRlckluZGV4OiBudW1iZXIpIHtcblx0UmVxdWVzdEhlYWRlcnNQYXJhbS5oYW5kbGVQYXJhbWV0ZXIoe3RhcmdldCwgcHJvcGVydHlLZXksIHBhcmFtZXRlckluZGV4fSk7XG59XG5cbiIsImV4cG9ydCAqIGZyb20gJy4vQ29udHJvbGxlcic7XG5leHBvcnQgKiBmcm9tICcuL0RlY29yYXRvckhlbHBlcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9NaWRkbGV3YXJlJztcbmV4cG9ydCAqIGZyb20gJy4vTW9kZWxEZWNvcmF0b3JzJztcbmV4cG9ydCAqIGZyb20gJy4vUm91dGUnO1xuZXhwb3J0ICogZnJvbSAnLi9Sb3V0ZU1ldGhvZCc7XG4iLCJpbXBvcnQge0V4Y2VwdGlvbn0gZnJvbSBcIkBBcHAvRXhjZXB0aW9ucy9FeGNlcHRpb25cIjtcblxuZXhwb3J0IGNsYXNzIEludmFsaWRSZWZTcGVjaWZpZWQgZXh0ZW5kcyBFeGNlcHRpb24ge1xuXHRjb25zdHJ1Y3RvcihlbnRpdHlOYW1lOiBzdHJpbmcsIHJlZjogc3RyaW5nKSB7XG5cdFx0c3VwZXIoJ1JlZiAnICsgcmVmICsgJyBpcyBub3QgZGVmaW5lZCBvbiBtb2RlbChlbnRpdHkpICcgKyBlbnRpdHlOYW1lKTtcblx0fVxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9Nb2RlbHMvSW52YWxpZFJlZlNwZWNpZmllZCc7XG4iLCJpbXBvcnQge0h0dHBDb250ZXh0LCBIdHRwUmVxdWVzdCwgSHR0cFJlc3BvbnNlfSBmcm9tIFwiQENvcmVcIjtcbmltcG9ydCB7aW50ZXJmYWNlc30gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IENvbnRhaW5lciBmcm9tIFwiLi9Db250YWluZXJcIjtcblxuXG4vLyBIZWxwZXIgbWV0aG9kcyB0byByZXNvbHZlIGZyb20gdGhlIGNvbnRhaW5lciBhIGxpdHRsZSBlYXNpZXIvY2xlYW5lclxuZXhwb3J0IGNvbnN0IHJlc29sdmUgPSA8VD4oaWRlbnRpZmllcjogaW50ZXJmYWNlcy5TZXJ2aWNlSWRlbnRpZmllcjxUPik6IFQgPT4gQ29udGFpbmVyLmdldDxUPihpZGVudGlmaWVyKVxuZXhwb3J0IGNvbnN0IGFwcCAgICAgPSByZXNvbHZlO1xuXG5cbmV4cG9ydCBjb25zdCByZXF1ZXN0ICA9ICgpOiBIdHRwUmVxdWVzdCA9PiBIdHRwQ29udGV4dC5yZXF1ZXN0KCk7XG5leHBvcnQgY29uc3QgcmVzcG9uc2UgPSAoKTogSHR0cFJlc3BvbnNlID0+IEh0dHBDb250ZXh0LnJlc3BvbnNlKCk7XG5cbi8vZXhwb3J0IGNvbnN0IGNvbmZpZyA9IChrZXk6IHN0cmluZykgPT4ge1xuLy9cdGNvbnN0IGJhc2VDb25mID0gXy5nZXQoQ29uZmlnLCBrZXkpO1xuLy9cbi8vXHRpZiAoIWJhc2VDb25mKSB7XG4vL1x0XHRyZXR1cm4gXy5nZXQoQ29uZmlnLCBrZXkpO1xuLy9cdH1cbi8vfVxuXG4iLCJpbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7QXV0aENyZWRlbnRpYWxDb250cmFjdH0gZnJvbSBcIkBBcHAvQ29udHJhY3RzL0F1dGhDb250cmFjdHNcIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIkBBcHAvTW9kZWxzL1VzZXJcIjtcbmltcG9ydCB7cmVzb2x2ZX0gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQge0h0dHBDb250ZXh0fSBmcm9tIFwiLi4vSHR0cC9Db250ZXh0L0h0dHBDb250ZXh0XCI7XG5pbXBvcnQge0F1dGhvcmlzZWRVc2VyfSBmcm9tIFwiLi9BdXRob3Jpc2VkVXNlclwiO1xuaW1wb3J0IHtBdXRoUHJvdmlkZXJ9IGZyb20gXCIuL0F1dGhQcm92aWRlclwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aCB7XG5cblx0Y29uc3RydWN0b3IoKSB7XG5cblx0fVxuXG5cdC8qKlxuXHQgKiBBdHRlbXB0IHRvIGxvZ2luIHdpdGggdGhlIGNyZWRlbnRpYWxzXG5cdCAqXG5cdCAqIEBwYXJhbSBjcmVkZW50aWFsc1xuXHQgKi9cblx0c3RhdGljIGFzeW5jIGF0dGVtcHQoY3JlZGVudGlhbHM6IEF1dGhDcmVkZW50aWFsQ29udHJhY3QpIHtcblxuXHRcdGNvbnN0IGF1dGhQcm92aWRlciA9IHJlc29sdmUoQXV0aFByb3ZpZGVyKTtcblxuXHRcdGNvbnN0IHVzZXI6IFVzZXIgfCBudWxsID0gYXdhaXQgYXV0aFByb3ZpZGVyLnZlcmlmeUNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKTtcblxuXHRcdGlmICghdXNlcikge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHRoaXMubG9naW5Bcyh1c2VyKTtcblxuXHRcdHJldHVybiB0cnVlO1xuXHR9XG5cblx0LyoqXG5cdCAqIEZvcmNlIGxvZ2luIHRvIHggdXNlclxuXHQgKlxuXHQgKiBAcGFyYW0gdXNlclxuXHQgKi9cblx0cHVibGljIHN0YXRpYyBsb2dpbkFzKHVzZXI6IFVzZXIpIHtcblx0XHRyZXNvbHZlKEF1dGhQcm92aWRlcikuYXV0aG9yaXNlQXModXNlcik7XG5cdH1cblxuXHQvKipcblx0ICogQ2hlY2sgdGhlIGNyZWRlbnRpYWxzIHRvIHNlZSBpZiB0aGUgdXNlciBjYW4gcmVnaXN0ZXIgd2l0aCB0aGVtXG5cdCAqIEJhc2ljYWxseSwgaWYgeCBlbWFpbC91c2VybmFtZSBpcyBpbiB1c2UuXG5cdCAqIEBwYXJhbSBjcmVkZW50aWFsc1xuXHQgKi9cblx0cHVibGljIHN0YXRpYyBhc3luYyBjYW5SZWdpc3RlckFzKGNyZWRlbnRpYWxzOiBBdXRoQ3JlZGVudGlhbENvbnRyYWN0KSB7XG5cdFx0Y29uc3QgdXNlciA9IGF3YWl0IHJlc29sdmUoQXV0aFByb3ZpZGVyKS51c2VyRnJvbUNyZWRlbnRpYWxzKGNyZWRlbnRpYWxzKTtcblxuXHRcdHJldHVybiB1c2VyID09PSBudWxsO1xuXHR9XG5cblx0LyoqXG5cdCAqIENoZWNrIGlmIHRoZXJlIGlzIGFuIGF1dGhlZCB1c2VyXG5cdCAqL1xuXHRzdGF0aWMgY2hlY2soKSB7XG5cdFx0cmV0dXJuICEhdGhpcy51c2VyKCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBjdXJyZW50bHkgYXV0aGVkIHVzZXIoaWYgYW55KSBmcm9tIHRoZSBjdXJyZW50IEh0dHAgQ29udGV4dFxuXHQgKi9cblx0c3RhdGljIHVzZXIoKTogQXV0aG9yaXNlZFVzZXIge1xuXHRcdHJldHVybiBIdHRwQ29udGV4dC5nZXQoKS51c2VyO1xuLy9cdFx0cmV0dXJuIFJlcXVlc3RTdG9yZS5nZXQoKS5jb250ZXh0KCkuY29udGFpbmVyLmdldDxBdXRob3Jpc2VkVXNlcj4oVFlQRS5Vc2VyKTtcblx0fVxuXG59XG4iLCJpbXBvcnQge0F1dGhDcmVkZW50aWFsQ29udHJhY3R9IGZyb20gXCJAQXBwL0NvbnRyYWN0cy9BdXRoQ29udHJhY3RzXCI7XG5pbXBvcnQge1VzZXJ9IGZyb20gXCJAQXBwL01vZGVscy9Vc2VyXCI7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIkBDb25maWdcIjtcbmltcG9ydCB7RmFzdGlmeVJlcGx5LCBGYXN0aWZ5UmVxdWVzdH0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7aW5qZWN0YWJsZX0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHtIdHRwQ29udGV4dCwgSnd0QXV0aFByb3ZpZGVyLCByZXNvbHZlfSBmcm9tIFwiQENvcmVcIjtcbmltcG9ydCB7SGFzaH0gZnJvbSBcIi4uL0NyeXB0L0hhc2hcIjtcbmltcG9ydCB7QXV0aH0gZnJvbSBcIi4vQXV0aFwiO1xuXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBBdXRoUHJvdmlkZXIge1xuXG4vL1x0QGluamVjdChKd3RBdXRoUHJvdmlkZXIpXG4vL1x0cHJpdmF0ZSBqd3RBdXRoUHJvdmlkZXI6IEp3dEF1dGhQcm92aWRlcjtcblxuXHQvKipcblx0ICogQXR0ZW1wdCB0byBhdXRob3Jpc2UgdGhpcyByZXF1ZXN0IHVzaW5nIEpXVCwgdGhlcmVcblx0ICogaXMgbm8gSldUIG9yIGl0J3MgaW52YWxpZCwgdGhpcyB3aWxsIHJldHVybiBudWxsXG5cdCAqXG5cdCAqIEBwYXJhbSByZXF1ZXN0XG5cdCAqIEBwYXJhbSByZXBseVxuXHQgKi9cblx0YXN5bmMgYXV0aG9yaXNlUmVxdWVzdChyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVwbHk6IEZhc3RpZnlSZXBseSkge1xuXG5cdFx0Y29uc3QgdG9rZW4gPSByZXNvbHZlKEp3dEF1dGhQcm92aWRlcikuZ2V0VG9rZW5Gcm9tSGVhZGVyKHJlcXVlc3QpO1xuXG5cdFx0aWYgKCF0b2tlbikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdmVyaWZpZWRUb2tlbiA9IHJlc29sdmUoSnd0QXV0aFByb3ZpZGVyKS52ZXJpZnlUb2tlbihyZXF1ZXN0KTtcblxuXHRcdGlmICghdmVyaWZpZWRUb2tlbikge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0Y29uc3QgdXNlcklkID0gdmVyaWZpZWRUb2tlbj8uaWQgfHwgbnVsbDtcblxuXHRcdGlmICghdXNlcklkKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRjb25zdCB1c2VyOiBVc2VyID0gYXdhaXQgVXNlci5maW5kKHVzZXJJZCk7XG5cblx0XHR0aGlzLmF1dGhvcmlzZUFzKHVzZXIpO1xuXG5cdFx0cmV0dXJuIEF1dGgudXNlcigpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldHMgdGhlIHVzZXIgZnJvbSB0aGUgY3JlZGVudGlhbHMuXG5cdCAqIFByaW1hcmlseSB1c2VzIHRoZSB7QHNlZSBDb25maWcuYXV0aC5wcmltYXJ5TG9naW5DcmVkZW50aWFsfSB0byBjaGVjayBpZlxuXHQgKiBhIHVzZXIgaGFzIHJlZ2lzdGVyZWQgd2l0aCB0aGlzIGFscmVhZHksIGlmIHRoZXkgaGF2ZSwgaXQgd2lsbCByZXR1cm4gdGhlIHVzZXIuXG5cdCAqXG5cdCAqIEBwYXJhbSBjcmVkZW50aWFsc1xuXHQgKi9cblx0YXN5bmMgdXNlckZyb21DcmVkZW50aWFscyhjcmVkZW50aWFsczogQXV0aENyZWRlbnRpYWxDb250cmFjdCkge1xuXHRcdGNvbnN0IHByaW1hcnlDcmVkZW50aWFsTmFtZSA9IENvbmZpZy5hdXRoLnByaW1hcnlMb2dpbkNyZWRlbnRpYWw7XG5cdFx0Y29uc3QgcHJpbWFyeUNyZWRlbnRpYWwgICAgID0gY3JlZGVudGlhbHNbcHJpbWFyeUNyZWRlbnRpYWxOYW1lXTtcblxuXHRcdGNvbnN0IHVzZXJDYWxsICAgICAgICAgICAgICAgICAgPSB7fTtcblx0XHR1c2VyQ2FsbFtwcmltYXJ5Q3JlZGVudGlhbE5hbWVdID0gcHJpbWFyeUNyZWRlbnRpYWwudG9Mb3dlckNhc2UoKTtcblxuXHRcdGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLndoZXJlPFVzZXI+KHVzZXJDYWxsKS5maXJzdCgpO1xuXG5cdFx0aWYgKCF1c2VyKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gdXNlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBJZiB3ZSBjYW4gZ2V0IHRoZSB1c2VyIGZyb20ge0BzZWUgdXNlckZyb21DcmVkZW50aWFsc30gdGhlbiB3ZSB3aWxsIGNvbXBhcmVcblx0ICogdGhhdCB1c2VycyBoYXNoZWQgcGFzc3dvcmQgd2l0aCB0aGUgcHJvdmlkZWQgcGFzc3dvcmRcblx0ICpcblx0ICogQHBhcmFtIGNyZWRlbnRpYWxzXG5cdCAqL1xuXHRhc3luYyB2ZXJpZnlDcmVkZW50aWFscyhjcmVkZW50aWFsczogQXV0aENyZWRlbnRpYWxDb250cmFjdCkge1xuXG5cdFx0Y29uc3QgdXNlciA9IGF3YWl0IHRoaXMudXNlckZyb21DcmVkZW50aWFscyhjcmVkZW50aWFscyk7XG5cblx0XHRpZiAoIXVzZXIpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGlmICghSGFzaC5jaGVjayhjcmVkZW50aWFscy5wYXNzd29yZCwgdXNlci5wYXNzd29yZCkpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdHJldHVybiB1c2VyO1xuXHR9XG5cblx0LyoqXG5cdCAqIEF1dGhvcmlzZSBhcyB4IHVzZXIuIFRoaXMgd2lsbCBmb3JjZSBhdXRoIHRoZVxuXHQgKiBwcm92aWRlZCB1c2VyIGZvciB0aGlzIHJlcXVlc3QgYmFzaWNhbGx5LlxuXHQgKlxuXHQgKiBAcGFyYW0gdXNlclxuXHQgKi9cblx0cHVibGljIGF1dGhvcmlzZUFzKHVzZXI6IFVzZXIpIHtcblx0XHRIdHRwQ29udGV4dC5nZXQoKS5zZXRVc2VyKHVzZXIpO1xuLy9cdFx0UmVxdWVzdFN0b3JlLmdldCgpLmNvbnRleHQoKVxuLy9cdFx0XHQuY29udGFpbmVyXG4vL1x0XHRcdC5iaW5kPEF1dGhvcmlzZWRVc2VyPihUWVBFLlVzZXIpXG4vL1x0XHRcdC50b0NvbnN0YW50VmFsdWUobmV3IEF1dGhvcmlzZWRVc2VyKHVzZXIpKTtcblx0fVxuXG5cdGp3dFByb3ZpZGVyKCk6IEp3dEF1dGhQcm92aWRlciB7XG5cdFx0cmV0dXJuIHJlc29sdmUoSnd0QXV0aFByb3ZpZGVyKTtcblx0fVxuXG59XG4iLCJpbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCBDb250YWluZXIgZnJvbSBcIi4uLy4uL0NvbnRhaW5lclwiO1xuaW1wb3J0IHtTZXJ2aWNlUHJvdmlkZXJ9IGZyb20gXCIuLi9TZXJ2aWNlUHJvdmlkZXJcIjtcbmltcG9ydCB7QXV0aFByb3ZpZGVyfSBmcm9tIFwiLi9BdXRoUHJvdmlkZXJcIjtcbmltcG9ydCB7Snd0QXV0aFByb3ZpZGVyfSBmcm9tIFwiLi9Kd3RBdXRoUHJvdmlkZXJcIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEF1dGhTZXJ2aWNlUHJvdmlkZXIgZXh0ZW5kcyBTZXJ2aWNlUHJvdmlkZXIge1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHN1cGVyKCk7XG5cdH1cblxuXHRwdWJsaWMgcmVnaXN0ZXJCaW5kaW5ncygpIHtcblx0XHRDb250YWluZXIuYmluZChKd3RBdXRoUHJvdmlkZXIpLnRvKEp3dEF1dGhQcm92aWRlcik7XG5cdFx0Q29udGFpbmVyLmJpbmQoQXV0aFByb3ZpZGVyKS50byhBdXRoUHJvdmlkZXIpO1xuXHR9XG5cblx0Ym9vdCgpIHtcblxuXHR9XG5cblxufVxuIiwiaW1wb3J0IHtjbGFzc1RvUGxhaW59IGZyb20gXCJjbGFzcy10cmFuc2Zvcm1lclwiO1xuaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7VXNlcn0gZnJvbSBcIkBBcHAvTW9kZWxzL1VzZXJcIjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiQENvbmZpZ1wiO1xuaW1wb3J0IHtyZXNvbHZlfSBmcm9tIFwiLi4vLi4vSGVscGVyc1wiO1xuaW1wb3J0IHtBdXRoUHJvdmlkZXJ9IGZyb20gXCIuL0F1dGhQcm92aWRlclwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQXV0aG9yaXNlZFVzZXIgZXh0ZW5kcyBVc2VyIHtcblxuXHRjb25zdHJ1Y3Rvcih1c2VyOiBVc2VyKSB7XG5cdFx0c3VwZXIoKTtcblxuXHRcdE9iamVjdC5hc3NpZ24odGhpcywgdXNlcik7XG5cdH1cblxuXHRnZW5lcmF0ZVRva2VuKCkge1xuXHRcdHJldHVybiByZXNvbHZlKEF1dGhQcm92aWRlcikuand0UHJvdmlkZXIoKS5nZW5lcmF0ZVRva2VuKHRoaXMuX2lkKVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdGhpcyBtb2RlbCBpbnN0YW5jZSBpcyByZXR1cm5lZCBpbiBhXG5cdCAqIHJlc3BvbnNlLCB3ZSdsbCBtYWtlIHN1cmUgdG8gdXNlIGNsYXNzVG9QbGFpbiBzb1xuXHQgKiB0aGF0IGFueSBARXhjbHVkZSgpIHByb3BlcnRpZXMgZXRjIGFyZSB0YWtlbiBjYXJlIG9mLlxuXHQgKi9cblx0dG9KU09OKCkge1xuXHRcdHJldHVybiBjbGFzc1RvUGxhaW4odGhpcywgQ29uZmlnLmh0dHAucmVzcG9uc2VTZXJpYWxpemF0aW9uKTtcblx0fVxuXG59XG4iLCJpbXBvcnQge0Zhc3RpZnlSZXF1ZXN0fSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge09iamVjdElkfSBmcm9tIFwibW9uZ29kYlwiO1xuaW1wb3J0IHtDb25maWd9IGZyb20gXCJAQ29uZmlnXCI7XG5pbXBvcnQge3NpZ24sIHZlcmlmeX0gZnJvbSAnanNvbndlYnRva2VuJztcblxuZXhwb3J0IGludGVyZmFjZSBWZXJpZmllZFRva2VuSW50ZXJmYWNlIHtcblx0aWQ6IHN0cmluZztcblx0c2VlZD86IHN0cmluZztcblx0aWF0OiBudW1iZXI7XG5cdGV4cDogbnVtYmVyO1xuXHRpc3M6IHN0cmluZztcbn1cblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEp3dEF1dGhQcm92aWRlciB7XG5cblx0Z2V0VG9rZW5Gcm9tSGVhZGVyKHJlcTogRmFzdGlmeVJlcXVlc3QpOiBzdHJpbmcgfCBudWxsIHtcblx0XHRjb25zdCBhdXRoSGVhZGVyID0gcmVxLmhlYWRlcnMuYXV0aG9yaXphdGlvbjtcblx0XHRpZiAoIWF1dGhIZWFkZXIpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRva2VuUGFydHMgPSBhdXRoSGVhZGVyLnNwbGl0KFwiIFwiKTtcblx0XHRpZiAodG9rZW5QYXJ0cy5sZW5ndGggIT09IDIpIHtcblx0XHRcdHJldHVybiBudWxsO1xuXHRcdH1cblxuXHRcdGNvbnN0IHR5cGUgID0gdG9rZW5QYXJ0c1swXTtcblx0XHRjb25zdCB0b2tlbiA9IHRva2VuUGFydHNbMV07XG5cdFx0aWYgKCF0b2tlbiB8fCAhdHlwZSkge1xuXHRcdFx0cmV0dXJuIG51bGw7XG5cdFx0fVxuXG5cdFx0aWYgKHR5cGUgJiYgdG9rZW4gJiYgdHlwZSA9PT0gXCJCZWFyZXJcIikge1xuXHRcdFx0cmV0dXJuIHRva2VuO1xuXHRcdH1cblxuXHRcdHJldHVybiBudWxsO1xuXHR9XG5cblx0Z2VuZXJhdGVUb2tlbih1c2VySWQ6IE9iamVjdElkKSB7XG5cdFx0cmV0dXJuIHNpZ24oXG5cdFx0XHR7aWQgOiB1c2VySWR9LFxuXHRcdFx0Q29uZmlnLmFwcC5hcHBLZXksXG5cdFx0XHRDb25maWcuYXV0aC5qd3RTaWduaW5nT3B0aW9uc1xuXHRcdCk7XG5cdH1cblxuXHR2ZXJpZnlUb2tlbihyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgdG9rZW4/OiBzdHJpbmcgfCBudWxsKSB7XG5cdFx0aWYgKCF0b2tlbikge1xuXHRcdFx0dG9rZW4gPSB0aGlzLmdldFRva2VuRnJvbUhlYWRlcihyZXF1ZXN0KTtcblx0XHR9XG5cblx0XHRpZiAoIXRva2VuKSB7XG5cdFx0XHRyZXR1cm4gbnVsbDtcblx0XHR9XG5cblx0XHRyZXR1cm4gPFZlcmlmaWVkVG9rZW5JbnRlcmZhY2U+dmVyaWZ5KFxuXHRcdFx0dG9rZW4sXG5cdFx0XHRDb25maWcuYXBwLmFwcEtleSxcblx0XHRcdENvbmZpZy5hdXRoLmp3dFZlcmlmeU9wdGlvbnNcblx0XHQpO1xuXHR9XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL0F1dGgnO1xuZXhwb3J0ICogZnJvbSAnLi9BdXRoUHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9BdXRoU2VydmljZVByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vQXV0aG9yaXNlZFVzZXInO1xuZXhwb3J0ICogZnJvbSAnLi9Kd3RBdXRoUHJvdmlkZXInO1xuIiwiaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7aW5pdCwgc2V0LCBnZXQsIGRlbH0gZnJvbSBcIm5vZGUtY2FjaGUtcmVkaXNcIjtcblxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ2FjaGUge1xuXG5cdGFzeW5jIGdldChrZXk6IHN0cmluZywgZGVmYXVsdFZhbHVlID0gbnVsbCkge1xuXHRcdGNvbnN0IHZhbHVlID0gYXdhaXQgZ2V0KGtleSk7XG5cdFx0cmV0dXJuIHZhbHVlID8/IGRlZmF1bHRWYWx1ZTtcblx0fVxuXG5cdGFzeW5jIHB1dChrZXk6IHN0cmluZywgdmFsdWU6IGFueSwgdHRsPzogbnVtYmVyKSB7XG5cdFx0YXdhaXQgc2V0KGtleSwgdmFsdWUsIHR0bCk7XG5cdH1cblxuXHRhc3luYyByZW1vdmUoa2V5OiBzdHJpbmcpIHtcblx0XHRhd2FpdCBkZWwoW2tleV0pO1xuXHR9XG5cblx0YXN5bmMgaGFzKGtleSA6IHN0cmluZyl7XG5cdFx0cmV0dXJuICEhKGF3YWl0IHRoaXMuZ2V0KGtleSwgdW5kZWZpbmVkKSk7XG5cdH1cblxufVxuIiwiaW1wb3J0IHtTZXJ2aWNlUHJvdmlkZXJ9IGZyb20gXCIuLi9TZXJ2aWNlUHJvdmlkZXJcIjtcbmltcG9ydCB7aW5pdH0gZnJvbSBcIm5vZGUtY2FjaGUtcmVkaXNcIjtcbmltcG9ydCB7Q29uZmlnfSBmcm9tIFwiQENvbmZpZ1wiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gXCIuLi8uLi9Db250YWluZXJcIjtcbmltcG9ydCB7Q2FjaGV9IGZyb20gXCIuL0NhY2hlXCI7XG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDYWNoZVNlcnZpY2VQcm92aWRlciBleHRlbmRzIFNlcnZpY2VQcm92aWRlciB7XG5cblx0cmVnaXN0ZXJCaW5kaW5ncygpe1xuXHRcdGluaXQoe1xuXHRcdFx0bmFtZSAgICAgICAgIDogXCJjYWNoZTpcIixcblx0XHRcdHJlZGlzT3B0aW9ucyA6IHtcblx0XHRcdFx0aG9zdCA6IENvbmZpZy5kYXRhYmFzZS5yZWRpcy5ob3N0LFxuXHRcdFx0XHRwb3J0IDogQ29uZmlnLmRhdGFiYXNlLnJlZGlzLnBvcnQsXG5cdFx0XHR9XG5cdFx0fSk7XG5cblx0XHRDb250YWluZXIuYmluZDxDYWNoZT4oQ2FjaGUpLnRvKENhY2hlKTtcblx0fVxuXG5cdGJvb3QoKSB7XG5cblxuXHR9XG5cbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vQ2FjaGUnO1xuZXhwb3J0ICogZnJvbSAnLi9DYWNoZVNlcnZpY2VQcm92aWRlcic7XG4iLCJpbXBvcnQge3Jlc29sdmV9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IFNpbXBsZUNyeXB0byBmcm9tIFwic2ltcGxlLWNyeXB0by1qc1wiO1xuXG5leHBvcnQgY2xhc3MgRW5jcnlwdGlvbiB7XG5cblx0c3RhdGljIGVuY3J5cHQoY29udGVudDogYW55KSB7XG5cdFx0cmV0dXJuIHJlc29sdmU8U2ltcGxlQ3J5cHRvPihTaW1wbGVDcnlwdG8pLmVuY3J5cHQoY29udGVudCk7XG5cdH1cblxuXHRzdGF0aWMgZGVjcnlwdChjb250ZW50OiBhbnkpIHtcblx0XHRyZXR1cm4gcmVzb2x2ZTxTaW1wbGVDcnlwdG8+KFNpbXBsZUNyeXB0bykuZGVjcnlwdChjb250ZW50KTtcblx0fVxuXG5cdHN0YXRpYyByYW5kb20obGVuZ3RoPzogbnVtYmVyKSB7XG5cdFx0cmV0dXJuIFNpbXBsZUNyeXB0by5nZW5lcmF0ZVJhbmRvbVN0cmluZyhsZW5ndGgpO1xuXHR9XG5cbn1cbiIsImltcG9ydCB7Q29uZmlnfSBmcm9tIFwiQENvbmZpZ1wiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQgU2ltcGxlQ3J5cHRvIGZyb20gXCJzaW1wbGUtY3J5cHRvLWpzXCI7XG5pbXBvcnQge0NvbnRhaW5lciwgU2VydmljZVByb3ZpZGVyfSBmcm9tIFwiQENvcmVcIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIEVuY3J5cHRpb25TZXJ2aWNlUHJvdmlkZXIgZXh0ZW5kcyBTZXJ2aWNlUHJvdmlkZXIge1xuXG5cdHB1YmxpYyByZWdpc3RlckJpbmRpbmdzKCkge1xuXHRcdGNvbnN0IGNyeXB0ID0gbmV3IFNpbXBsZUNyeXB0byhDb25maWcuYXBwLmFwcEtleSk7XG5cblx0XHRDb250YWluZXIuYmluZDxTaW1wbGVDcnlwdG8+KFNpbXBsZUNyeXB0bykudG9Db25zdGFudFZhbHVlKGNyeXB0KTtcblx0fVxuXG5cdGJvb3QoKSB7XG5cblx0fVxuXG59XG4iLCJpbXBvcnQgYmNyeXB0IGZyb20gXCJiY3J5cHRcIjtcblxuZXhwb3J0IGNsYXNzIEhhc2gge1xuXG5cdHN0YXRpYyBtYWtlKGNvbnRlbnQ6IHN0cmluZywgcm91bmRzOiBudW1iZXIgPSAxMCk6IFByb21pc2U8c3RyaW5nPiB7XG5cdFx0cmV0dXJuIGJjcnlwdC5oYXNoKGNvbnRlbnQsIDEwKTtcblx0fVxuXG5cdHN0YXRpYyBjaGVjayhjb250ZW50OiBzdHJpbmcsIGhhc2hlZENvbnRlbnQ6IHN0cmluZyk6IGJvb2xlYW4ge1xuXHRcdHJldHVybiBiY3J5cHQuY29tcGFyZVN5bmMoY29udGVudCwgaGFzaGVkQ29udGVudClcblx0fVxuXG59XG4iLCJleHBvcnQgKiBmcm9tICcuL0VuY3J5cHRpb24nO1xuZXhwb3J0ICogZnJvbSAnLi9FbmNyeXB0aW9uU2VydmljZVByb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vSGFzaCc7XG4iLCJpbXBvcnQge1VzZXJ9IGZyb20gXCJAQXBwL01vZGVscy9Vc2VyXCI7XG5pbXBvcnQge0Zhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3R9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge2ludGVyZmFjZXN9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7QXV0aG9yaXNlZFVzZXIsIENvbnRhaW5lciwgSHR0cENvbnRleHRTdG9yZSwgSHR0cFJlcXVlc3QsIEh0dHBSZXNwb25zZSwgTUVUQURBVEF9IGZyb20gXCJAQ29yZVwiO1xuXG5leHBvcnQgY2xhc3MgSHR0cENvbnRleHQge1xuXG5cdHJlcXVlc3Q6IEh0dHBSZXF1ZXN0O1xuXHRyZXNwb25zZTogSHR0cFJlc3BvbnNlO1xuXHRjb250YWluZXI6IGludGVyZmFjZXMuQ29udGFpbmVyO1xuXHR1c2VyOiBBdXRob3Jpc2VkVXNlcjtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCxcblx0XHRyZXNwb25zZTogRmFzdGlmeVJlcGx5XG5cdCkge1xuXHRcdHRoaXMucmVxdWVzdCAgPSBuZXcgSHR0cFJlcXVlc3QocmVxdWVzdCk7XG5cdFx0dGhpcy5yZXNwb25zZSA9IG5ldyBIdHRwUmVzcG9uc2UocmVzcG9uc2UpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdlIHVzZSBhc3luYyBsb2NhbHN0b3JhZ2UgdG8gaGVscCBoYXZlIGNvbnRleHQgYXJvdW5kIHRoZSBhcHAgd2l0aG91dCBkaXJlY3Rcblx0ICogYWNjZXNzIHRvIG91ciBmYXN0aWZ5IHJlcXVlc3QuIFdlIGFsc28gYmluZCB0aGlzIGNvbnRleHQgY2xhc3MgdG8gdGhlIGZhc3RpZnkgcmVxdWVzdFxuXHQgKlxuXHQgKiBAcGFyYW0gZG9uZVxuXHQgKi9cblx0YmluZChkb25lKSB7XG5cdFx0dGhpcy5jb250YWluZXIgPSBDb250YWluZXIuY3JlYXRlQ2hpbGQoKTtcblxuXHRcdC8vIFdlIGJpbmQgdGhlIGNvbnRleHQgdG8gdGhlIGN1cnJlbnQgcmVxdWVzdCwgc28gaXQncyBvYnRhaW5hYmxlXG5cdFx0Ly8gdGhyb3VnaG91dCB0aGUgbGlmZWN5Y2xlIG9mIHRoaXMgcmVxdWVzdCwgdGhpcyBpc24ndCBib3VuZCB0b1xuXHRcdC8vIG91ciB3cmFwcGVyIHJlcXVlc3QgY2xhc3MsIG9ubHkgdGhlIG9yaWdpbmFsIGZhc3RpZnkgcmVxdWVzdFxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoXG5cdFx0XHRNRVRBREFUQS5IVFRQX0NPTlRFWFQsIHRoaXMsIHRoaXMucmVxdWVzdC5mYXN0aWZ5UmVxdWVzdFxuXHRcdCk7XG5cblx0XHRIdHRwQ29udGV4dFN0b3JlLmdldEluc3RhbmNlKCkuYmluZCh0aGlzLnJlcXVlc3QuZmFzdGlmeVJlcXVlc3QsIGRvbmUpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgY3VycmVudCByZXF1ZXN0IGNvbnRleHQuXG5cdCAqIFRoaXMgd2lsbCByZXR1cm4gYW4gaW5zdGFuY2Ugb2YgdGhpcyBjbGFzcy5cblx0ICovXG5cdHN0YXRpYyBnZXQoKTogSHR0cENvbnRleHQge1xuXHRcdHJldHVybiBIdHRwQ29udGV4dFN0b3JlLmdldEluc3RhbmNlKCkuY29udGV4dCgpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiB0aGUgRmFzdGlmeSBSZXF1ZXN0IHdyYXBwZXJcblx0ICovXG5cdHN0YXRpYyByZXF1ZXN0KCk6IEh0dHBSZXF1ZXN0IHtcblx0XHRyZXR1cm4gdGhpcy5nZXQoKS5yZXF1ZXN0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybiB0aGUgRmFzdGlmeSBSZXBseSB3cmFwcGVyLCB0aGlzIGltcGxlbWVudHMgb3VyXG5cdCAqIG93biBoZWxwZXIgbWV0aG9kcyB0byBtYWtlIHRoaW5ncyBhIGxpdHRsZSBlYXNpZXJcblx0ICovXG5cdHN0YXRpYyByZXNwb25zZSgpOiBIdHRwUmVzcG9uc2Uge1xuXHRcdHJldHVybiB0aGlzLmdldCgpLnJlc3BvbnNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgY3VycmVudGx5IGF1dGhlZCB1c2VyIG9uIHRoZSBjb250ZXh0KHRoaXMgd2lsbCBlc3NlbnRpYWxseSBhdXRob3Jpc2UgdGhpcyB1c2VyKVxuXHQgKiBAcGFyYW0gdXNlclxuXHQgKi9cblx0cHVibGljIHNldFVzZXIodXNlcjogVXNlcikge1xuXHRcdGNvbnN0IGF1dGhlZFVzZXIgPSBuZXcgQXV0aG9yaXNlZFVzZXIodXNlcik7XG5cblx0XHR0aGlzLmNvbnRhaW5lclxuXHRcdFx0LmJpbmQ8QXV0aG9yaXNlZFVzZXI+KEF1dGhvcmlzZWRVc2VyKVxuXHRcdFx0LnRvQ29uc3RhbnRWYWx1ZShhdXRoZWRVc2VyKTtcblxuXHRcdHRoaXMudXNlciA9IGF1dGhlZFVzZXI7XG5cdH1cbn1cbiIsImltcG9ydCB7TUVUQURBVEF9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IHtBc3luY0xvY2FsU3RvcmFnZX0gZnJvbSBcImFzeW5jX2hvb2tzXCI7XG5pbXBvcnQge0Zhc3RpZnlSZXF1ZXN0LCBIb29rSGFuZGxlckRvbmVGdW5jdGlvbn0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7SHR0cENvbnRleHR9IGZyb20gXCIuL0h0dHBDb250ZXh0XCI7XG5cbmxldCBpbnN0YW5jZSA9IG51bGw7XG5cbmV4cG9ydCBjbGFzcyBIdHRwQ29udGV4dFN0b3JlIHtcblxuXHRwcml2YXRlIHJlYWRvbmx5IF9zdG9yZTogQXN5bmNMb2NhbFN0b3JhZ2U8SHR0cENvbnRleHQ+O1xuXG5cdGNvbnN0cnVjdG9yKCkge1xuXHRcdHRoaXMuX3N0b3JlID0gbmV3IEFzeW5jTG9jYWxTdG9yYWdlPEh0dHBDb250ZXh0PigpO1xuXG5cdFx0aW5zdGFuY2UgPSB0aGlzO1xuXHR9XG5cblx0c3RhdGljIGdldEluc3RhbmNlKCk6IEh0dHBDb250ZXh0U3RvcmUge1xuXHRcdGlmIChpbnN0YW5jZSkge1xuXHRcdFx0cmV0dXJuIGluc3RhbmNlO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgSHR0cENvbnRleHRTdG9yZSgpO1xuXHR9XG5cblx0Y29udGV4dCgpOiBIdHRwQ29udGV4dCB7XG5cdFx0cmV0dXJuIHRoaXMuX3N0b3JlLmdldFN0b3JlKCk7XG5cdH1cblxuXHRiaW5kKHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LCBkb25lOiBIb29rSGFuZGxlckRvbmVGdW5jdGlvbikge1xuXHRcdHRoaXMuX3N0b3JlLnJ1bihSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLkhUVFBfQ09OVEVYVCwgcmVxdWVzdCksIGRvbmUpO1xuXHR9XG59XG4iLCJpbXBvcnQge0V4Y2VwdGlvbn0gZnJvbSBcIkBBcHAvRXhjZXB0aW9ucy9FeGNlcHRpb25cIjtcbmltcG9ydCB7TXVsdGlwYXJ0fSBmcm9tIFwiZmFzdGlmeS1tdWx0aXBhcnRcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuXG5pbXBvcnQge1N0YXR1c0NvZGVzfSBmcm9tIFwiaHR0cC1zdGF0dXMtY29kZXNcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQge0VuY3J5cHRpb24sIEh0dHBSZXF1ZXN0LCBMb2csIFN0b3JhZ2UsIFVwbG9hZGVkRmlsZUluZm9ybWF0aW9ufSBmcm9tIFwiQENvcmVcIjtcbmltcG9ydCB7cGlwZWxpbmV9IGZyb20gXCJzdHJlYW1cIjtcblxuaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJ1xuXG5jb25zdCBwdW1wID0gdXRpbC5wcm9taXNpZnkocGlwZWxpbmUpXG5cblxuZXhwb3J0IGNsYXNzIEZpbGVVcGxvYWQge1xuXHRjb25zdHJ1Y3Rvcihwcml2YXRlIHJlcXVlc3Q6IEh0dHBSZXF1ZXN0LCBwcml2YXRlIGZpZWxkOiBzdHJpbmcpIHsgfVxuXG5cdGFzeW5jIHN0b3JlKGxvY2F0aW9uOiBzdHJpbmcpOiBQcm9taXNlPFVwbG9hZGVkRmlsZUluZm9ybWF0aW9uPiB7XG5cdFx0bGV0IGZpbGU6IE11bHRpcGFydCB8IG51bGwgPSBudWxsO1xuXG5cdFx0Zm9yIGF3YWl0IChsZXQgdXBsb2FkIG9mIHRoaXMucmVxdWVzdC5mYXN0aWZ5UmVxdWVzdC5maWxlcygpKSB7XG5cdFx0XHRpZiAodXBsb2FkLmZpZWxkbmFtZSA9PT0gdGhpcy5maWVsZCkge1xuXHRcdFx0XHRmaWxlID0gdXBsb2FkO1xuXHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHR9XG5cblx0XHRpZiAoIWZpbGUpIHtcblx0XHRcdHRocm93IG5ldyBFeGNlcHRpb24oJ0ZpbGUgbm90IGZvdW5kIG9uIHJlcXVlc3QuJywgU3RhdHVzQ29kZXMuQkFEX1JFUVVFU1QpO1xuXHRcdH1cblxuXHRcdGNvbnN0IHRlbXBOYW1lID0gRW5jcnlwdGlvbi5yYW5kb20oKSArICcuJyArIChmaWxlLmZpbGVuYW1lLnNwbGl0KCcuJykucG9wKCkpXG5cdFx0Y29uc3QgdGVtcFBhdGggPSBwYXRoLmpvaW4oX19kaXJuYW1lLCAnLi4nLCAnc3RvcmFnZScsICd0ZW1wJywgdGVtcE5hbWUpO1xuXG5cdFx0YXdhaXQgcHVtcChmaWxlLmZpbGUsIGZzLmNyZWF0ZVdyaXRlU3RyZWFtKHRlbXBQYXRoKSlcblxuXHRcdGZpbGUuZmlsZXBhdGggPSB0ZW1wUGF0aDtcblxuXHRcdHRyeSB7XG5cdFx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IFN0b3JhZ2UucHV0KGxvY2F0aW9uLCBmaWxlKTtcblxuXHRcdFx0aWYgKGZzLmV4aXN0c1N5bmModGVtcFBhdGgpKVxuXHRcdFx0XHRmcy5ybVN5bmModGVtcFBhdGgpO1xuXG5cdFx0XHRyZXR1cm4gcmVzcG9uc2U7XG5cdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0XHR0aHJvdyBuZXcgRXhjZXB0aW9uKFxuXHRcdFx0XHQnU29tZXRoaW5nIHdlbnQgd3JvbmcgdXBsb2FkaW5nIHRoZSBmaWxlJywgU3RhdHVzQ29kZXMuSU5URVJOQUxfU0VSVkVSX0VSUk9SXG5cdFx0XHQpO1xuXHRcdH1cblxuXG5cdH1cblxufVxuIiwiaW1wb3J0IHtGYXN0aWZ5UmVxdWVzdH0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7RmlsZVVwbG9hZH0gZnJvbSBcIkBDb3JlXCI7XG5cbmV4cG9ydCBjbGFzcyBIdHRwUmVxdWVzdCB7XG5cblx0cHJpdmF0ZSByZWFkb25seSBfcmVxdWVzdDogRmFzdGlmeVJlcXVlc3Q7XG5cblx0Y29uc3RydWN0b3IocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QpIHtcblx0XHR0aGlzLl9yZXF1ZXN0ID0gcmVxdWVzdDtcblx0fVxuXG5cdGdldCBmYXN0aWZ5UmVxdWVzdCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fcmVxdWVzdDtcblx0fVxuXG5cdGZpbGUoZmllbGQ6IHN0cmluZykge1xuXHRcdHJldHVybiBuZXcgRmlsZVVwbG9hZCh0aGlzLCBmaWVsZCk7XG5cdH1cblxuXG59XG4iLCJleHBvcnQgKiBmcm9tICcuL0ZpbGVVcGxvYWQnO1xuZXhwb3J0ICogZnJvbSAnLi9IdHRwUmVxdWVzdCc7XG4iLCJpbXBvcnQge1ZhbGlkYXRpb25FeGNlcHRpb259IGZyb20gXCJAQXBwL0V4Y2VwdGlvbnMvVmFsaWRhdGlvbkV4Y2VwdGlvblwiO1xuaW1wb3J0IHtGYXN0aWZ5UmVwbHl9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge1N0YXR1c0NvZGVzfSBmcm9tIFwiaHR0cC1zdGF0dXMtY29kZXNcIjtcblxuZXhwb3J0IGNsYXNzIEh0dHBSZXNwb25zZSB7XG5cblx0LyoqXG5cdCAqIEhvbGQgdGhlIG9yaWdpbmFsIGZhc3RpZnkgcmVwbHkgc28gd2UgY2FuIGFjY2Vzcy91c2UgaXQgd2hlbiBuZWVkZWRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgcmVhZG9ubHkgX3Jlc3BvbnNlOiBGYXN0aWZ5UmVwbHk7XG5cdC8qKlxuXHQgKiBUaGUgZGF0YSB0byBiZSBzZW50IGluIHRoaXMgcmVzcG9uc2Vcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2RhdGE6IGFueTtcblx0LyoqXG5cdCAqIFRoZSByZXNwb25zZSBjb2RlIHRvIGJlIHNlbnRcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2NvZGU/OiBudW1iZXIgfCBTdGF0dXNDb2RlcztcblxuXHRjb25zdHJ1Y3RvcihyZXNwb25zZTogRmFzdGlmeVJlcGx5KSB7XG5cdFx0dGhpcy5fcmVzcG9uc2UgPSByZXNwb25zZTtcblx0fVxuXG5cdGdldCBmYXN0aWZ5UmVwbHkoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX3Jlc3BvbnNlO1xuXHR9XG5cblx0c2V0IGNvZGUoY29kZTogU3RhdHVzQ29kZXMpIHtcblx0XHR0aGlzLl9jb2RlID0gY29kZTtcblx0fVxuXG5cdHNldCBkYXRhKGRhdGE6IGFueSkge1xuXHRcdHRoaXMuX2RhdGEgPSBkYXRhO1xuXHR9XG5cblx0Z2V0IGNvZGUoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2NvZGUgPz8gMjAwO1xuXHR9XG5cblx0Z2V0IGRhdGEoKSB7XG5cdFx0cmV0dXJuIHRoaXMuX2RhdGEgPz8ge307XG5cdH1cblxuXHQvKipcblx0ICogQXBwbHkgYSBoZWFkZXIgdG8gdGhlIHJlc3BvbnNlLCB0aGlzIGFwcGxpZXMgZGlyZWN0bHkgdG8gdGhlIGZhc3RpZnkgcmVzcG9uc2Vcblx0ICpcblx0ICogQHBhcmFtIGhlYWRlclxuXHQgKiBAcGFyYW0gdmFsdWVcblx0ICovXG5cdGhlYWRlcihoZWFkZXI6IHN0cmluZywgdmFsdWU6IGFueSkge1xuXHRcdHRoaXMuZmFzdGlmeVJlcGx5LmhlYWRlcihoZWFkZXIsIHZhbHVlKTtcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNldCB0aGUgZGF0YSAmIHN0YXR1cyBjb2RlIHRvIHJldHVyblxuXHQgKlxuXHQgKiBAcGFyYW0gZGF0YVxuXHQgKiBAcGFyYW0gY29kZVxuXHQgKi9cblx0c2V0UmVzcG9uc2UoZGF0YTogYW55LCBjb2RlOiBTdGF0dXNDb2Rlcykge1xuXHRcdHRoaXMuX2RhdGEgPSBkYXRhO1xuXHRcdHRoaXMuX2NvZGUgPSBjb2RlO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogU2V0IHRoZSBzdGF0dXMgY29kZS4uLiBjYW4gYmUgY2hhaW5lZCB3aXRoIG90aGVyIG1ldGhvZHMuXG5cdCAqXG5cdCAqIEBwYXJhbSBjb2RlXG5cdCAqL1xuXHRzZXRDb2RlKGNvZGU6IFN0YXR1c0NvZGVzKSB7XG5cdFx0dGhpcy5fY29kZSA9IGNvZGU7XG5cblx0XHRyZXR1cm4gdGhpcztcblx0fVxuXG5cdC8qKlxuXHQgKiBTZW5kIHRoZSBkYXRhL3N0YXR1cyBjb2RlIG1hbnVhbGx5XG5cdCAqL1xuXHRzZW5kKCkge1xuXHRcdHJldHVybiB0aGlzLmZhc3RpZnlSZXBseVxuXHRcdFx0LnN0YXR1cyh0aGlzLmNvZGUpXG5cdFx0XHQuc2VuZCh0aGlzLmRhdGEpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgYSByZWRpcmVjdCByZXNwb25zZSB0byB4IHVybFxuXHQgKlxuXHQgKiBAcGFyYW0gdXJsXG5cdCAqL1xuXHRyZWRpcmVjdCh1cmw6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzXG5cdFx0XHQuc2V0UmVzcG9uc2UobnVsbCwgU3RhdHVzQ29kZXMuVEVNUE9SQVJZX1JFRElSRUNUKVxuXHRcdFx0LmhlYWRlcignTG9jYXRpb24nLCB1cmwpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgYSBub3QgZm91bmQgcmVzcG9uc2Vcblx0ICpcblx0ICogQHBhcmFtIGRhdGFcblx0ICovXG5cdG5vdEZvdW5kKGRhdGE/OiBhbnkpIHtcblx0XHRyZXR1cm4gdGhpcy5zZXRSZXNwb25zZShkYXRhLCBTdGF0dXNDb2Rlcy5OT1RfRk9VTkQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgYSBiYWQgcmVxdWVzdCByZXNwb25zZVxuXHQgKlxuXHQgKiBAcGFyYW0gZGF0YVxuXHQgKi9cblx0YmFkUmVxdWVzdChkYXRhPzogYW55KSB7XG5cdFx0cmV0dXJuIHRoaXMuc2V0UmVzcG9uc2UoZGF0YSwgU3RhdHVzQ29kZXMuQkFEX1JFUVVFU1QpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNlbmQgYSB2YWxpZGF0aW9uIGZhaWx1cmUgcmVzcG9uc2Vcblx0ICogTk9URTogVGhpcyB3aWxsIHRocm93IGEge0BzZWUgVmFsaWRhdGlvbkV4Y2VwdGlvbn0sIGp1c3QgdG8ga2VlcCB0aGluZ3Mgc3RydWN0dXJlZC5cblx0ICogQHBhcmFtIGRhdGFcblx0ICovXG5cdHZhbGlkYXRpb25GYWlsdXJlKGRhdGE/OiBhbnkpIHtcblx0XHR0aHJvdyBuZXcgVmFsaWRhdGlvbkV4Y2VwdGlvbihkYXRhKTtcbi8vXHRcdHJldHVybiB0aGlzLnNldFJlc3BvbnNlKGRhdGEsIFN0YXR1c0NvZGVzLlVOUFJPQ0VTU0FCTEVfRU5USVRZKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm4ganNvbiBkYXRhXG5cdCAqXG5cdCAqIEBwYXJhbSBkYXRhXG5cdCAqIEBwYXJhbSBjb2RlXG5cdCAqL1xuXHRqc29uKGRhdGE/OiBhbnksIGNvZGU/OiBTdGF0dXNDb2Rlcykge1xuXHRcdHJldHVybiB0aGlzLnNldFJlc3BvbnNlKGRhdGEgfHwge30sIGNvZGUgfHwgU3RhdHVzQ29kZXMuT0spXG5cdH1cblxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9IdHRwUmVzcG9uc2UnO1xuIiwiZXhwb3J0ICogZnJvbSAnLi9IdHRwQ29udGV4dCc7XG5leHBvcnQgKiBmcm9tICcuL0h0dHBDb250ZXh0U3RvcmUnO1xuZXhwb3J0ICogZnJvbSAnLi9SZXF1ZXN0JztcbmV4cG9ydCAqIGZyb20gJy4vUmVzcG9uc2UnO1xuIiwiaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge01FVEFEQVRBfSBmcm9tIFwiLi4vLi4vLi4vRGVjb3JhdG9yRGF0YVwiO1xuaW1wb3J0IHtDb250cm9sbGVyTWV0YWRhdGF9IGZyb20gXCIuLi8uLi8uLi9EZWNvcmF0b3JzL0NvbnRyb2xsZXJcIjtcbmltcG9ydCB7Q29udHJvbGxlck1ldGhvZE1ldGFkYXRhfSBmcm9tIFwiLi4vLi4vLi4vRGVjb3JhdG9ycy9Sb3V0ZVwiO1xuXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyIHtcblxuLy9cdEBjdXJyZW50UmVxdWVzdFxuLy9cdHByb3RlY3RlZCByZWFkb25seSByZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdDtcbi8vXHRAY3VycmVudFVzZXJcbi8vXHRwcm90ZWN0ZWQgcmVhZG9ubHkgdXNlcjogQXV0aG9yaXNlZFVzZXI7XG4vL1x0QHJlcXVlc3RDb250YWluZXJcbi8vXHRwcm90ZWN0ZWQgcmVhZG9ubHkgY29udGFpbmVyOiBDb250YWluZXI7XG5cblx0Z2V0TWV0YWRhdGEoKTogQ29udHJvbGxlck1ldGFkYXRhIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YShNRVRBREFUQS5DT05UUk9MTEVSLCB0aGlzLmNvbnN0cnVjdG9yKTtcblx0fVxuXG5cdGdldE1ldGhvZE1ldGFkYXRhKCk6IENvbnRyb2xsZXJNZXRob2RNZXRhZGF0YVtdIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YShNRVRBREFUQS5DT05UUk9MTEVSX01FVEhPRFMsIHRoaXMuY29uc3RydWN0b3IpO1xuXHR9XG5cbn1cbiIsImltcG9ydCB7Z2xvYn0gZnJvbSBcImdsb2JcIjtcbmltcG9ydCB7aW5qZWN0YWJsZSwgaW50ZXJmYWNlc30gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHBhdGggZnJvbSBcInBhdGhcIjtcbmltcG9ydCB7QXV0aG9yaXNlZFVzZXIsIEh0dHBDb250ZXh0LCBIdHRwUmVxdWVzdCwgTG9nLCBTZXJ2aWNlUHJvdmlkZXJ9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IENvbnRhaW5lciwge0FVVEhFRF9VU0VSX0lERU5USUZJRVIsIENPTlRBSU5FUl9JREVOVElGSUVSLCBIVFRQX0NPTlRFWFRfSURFTlRJRklFUiwgSFRUUF9SRVFVRVNUX0lERU5USUZJRVJ9IGZyb20gXCIuLi8uLi8uLi9Db250YWluZXJcIjtcbmltcG9ydCB7Q29udHJvbGxlcn0gZnJvbSBcIi4vQ29udHJvbGxlclwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgQ29udHJvbGxlclNlcnZpY2VQcm92aWRlciBleHRlbmRzIFNlcnZpY2VQcm92aWRlciB7XG5cblx0cmVnaXN0ZXJCaW5kaW5ncygpIHtcblxuXHR9XG5cblx0Ym9vdCgpIHtcblx0XHR0aGlzLmJpbmRDb250ZXh0VG9Db250YWluZXIoQ29udGFpbmVyKTtcblxuXHRcdGdsb2Jcblx0XHRcdC5zeW5jKFxuXHRcdFx0XHRwYXRoLmpvaW4oJ3NyYycsICdBcHAnLCAnSHR0cCcsICdDb250cm9sbGVycycsICcqKicsICcqLnRzJyksXG5cdFx0XHRcdHtmb2xsb3cgOiB0cnVlfVxuXHRcdFx0KVxuXHRcdFx0Lm1hcChmaWxlID0+IHtcblxuXG5cdFx0XHRcdGNvbnN0IGxvYyA9IGZpbGVcblx0XHRcdFx0XHQucmVwbGFjZSgnc3JjL0FwcC9IdHRwL0NvbnRyb2xsZXJzLycsICcnKVxuXHRcdFx0XHRcdC5yZXBsYWNlKCcudHMnLCAnJyk7XG5cblx0XHRcdFx0aW1wb3J0KGBAQXBwL0h0dHAvQ29udHJvbGxlcnMvJHtsb2N9YClcblx0XHRcdFx0XHQudGhlbihtb2R1bGUgPT4gdGhpcy5sb2FkQ29udHJvbGxlcihtb2R1bGUsIGxvYykpXG5cdFx0XHRcdFx0LmNhdGNoKGVycm9yID0+IHtcblx0XHRcdFx0XHRcdExvZy53YXJuKCdbJyArIHRoaXMuY29uc3RydWN0b3IubmFtZSArICddIEZhaWxlZCB0byBsb2FkIGNvbnRyb2xsZXI6ICcgKyBmaWxlKTtcblx0XHRcdFx0XHRcdExvZy5lcnJvcihlcnJvcik7XG5cdFx0XHRcdFx0fSlcblx0XHRcdH0pO1xuXHR9XG5cblx0cHVibGljIGJpbmRDb250ZXh0VG9Db250YWluZXIoY29udGFpbmVyOiBpbnRlcmZhY2VzLkNvbnRhaW5lciwgY29udGV4dD86IEh0dHBDb250ZXh0KSB7XG5cblx0XHRpZiAoIWNvbnRleHQpIHtcblx0XHRcdGNvbnRleHQgPSB7fSBhcyBIdHRwQ29udGV4dDtcblx0XHR9XG5cblx0XHRjb250YWluZXIuYmluZDxIdHRwQ29udGV4dD4oSFRUUF9DT05URVhUX0lERU5USUZJRVIpLnRvQ29uc3RhbnRWYWx1ZShjb250ZXh0KTtcblx0XHRjb250YWluZXIuYmluZDxBdXRob3Jpc2VkVXNlcj4oQVVUSEVEX1VTRVJfSURFTlRJRklFUikudG9Db25zdGFudFZhbHVlKGNvbnRleHQudXNlcik7XG5cdFx0Y29udGFpbmVyLmJpbmQ8SHR0cFJlcXVlc3Q+KEhUVFBfUkVRVUVTVF9JREVOVElGSUVSKS50b0NvbnN0YW50VmFsdWUoY29udGV4dC5yZXF1ZXN0KTtcblx0XHRjb250YWluZXIuYmluZDxpbnRlcmZhY2VzLkNvbnRhaW5lcj4oQ09OVEFJTkVSX0lERU5USUZJRVIpLnRvQ29uc3RhbnRWYWx1ZShjb250YWluZXIpO1xuXG5cdH1cblxuXHRwcml2YXRlIGxvYWRDb250cm9sbGVyKG1vZHVsZTogYW55LCBmaWxlOiBzdHJpbmcpIHtcblx0XHQvL2NvbnN0IGNvbnRyb2xsZXJNb2R1bGUgPSByZXF1aXJlKHBhdGgucmVzb2x2ZShmaWxlKSlcblx0XHRjb25zdCBjb250cm9sbGVyTmFtZSA9IE9iamVjdC5rZXlzKG1vZHVsZSlbMF0gfHwgbnVsbDtcblxuXHRcdGlmICghY29udHJvbGxlck5hbWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignVGhlcmUgd2FzIGFuIGVycm9yIGxvYWRpbmcgY29udHJvbGxlcjogJyArIGZpbGUpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbnRyb2xsZXIgPSBtb2R1bGVbY29udHJvbGxlck5hbWVdO1xuXG5cdFx0Y29uc3QgbmFtZSA9IGNvbnRyb2xsZXIubmFtZTtcblx0XHRpZiAoQ29udGFpbmVyLmlzQm91bmROYW1lZChDb250cm9sbGVyLCBuYW1lKSkge1xuXHRcdFx0dGhyb3cgbmV3IEVycm9yKGBUd28gY29udHJvbGxlcnMgY2Fubm90IGhhdmUgdGhlIHNhbWUgbmFtZTogJHtuYW1lfWApO1xuXHRcdH1cblx0XHRDb250YWluZXIuYmluZChDb250cm9sbGVyKS50byhjb250cm9sbGVyKS53aGVuVGFyZ2V0TmFtZWQobmFtZSk7XG5cblx0XHRMb2cuaW5mbygnQ29udHJvbGxlciBMb2FkZWQ6ICcgKyBmaWxlKVxuXHR9XG5cblx0YWxsQ29udHJvbGxlcnMoKSB7XG5cdFx0aWYgKCFDb250YWluZXIuaXNCb3VuZChDb250cm9sbGVyKSkge1xuXHRcdFx0TG9nLndhcm4oJ05vIGNvbnRyb2xsZXJzIGhhdmUgYmVlbiBib3VuZCB0byB0aGUgY29udGFpbmVyLi4uJyk7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXG5cdFx0cmV0dXJuIENvbnRhaW5lci5nZXRBbGwoQ29udHJvbGxlcikgfHwgW107XG5cdH1cblxufVxuIiwiaW1wb3J0IHtWYWxpZGF0aW9uRXhjZXB0aW9ufSBmcm9tIFwiQEFwcC9FeGNlcHRpb25zL1ZhbGlkYXRpb25FeGNlcHRpb25cIjtcbmltcG9ydCB7dmFsaWRhdGVPclJlamVjdCwgVmFsaWRhdGlvbkVycm9yfSBmcm9tIFwiY2xhc3MtdmFsaWRhdG9yXCI7XG5pbXBvcnQge0xvZ30gZnJvbSBcIkBDb3JlXCI7XG5cbmV4cG9ydCBjbGFzcyBEYXRhVHJhbnNmZXJPYmplY3Qge1xuXG5cdC8qKlxuXHQgKiBWYWxpZGF0aW9uIGVycm9ycyByZXR1cm5lZCBieSBjbGFzcy12YWxpZGF0b3Jcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX3ZhbGlkYXRpb25FcnJvcnM/OiBWYWxpZGF0aW9uRXJyb3JbXTtcblxuXHQvKipcblx0ICogVmFsaWRhdGUgdGhlIGRhdGEgdHJhbnNmZXIgb2JqZWN0IHVzaW5nIGNsYXNzLXZhbGlkYXRvclxuXHQgKi9cblx0YXN5bmMgdmFsaWRhdGUoKSB7XG5cdFx0dHJ5IHtcblx0XHRcdGF3YWl0IHZhbGlkYXRlT3JSZWplY3QodGhpcywge1xuXHRcdFx0XHRmb3JiaWRVbmtub3duVmFsdWVzIDogdHJ1ZSxcblx0XHRcdFx0d2hpdGVsaXN0ICAgICAgICAgICA6IHRydWUsXG5cdFx0XHRcdGVuYWJsZURlYnVnTWVzc2FnZXMgOiB0cnVlLFxuXHRcdFx0fSlcblx0XHR9IGNhdGNoIChlcnJvcikge1xuXHRcdFx0TG9nLndhcm4oZXJyb3IudG9TdHJpbmcoZmFsc2UpLCB0cnVlKTtcblxuXHRcdFx0aWYgKEFycmF5LmlzQXJyYXkoZXJyb3IpKSB7XG5cdFx0XHRcdHRoaXMuX3ZhbGlkYXRpb25FcnJvcnMgPSBlcnJvcjtcblx0XHRcdH1cblx0XHR9XG5cdH1cblxuXHQvKipcblx0ICogSWYgeW91IGRpZG4ndCB1c2UgYXV0byB2YWxpZGF0aW9uLCB0aGVuIHlvdSBjYW5cblx0ICogY2FsbCB0aGlzIG1ldGhvZCB0byB0aHJvdyB0aGUgdmFsaWRhdGlvbiBlcnJvclxuXHQgKi9cblx0dGhyb3dJZkZhaWxlZCgpIHtcblx0XHRpZiAodGhpcy5mYWlsZWQoKSkge1xuXHRcdFx0dGhyb3cgbmV3IFZhbGlkYXRpb25FeGNlcHRpb24odGhpcy5fdmFsaWRhdGlvbkVycm9ycyk7XG5cdFx0fVxuXHR9XG5cblx0LyoqXG5cdCAqIERpZCB0aGUgdmFsaWRhdGlvbiBmYWlsP1xuXHQgKi9cblx0ZmFpbGVkKCkge1xuXHRcdHJldHVybiAhIXRoaXMuX3ZhbGlkYXRpb25FcnJvcnM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSBjbGFzcy12YWxpZGF0b3IgZXJyb3JzXG5cdCAqL1xuXHRlcnJvcnMoKSB7XG5cdFx0aWYgKCF0aGlzLl92YWxpZGF0aW9uRXJyb3JzKSByZXR1cm4gbnVsbDtcblxuXHRcdHJldHVybiB0aGlzLl92YWxpZGF0aW9uRXJyb3JzO1xuXHR9XG5cbn1cbiIsImltcG9ydCB7RmFzdGlmeVJlcGx5LCBGYXN0aWZ5UmVxdWVzdH0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7TUVUQURBVEF9IGZyb20gXCIuLi8uLi8uLi8uLi9EZWNvcmF0b3JEYXRhXCI7XG5cblxuZXhwb3J0IGludGVyZmFjZSBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSB7XG5cdHByb3BlcnR5S2V5OiBzdHJpbmcgfCBzeW1ib2w7XG5cdHBhcmFtZXRlckluZGV4OiBudW1iZXI7XG5cdHRhcmdldDogT2JqZWN0O1xufVxuXG5cbmV4cG9ydCBjbGFzcyBDb250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yIHtcblxuXHRwdWJsaWMgZXhwZWN0ZWRQYXJhbVR5cGU6IGFueTtcblxuXHRjb25zdHJ1Y3RvcihwYXJhbVR5cGU6IGFueSkge1xuXHRcdHRoaXMuZXhwZWN0ZWRQYXJhbVR5cGUgPSBwYXJhbVR5cGU7XG5cdH1cblxuXHRzdGF0aWMgZ2V0TWV0aG9kTWV0YWRhdGE8VD4odGFyZ2V0OiBGdW5jdGlvbiwgbWV0YWRhdGE6IE1FVEFEQVRBKTogVCB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEobWV0YWRhdGEsIHRhcmdldCk7XG5cdH1cblxuXHRzdGF0aWMgaGFzSW5qZWN0YWJsZVBhcmFtcyhtZXRhZGF0YTogTUVUQURBVEEsIHRhcmdldDogYW55LCBrZXk6IHN0cmluZyB8IHN5bWJvbCkge1xuXHRcdHJldHVybiAhIXRoaXMuZ2V0TWV0aG9kTWV0YWRhdGEodGFyZ2V0W2tleV0sIG1ldGFkYXRhKTtcblx0fVxuXG5cdGFzeW5jIGJpbmQocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlc3BvbnNlOiBGYXN0aWZ5UmVwbHkpIHtcblx0XHRyZXR1cm4gdW5kZWZpbmVkO1xuXHR9XG5cblx0cHVibGljIGNhbkJpbmQodGFyZ2V0OiBGdW5jdGlvbiwgcGFyYW06IGFueSwgcGFyYW1ldGVySW5kZXggOiBudW1iZXIpIHtcblx0XHRyZXR1cm4gdGhpcy5leHBlY3RlZFBhcmFtVHlwZS5wcm90b3R5cGUgPT09IHBhcmFtLnByb3RvdHlwZTtcblx0fVxuXG59XG4iLCJpbXBvcnQge3BsYWluVG9DbGFzc30gZnJvbSBcImNsYXNzLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQge0Zhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3R9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge01FVEFEQVRBfSBmcm9tIFwiLi4vLi4vLi4vLi4vRGVjb3JhdG9yRGF0YVwiO1xuaW1wb3J0IHtEZWNvcmF0b3JIZWxwZXJzfSBmcm9tIFwiLi4vLi4vLi4vLi4vRGVjb3JhdG9ycy9EZWNvcmF0b3JIZWxwZXJzXCI7XG5pbXBvcnQge0RhdGFUcmFuc2Zlck9iamVjdH0gZnJvbSBcIi4uL0RhdGFUcmFuc2Zlck9iamVjdFwiO1xuaW1wb3J0IHtDb250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yLCBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YX0gZnJvbSBcIi4vQ29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvclwiO1xuXG5cbmV4cG9ydCBjbGFzcyBEYXRhVHJhbnNmZXJPYmplY3RQYXJhbSBleHRlbmRzIENvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3Ige1xuXG5cdHByaXZhdGUgZHRvUGFyYW1ldGVyOiB0eXBlb2YgRGF0YVRyYW5zZmVyT2JqZWN0O1xuXHRwcml2YXRlIHZhbGlkYXRlT25SZXF1ZXN0OiBib29sZWFuID0gdHJ1ZTtcblxuXHRjb25zdHJ1Y3Rvcihcblx0XHRkdG9QYXJhbWV0ZXI6IHR5cGVvZiBEYXRhVHJhbnNmZXJPYmplY3QsXG5cdFx0dmFsaWRhdGVPblJlcXVlc3Q6IGJvb2xlYW4gPSB0cnVlXG5cdCkge1xuXHRcdHN1cGVyKGR0b1BhcmFtZXRlcilcblx0XHR0aGlzLmR0b1BhcmFtZXRlciAgICAgID0gZHRvUGFyYW1ldGVyO1xuXHRcdHRoaXMudmFsaWRhdGVPblJlcXVlc3QgPSB2YWxpZGF0ZU9uUmVxdWVzdDtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgaGFuZGxlUGFyYW1ldGVyKHJlZmxlY3RvcjogUmVmbGVjdENvbnRyb2xsZXJNZXRob2RQYXJhbURhdGEsIHZhbGlkYXRlT25SZXF1ZXN0OiBib29sZWFuID0gdHJ1ZSkge1xuXHRcdGNvbnN0IHBhcmFtVHlwZXMgPSBEZWNvcmF0b3JIZWxwZXJzLnBhcmFtVHlwZXMocmVmbGVjdG9yLnRhcmdldCwgcmVmbGVjdG9yLnByb3BlcnR5S2V5KTtcblxuXHRcdGNvbnN0IGR0b1BhcmFtZXRlcjogdHlwZW9mIERhdGFUcmFuc2Zlck9iamVjdCA9IHBhcmFtVHlwZXNbcmVmbGVjdG9yLnBhcmFtZXRlckluZGV4XTtcblxuXHRcdGlmIChkdG9QYXJhbWV0ZXIucHJvdG90eXBlIGluc3RhbmNlb2YgRGF0YVRyYW5zZmVyT2JqZWN0KSB7XG5cdFx0XHRjb25zdCBwYXJhbUhhbmRsZXIgPSBuZXcgRGF0YVRyYW5zZmVyT2JqZWN0UGFyYW0oZHRvUGFyYW1ldGVyLCB2YWxpZGF0ZU9uUmVxdWVzdCk7XG5cdFx0XHR0aGlzLnNldE1ldGFkYXRhKHJlZmxlY3RvciwgcGFyYW1IYW5kbGVyKVxuXHRcdH1cblx0fVxuXG5cdHByaXZhdGUgc3RhdGljIHNldE1ldGFkYXRhKHJlZmxlY3RvcjogUmVmbGVjdENvbnRyb2xsZXJNZXRob2RQYXJhbURhdGEsIGR0b1BhcmFtOiBEYXRhVHJhbnNmZXJPYmplY3RQYXJhbSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHJlZmxlY3Rvci50YXJnZXRbcmVmbGVjdG9yLnByb3BlcnR5S2V5XTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfRFRPLCBkdG9QYXJhbSwgdGFyZ2V0KVxuXHR9XG5cblx0c3RhdGljIGdldE1ldGFkYXRhKHRhcmdldDogRnVuY3Rpb24pOiBEYXRhVHJhbnNmZXJPYmplY3RQYXJhbSB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfRFRPLCB0YXJnZXQpO1xuXHR9XG5cblx0YXN5bmMgYmluZChyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXHRcdGNvbnN0IGR0b0NsYXNzID0gcGxhaW5Ub0NsYXNzKHRoaXMuZHRvUGFyYW1ldGVyLCByZXF1ZXN0LmJvZHkpO1xuXG5cdFx0YXdhaXQgZHRvQ2xhc3MudmFsaWRhdGUoKTtcblxuXHRcdGlmICh0aGlzLnZhbGlkYXRlT25SZXF1ZXN0KSB7XG5cdFx0XHRkdG9DbGFzcy50aHJvd0lmRmFpbGVkKCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGR0b0NsYXNzO1xuXHR9XG5cblx0c3RhdGljIGNhbkluamVjdCh0YXJnZXQ6IGFueSwga2V5OiBzdHJpbmcgfCBzeW1ib2wpIHtcblx0XHRyZXR1cm4gISF0aGlzLmdldE1ldGFkYXRhKHRhcmdldFtrZXldKTtcblx0fVxufVxuIiwiaW1wb3J0IHtwbGFpblRvQ2xhc3N9IGZyb20gXCJjbGFzcy10cmFuc2Zvcm1lclwiO1xuaW1wb3J0IHtGYXN0aWZ5UmVwbHksIEZhc3RpZnlSZXF1ZXN0fSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtNRVRBREFUQX0gZnJvbSBcIi4uLy4uLy4uLy4uL0RlY29yYXRvckRhdGFcIjtcbmltcG9ydCB7RGVjb3JhdG9ySGVscGVyc30gZnJvbSBcIi4uLy4uLy4uLy4uL0RlY29yYXRvcnMvRGVjb3JhdG9ySGVscGVyc1wiO1xuaW1wb3J0IHtEYXRhVHJhbnNmZXJPYmplY3R9IGZyb20gXCIuLi9EYXRhVHJhbnNmZXJPYmplY3RcIjtcbmltcG9ydCB7Q29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvciwgUmVmbGVjdENvbnRyb2xsZXJNZXRob2RQYXJhbURhdGF9IGZyb20gXCIuL0NvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3JcIjtcblxuXG5leHBvcnQgY2xhc3MgUmVxdWVzdEJvZHlQYXJhbSBleHRlbmRzIENvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3Ige1xuXHRwcml2YXRlIHBhcmFtZXRlckluZGV4OiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IocGFyYW1ldGVySW5kZXg6IG51bWJlcikge1xuXHRcdHN1cGVyKG51bGwpXG5cdFx0dGhpcy5wYXJhbWV0ZXJJbmRleCA9IHBhcmFtZXRlckluZGV4O1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBoYW5kbGVQYXJhbWV0ZXIocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSwgdmFsaWRhdGVPblJlcXVlc3Q6IGJvb2xlYW4gPSB0cnVlKSB7XG5cdFx0dGhpcy5zZXRNZXRhZGF0YShyZWZsZWN0b3IsIG5ldyBSZXF1ZXN0Qm9keVBhcmFtKHJlZmxlY3Rvci5wYXJhbWV0ZXJJbmRleCkpXG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBzZXRNZXRhZGF0YShyZWZsZWN0b3I6IFJlZmxlY3RDb250cm9sbGVyTWV0aG9kUGFyYW1EYXRhLCBkdG9QYXJhbTogUmVxdWVzdEJvZHlQYXJhbSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHJlZmxlY3Rvci50YXJnZXRbcmVmbGVjdG9yLnByb3BlcnR5S2V5XTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfQk9EWSwgZHRvUGFyYW0sIHRhcmdldClcblx0fVxuXG5cdHN0YXRpYyBnZXRNZXRhZGF0YSh0YXJnZXQ6IEZ1bmN0aW9uKTogUmVxdWVzdEJvZHlQYXJhbSB8IHVuZGVmaW5lZCB7XG5cdFx0cmV0dXJuIFJlZmxlY3QuZ2V0TWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfQk9EWSwgdGFyZ2V0KTtcblx0fVxuXG5cdHB1YmxpYyBjYW5CaW5kKHRhcmdldDogRnVuY3Rpb24sIHBhcmFtOiBhbnksIHBhcmFtZXRlckluZGV4OiBudW1iZXIpIHtcblx0XHRyZXR1cm4gcGFyYW1ldGVySW5kZXggPT09IHRoaXMucGFyYW1ldGVySW5kZXg7XG5cdH1cblxuXHRhc3luYyBiaW5kKHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LCByZXNwb25zZTogRmFzdGlmeVJlcGx5KSB7XG5cdFx0cmV0dXJuIHJlcXVlc3QuYm9keTtcblx0fVxufVxuIiwiaW1wb3J0IHtwbGFpblRvQ2xhc3N9IGZyb20gXCJjbGFzcy10cmFuc2Zvcm1lclwiO1xuaW1wb3J0IHtGYXN0aWZ5UmVwbHksIEZhc3RpZnlSZXF1ZXN0fSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtNRVRBREFUQX0gZnJvbSBcIi4uLy4uLy4uLy4uL0RlY29yYXRvckRhdGFcIjtcbmltcG9ydCB7RGVjb3JhdG9ySGVscGVyc30gZnJvbSBcIi4uLy4uLy4uLy4uL0RlY29yYXRvcnMvRGVjb3JhdG9ySGVscGVyc1wiO1xuaW1wb3J0IHtEYXRhVHJhbnNmZXJPYmplY3R9IGZyb20gXCIuLi9EYXRhVHJhbnNmZXJPYmplY3RcIjtcbmltcG9ydCB7Q29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvciwgUmVmbGVjdENvbnRyb2xsZXJNZXRob2RQYXJhbURhdGF9IGZyb20gXCIuL0NvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3JcIjtcblxuXG5leHBvcnQgY2xhc3MgUmVxdWVzdEhlYWRlcnNQYXJhbSBleHRlbmRzIENvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3Ige1xuXHRwcml2YXRlIHBhcmFtZXRlckluZGV4OiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IocGFyYW1ldGVySW5kZXg6IG51bWJlcikge1xuXHRcdHN1cGVyKG51bGwpXG5cdFx0dGhpcy5wYXJhbWV0ZXJJbmRleCA9IHBhcmFtZXRlckluZGV4O1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBoYW5kbGVQYXJhbWV0ZXIocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSkge1xuXHRcdHRoaXMuc2V0TWV0YWRhdGEocmVmbGVjdG9yLCBuZXcgUmVxdWVzdEhlYWRlcnNQYXJhbShyZWZsZWN0b3IucGFyYW1ldGVySW5kZXgpKVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgc2V0TWV0YWRhdGEocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSwgZHRvUGFyYW06IFJlcXVlc3RIZWFkZXJzUGFyYW0pIHtcblx0XHRjb25zdCB0YXJnZXQgPSByZWZsZWN0b3IudGFyZ2V0W3JlZmxlY3Rvci5wcm9wZXJ0eUtleV07XG5cblx0XHRSZWZsZWN0LmRlZmluZU1ldGFkYXRhKE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX0hFQURFUlMsIGR0b1BhcmFtLCB0YXJnZXQpXG5cdH1cblxuXHRzdGF0aWMgZ2V0TWV0YWRhdGEodGFyZ2V0OiBGdW5jdGlvbik6IFJlcXVlc3RIZWFkZXJzUGFyYW0gfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX0hFQURFUlMsIHRhcmdldCk7XG5cdH1cblxuXHRwdWJsaWMgY2FuQmluZCh0YXJnZXQ6IEZ1bmN0aW9uLCBwYXJhbTogYW55LCBwYXJhbWV0ZXJJbmRleDogbnVtYmVyKSB7XG5cdFx0cmV0dXJuIHBhcmFtZXRlckluZGV4ID09PSB0aGlzLnBhcmFtZXRlckluZGV4O1xuXHR9XG5cblx0YXN5bmMgYmluZChyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXHRcdHJldHVybiByZXF1ZXN0LmhlYWRlcnM7XG5cdH1cbn1cbiIsImltcG9ydCB7RmFzdGlmeVJlcGx5LCBGYXN0aWZ5UmVxdWVzdH0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7TUVUQURBVEF9IGZyb20gXCIuLi8uLi8uLi8uLi9EZWNvcmF0b3JEYXRhXCI7XG5pbXBvcnQge0NvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3IsIFJlZmxlY3RDb250cm9sbGVyTWV0aG9kUGFyYW1EYXRhfSBmcm9tIFwiLi9Db250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yXCI7XG5cbmV4cG9ydCBjbGFzcyBSZXF1ZXN0UGFyYW0gZXh0ZW5kcyBDb250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yIHtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcihudWxsKTtcblx0fVxuXG5cdHN0YXRpYyBoYW5kbGVQYXJhbWV0ZXIocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSkge1xuXHRcdGNvbnN0IHBhcmFtSGFuZGxlciA9IG5ldyBSZXF1ZXN0UGFyYW0oKTtcblx0XHR0aGlzLnNldE1ldGFkYXRhKHJlZmxlY3RvciwgcGFyYW1IYW5kbGVyKVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgc2V0TWV0YWRhdGEocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSwgcGFyYW06IFJlcXVlc3RQYXJhbSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHJlZmxlY3Rvci50YXJnZXRbcmVmbGVjdG9yLnByb3BlcnR5S2V5XTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfRkFTVElGWV9SRVFVRVNULCBwYXJhbSwgdGFyZ2V0KVxuXHR9XG5cblx0c3RhdGljIGdldE1ldGFkYXRhKHRhcmdldDogRnVuY3Rpb24pOiBSZXF1ZXN0UGFyYW0gfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX0ZBU1RJRllfUkVRVUVTVCwgdGFyZ2V0KTtcblx0fVxuXG5cdHB1YmxpYyBjYW5CaW5kKHRhcmdldCA6IEZ1bmN0aW9uLCBwYXJhbTogYW55LCBwYXJhbWV0ZXJJbmRleCA6IG51bWJlcikge1xuXHRcdHJldHVybiB0aGlzIGluc3RhbmNlb2YgUmVxdWVzdFBhcmFtO1xuXHR9XG5cblx0YXN5bmMgYmluZChyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXHRcdHJldHVybiByZXF1ZXN0O1xuXHR9XG5cbn1cbiIsImltcG9ydCB7RmFzdGlmeVJlcGx5LCBGYXN0aWZ5UmVxdWVzdH0gZnJvbSBcImZhc3RpZnlcIjtcbmltcG9ydCB7TUVUQURBVEF9IGZyb20gXCIuLi8uLi8uLi8uLi9EZWNvcmF0b3JEYXRhXCI7XG5pbXBvcnQge0RlY29yYXRvckhlbHBlcnN9IGZyb20gXCIuLi8uLi8uLi8uLi9EZWNvcmF0b3JzL0RlY29yYXRvckhlbHBlcnNcIjtcbmltcG9ydCB7Q29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvciwgUmVmbGVjdENvbnRyb2xsZXJNZXRob2RQYXJhbURhdGF9IGZyb20gXCIuL0NvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3JcIjtcblxuZXhwb3J0IGNsYXNzIFJvdXRlUGFyYW1ldGVyUGFyYW0gZXh0ZW5kcyBDb250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yIHtcblx0cHJpdmF0ZSBwYXJhbWV0ZXJOYW1lOiBzdHJpbmc7XG5cdHByaXZhdGUgcGFyYW1JbmRleDogbnVtYmVyO1xuXG5cdGNvbnN0cnVjdG9yKHBhcmFtZXRlck5hbWU6IHN0cmluZywgdHlwZTogRnVuY3Rpb24sIHBhcmFtSW5kZXg6IG51bWJlcikge1xuXHRcdHN1cGVyKHR5cGUpO1xuXHRcdHRoaXMucGFyYW1ldGVyTmFtZSA9IHBhcmFtZXRlck5hbWU7XG5cdFx0dGhpcy5wYXJhbUluZGV4ICAgID0gcGFyYW1JbmRleDtcblx0fVxuXG5cdHN0YXRpYyBoYW5kbGVQYXJhbWV0ZXIocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSkge1xuXHRcdGNvbnN0IHR5cGVzICAgICAgICAgID0gRGVjb3JhdG9ySGVscGVycy5wYXJhbVR5cGVzKHJlZmxlY3Rvci50YXJnZXQsIHJlZmxlY3Rvci5wcm9wZXJ0eUtleSlcblx0XHRjb25zdCBwYXJhbWV0ZXJOYW1lcyA9IERlY29yYXRvckhlbHBlcnMuZ2V0UGFyYW1ldGVyTmFtZXMocmVmbGVjdG9yLnRhcmdldFtyZWZsZWN0b3IucHJvcGVydHlLZXldKVxuXG5cdFx0Y29uc3Qgcm91dGVQYXJhbWV0ZXJQYXJhbSA9IG5ldyBSb3V0ZVBhcmFtZXRlclBhcmFtKFxuXHRcdFx0cGFyYW1ldGVyTmFtZXNbcmVmbGVjdG9yLnBhcmFtZXRlckluZGV4XSxcblx0XHRcdHR5cGVzW3JlZmxlY3Rvci5wYXJhbWV0ZXJJbmRleF0sXG5cdFx0XHRyZWZsZWN0b3IucGFyYW1ldGVySW5kZXhcblx0XHQpO1xuXG5cdFx0dGhpcy5zZXRNZXRhZGF0YShyZWZsZWN0b3IsIHJvdXRlUGFyYW1ldGVyUGFyYW0pXG5cdH1cblxuXHRwcml2YXRlIHN0YXRpYyBzZXRNZXRhZGF0YShyZWZsZWN0b3I6IFJlZmxlY3RDb250cm9sbGVyTWV0aG9kUGFyYW1EYXRhLCBwYXJhbTogUm91dGVQYXJhbWV0ZXJQYXJhbSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHJlZmxlY3Rvci50YXJnZXRbcmVmbGVjdG9yLnByb3BlcnR5S2V5XTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfUk9VVEVfUEFSQU1FVEVSLCBwYXJhbSwgdGFyZ2V0KVxuXHR9XG5cblx0c3RhdGljIGdldE1ldGFkYXRhKHRhcmdldDogRnVuY3Rpb24pOiBSb3V0ZVBhcmFtZXRlclBhcmFtIHwgdW5kZWZpbmVkIHtcblx0XHRyZXR1cm4gUmVmbGVjdC5nZXRNZXRhZGF0YShNRVRBREFUQS5SRVFVRVNUX01FVEhPRF9ST1VURV9QQVJBTUVURVIsIHRhcmdldCk7XG5cdH1cblxuXHRwdWJsaWMgY2FuQmluZCh0YXJnZXQ6IEZ1bmN0aW9uLCBwYXJhbTogYW55LCBwYXJhbWV0ZXJJbmRleDogbnVtYmVyKSB7XG5cblx0XHRpZiAocGFyYW1ldGVySW5kZXggIT09IHRoaXMucGFyYW1JbmRleCkge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzLmV4cGVjdGVkUGFyYW1UeXBlID09PSBwYXJhbTtcblx0fVxuXG5cdGFzeW5jIGJpbmQocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlc3BvbnNlOiBGYXN0aWZ5UmVwbHkpIHtcblx0XHRjb25zdCBwYXJhbVZhbHVlID0gcmVxdWVzdC5wYXJhbXNbdGhpcy5wYXJhbWV0ZXJOYW1lXTtcblx0XHRjb25zdCBwYXJhbSAgICAgID0gdGhpcy5leHBlY3RlZFBhcmFtVHlwZShwYXJhbVZhbHVlKTtcblxuXHRcdHJldHVybiBwYXJhbSA/PyBudWxsO1xuXHR9XG5cbn1cbiIsImltcG9ydCB7RXhjZXB0aW9ufSBmcm9tIFwiQEFwcC9FeGNlcHRpb25zL0V4Y2VwdGlvblwiO1xuaW1wb3J0IHtGYXN0aWZ5UmVwbHksIEZhc3RpZnlSZXF1ZXN0fSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtTdGF0dXNDb2Rlc30gZnJvbSBcImh0dHAtc3RhdHVzLWNvZGVzXCI7XG5pbXBvcnQge0RlY29yYXRvckhlbHBlcnMsIE1FVEFEQVRBfSBmcm9tIFwiQENvcmVcIjtcbmltcG9ydCB7Q29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvciwgUmVmbGVjdENvbnRyb2xsZXJNZXRob2RQYXJhbURhdGF9IGZyb20gXCIuL0NvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3JcIjtcblxuZXhwb3J0IGNsYXNzIFJvdXRlUXVlcnlQYXJhbSBleHRlbmRzIENvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3Ige1xuXHRwcml2YXRlIHBhcmFtZXRlck5hbWU6IHN0cmluZztcblx0cHJpdmF0ZSBwYXJhbUluZGV4OiBudW1iZXI7XG5cblx0Y29uc3RydWN0b3IocGFyYW1ldGVyTmFtZTogc3RyaW5nLCB0eXBlOiBGdW5jdGlvbiwgcGFyYW1JbmRleDogbnVtYmVyKSB7XG5cdFx0c3VwZXIodHlwZSk7XG5cdFx0dGhpcy5wYXJhbWV0ZXJOYW1lID0gcGFyYW1ldGVyTmFtZTtcblx0XHR0aGlzLnBhcmFtSW5kZXggICAgPSBwYXJhbUluZGV4O1xuXHR9XG5cblx0c3RhdGljIGhhbmRsZVBhcmFtZXRlcihyZWZsZWN0b3I6IFJlZmxlY3RDb250cm9sbGVyTWV0aG9kUGFyYW1EYXRhKSB7XG5cdFx0Y29uc3QgdHlwZXMgICAgICAgICAgPSBEZWNvcmF0b3JIZWxwZXJzLnBhcmFtVHlwZXMocmVmbGVjdG9yLnRhcmdldCwgcmVmbGVjdG9yLnByb3BlcnR5S2V5KVxuXHRcdGNvbnN0IHBhcmFtZXRlck5hbWVzID0gRGVjb3JhdG9ySGVscGVycy5nZXRQYXJhbWV0ZXJOYW1lcyhyZWZsZWN0b3IudGFyZ2V0W3JlZmxlY3Rvci5wcm9wZXJ0eUtleV0pXG5cblx0XHRjb25zdCByb3V0ZVBhcmFtZXRlclBhcmFtID0gbmV3IFJvdXRlUXVlcnlQYXJhbShcblx0XHRcdHBhcmFtZXRlck5hbWVzW3JlZmxlY3Rvci5wYXJhbWV0ZXJJbmRleF0sXG5cdFx0XHR0eXBlc1tyZWZsZWN0b3IucGFyYW1ldGVySW5kZXhdLFxuXHRcdFx0cmVmbGVjdG9yLnBhcmFtZXRlckluZGV4XG5cdFx0KTtcblxuXHRcdHRoaXMuc2V0TWV0YWRhdGEocmVmbGVjdG9yLCByb3V0ZVBhcmFtZXRlclBhcmFtKVxuXHR9XG5cblx0cHJpdmF0ZSBzdGF0aWMgc2V0TWV0YWRhdGEocmVmbGVjdG9yOiBSZWZsZWN0Q29udHJvbGxlck1ldGhvZFBhcmFtRGF0YSwgcGFyYW06IFJvdXRlUXVlcnlQYXJhbSkge1xuXHRcdGNvbnN0IHRhcmdldCA9IHJlZmxlY3Rvci50YXJnZXRbcmVmbGVjdG9yLnByb3BlcnR5S2V5XTtcblxuXHRcdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuUkVRVUVTVF9NRVRIT0RfUVVFUllfUEFSQU1FVEVSLCBwYXJhbSwgdGFyZ2V0KVxuXHR9XG5cblx0c3RhdGljIGdldE1ldGFkYXRhKHRhcmdldDogRnVuY3Rpb24pOiBSb3V0ZVF1ZXJ5UGFyYW0gfCB1bmRlZmluZWQge1xuXHRcdHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLlJFUVVFU1RfTUVUSE9EX1FVRVJZX1BBUkFNRVRFUiwgdGFyZ2V0KTtcblx0fVxuXG5cdHB1YmxpYyBjYW5CaW5kKHRhcmdldDogRnVuY3Rpb24sIHBhcmFtOiBhbnksIHBhcmFtZXRlckluZGV4OiBudW1iZXIpIHtcblxuXHRcdGlmIChwYXJhbWV0ZXJJbmRleCAhPT0gdGhpcy5wYXJhbUluZGV4KSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0Y29uc3QgcmVzID0gdGhpcy5leHBlY3RlZFBhcmFtVHlwZSA9PT0gcGFyYW07XG5cdFx0cmV0dXJuIHJlcztcbi8vXHRcdHJldHVybiB0aGlzIGluc3RhbmNlb2YgUm91dGVRdWVyeVBhcmFtO1xuXHR9XG5cblx0YXN5bmMgYmluZChyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkge1xuXHRcdGNvbnN0IHBhcmFtVmFsdWUgPSByZXF1ZXN0LnF1ZXJ5W3RoaXMucGFyYW1ldGVyTmFtZV07XG5cdFx0Y29uc3QgcGFyYW0gICAgICA9IHRoaXMuZXhwZWN0ZWRQYXJhbVR5cGUocGFyYW1WYWx1ZSk7XG5cblx0XHRpZiAoIXBhcmFtKSB7XG5cdFx0XHR0aHJvdyBuZXcgRXhjZXB0aW9uKGBFeHBlY3RlZCB0eXBlIG9mICR7dHlwZW9mIHBhcmFtfSBmb3IgcGFyYW0gJHt0aGlzLnBhcmFtZXRlck5hbWV9IGJ1dCAke3R5cGVvZiBwYXJhbVZhbHVlfSBjYW5ub3QgYmUgY2FzdCB0byAke3R5cGVvZiBwYXJhbX1gLCBTdGF0dXNDb2Rlcy5CQURfUkVRVUVTVCk7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHBhcmFtID8/IG51bGw7XG5cdH1cblxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9Db250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yJztcbmV4cG9ydCAqIGZyb20gJy4vRGF0YVRyYW5zZmVyT2JqZWN0UGFyYW0nO1xuZXhwb3J0ICogZnJvbSAnLi9SZXF1ZXN0Qm9keVBhcmFtJztcbmV4cG9ydCAqIGZyb20gJy4vUmVxdWVzdEhlYWRlcnNQYXJhbSc7XG5leHBvcnQgKiBmcm9tICcuL1JlcXVlc3RQYXJhbSc7XG5leHBvcnQgKiBmcm9tICcuL1JvdXRlUGFyYW1ldGVyUGFyYW0nO1xuZXhwb3J0ICogZnJvbSAnLi9Sb3V0ZVF1ZXJ5UGFyYW0nO1xuIiwiaW1wb3J0IHtGYXN0aWZ5UmVwbHksIEZhc3RpZnlSZXF1ZXN0fSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge01FVEFEQVRBfSBmcm9tIFwiLi4vLi4vLi4vRGVjb3JhdG9yRGF0YVwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgYWJzdHJhY3QgY2xhc3MgTWlkZGxld2FyZSB7XG5cblx0cHVibGljIGFic3RyYWN0IGhhbmRsZXIocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlc3BvbnNlOiBGYXN0aWZ5UmVwbHkpOiBQcm9taXNlPGFueT47XG5cblx0c3RhdGljIGdldE1ldGFkYXRhKGNvbnRyb2xsZXI6IGFueSkge1xuXHRcdHJldHVybiBSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLk1JRERMRVdBUkUsIGNvbnRyb2xsZXIpO1xuXHR9XG5cblx0c3RhdGljIHNldE1ldGFkYXRhKGNvbnRyb2xsZXI6IGFueSwgbWlkZGxld2FyZXM6IE1pZGRsZXdhcmVbXSkge1xuXHRcdHJldHVybiBSZWZsZWN0LmRlZmluZU1ldGFkYXRhKE1FVEFEQVRBLk1JRERMRVdBUkUsIHttaWRkbGV3YXJlc30sIGNvbnRyb2xsZXIpO1xuXHR9XG5cbn1cbiIsImltcG9ydCB7RXhjZXB0aW9uSGFuZGxlcn0gZnJvbSBcIkBBcHAvRXhjZXB0aW9ucy9FeGNlcHRpb25IYW5kbGVyXCI7XG5pbXBvcnQge0NvbmZpZ30gZnJvbSBcIkBDb25maWdcIjtcbmltcG9ydCBjb25zb2xlIGZyb20gJ2NoYWxrLWNvbnNvbGUnO1xuaW1wb3J0IHtjbGFzc1RvUGxhaW4sIHNlcmlhbGl6ZX0gZnJvbSBcImNsYXNzLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQge0Zhc3RpZnlSZXBseSwgRmFzdGlmeVJlcXVlc3R9IGZyb20gXCJmYXN0aWZ5XCI7XG5pbXBvcnQge1JvdXRlSGFuZGxlck1ldGhvZH0gZnJvbSBcImZhc3RpZnkvdHlwZXMvcm91dGVcIjtcbmltcG9ydCBTdGF0dXNDb2RlcyBmcm9tIFwiaHR0cC1zdGF0dXMtY29kZXNcIjtcbmltcG9ydCB7aW5qZWN0YWJsZX0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHtPYmplY3RJZH0gZnJvbSBcIm1vbmdvZGJcIjtcbmltcG9ydCB7XG5cdENPTlRST0xMRVJfTUVUSE9EX1BBUkFNUyxcblx0Q29udHJvbGxlck1ldGFkYXRhLFxuXHRDb250cm9sbGVyTWV0aG9kTWV0YWRhdGEsXG5cdENvbnRyb2xsZXJNZXRob2RQYXJhbWV0ZXJNZXRhZGF0YSxcblx0Q29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvcixcblx0RGVjb3JhdG9ySGVscGVycyxcblx0SHR0cENvbnRleHQsXG5cdEh0dHBSZXNwb25zZSxcblx0TG9nLFxuXHRNRVRBREFUQSxcblx0TW9kZWxFbnRpdHlcbn0gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQge0NvbnRyb2xsZXJ9IGZyb20gXCIuL0NvbnRyb2xsZXJcIjtcbmltcG9ydCB7TWlkZGxld2FyZX0gZnJvbSBcIi4vTWlkZGxld2FyZVwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgUm91dGUge1xuXG5cdGNvbnN0cnVjdG9yKFxuXHRcdHByaXZhdGUgY29udHJvbGxlckNvbnN0cnVjdG9yOiBGdW5jdGlvbixcblx0XHRwcml2YXRlIGNvbnRyb2xsZXJNZXRhZGF0YTogQ29udHJvbGxlck1ldGFkYXRhLFxuXHRcdHByaXZhdGUgY29udHJvbGxlck1ldGhvZE1ldGFkYXRhOiBDb250cm9sbGVyTWV0aG9kTWV0YWRhdGFbXSxcblx0XHRwcml2YXRlIG1ldGFkYXRhOiBDb250cm9sbGVyTWV0aG9kTWV0YWRhdGFcblx0KSB7fVxuXG5cdC8qKlxuXHQgKiBSZXR1cm5zIGFsbCB0aGUgZmFzdGlmeSByb3V0ZSBhcmd1bWVudHMgbmVlZGVkIHRvXG5cdCAqIGJpbmQgdGhpcyByb3V0ZSB0byB0aGUgZmFzdGlmeSBpbnN0YW5jZVxuXHQgKi9cblx0Z2V0RmFzdGlmeVJvdXRlT3B0aW9ucygpIHtcblx0XHRjb25zdCBoYW5kbGVyICAgICAgICAgICA9IHRoaXMucmVzb2x2ZUhhbmRsZXJGYWN0b3J5KCk7XG5cdFx0Y29uc3Qgcm91dGVQYXRoOiBzdHJpbmcgPSB0aGlzLmdldFJvdXRlUGF0aCgpO1xuXHRcdGNvbnN0IG1pZGRsZXdhcmVBZGFwdGVyID0gdGhpcy5nZXRNaWRkbGV3YXJlQWRhcHRlcihyb3V0ZVBhdGgpO1xuXG5cdFx0cmV0dXJuIFtyb3V0ZVBhdGgsIG1pZGRsZXdhcmVBZGFwdGVyLCBoYW5kbGVyXTtcblx0fVxuXG5cdC8qKlxuXHQgKiBMb2FkIHRoZSBtaWRkbGV3YXJlIGZvciB0aGlzIHJvdXRlIGFuZCByZXR1cm4gaXQgYXMgYSBmYXN0aWZ5IHByZS1oYW5kbGVyXG5cdCAqXG5cdCAqIEBwYXJhbSByb3V0ZVBhdGhcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgZ2V0TWlkZGxld2FyZUFkYXB0ZXIocm91dGVQYXRoOiBzdHJpbmcpIHtcblx0XHRjb25zdCBjb250cm9sbGVyTWlkZGxld2FyZU1ldGEgID0gTWlkZGxld2FyZS5nZXRNZXRhZGF0YSh0aGlzLmNvbnRyb2xsZXJDb25zdHJ1Y3Rvcik7XG5cdFx0Y29uc3QgbWV0aG9kTWlkZGxld2FyZU1ldGEgICAgICA9IE1pZGRsZXdhcmUuZ2V0TWV0YWRhdGEodGhpcy5tZXRhZGF0YS50YXJnZXRbdGhpcy5tZXRhZGF0YS5rZXldKTtcblx0XHRjb25zdCBtaWRkbGV3YXJlczogTWlkZGxld2FyZVtdID0gW1xuXHRcdFx0Li4uKGNvbnRyb2xsZXJNaWRkbGV3YXJlTWV0YT8ubWlkZGxld2FyZXMgfHwgW10pLFxuXHRcdFx0Li4uKG1ldGhvZE1pZGRsZXdhcmVNZXRhPy5taWRkbGV3YXJlcyB8fCBbXSksXG5cdFx0XTtcblxuXHRcdG1pZGRsZXdhcmVzLmZvckVhY2gobXcgPT4ge1xuXHRcdFx0TG9nLmluZm8obXcuY29uc3RydWN0b3IubmFtZSArICcgd2FzIGxvYWRlZCBmb3IgJyArIHJvdXRlUGF0aCk7XG5cdFx0fSlcblxuXHRcdHJldHVybiB7XG5cdFx0XHRwcmVIYW5kbGVyIDogYXN5bmMgKHJlcXVlc3Q6IEZhc3RpZnlSZXF1ZXN0LCByZXNwb25zZTogRmFzdGlmeVJlcGx5KSA9PiB7XG5cdFx0XHRcdGZvciAoY29uc3QgbWlkZGxld2FyZSBvZiBtaWRkbGV3YXJlcykge1xuXHRcdFx0XHRcdHRyeSB7XG5cdFx0XHRcdFx0XHRhd2FpdCBtaWRkbGV3YXJlLmhhbmRsZXIocmVxdWVzdCwgcmVzcG9uc2UpO1xuXHRcdFx0XHRcdH0gY2F0Y2ggKGV4Y2VwdGlvbikge1xuXHRcdFx0XHRcdFx0cmV0dXJuIEV4Y2VwdGlvbkhhbmRsZXIudHJhbnNmb3JtKGV4Y2VwdGlvbiwgcmVzcG9uc2UpO1xuXHRcdFx0XHRcdH1cblx0XHRcdFx0fVxuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogUGFyc2UgdGhlIGNvbnRyb2xsZXIgJiBtZXRob2Qgcm91dGUsIGFsbG93cyB1cyB0byBkZWZpbmUgcm91dGVzIHdpdGhvdXQgYSBsZWFkaW5nIC9cblx0ICovXG5cdGdldFJvdXRlUGF0aCgpIHtcblxuXHRcdGNvbnN0IHJvdXRlcyA9IFtcblx0XHRcdHRoaXMuY29udHJvbGxlck1ldGFkYXRhLnBhdGgsXG5cdFx0XHR0aGlzLm1ldGFkYXRhLnBhdGhcblx0XHRdO1xuXG5cdFx0Zm9yIChsZXQgcm91dGUgaW4gcm91dGVzKSB7XG5cdFx0XHRyb3V0ZXNbcm91dGVdID0gcm91dGVzW3JvdXRlXS5yZXBsYWNlKCcvJywgJycpO1xuXHRcdH1cblxuXHRcdGxldCByb3V0ZSA9IHJvdXRlcy5qb2luKCcvJyk7XG5cblxuXHRcdGlmICghcm91dGUuc3RhcnRzV2l0aCgnLycpKSB7XG5cdFx0XHRyb3V0ZSA9ICcvJyArIHJvdXRlXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHJvdXRlO1xuXG5cbi8vXHRcdGlmICghdGhpcy5jb250cm9sbGVyTWV0YWRhdGEucGF0aC5zdGFydHNXaXRoKCcvJykpIHtcbi8vXHRcdFx0dGhpcy5jb250cm9sbGVyTWV0YWRhdGEucGF0aCA9ICcvJyArIHRoaXMuY29udHJvbGxlck1ldGFkYXRhLnBhdGg7XG4vL1x0XHR9XG4vL1xuLy9cdFx0aWYgKCF0aGlzLm1ldGFkYXRhLnBhdGguc3RhcnRzV2l0aCgnLycpKSB7XG4vL1x0XHRcdHRoaXMubWV0YWRhdGEucGF0aCA9ICcvJyArIHRoaXMubWV0YWRhdGEucGF0aDtcbi8vXHRcdH1cbi8vXG4vL1x0XHRpZiAodGhpcy5jb250cm9sbGVyTWV0aG9kTWV0YWRhdGEubGVuZ3RoID09PSAxICYmIHRoaXMuY29udHJvbGxlck1ldGFkYXRhLnBhdGggPT09ICcvJykge1xuLy9cdFx0XHR0aGlzLm1ldGFkYXRhLnBhdGggPSAnJztcbi8vXHRcdH1cbi8vXG4vL1x0XHRsZXQgcGF0aCA9IGAke3RoaXMuY29udHJvbGxlck1ldGFkYXRhLnBhdGh9JHt0aGlzLm1ldGFkYXRhLnBhdGh9YDtcbi8vXG4vL1x0XHRpZiAocGF0aC5lbmRzV2l0aCgnLycpKSB7XG4vL1x0XHRcdHBhdGggPSBwYXRoLnN1YnN0cmluZygwLCBwYXRoLmxlbmd0aCAtIDEpO1xuLy9cdFx0fVxuLy9cbi8vXHRcdHJldHVybiBwYXRoO1xuXHR9XG5cblx0LyoqXG5cdCAqIEhhbmRsZSB0aGUgcmVxdWVzdCB0byB0aGUgY29udHJvbGxlciBtZXRob2Rcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgcmVzb2x2ZUhhbmRsZXJGYWN0b3J5KCk6IFJvdXRlSGFuZGxlck1ldGhvZCB7XG5cdFx0cmV0dXJuIGFzeW5jIChyZXF1ZXN0OiBGYXN0aWZ5UmVxdWVzdCwgcmVzcG9uc2U6IEZhc3RpZnlSZXBseSkgPT4ge1xuXHRcdFx0dHJ5IHtcblx0XHRcdFx0Y29uc3Qgcm91dGVQYXJhbWV0ZXJzICAgICAgICAgID0gYXdhaXQgdGhpcy5pbmplY3RSb3V0ZURlY29yYXRvcnMocmVxdWVzdCwgcmVzcG9uc2UpO1xuXHRcdFx0XHRjb25zdCBodHRwQ29udGV4dDogSHR0cENvbnRleHQgPSBSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLkhUVFBfQ09OVEVYVCwgcmVxdWVzdCk7XG5cblx0XHRcdFx0Y29uc3QgdmFsdWUgPSBhd2FpdCBodHRwQ29udGV4dC5jb250YWluZXIuZ2V0TmFtZWQ8YW55Pihcblx0XHRcdFx0XHRDb250cm9sbGVyLCB0aGlzLmNvbnRyb2xsZXJNZXRhZGF0YS50YXJnZXQubmFtZVxuXHRcdFx0XHQpW3RoaXMubWV0YWRhdGEua2V5XSguLi5yb3V0ZVBhcmFtZXRlcnMpO1xuXG5cdFx0XHRcdGlmIChyZXNwb25zZS5zZW50KSB7XG5cdFx0XHRcdFx0Y29uc29sZS53YXJuKCdSZXMgd2FzIGFscmVhZHkgc2VudCcpO1xuXHRcdFx0XHRcdHJldHVybjtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJldHVybiB0aGlzLmdldFJlc3BvbnNlUmVzdWx0KHZhbHVlKTtcblx0XHRcdH0gY2F0Y2ggKGVycm9yKSB7XG5cdFx0XHRcdHJldHVybiBFeGNlcHRpb25IYW5kbGVyLnRyYW5zZm9ybShlcnJvciwgcmVzcG9uc2UpO1xuXHRcdFx0fVxuXHRcdH07XG5cdH1cblxuXHQvKipcblx0ICogSGFuZGxlIGFueSBjb250cm9sbGVyIG1ldGhvZCBwYXJhbWV0ZXIgaW5qZWN0aW9uXG5cdCAqIFJvdXRlIG1vZGVsIGJpbmRpbmcsIGRhdGEgdHJhbnNmZXIgb2JqZWN0cywgcmVxdWVzdCwgcmVzcG9uc2UgZXRjLi4uXG5cdCAqXG5cdCAqIEBwYXJhbSByZXF1ZXN0XG5cdCAqIEBwYXJhbSByZXNwb25zZVxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBhc3luYyBpbmplY3RSb3V0ZURlY29yYXRvcnMocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlc3BvbnNlOiBGYXN0aWZ5UmVwbHkpIHtcblx0XHRjb25zdCBwYXJhbUFyZ3M6IGFueVtdID0gW107XG5cblx0XHRjb25zdCBwYXJhbXMgPSBEZWNvcmF0b3JIZWxwZXJzLnBhcmFtVHlwZXModGhpcy5tZXRhZGF0YS50YXJnZXQsIHRoaXMubWV0YWRhdGEua2V5KVxuXG5cdFx0aWYgKCFwYXJhbXMpIHtcblx0XHRcdHJldHVybiBbcmVxdWVzdCwgcmVzcG9uc2VdO1xuXHRcdH1cblxuXHRcdGZvciAobGV0IGluZGV4IGluIHRoaXMubWV0YWRhdGEucGFyYW1ldGVycykge1xuXHRcdFx0Y29uc3QgcGFyYW1ldGVyOiBDb250cm9sbGVyTWV0aG9kUGFyYW1ldGVyTWV0YWRhdGEgPSB0aGlzLm1ldGFkYXRhLnBhcmFtZXRlcnNbaW5kZXhdO1xuXG5cdFx0XHRpZiAocGFyYW1ldGVyLnR5cGUucHJvdG90eXBlIGluc3RhbmNlb2YgTW9kZWxFbnRpdHkpIHtcblx0XHRcdFx0Y29uc3QgaWRlbnRpZmllciA9IHJlcXVlc3QucGFyYW1zW3BhcmFtZXRlci5uYW1lXTtcblx0XHRcdFx0Y29uc3QgbW9kZWwgICAgICA9IGF3YWl0IHBhcmFtZXRlci50eXBlLnF1ZXJ5KCkuZmluZEJ5SWQobmV3IE9iamVjdElkKGlkZW50aWZpZXIpKSA/PyBudWxsO1xuXG5cdFx0XHRcdHBhcmFtQXJncy5wdXNoKG1vZGVsKTtcblxuXHRcdFx0XHRjb250aW51ZTtcblx0XHRcdH1cblxuXHRcdFx0Zm9yIChjb25zdCBtZXRhZGF0YUtleSBvZiBDT05UUk9MTEVSX01FVEhPRF9QQVJBTVMpIHtcblx0XHRcdFx0Y29uc3QgbWV0aG9kTWV0YTogQ29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvciA9IENvbnRyb2xsZXJSZXF1ZXN0UGFyYW1EZWNvcmF0b3IuZ2V0TWV0aG9kTWV0YWRhdGEoXG5cdFx0XHRcdFx0dGhpcy5tZXRhZGF0YS50YXJnZXRbdGhpcy5tZXRhZGF0YS5rZXldLFxuXHRcdFx0XHRcdG1ldGFkYXRhS2V5XG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0aWYgKCFtZXRob2RNZXRhKSB7XG5cdFx0XHRcdFx0Y29udGludWU7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRpZiAobWV0aG9kTWV0YS5jYW5CaW5kKHRoaXMubWV0YWRhdGEudGFyZ2V0W3RoaXMubWV0YWRhdGEua2V5XSwgcGFyYW1ldGVyLnR5cGUsIE51bWJlcihpbmRleCkpKSB7XG5cdFx0XHRcdFx0cGFyYW1BcmdzLnB1c2goYXdhaXQgbWV0aG9kTWV0YS5iaW5kKHJlcXVlc3QsIHJlc3BvbnNlKSk7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdH1cblx0XHRcdH1cblxuXHRcdH1cblxuXHRcdC8vXHRcdGZvciAobGV0IHBhcmFtSW5kZXggaW4gcGFyYW1zKSB7XG5cdFx0Ly9cdFx0XHRjb25zdCBwYXJhbSA9IHBhcmFtc1twYXJhbUluZGV4XTtcblx0XHQvL1xuXHRcdC8vXHRcdFx0Zm9yIChjb25zdCBtZXRhZGF0YUtleSBvZiBDT05UUk9MTEVSX01FVEhPRF9QQVJBTVMpIHtcblx0XHQvL1xuXHRcdC8vXHRcdFx0XHRjb25zdCBtZXRob2RNZXRhOiBDb250cm9sbGVyUmVxdWVzdFBhcmFtRGVjb3JhdG9yID0gQ29udHJvbGxlclJlcXVlc3RQYXJhbURlY29yYXRvci5nZXRNZXRob2RNZXRhZGF0YShcblx0XHQvL1x0XHRcdFx0XHR0aGlzLm1ldGFkYXRhLnRhcmdldFt0aGlzLm1ldGFkYXRhLmtleV0sXG5cdFx0Ly9cdFx0XHRcdFx0bWV0YWRhdGFLZXlcblx0XHQvL1x0XHRcdFx0KTtcblx0XHQvL1xuXHRcdC8vXHRcdFx0XHRpZiAoIW1ldGhvZE1ldGEpIHtcblx0XHQvL1x0XHRcdFx0XHRjb250aW51ZTtcblx0XHQvL1x0XHRcdFx0fVxuXHRcdC8vXG5cdFx0Ly9cdFx0XHRcdGlmIChtZXRob2RNZXRhLmNhbkJpbmQodGhpcy5tZXRhZGF0YS50YXJnZXRbdGhpcy5tZXRhZGF0YS5rZXldLCBwYXJhbSwgTnVtYmVyKHBhcmFtSW5kZXgpKSkge1xuXHRcdC8vXHRcdFx0XHRcdHBhcmFtQXJncy5wdXNoKGF3YWl0IG1ldGhvZE1ldGEuYmluZChyZXF1ZXN0LCByZXNwb25zZSkpO1xuXHRcdC8vXHRcdFx0XHRcdGJyZWFrO1xuXHRcdC8vXHRcdFx0XHR9XG5cdFx0Ly9cblx0XHQvL1x0XHRcdH1cblx0XHQvL1x0XHR9XG5cblx0XHQvL3BhcmFtQXJncy5wdXNoKHJlcXVlc3QsIHJlc3BvbnNlKTtcblxuXHRcdHJldHVybiBwYXJhbUFyZ3M7XG5cblxuLy9cdFx0Y29uc3Qgcm91dGVBcmd1bWVudHM6IGFueVtdID0gW107XG4vL1xuLy9cdFx0aWYgKCFwYXJhbWV0ZXJNZXRhZGF0YSB8fCAhcGFyYW1ldGVyTWV0YWRhdGEubGVuZ3RoKSB7XG4vL1x0XHRcdHJldHVybiBbcmVxdWVzdCwgcmVzcG9uc2VdO1xuLy9cdFx0fVxuLy9cbi8vXHRcdGZvciAoY29uc3QgcGFyYW0gb2YgcGFyYW1ldGVyTWV0YWRhdGEpIHtcbi8vXHRcdFx0Y29uc3Qge3R5cGUsIGluZGV4LCBwYXJhbWV0ZXJOYW1lLCBpbmplY3RSb290LCBjYXN0LCB2YWxpZGF0ZU9uUmVxdWVzdH0gPSBwYXJhbTtcbi8vXG4vL1x0XHRcdHN3aXRjaCAodHlwZSkge1xuLy9cdFx0XHRcdGNhc2UgUEFSQU1FVEVSX1RZUEUuUkVRVUVTVDpcbi8vXHRcdFx0XHRcdHJvdXRlQXJndW1lbnRzW2luZGV4XSA9IHJlcXVlc3Q7XG4vL1x0XHRcdFx0XHRicmVhaztcbi8vXHRcdFx0XHRjYXNlIFBBUkFNRVRFUl9UWVBFLlBBUkFNUzpcbi8vXHRcdFx0XHRcdHJvdXRlQXJndW1lbnRzW2luZGV4XSA9IHRoaXMuZ2V0UGFyYW0ocmVxdWVzdCwgXCJwYXJhbXNcIiwgaW5qZWN0Um9vdCwgcGFyYW1ldGVyTmFtZSk7XG4vL1x0XHRcdFx0XHRicmVhaztcbi8vXHRcdFx0XHRjYXNlIFBBUkFNRVRFUl9UWVBFLlFVRVJZOlxuLy9cdFx0XHRcdFx0cm91dGVBcmd1bWVudHNbaW5kZXhdID0gdGhpcy5nZXRQYXJhbShyZXF1ZXN0LCBcInF1ZXJ5XCIsIGluamVjdFJvb3QsIHBhcmFtZXRlck5hbWUpO1xuLy9cdFx0XHRcdFx0YnJlYWs7XG4vL1x0XHRcdFx0Y2FzZSBQQVJBTUVURVJfVFlQRS5CT0RZOlxuLy9cdFx0XHRcdFx0cm91dGVBcmd1bWVudHNbaW5kZXhdID0gcmVxdWVzdC5ib2R5O1xuLy9cdFx0XHRcdFx0YnJlYWs7XG4vL1x0XHRcdFx0Y2FzZSBQQVJBTUVURVJfVFlQRS5EVE86XG4vL1x0XHRcdFx0XHRpZiAodGhpcy5zaG91bGRCaW5kRHRvKGNhc3QpKSB7XG4vL1x0XHRcdFx0XHRcdHJvdXRlQXJndW1lbnRzW2luZGV4XSA9IGF3YWl0IHRoaXMuYmluZER0byhjYXN0LCByZXF1ZXN0LmJvZHksIHZhbGlkYXRlT25SZXF1ZXN0KTtcbi8vXHRcdFx0XHRcdH1cbi8vXHRcdFx0XHRcdGJyZWFrO1xuLy9cdFx0XHRcdGNhc2UgUEFSQU1FVEVSX1RZUEUuSEVBREVSUzpcbi8vXHRcdFx0XHRcdHJvdXRlQXJndW1lbnRzW2luZGV4XSA9IHRoaXMuZ2V0UGFyYW0ocmVxdWVzdCwgXCJoZWFkZXJzXCIsIGluamVjdFJvb3QsIHBhcmFtZXRlck5hbWUpO1xuLy9cdFx0XHRcdFx0YnJlYWs7XG4vL1x0XHRcdFx0Y2FzZSBQQVJBTUVURVJfVFlQRS5DT09LSUVTOlxuLy9cdFx0XHRcdFx0cm91dGVBcmd1bWVudHNbaW5kZXhdID0gdGhpcy5nZXRQYXJhbShyZXF1ZXN0LCBcImNvb2tpZXNcIiwgaW5qZWN0Um9vdCwgcGFyYW1ldGVyTmFtZSk7XG4vL1x0XHRcdFx0XHRicmVhaztcbi8vXHRcdFx0XHRkZWZhdWx0OlxuLy9cdFx0XHRcdFx0cm91dGVBcmd1bWVudHNbaW5kZXhdID0gcmVzcG9uc2U7XG4vL1x0XHRcdFx0XHRicmVhazsgLy8gcmVzcG9uc2Vcbi8vXHRcdFx0fVxuLy9cdFx0fVxuLy9cbi8vXHRcdHJvdXRlQXJndW1lbnRzLnB1c2gocmVxdWVzdCwgcmVzcG9uc2UpO1xuXG4vL1x0XHRyZXR1cm4gcm91dGVBcmd1bWVudHM7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IHRoZSByZXN1bHQgb2YgdGhlIHJlc3BvbnNlIGZyb20gdGhlIGNvbnRyb2xsZXIgYWN0aW9uLlxuXHQgKlxuXHQgKiBJZiB0aGUgY29udHJvbGxlciByZXNwb25kZWQgd2l0aCB1bmRlZmluZWQvbnVsbCwgd2UnbGwgc2VuZCBhIG5vIGNvbnRlbnQgcmVzcG9uc2Vcblx0ICogSWYgdGhlcmUgd2FzIGFuIG9iamVjdCByZXR1cm5lZCBkaXJlY3RseSBmcm9tIHRoZSBjb250cm9sbGVyLCB3ZSdsbCBjcmVhdGUgYSBuZXcgcmVzcG9uc2UgYW5kIHNlbmQgaXQuXG5cdCAqXG5cdCAqIE90aGVyd2lzZSwgd2UnbGwgc2VuZCB0aGUgcmVzcG9uc2Ugb2YgdGhlIHtAc2VlIEh0dHBDb250ZXh0fVxuXHQgKlxuXHQgKiBAcGFyYW0gY29udHJvbGxlclJlc3BvbnNlXG5cdCAqIEBwcml2YXRlXG5cdCAqL1xuXHRwcml2YXRlIGdldFJlc3BvbnNlUmVzdWx0KGNvbnRyb2xsZXJSZXNwb25zZTogSHR0cFJlc3BvbnNlIHwgYW55KSB7XG5cdFx0Y29uc3QgcmVzcG9uc2UgPSBIdHRwQ29udGV4dC5yZXNwb25zZSgpO1xuXG5cdFx0aWYgKGNvbnRyb2xsZXJSZXNwb25zZSA9PT0gdW5kZWZpbmVkIHx8IGNvbnRyb2xsZXJSZXNwb25zZSA9PT0gbnVsbCkge1xuXHRcdFx0cmV0dXJuIHJlc3BvbnNlLnNldFJlc3BvbnNlKG51bGwsIFN0YXR1c0NvZGVzLk5PX0NPTlRFTlQpLnNlbmQoKTtcblx0XHR9XG5cblxuXHRcdGlmICghKGNvbnRyb2xsZXJSZXNwb25zZSBpbnN0YW5jZW9mIEh0dHBSZXNwb25zZSkpIHtcblx0XHRcdHJldHVybiByZXNwb25zZS5zZXRSZXNwb25zZShcblx0XHRcdFx0Y2xhc3NUb1BsYWluKGNvbnRyb2xsZXJSZXNwb25zZSwgQ29uZmlnLmh0dHAucmVzcG9uc2VTZXJpYWxpemF0aW9uKSxcblx0XHRcdFx0U3RhdHVzQ29kZXMuQUNDRVBURURcblx0XHRcdCkuc2VuZCgpO1xuXHRcdH1cblxuXHRcdGNvbnN0IGNvbmYgICAgICAgICAgICAgID0gQ29uZmlnLmh0dHAucmVzcG9uc2VTZXJpYWxpemF0aW9uO1xuXHRcdGNvbnRyb2xsZXJSZXNwb25zZS5kYXRhID0gc2VyaWFsaXplKGNvbnRyb2xsZXJSZXNwb25zZS5kYXRhLCBjb25mKTtcblxuXHRcdHJldHVybiBjb250cm9sbGVyUmVzcG9uc2Uuc2VuZCgpO1xuXHR9XG5cblx0cHJpdmF0ZSByZXBsYWNlQ2lyY3VsYXJSZWZlcmVuY2VJblJlc3BvbnNlKHZhbCwgY2FjaGUgPSBudWxsKSB7XG5cdFx0Y2FjaGUgPSBjYWNoZSB8fCBuZXcgV2Vha1NldCgpO1xuXG5cdFx0aWYgKHZhbCAmJiB0eXBlb2YgKHZhbCkgPT09ICdvYmplY3QnKSB7XG5cdFx0XHRpZiAoY2FjaGUuaGFzKHZhbCkpIHJldHVybiAnW0NpcmN1bGFyXSc7XG5cblx0XHRcdGNhY2hlLmFkZCh2YWwpO1xuXG5cdFx0XHRjb25zdCBvYmogPSAoQXJyYXkuaXNBcnJheSh2YWwpID8gW10gOiB7fSk7XG5cdFx0XHRmb3IgKGNvbnN0IGlkeCBpbiB2YWwpIHtcblx0XHRcdFx0b2JqW2lkeF0gPSB0aGlzLnJlcGxhY2VDaXJjdWxhclJlZmVyZW5jZUluUmVzcG9uc2UodmFsW2lkeF0sIGNhY2hlKTtcblx0XHRcdH1cblxuXHRcdFx0Y2FjaGUuZGVsZXRlKHZhbCk7XG5cdFx0XHRyZXR1cm4gb2JqO1xuXHRcdH1cblxuXHRcdHJldHVybiB2YWw7XG5cdH07XG5cblxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9Db250cm9sbGVyJztcbmV4cG9ydCAqIGZyb20gJy4vQ29udHJvbGxlclNlcnZpY2VQcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL0RhdGFUcmFuc2Zlck9iamVjdCc7XG5leHBvcnQgKiBmcm9tICcuL0RlY29yYXRvcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9NaWRkbGV3YXJlJztcbmV4cG9ydCAqIGZyb20gJy4vUm91dGUnO1xuIiwiaW1wb3J0IHtDb25maWd9IGZyb20gXCJAQ29uZmlnXCI7XG5pbXBvcnQgY29uc29sZSBmcm9tICdjaGFsay1jb25zb2xlJztcbmltcG9ydCBmYXN0aWZ5LCB7RmFzdGlmeUluc3RhbmNlLCBGYXN0aWZ5UmVwbHksIEZhc3RpZnlSZXF1ZXN0fSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtpbmplY3QsIGluamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCBtaWRkaWUgZnJvbSBcIm1pZGRpZVwiO1xuaW1wb3J0IHtMb2d9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IHtNRVRBREFUQX0gZnJvbSBcIi4uLy4uLy4uL0RlY29yYXRvckRhdGFcIjtcbmltcG9ydCB7Q29udHJvbGxlck1ldGhvZE1ldGFkYXRhfSBmcm9tIFwiLi4vLi4vLi4vRGVjb3JhdG9ycy9Sb3V0ZVwiO1xuaW1wb3J0IHtIdHRwQ29udGV4dH0gZnJvbSBcIi4uL0NvbnRleHQvSHR0cENvbnRleHRcIjtcbmltcG9ydCB7Q29udHJvbGxlcn0gZnJvbSBcIi4uL0NvbnRyb2xsZXIvQ29udHJvbGxlclwiO1xuaW1wb3J0IHtDb250cm9sbGVyU2VydmljZVByb3ZpZGVyfSBmcm9tIFwiLi4vQ29udHJvbGxlci9Db250cm9sbGVyU2VydmljZVByb3ZpZGVyXCI7XG5pbXBvcnQge1JvdXRlfSBmcm9tIFwiLi4vQ29udHJvbGxlci9Sb3V0ZVwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VydmVyIHtcblxuXHQvKipcblx0ICogT3VyIGZhc3RpZnkgaW5zdGFuY2UgZm9yIHRoZSBzZXJ2ZXJcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2FwcDogRmFzdGlmeUluc3RhbmNlO1xuXG5cdC8qKlxuXHQgKiBJbmplY3RlZCBjb250cm9sbGVyIHNlcnZpY2UgcHJvdmlkZXJcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdEBpbmplY3QoQ29udHJvbGxlclNlcnZpY2VQcm92aWRlcilcblx0cHJpdmF0ZSBjb250cm9sbGVyUHJvdmlkZXI6IENvbnRyb2xsZXJTZXJ2aWNlUHJvdmlkZXJcblxuXHQvKipcblx0ICogSW5pdGlhbGlzZSBmYXN0aWZ5LCBhZGQgYWxsIHJvdXRlcyB0byB0aGUgYXBwbGljYXRpb24gYW5kIGFwcGx5IGFueSBtaWRkbGV3YXJlc1xuXHQgKi9cblx0cHVibGljIGFzeW5jIGJ1aWxkKCkge1xuXHRcdGlmICh0aGlzLl9hcHApXG5cdFx0XHR0aHJvdyBuZXcgRXJyb3IoJ1NlcnZlciBoYXMgYWxyZWFkeSBiZWVuIGJ1aWx0Jyk7XG5cblx0XHR0aGlzLl9hcHAgPSBmYXN0aWZ5KHtcblx0XHRcdC8vbG9nZ2VyIDogdHJ1ZVxuXHRcdH0pO1xuXG5cdFx0YXdhaXQgdGhpcy5fYXBwLnJlZ2lzdGVyKG1pZGRpZSk7XG5cblx0XHR0aGlzLl9hcHAuYWRkSG9vaygnb25FcnJvcicsIChyZXF1ZXN0LCByZXBseSwgZXJyb3IsIGRvbmUpID0+IHtcblx0XHRcdGNvbnNvbGUuZXJyb3IoZXJyb3IpO1xuXG5cdFx0XHRkb25lKCk7XG5cdFx0fSk7XG5cblx0XHQvLyBUaGUgdmVyeSBmaXJzdCBtaWRkbGV3YXJlIHRvIGJlIGludm9rZWRcblx0XHQvLyBpdCBjcmVhdGVzIGEgbmV3IGh0dHBDb250ZXh0IGFuZCBhdHRhY2hlcyBpdCB0byB0aGVcblx0XHQvLyBjdXJyZW50IHJlcXVlc3QgYXMgbWV0YWRhdGEgdXNpbmcgUmVmbGVjdFxuLy9cdFx0dGhpcy5fYXBwLmFkZEhvb2soJ3ByZUhhbmRsZXInLCBhc3luYyAocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlc3BvbnNlOiBGYXN0aWZ5UmVwbHkpID0+IHtcbi8vXG4vL1xuLy9cdFx0XHRSZWZsZWN0LmRlZmluZU1ldGFkYXRhKFxuLy9cdFx0XHRcdE1FVEFEQVRBLkhUVFBfQ09OVEVYVCxcbi8vXHRcdFx0XHQobmV3IEh0dHBDb250ZXh0KHJlcXVlc3QsIHJlc3BvbnNlKSkucHJlcGFyZSgpLFxuLy9cdFx0XHRcdHJlcXVlc3Rcbi8vXHRcdFx0KTtcbi8vXHRcdH0pO1xuXG5cdFx0dGhpcy5fYXBwLmFkZEhvb2soJ3ByZUhhbmRsZXInLCAocmVxdWVzdDogRmFzdGlmeVJlcXVlc3QsIHJlc3BvbnNlOiBGYXN0aWZ5UmVwbHksIGRvbmUpID0+IHtcblx0XHRcdChuZXcgSHR0cENvbnRleHQocmVxdWVzdCwgcmVzcG9uc2UpKS5iaW5kKGRvbmUpO1xuXHRcdH0pO1xuXG5cdFx0dGhpcy5yZWdpc3RlclBsdWdpbnMoKTtcblxuXHRcdHRoaXMucmVnaXN0ZXJDb250cm9sbGVycygpO1xuXG5cdFx0cmV0dXJuIHRoaXMuX2FwcDtcblx0fVxuXG5cdC8qKlxuXHQgKiBSZWdpc3RlciBhbGwgY29udHJvbGxlciByb3V0ZXMgaW5zaWRlIGZhc3RpZnlcblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgcmVnaXN0ZXJDb250cm9sbGVycygpIHtcblxuXHRcdHRoaXMuX2FwcC5yZWdpc3RlcigoaW5zdGFuY2UsIG9wdHMsIGRvbmUpID0+IHtcblxuXHRcdFx0dGhpcy5jb250cm9sbGVyUHJvdmlkZXIuYWxsQ29udHJvbGxlcnMoKS5mb3JFYWNoKChjb250cm9sbGVyOiBDb250cm9sbGVyKSA9PiB7XG5cblx0XHRcdFx0Y29uc3QgY29udHJvbGxlck1ldGFkYXRhID0gY29udHJvbGxlci5nZXRNZXRhZGF0YSgpO1xuXHRcdFx0XHRjb25zdCBtZXRob2RNZXRhZGF0YSAgICAgPSBjb250cm9sbGVyLmdldE1ldGhvZE1ldGFkYXRhKCk7XG5cblx0XHRcdFx0aWYgKGNvbnRyb2xsZXJNZXRhZGF0YSAmJiBtZXRob2RNZXRhZGF0YSkge1xuXG5cdFx0XHRcdFx0bWV0aG9kTWV0YWRhdGEuZm9yRWFjaCgobWV0YWRhdGE6IENvbnRyb2xsZXJNZXRob2RNZXRhZGF0YSkgPT4ge1xuXG5cdFx0XHRcdFx0XHRjb25zdCBhcHBSb3V0ZSA9IG5ldyBSb3V0ZShcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlci5jb25zdHJ1Y3Rvcixcblx0XHRcdFx0XHRcdFx0Y29udHJvbGxlck1ldGFkYXRhLFxuXHRcdFx0XHRcdFx0XHRtZXRob2RNZXRhZGF0YSxcblx0XHRcdFx0XHRcdFx0bWV0YWRhdGFcblx0XHRcdFx0XHRcdCk7XG5cblx0XHRcdFx0XHRcdExvZy5pbmZvKGBSb3V0ZSBMb2FkZWQ6ICR7Y29udHJvbGxlci5jb25zdHJ1Y3Rvci5uYW1lfSgke21ldGFkYXRhLm1ldGhvZC50b1VwcGVyQ2FzZSgpfSAke2FwcFJvdXRlLmdldFJvdXRlUGF0aCgpfSlgKTtcblxuXHRcdFx0XHRcdFx0dGhpcy5fYXBwW21ldGFkYXRhLm1ldGhvZF0oLi4uYXBwUm91dGUuZ2V0RmFzdGlmeVJvdXRlT3B0aW9ucygpKTtcblx0XHRcdFx0XHR9KTtcblx0XHRcdFx0fVxuXHRcdFx0fSk7XG5cblx0XHRcdGRvbmUoKTtcblx0XHR9KVxuXG5cdH1cblxuXHRjbGVhblVwTWV0YWRhdGEoKSB7XG5cdFx0UmVmbGVjdC5kZWZpbmVNZXRhZGF0YShcblx0XHRcdE1FVEFEQVRBLkNPTlRST0xMRVIsXG5cdFx0XHRbXSxcblx0XHRcdFJlZmxlY3Rcblx0XHQpO1xuXHR9XG5cblx0cHJpdmF0ZSByZWdpc3RlclBsdWdpbnMoKSB7XG5cdFx0Y29uc3QgcHJvdmlkZXJzID0gQ29uZmlnLnNlcnZlclByb3ZpZGVycztcblxuXHRcdHByb3ZpZGVycy5mb3JFYWNoKHByb3ZpZGVyID0+IHtcblx0XHRcdHRoaXMuX2FwcC5yZWdpc3Rlcihwcm92aWRlclswXSwgcHJvdmlkZXJbMV0pO1xuXHRcdH0pXG5cdH1cblxuXHRnZXQgYXBwKCkge1xuXHRcdHJldHVybiB0aGlzLl9hcHA7XG5cdH1cbn1cbiIsImltcG9ydCB7RmFzdGlmeUluc3RhbmNlfSBmcm9tIFwiZmFzdGlmeVwiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge0NvbnRhaW5lciwgTG9nLCBTZXJ2aWNlUHJvdmlkZXJ9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IHtTZXJ2ZXJ9IGZyb20gXCIuL1NlcnZlclwiO1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU2VydmVyU2VydmljZVByb3ZpZGVyIGV4dGVuZHMgU2VydmljZVByb3ZpZGVyIHtcblxuXHQvKipcblx0ICogVGhlIEZhc3RpZnkgU2VydmVyIHdyYXBwZWQgd2l0aCBvdXIgb3duIGxvZ2ljXG5cdCAqIEBwdWJsaWNcblx0ICovXG5cdHB1YmxpYyBzZXJ2ZXI6IFNlcnZlcjtcblxuXHQvKipcblx0ICogVGhlIGluc3RhbmNlIG9mIEZhc3RpZnkgdGhhdCB7QHNlZSBTZXJ2ZXJ9IGlzIHVzaW5nXHQgKlxuXHQgKiBAcHVibGljXG5cdCAqL1xuXHRwdWJsaWMgaHR0cFNlcnZlcjogRmFzdGlmeUluc3RhbmNlO1xuXG5cdHB1YmxpYyByZWdpc3RlckJpbmRpbmdzKCkge1xuXHRcdENvbnRhaW5lci5iaW5kKFNlcnZlcikudG8oU2VydmVyKS5pblNpbmdsZXRvblNjb3BlKCk7XG5cdH1cblxuXHRhc3luYyBib290KCkge1xuXG5cdH1cblxuXHRhc3luYyBydW4oKSB7XG5cdFx0dGhpcy5zZXJ2ZXIgPSBDb250YWluZXIuZ2V0PFNlcnZlcj4oU2VydmVyKTtcblxuXHRcdHRoaXMuaHR0cFNlcnZlciA9IGF3YWl0IHRoaXMuc2VydmVyLmJ1aWxkKCk7XG5cblx0XHRhd2FpdCB0aGlzLmh0dHBTZXJ2ZXIubGlzdGVuKDMwMDApO1xuXG5cdFx0TG9nLnN1Y2Nlc3MoJ1NlcnZlciBpcyBydW5uaW5nIGF0IGh0dHA6Ly8xMjcuMC4wLjE6MzAwMCcpO1xuXHR9XG5cbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vU2VydmVyJztcbmV4cG9ydCAqIGZyb20gJy4vU2VydmVyU2VydmljZVByb3ZpZGVyJztcbiIsImV4cG9ydCAqIGZyb20gJy4vQ29udGV4dC9SZXF1ZXN0JztcbmV4cG9ydCAqIGZyb20gJy4vQ29udGV4dC9SZXNwb25zZSc7XG5leHBvcnQgKiBmcm9tICcuL0NvbnRleHQnO1xuZXhwb3J0ICogZnJvbSAnLi9Db250cm9sbGVyL0RlY29yYXRvcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9Db250cm9sbGVyJztcbmV4cG9ydCAqIGZyb20gJy4vU2VydmVyJztcbiIsImltcG9ydCB7aW5qZWN0YWJsZX0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHtMT0dHRVJfSURFTlRJRklFUiwgcmVzb2x2ZX0gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQge0xvZ2dlcn0gZnJvbSBcIndpbnN0b25cIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIExvZyB7XG5cblx0c3RhdGljIGxvZyhtZXNzYWdlLCAuLi5hcmdzKSB7XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0aWYoZ2xvYmFsLmRpc2FibGVDb25zb2xlTG9ncyl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHJlc29sdmU8TG9nZ2VyPihMT0dHRVJfSURFTlRJRklFUikubG9nKCdsb2cnLCBtZXNzYWdlLCB7Li4uYXJnc30pO1xuXHR9XG5cblx0c3RhdGljIHN1Y2Nlc3MobWVzc2FnZSwgLi4uYXJncykge1xuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdGlmKGdsb2JhbC5kaXNhYmxlQ29uc29sZUxvZ3Mpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRyZXNvbHZlPExvZ2dlcj4oTE9HR0VSX0lERU5USUZJRVIpLmxvZygnc3VjY2VzcycsIG1lc3NhZ2UsIHsuLi5hcmdzfSk7XG5cdH1cblxuXHRzdGF0aWMgd2FybihtZXNzYWdlLCAuLi5hcmdzKSB7XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0aWYoZ2xvYmFsLmRpc2FibGVDb25zb2xlTG9ncyl7XG5cdFx0XHRyZXR1cm47XG5cdFx0fVxuXHRcdHJlc29sdmU8TG9nZ2VyPihMT0dHRVJfSURFTlRJRklFUikud2FybihtZXNzYWdlLCB7Li4uYXJnc30pO1xuXHR9XG5cblx0c3RhdGljIGVycm9yKG1lc3NhZ2UsIC4uLmFyZ3MpIHtcblx0XHQvL0B0cy1pZ25vcmVcblx0XHRpZihnbG9iYWwuZGlzYWJsZUNvbnNvbGVMb2dzKXtcblx0XHRcdHJldHVybjtcblx0XHR9XG5cdFx0cmVzb2x2ZTxMb2dnZXI+KExPR0dFUl9JREVOVElGSUVSKS5lcnJvcihtZXNzYWdlLCB7Li4uYXJnc30pO1xuXHR9XG5cblx0c3RhdGljIGluZm8obWVzc2FnZSwgLi4uYXJncykge1xuXHRcdC8vQHRzLWlnbm9yZVxuXHRcdGlmKGdsb2JhbC5kaXNhYmxlQ29uc29sZUxvZ3Mpe1xuXHRcdFx0cmV0dXJuO1xuXHRcdH1cblx0XHRyZXNvbHZlPExvZ2dlcj4oTE9HR0VSX0lERU5USUZJRVIpLmluZm8obWVzc2FnZSwgey4uLmFyZ3N9KTtcblx0fVxuXG59XG4iLCJpbXBvcnQgY2hhbGsgZnJvbSBcImNoYWxrXCI7XG5pbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7Q29udGFpbmVyLCBMb2csIExPR0dFUl9JREVOVElGSUVSLCBTZXJ2aWNlUHJvdmlkZXJ9IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IHtjcmVhdGVMb2dnZXIsIGZvcm1hdCwgTG9nZ2VyLCB0cmFuc3BvcnRzfSBmcm9tIFwid2luc3RvblwiO1xuaW1wb3J0IERhaWx5Um90YXRlRmlsZSBmcm9tIFwid2luc3Rvbi1kYWlseS1yb3RhdGUtZmlsZVwiO1xuXG5jb25zdCB7Y29tYmluZSwgdGltZXN0YW1wLCBsYWJlbCwgcHJldHR5UHJpbnQsIHByaW50ZiwgY29sb3JpemUsIGNsaSwgbXN9ID0gZm9ybWF0O1xuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTG9nU2VydmljZVByb3ZpZGVyIGV4dGVuZHMgU2VydmljZVByb3ZpZGVyIHtcblxuXHRwdWJsaWMgcmVnaXN0ZXJCaW5kaW5ncygpIHtcblx0XHRjb25zdCByb3RhdGVGaWxlID0gbmV3IERhaWx5Um90YXRlRmlsZSh7XG5cdFx0XHRkaXJuYW1lICAgICAgIDogXCIuL3N0b3JhZ2UvbG9nc1wiLFxuXHRcdFx0ZmlsZW5hbWUgICAgICA6IFwiJURBVEUlLWFwcC5sb2dcIixcblx0XHRcdGZvcm1hdCAgICAgICAgOiBjb21iaW5lKFxuXHRcdFx0XHRmb3JtYXQudGltZXN0YW1wKHtmb3JtYXQgOiAnTS9EIEhIOm1tOnNzLlNTUyd9KSxcblx0XHRcdFx0Zm9ybWF0Lm1zKCksXG5cdFx0XHRcdHByaW50Zigoe2xldmVsLCBtZXNzYWdlLCBsYWJlbCwgbXMsIHRpbWVzdGFtcCwgLi4ubWV0YWRhdGF9KSA9PiB7XG5cdFx0XHRcdFx0aWYgKG1zKSB7XG5cdFx0XHRcdFx0XHRpZiAobXMucmVwbGFjZShcIm1zXCIsIFwiXCIpLnJlcGxhY2UoXCIrXCIsIFwiXCIpLnJlcGxhY2UoXCJzXCIsIFwiXCIpID4gMTAwKSB7XG5cdFx0XHRcdFx0XHRcdG1zID0gYCR7bXN9YDtcblx0XHRcdFx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdFx0XHRcdG1zID0gYCR7bXN9YDtcblx0XHRcdFx0XHRcdH1cblx0XHRcdFx0XHR9XG5cdFx0XHRcdFx0bGV0IG1zZyA9IGBbJHt0aW1lc3RhbXB9XVske2xldmVsfSAke21zfV0gOiAke21lc3NhZ2V9YDtcblxuXHRcdFx0XHRcdGlmIChtZXRhZGF0YSAmJiBPYmplY3Qua2V5cyhtZXRhZGF0YSkubGVuZ3RoKSB7XG5cdFx0XHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdFx0XHRtc2cgKz0gJ1xcbic7XG5cdFx0XHRcdFx0XHRcdG1zZyArPSBKU09OLnN0cmluZ2lmeShtZXRhZGF0YSwgbnVsbCwgXCIgICAgXCIpO1xuXHRcdFx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblxuXHRcdFx0XHRcdFx0fVxuXHRcdFx0XHRcdH1cblxuXHRcdFx0XHRcdHJldHVybiBtc2c7XG5cdFx0XHRcdH0pXG5cdFx0XHQpLFxuXHRcdFx0emlwcGVkQXJjaGl2ZSA6IHRydWUsXG5cdFx0XHRtYXhTaXplICAgICAgIDogXCIyMG1cIixcblx0XHRcdG1heEZpbGVzICAgICAgOiBcIjE0ZFwiXG5cdFx0fSk7XG5cblx0XHRjb25zdCBteUZvcm1hdCA9IHByaW50Zigoe2xldmVsLCBtZXNzYWdlLCBsYWJlbCwgbXMsIHRpbWVzdGFtcCwgLi4ubWV0YWRhdGF9KSA9PiB7XG5cdFx0XHRpZiAobXMpIHtcblx0XHRcdFx0aWYgKG1zLnJlcGxhY2UoXCJtc1wiLCBcIlwiKS5yZXBsYWNlKFwiK1wiLCBcIlwiKS5yZXBsYWNlKFwic1wiLCBcIlwiKSA+IDEwMCkge1xuXHRcdFx0XHRcdG1zID0gY2hhbGsucmVkQnJpZ2h0YCR7bXN9YDtcblx0XHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0XHRtcyA9IGNoYWxrLmdyZWVuQnJpZ2h0YCR7bXN9YDtcblx0XHRcdFx0fVxuXHRcdFx0fVxuXG5cdFx0XHR0aW1lc3RhbXAgPSBjaGFsay5ncmF5KGBbJHt0aW1lc3RhbXB9XWApO1xuXG5cdFx0XHRsZXQgbGV2ZWxDb2xvciAgID0gY2hhbGsud2hpdGU7XG5cdFx0XHRsZXQgbWVzc2FnZUNvbG9yID0gY2hhbGsud2hpdGU7XG5cblx0XHRcdHN3aXRjaCAobGV2ZWwpIHtcblx0XHRcdFx0Y2FzZSAnbG9nJzpcblx0XHRcdFx0XHRsZXZlbENvbG9yID0gY2hhbGsuYmdHcmF5LndoaXRlQnJpZ2h0LmJvbGQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3dhcm4nOlxuXHRcdFx0XHRcdGxldmVsQ29sb3IgPSBjaGFsay5iZ1llbGxvdy53aGl0ZUJyaWdodC5ib2xkO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdlcnJvcic6XG5cdFx0XHRcdFx0bGV2ZWxDb2xvciA9IGNoYWxrLmJnUmVkLndoaXRlQnJpZ2h0LmJvbGQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3N1Y2Nlc3MnOlxuXHRcdFx0XHRcdGxldmVsQ29sb3IgPSBjaGFsay5iZ0dyZWVuLndoaXRlQnJpZ2h0LmJvbGQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2luZm8nOlxuXHRcdFx0XHRcdGxldmVsQ29sb3IgPSBjaGFsay5iZ0JsdWUud2hpdGVCcmlnaHQuYm9sZDtcblx0XHRcdFx0XHRicmVhaztcblx0XHRcdH1cblx0XHRcdHN3aXRjaCAobGV2ZWwpIHtcblx0XHRcdFx0Y2FzZSAnbG9nJzpcblx0XHRcdFx0XHRtZXNzYWdlQ29sb3IgPSBjaGFsay5ncmF5O1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICd3YXJuJzpcblx0XHRcdFx0XHRtZXNzYWdlQ29sb3IgPSBjaGFsay55ZWxsb3c7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ2Vycm9yJzpcblx0XHRcdFx0XHRtZXNzYWdlQ29sb3IgPSBjaGFsay5yZWQ7XG5cdFx0XHRcdFx0YnJlYWs7XG5cdFx0XHRcdGNhc2UgJ3N1Y2Nlc3MnOlxuXHRcdFx0XHRcdG1lc3NhZ2VDb2xvciA9IGNoYWxrLmdyZWVuO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0XHRjYXNlICdpbmZvJzpcblx0XHRcdFx0XHRtZXNzYWdlQ29sb3IgPSBjaGFsay5ibHVlO1xuXHRcdFx0XHRcdGJyZWFrO1xuXHRcdFx0fVxuXG5cdFx0XHRsZXZlbCAgICAgICAgICAgPSBsZXZlbENvbG9yYCAke2xldmVsLnRvVXBwZXJDYXNlKCl9IGA7XG5cdFx0XHRjb25zdCBsZXZlbFdyYXAgPSBjaGFsay5ncmF5YCR7bGV2ZWx9YDtcblx0XHRcdG1lc3NhZ2UgICAgICAgICA9IG1lc3NhZ2VDb2xvcmAke21lc3NhZ2V9YDtcblxuXHRcdFx0bGV0IG1zZyA9IGAke3RpbWVzdGFtcH0gJHtsZXZlbFdyYXB9ICR7bWVzc2FnZX0gJHttc31gO1xuXG5cdFx0XHRpZiAobWV0YWRhdGEgJiYgT2JqZWN0LmtleXMobWV0YWRhdGEpLmxlbmd0aCkge1xuXHRcdFx0XHR0cnkge1xuXHRcdFx0XHRcdG1zZyArPSAnXFxuJztcblx0XHRcdFx0XHRtc2cgKz0gSlNPTi5zdHJpbmdpZnkobWV0YWRhdGEsIG51bGwsIFwiICAgIFwiKTtcblx0XHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cblx0XHRcdHJldHVybiBtc2c7XG5cdFx0fSk7XG5cblx0XHRjb25zdCBjbGlUcmFuc3BvcnQgPSBuZXcgdHJhbnNwb3J0cy5Db25zb2xlKHtcblx0XHRcdGhhbmRsZUV4Y2VwdGlvbnMgOiB0cnVlLFxuXHRcdFx0Zm9ybWF0ICAgICAgICAgICA6IGNvbWJpbmUoXG5cdFx0XHRcdGZvcm1hdC50aW1lc3RhbXAoe2Zvcm1hdCA6ICdISDptbTpzcyd9KSxcblx0XHRcdFx0bXMoKSxcblx0XHRcdFx0bXlGb3JtYXQsXG5cdFx0XHRcdC8vZm9ybWF0LmFsaWduKCksXG5cdFx0XHQpLFxuXHRcdH0pO1xuXG5cdFx0Y29uc3QgbG9nZ2VyID0gY3JlYXRlTG9nZ2VyKHtcblx0XHRcdGxldmVscyAgICAgICAgICAgIDoge1xuXHRcdFx0XHRkZWJ1ZyAgIDogMCxcblx0XHRcdFx0c3VjY2VzcyA6IDEsXG5cdFx0XHRcdGluZm8gICAgOiAyLFxuXHRcdFx0XHR3YXJuICAgIDogMyxcblx0XHRcdFx0ZXJyb3IgICA6IDRcblx0XHRcdH0sXG5cdFx0XHRsZXZlbCAgICAgICAgICAgICA6ICdlcnJvcicsXG5cdFx0XHRleGl0T25FcnJvciAgICAgICA6IGZhbHNlLFxuXHRcdFx0aGFuZGxlRXhjZXB0aW9ucyAgOiBmYWxzZSxcblx0XHRcdGV4Y2VwdGlvbkhhbmRsZXJzIDogW1xuXHRcdFx0XHRjbGlUcmFuc3BvcnQsXG5cdFx0XHRcdHJvdGF0ZUZpbGVcblx0XHRcdF0sXG5cdFx0XHR0cmFuc3BvcnRzICAgICAgICA6IFtcblx0XHRcdFx0Y2xpVHJhbnNwb3J0LFxuXHRcdFx0XHRyb3RhdGVGaWxlXG5cdFx0XHRdXG5cdFx0fSk7XG5cblx0XHRDb250YWluZXIuYmluZDxMb2dnZXI+KExPR0dFUl9JREVOVElGSUVSKS50b0NvbnN0YW50VmFsdWUobG9nZ2VyKTtcblxuXHRcdExvZy5pbmZvKCcuLi4nKTtcblx0XHRMb2cuaW5mbygnLi4uJyk7XG5cdFx0TG9nLnN1Y2Nlc3MoJ0FwcGxpY2F0aW9uIGlzIGJvb3RpbmcuLi4nKTtcblx0fVxuXG5cdGJvb3QoKSB7XG5cblxuXHR9XG5cblxufVxuIiwiZXhwb3J0ICogZnJvbSAnLi9Mb2cnO1xuZXhwb3J0ICogZnJvbSAnLi9Mb2dTZXJ2aWNlUHJvdmlkZXInO1xuIiwiaW1wb3J0IHtDb25maWd9IGZyb20gXCJAQ29uZmlnXCI7XG5pbXBvcnQge2NsYXNzVG9QbGFpbn0gZnJvbSBcImNsYXNzLXRyYW5zZm9ybWVyXCI7XG5pbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcbmltcG9ydCB7T2JqZWN0SWR9IGZyb20gXCJtb25nb2RiXCI7XG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSc7XG5pbXBvcnQge1F1ZXJ5QnVpbGRlciwgUmVwb3NpdG9yeX0gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gXCIuLi8uLi9Db250YWluZXJcIjtcblxuXG4vL2V4cG9ydCBmdW5jdGlvbiBtb2RlbDxUIGV4dGVuZHMgTW9kZWxFbnRpdHk8VD4+KGNvbnN0cnVjdG9yOiBUKSB7XG4vLy8vXHRyZXR1cm4gY2xhc3MgZXh0ZW5kcyBjb25zdHJ1Y3RvciB7XG4vLy8vXG4vLy8vXHRcdHN0YXRpYyByZXBvc2l0b3J5KCk6IFJlcG9zaXRvcnk8VD4ge1xuLy8vL1x0XHRcdHJldHVybiBDb250YWluZXIuZ2V0PFJlcG9zaXRvcnk8VD4+KHRoaXMuY29uc3RydWN0b3IpO1xuLy8vL1x0XHR9XG4vLy8vXG4vLy8vXHR9O1xuLy9cdFJlZmxlY3QuZGVmaW5lTWV0YWRhdGEoTUVUQURBVEEuTU9ERUwsIHt0eXBlIDogY29uc3RydWN0b3J9LCBjb25zdHJ1Y3Rvcik7XG4vL1xuLy8vL1x0T2JqZWN0LmRlZmluZVByb3BlcnR5KGNvbnN0cnVjdG9yLmNvbnN0cnVjdG9yLnByb3RvdHlwZSwgJ3doZXJlJywgKGF0dHJpYnV0ZXMgOiBQYXJ0aWFsPFQ+KSA9PiB7XG4vLy8vXHRcdGNvbnN0IG1ldGEgPSBSZWZsZWN0LmdldE1ldGFkYXRhKE1FVEFEQVRBLk1PREVMLCB0aGlzKTtcbi8vLy9cbi8vLy9cdFx0Y29uc29sZS5sb2cobWV0YSk7XG4vLy8vXHR9KVxuLy9cbi8vLy9cdHJldHVybiBmdW5jdGlvbihkZXNjcmlwdG9yIDogYW55KSB7XG4vLy8vXG4vLy8vXHR9XG4vL31cblxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgTW9kZWxFbnRpdHk8TT4ge1xuXG5cdC8qKlxuXHQgKiBXZSdsbCBzdG9yZSB0aGUgcmVzdWx0IG9mIHRoZSByZWNlbnQgbW9uZ28gcmVxdWVzdCBpZiB0aGVyZVxuXHQgKiBpcyBvbmUuIFRoaXMgd2F5IHdlIGFsd2F5cyBoYXZlIGFjY2VzcyB0byBpdCwgYW5kIGNhbiByZXR1cm5cblx0ICogZ2VuZXJpYyB0cnVlL2ZhbHNlIHR5cGVzIG9mIHJlc3BvbnNlcyBmb3Igc29tZSBvcGVyYXRpb25zLlxuXHQgKi9cblx0cHJpdmF0ZSBfcmVjZW50TW9uZ29SZXNwb25zZTogYW55ID0gbnVsbDtcblxuXHRwcml2YXRlIF9xdWVyeUJ1aWxkZXI6IFF1ZXJ5QnVpbGRlcjxNPjtcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHR0aGlzLl9xdWVyeUJ1aWxkZXIgPSBuZXcgUXVlcnlCdWlsZGVyPE0+KHRoaXMpO1xuXHR9XG5cblx0cXVlcnlCdWlsZGVyKCk6IFF1ZXJ5QnVpbGRlcjxNPiB7XG5cdFx0cmV0dXJuIHRoaXMuX3F1ZXJ5QnVpbGRlcjtcblx0fVxuXG5cdC8qKlxuXHQgKiBBIGhlbHBlciBtZXRob2QgdXNlZCB0byByZXR1cm4gYSBjb3JyZWN0IHR5cGUuLi5cblx0ICogV2UncmUgc3RpbGwgZ2V0dGluZyB1c2VkIHRvIGdlbmVyaWNzLlxuXHQgKlxuXHQgKiBAcHJpdmF0ZVxuXHQgKi9cblx0cHJpdmF0ZSBtb2RlbEluc3RhbmNlKCk6IE0ge1xuXHRcdHJldHVybiB0aGlzIGFzIHVua25vd24gYXMgTTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYW4gaW5zdGFuY2Ugb2YgdGhlIG1vbmdvIHJlcG9zaXRvcnlcblx0ICovXG5cdHJlcG9zaXRvcnkoKTogUmVwb3NpdG9yeTxNPiB7XG5cdFx0cmV0dXJuIENvbnRhaW5lci5nZXQ8UmVwb3NpdG9yeTxNPj4odGhpcy5jb25zdHJ1Y3Rvcik7XG5cdH1cblxuXHQvKipcblx0ICogU2F2ZSBhbnkgY2hhbmdlcyBtYWRlIHRvIHRoZSBtb2RlbFxuXHQgKlxuXHQgKiBGb3IgZXg6XG5cdCAqIGNvbnN0IHVzZXIgPSBhd2FpdCBVc2VyLmZpbmQoMTIzKTtcblx0ICogdXNlci5uYW1lID0gJ1NhbSc7XG5cdCAqIGF3YWl0IHVzZXIuc2F2ZSgpXG5cdCAqXG5cdCAqIEByZXR1cm4gdGhpc1xuXHQgKi9cblx0YXN5bmMgc2F2ZSgpIHtcblx0XHRhd2FpdCB0aGlzLnJlcG9zaXRvcnkoKS5zYXZlKFxuXHRcdFx0dGhpcy5tb2RlbEluc3RhbmNlKClcblx0XHQpO1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHRhc3luYyByZWZyZXNoKCkge1xuXHRcdGNvbnN0IG5ld1ZlcnNpb24gPSBhd2FpdCB0aGlzLnJlcG9zaXRvcnkoKS5maW5kQnlJZCgodGhpcyBhcyBhbnkpLl9pZCk7XG5cblx0XHRPYmplY3QuYXNzaWduKHRoaXMsIG5ld1ZlcnNpb24pO1xuXHR9XG5cblx0LyoqXG5cdCAqIERlbGV0ZSB0aGUgY3VycmVudCBtb2RlbCBpbnN0YW5jZSBmcm9tIHRoZSBjb2xsZWN0aW9uXG5cdCAqL1xuXHRhc3luYyBkZWxldGUoKSB7XG5cdFx0YXdhaXQgdGhpcy5yZXBvc2l0b3J5KCkucmVtb3ZlKHRoaXMubW9kZWxJbnN0YW5jZSgpKTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgYXN5bmMgY291bnQoKSB7XG5cdFx0cmV0dXJuIHRoaXMud2hlcmUoe30pLmNvdW50KCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0IGFuIGluc3RhbmNlIG9mIHF1ZXJ5IGJ1aWxkZXIsIHNpbWlsYXIgdG8gdXNpbmcgY29sbGVjdGlvbi5maW5kKClcblx0ICogQnV0Li4uIG91ciBxdWVyeSBidWlsZGVyIHJldHVybnMgYSBjb3VwbGUgb2YgaGVscGVyIG1ldGhvZHMsIGZpcnN0KCksIGdldCgpXG5cdCAqIHtAc2VlIFF1ZXJ5QnVpbGRlcn1cblx0ICpcblx0ICogQHBhcmFtIGF0dHJpYnV0ZXNcblx0ICovXG5cdHN0YXRpYyB3aGVyZTxUIGV4dGVuZHMgTW9kZWxFbnRpdHk8VD4+KGF0dHJpYnV0ZXM6IFBhcnRpYWw8VD4pOiBRdWVyeUJ1aWxkZXI8VD4ge1xuLy9cdFx0Y29uc3QgYnVpbGRlciA9IG5ldyBRdWVyeUJ1aWxkZXI8VD4obmV3IHRoaXMoKSk7XG5cdFx0Y29uc3QgbW9kZWwgPSAobmV3IHRoaXMoKSBhcyB1bmtub3duIGFzIFQpO1xuXG5cdFx0cmV0dXJuIG1vZGVsLnF1ZXJ5QnVpbGRlcigpLndoZXJlKGF0dHJpYnV0ZXMpO1xuXHR9XG5cblx0c3RhdGljIHdpdGg8VD4oLi4ucmVmczogKGtleW9mIFQpW10pIHtcblx0XHRjb25zdCBtb2RlbDogTW9kZWxFbnRpdHk8VD4gPSAobmV3IHRoaXMoKSBhcyBNb2RlbEVudGl0eTxUPik7XG5cblx0XHRyZXR1cm4gbW9kZWwucXVlcnlCdWlsZGVyKCkud2l0aCguLi5yZWZzKTtcblx0fVxuXG5cdC8qKlxuXHQgKiBGaW5kIGFuIGl0ZW0gdXNpbmcgaXQncyBpZCBhbmQgcmV0dXJuIGl0IGFzIGEgbW9kZWwuXG5cdCAqXG5cdCAqIEBwYXJhbSBpZFxuXHQgKi9cblx0c3RhdGljIGZpbmQ8VCBleHRlbmRzIE1vZGVsRW50aXR5PFQ+PihpZDogc3RyaW5nIHwgT2JqZWN0SWQpOiBQcm9taXNlPFQ+IHtcblx0XHRjb25zdCBtb2RlbCA9IG5ldyB0aGlzKCkgYXMgdW5rbm93biBhcyBUO1xuXG4vL1x0XHRjb25zdCBidWlsZGVyID0gbmV3IFF1ZXJ5QnVpbGRlcjxUPihtb2RlbCk7XG5cblx0XHRyZXR1cm4gbW9kZWwucmVwb3NpdG9yeSgpLmZpbmRCeUlkKGlkKTtcbi8vXHRcdHJldHVybiBidWlsZGVyXG4vL1x0XHRcdC5cbi8vXHRcdFx0LndoZXJlPFQ+KHtfaWQgOiBuZXcgT2JqZWN0SWQoaWQpfSlcbi8vXHRcdFx0LmZpcnN0KCk7XG5cdH1cblxuXHQvKipcblx0ICogQmFzaWNhbGx5IGFuIGFsaWFzIG9mIHRoZSB7QHNlZSBRdWVyeUJ1aWxkZXIub3JkZXJCeURlc2MoKX1cblx0ICogdGhhdCBhbGxvd3MgdXMgdG8gb3JkZXIgYW5kIGNhbGwgZ2V0KCkgb3IgZmlyc3QoKVxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5XG5cdCAqL1xuXHRzdGF0aWMgb3JkZXJCeURlc2M8VD4oa2V5OiBrZXlvZiBUKTogUXVlcnlCdWlsZGVyPFQ+IHtcblx0XHRyZXR1cm4gbmV3IFF1ZXJ5QnVpbGRlcjxUPihuZXcgdGhpcygpKS5vcmRlckJ5RGVzYyhrZXkpO1xuXHR9XG5cblx0LyoqXG5cdCAqIEJhc2ljYWxseSBhbiBhbGlhcyBvZiB0aGUge0BzZWUgUXVlcnlCdWlsZGVyLm9yZGVyQnlBc2MoKX1cblx0ICogdGhhdCBhbGxvd3MgdXMgdG8gb3JkZXIgYW5kIGNhbGwgZ2V0KCkgb3IgZmlyc3QoKVxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5XG5cdCAqL1xuXHRzdGF0aWMgb3JkZXJCeUFzYzxUPihrZXk6IGtleW9mIFQpOiBRdWVyeUJ1aWxkZXI8VD4ge1xuXHRcdHJldHVybiBuZXcgUXVlcnlCdWlsZGVyPFQ+KG5ldyB0aGlzKCkpLm9yZGVyQnlBc2Moa2V5KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBDcmVhdGUgYSBuZXcgaW5zdGFuY2Ugb2YgdGhpcyBtb2RlbCBhbmQgc3RvcmUgaXQgaW4gdGhlIGNvbGxlY3Rpb25cblx0ICpcblx0ICogQFRPRE86IE5lZWQgdG8gZmlndXJlIGEgc29sdXRpb24gZm9yIHVzaW5nIGdlbmVyaWNzIHdpdGggc3RhdGljIG1ldGhvZHMuXG5cdCAqXG5cdCAqIEBwYXJhbSB7UGFydGlhbDxNPn0gYXR0cmlidXRlc1xuXHQgKi9cblx0c3RhdGljIGFzeW5jIGNyZWF0ZTxUIGV4dGVuZHMgTW9kZWxFbnRpdHk8VD4+KGF0dHJpYnV0ZXM6IFBhcnRpYWw8VD4pIDogUHJvbWlzZTxUPiB7XG5cdFx0YXdhaXQgdGhpcy5xdWVyeSgpLmluc2VydChhdHRyaWJ1dGVzKTtcblxuXHRcdHJldHVybiBhd2FpdCB0aGlzLmZpbmQoYXR0cmlidXRlc1snX2lkJ10pIDtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYW4gaW5zdGFuY2Ugb2YgdGhlIHVuZGVybHlpbmcgbW9uZ28gcmVwb3NpdG9yeSBmb3IgdGhpcyBtb2RlbFxuXHQgKi9cblx0c3RhdGljIHF1ZXJ5PFQgZXh0ZW5kcyBNb2RlbEVudGl0eTxUPj4oKSB7XG5cdFx0Ly9AdHMtaWdub3JlXG5cdFx0cmV0dXJuIENvbnRhaW5lci5nZXQ8UmVwb3NpdG9yeTxNPj4odGhpcyk7XG5cdH1cblxuXHRwdWJsaWMgbW9uZ29SZXNwb25zZSgpOiBhbnkge1xuXHRcdHJldHVybiB0aGlzLl9yZWNlbnRNb25nb1Jlc3BvbnNlO1xuXHR9XG5cblx0cHVibGljIHNldE1vbmdvUmVzcG9uc2UocmVzcG9uc2U6IGFueSk6IGFueSB7XG5cdFx0dGhpcy5fcmVjZW50TW9uZ29SZXNwb25zZSA9IHJlc3BvbnNlO1xuXHR9XG5cblx0LyoqXG5cdCAqIFdpbGwgcmV0dXJuIGEgY29ycmVjdGx5IGZvcm1hdHRlZCBuYW1lIGZvciB0aGUgdW5kZXJseWluZyBtb25nbyBjb2xsZWN0aW9uXG5cdCAqL1xuXHRwdWJsaWMgY29sbGVjdGlvbk5hbWUobWFueTogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0cmV0dXJuIE1vZGVsRW50aXR5LmZvcm1hdE5hbWVGb3JDb2xsZWN0aW9uKHRoaXMuY29uc3RydWN0b3IubmFtZSwgbWFueSk7XG5cdH1cblxuXHRzdGF0aWMgZm9ybWF0TmFtZUZvckNvbGxlY3Rpb24oc3RyOiBzdHJpbmcsIG1hbnk6IGJvb2xlYW4gPSBmYWxzZSkge1xuXHRcdHJldHVybiBTdHJpbmcocGx1cmFsaXplKHN0ciwgbWFueSA/IDIgOiAxKSkudG9Mb3dlckNhc2UoKVxuXHR9XG5cblx0LyoqXG5cdCAqIFdoZW4gdGhpcyBtb2RlbCBpbnN0YW5jZSBpcyByZXR1cm5lZCBpbiBhXG5cdCAqIHJlc3BvbnNlLCB3ZSdsbCBtYWtlIHN1cmUgdG8gdXNlIGNsYXNzVG9QbGFpbiBzb1xuXHQgKiB0aGF0IGFueSBARXhjbHVkZSgpIHByb3BlcnRpZXMgZXRjIGFyZSB0YWtlbiBjYXJlIG9mLlxuXHQgKi9cblx0dG9KU09OKCkge1xuXHRcdHJldHVybiBjbGFzc1RvUGxhaW48TT4odGhpcy5tb2RlbEluc3RhbmNlKCksIENvbmZpZy5odHRwLnJlc3BvbnNlU2VyaWFsaXphdGlvbik7XG5cdH1cblxufVxuXG4iLCJpbXBvcnQge0NvbmZpZ30gZnJvbSBcIkBDb25maWdcIjtcbmltcG9ydCB7Z2xvYn0gZnJvbSBcImdsb2JcIjtcbmltcG9ydCB7aW5qZWN0YWJsZX0gZnJvbSBcImludmVyc2lmeVwiO1xuaW1wb3J0IHtNb25nb0NsaWVudH0gZnJvbSBcIm1vbmdvZGJcIjtcbmltcG9ydCBwYXRoIGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgcGx1cmFsaXplIGZyb20gJ3BsdXJhbGl6ZSc7XG5pbXBvcnQge0NsYXNzVHlwZSwgTG9nLCBNb2RlbEVudGl0eSwgUmVwb3NpdG9yeX0gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQgQ29udGFpbmVyIGZyb20gXCIuLi8uLi9Db250YWluZXJcIjtcbmltcG9ydCB7U2VydmljZVByb3ZpZGVyfSBmcm9tIFwiLi4vU2VydmljZVByb3ZpZGVyXCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgTW9kZWxTZXJ2aWNlUHJvdmlkZXJDYWNoZWRNb2RlbCB7XG5cdG5hbWU6IHN0cmluZztcblx0bG9jYXRpb246IHN0cmluZztcblx0aW1wb3J0OiBzdHJpbmc7XG5cdG9yaWdpbmFsTG9jYXRpb246IHN0cmluZztcbn1cblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGNsYXNzIE1vZGVsU2VydmljZVByb3ZpZGVyIGV4dGVuZHMgU2VydmljZVByb3ZpZGVyIHtcblxuXHRwcml2YXRlIG1vZGVsczogTW9kZWxTZXJ2aWNlUHJvdmlkZXJDYWNoZWRNb2RlbFtdID0gW107XG5cblx0cHVibGljIGFzeW5jIHJlZ2lzdGVyQmluZGluZ3MoKSB7XG5cblx0XHRjb25zdCBtb2RlbHMgPSB0aGlzLmdldE1vZGVscygpO1xuXG5cdFx0Zm9yIChsZXQgbW9kZWwgb2YgbW9kZWxzKSB7XG5cdFx0XHR0cnkge1xuXHRcdFx0XHRjb25zdCBtb2R1bGUgPSBhd2FpdCBpbXBvcnQoYEBBcHAvTW9kZWxzLyR7bW9kZWwubG9jYXRpb259YCk7XG5cblx0XHRcdFx0dGhpcy5sb2FkTW9kZWwobW9kdWxlLCBtb2RlbC5uYW1lKVxuXHRcdFx0fSBjYXRjaCAoZXJyb3IpIHtcblx0XHRcdFx0TG9nLndhcm4oJ1snICsgdGhpcy5jb25zdHJ1Y3Rvci5uYW1lICsgJ10gRmFpbGVkIHRvIGxvYWQgbW9kZWw6ICcgKyBtb2RlbC5vcmlnaW5hbExvY2F0aW9uKTtcblx0XHRcdFx0TG9nLmVycm9yKGVycm9yKTtcblx0XHRcdH1cblx0XHR9XG5cblx0fVxuXG5cdGFzeW5jIGJvb3QoKSB7XG5cdFx0YXdhaXQgdGhpcy5zZXR1cERhdGFiYXNlKCk7XG5cdFx0dGhpcy5zZXR1cEVudGl0eVJlcG9zaXRvcmllcygpO1xuXHR9XG5cblx0Z2V0TW9kZWxzKCk6IE1vZGVsU2VydmljZVByb3ZpZGVyQ2FjaGVkTW9kZWxbXSB7XG5cdFx0Y29uc3QgbW9kZWxzID0gZ2xvYi5zeW5jKFxuXHRcdFx0cGF0aC5qb2luKCdzcmMnLCAnQXBwJywgJ01vZGVscycsICcqKicsICcqLnRzJyksXG5cdFx0XHR7Zm9sbG93IDogdHJ1ZX1cblx0XHQpO1xuXG5cdFx0cmV0dXJuIG1vZGVscy5tYXAobW9kZWwgPT4ge1xuXHRcdFx0Y29uc3QgbG9jYXRpb24gPSBtb2RlbFxuXHRcdFx0XHQucmVwbGFjZSgnc3JjL0FwcC9Nb2RlbHMvJywgJycpXG5cdFx0XHRcdC5yZXBsYWNlKCcudHMnLCAnJyk7XG5cblx0XHRcdGNvbnN0IG5hbWUgPSBsb2NhdGlvbi5zcGxpdCgnLycpLnBvcCgpO1xuXG5cdFx0XHRyZXR1cm4ge1xuXHRcdFx0XHRuYW1lLFxuXHRcdFx0XHRsb2NhdGlvbixcblx0XHRcdFx0aW1wb3J0ICAgICAgICAgICA6IGBAQXBwL01vZGVscy8ke2xvY2F0aW9ufWAsXG5cdFx0XHRcdG9yaWdpbmFsTG9jYXRpb24gOiBtb2RlbFxuXHRcdFx0fTtcblx0XHR9KTtcblx0fVxuXG5cdHByaXZhdGUgYXN5bmMgc2V0dXBEYXRhYmFzZSgpIHtcblx0XHRjb25zdCBjbGllbnQgPSBuZXcgTW9uZ29DbGllbnQoQ29uZmlnLmRhdGFiYXNlLm1vbmdvLmNvbm5lY3Rpb25VcmwsIHtcblx0XHRcdHVzZU5ld1VybFBhcnNlciAgICA6IHRydWUsXG5cdFx0XHR1c2VVbmlmaWVkVG9wb2xvZ3kgOiB0cnVlXG5cdFx0fSk7XG5cblx0XHRjb25zdCBjb25uZWN0aW9uID0gYXdhaXQgY2xpZW50LmNvbm5lY3QoKTtcblxuXHRcdENvbnRhaW5lci5iaW5kPE1vbmdvQ2xpZW50PihNb25nb0NsaWVudCkudG9Db25zdGFudFZhbHVlKGNvbm5lY3Rpb24pO1xuXHR9XG5cblx0cHJpdmF0ZSBzZXR1cEVudGl0eVJlcG9zaXRvcmllcygpIHtcblx0XHRjb25zdCBtb2RlbHM6IE1vZGVsRW50aXR5PGFueT5bXSA9IENvbnRhaW5lci5nZXRBbGwoTW9kZWxFbnRpdHkpO1xuXG5cdFx0Zm9yIChsZXQgbW9kZWwgb2YgbW9kZWxzKSB7XG5cblx0XHRcdGNvbnN0IHJlcG9zaXRvcnkgPSBuZXcgUmVwb3NpdG9yeTx0eXBlb2YgbW9kZWw+KFxuXHRcdFx0XHRtb2RlbC5jb25zdHJ1Y3RvciBhcyBDbGFzc1R5cGU8dHlwZW9mIG1vZGVsPixcblx0XHRcdFx0Q29udGFpbmVyLmdldDxNb25nb0NsaWVudD4oTW9uZ29DbGllbnQpLFxuXHRcdFx0XHRwbHVyYWxpemUobW9kZWwuY29uc3RydWN0b3IubmFtZS50b0xvd2VyQ2FzZSgpKVxuXHRcdFx0KTtcblxuXHRcdFx0Q29udGFpbmVyLmJpbmQobW9kZWwuY29uc3RydWN0b3IpLnRvQ29uc3RhbnRWYWx1ZShyZXBvc2l0b3J5KTtcblx0XHR9XG5cdH1cblxuXHRwcml2YXRlIGxvYWRNb2RlbChtb2R1bGUsIGxvYzogc3RyaW5nKSB7XG5cdFx0Y29uc3QgbW9kZWxOYW1lID0gT2JqZWN0LmtleXMobW9kdWxlKVswXSB8fCBudWxsO1xuXG5cdFx0aWYgKCFtb2RlbE5hbWUpIHtcblx0XHRcdHRocm93IG5ldyBFcnJvcignVGhlcmUgd2FzIGFuIGVycm9yIGxvYWRpbmcgbW9kZWw6ICcgKyBsb2MpO1xuXHRcdH1cblxuXHRcdGNvbnN0IG1vZGVsID0gbW9kdWxlW21vZGVsTmFtZV07XG5cblx0XHRDb250YWluZXIuYmluZChNb2RlbEVudGl0eSkudG8obW9kZWwpLndoZW5UYXJnZXROYW1lZChtb2RlbE5hbWUpO1xuXG5cdFx0TG9nLmluZm8oJ01vZGVsIGxvYWRlZDogJyArIGxvYylcblx0fVxuXG5cdG1vZGVsRXhpc3RzKG5hbWU6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLm1vZGVscy5maW5kKG1vZGVsID0+IG1vZGVsLm5hbWUgPT09IG5hbWUpO1xuXHR9XG59XG4iLCJpbXBvcnQge0N1cnNvciwgRmluZE9uZU9wdGlvbnMsIFVwZGF0ZU1hbnlPcHRpb25zLCBXaXRob3V0UHJvamVjdGlvbn0gZnJvbSBcIm1vbmdvZGJcIjtcbmltcG9ydCB7SW52YWxpZFJlZlNwZWNpZmllZCwgTW9kZWxFbnRpdHksIFJlZn0gZnJvbSBcIkBDb3JlXCI7XG5cblxuaW50ZXJmYWNlIENvbGxlY3Rpb25PcmRlciB7XG5cdGRpcmVjdGlvbjogMSB8IC0xLFxuXHRrZXk6IHN0cmluZyxcbn1cblxuZXhwb3J0IGNsYXNzIFF1ZXJ5QnVpbGRlcjxUPiB7XG5cblx0LyoqXG5cdCAqIFdoZW4gd2UgY2FsbCBhbnkgaW50ZXJuYWwgbW9uZ28gbWV0aG9kcyB0byBxdWVyeSBhIGNvbGxlY3Rpb25cblx0ICogd2UnbGwgc3RvcmUgaXQncyBpbnN0YW5jZSBoZXJlIHNvIHRoYXQgd2UgY2FuIHVzZSBjaGFpbmluZy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgX2J1aWxkZXJSZXN1bHQ6IEN1cnNvcjxUPjtcblxuXHRwcml2YXRlIF9tb2RlbDogTW9kZWxFbnRpdHk8VD47XG5cblx0cHJpdmF0ZSBfY29sbGVjdGlvbkZpbHRlcjogb2JqZWN0ID0gbnVsbDtcblxuXHRwcml2YXRlIF9jb2xsZWN0aW9uQWdncmVnYXRpb246IG9iamVjdFtdID0gW107XG5cblx0cHJpdmF0ZSBfY29sbGVjdGlvbk9yZGVyOiBDb2xsZWN0aW9uT3JkZXIgfCBudWxsID0gbnVsbDtcblxuXHRjb25zdHJ1Y3Rvcihtb2RlbDogTW9kZWxFbnRpdHk8VD4pIHtcblx0XHR0aGlzLl9tb2RlbCA9IG1vZGVsO1xuXHR9XG5cblx0LyoqXG5cdCAqIFNpbWlsYXIgdG8gdXNpbmcgY29sbGVjdGlvbi5maW5kKClcblx0ICpcblx0ICogQHBhcmFtIGF0dHJpYnV0ZXNcblx0ICovXG5cdHB1YmxpYyB3aGVyZTxNPihhdHRyaWJ1dGVzOiBQYXJ0aWFsPE0+KTogUXVlcnlCdWlsZGVyPFQ+IHtcblx0XHR0aGlzLl9jb2xsZWN0aW9uRmlsdGVyID0gYXR0cmlidXRlcztcblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0cHVibGljIHdpdGgoLi4ucmVmc1RvTG9hZDogKGtleW9mIFQpW10pOiBRdWVyeUJ1aWxkZXI8VD4ge1xuXG5cdFx0Y29uc3QgcmVmcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ21vbmdvOnJlZnMnLCB0aGlzLl9tb2RlbCkgfHwge307XG5cblx0XHRmb3IgKGxldCByZWYgb2YgcmVmc1RvTG9hZCkge1xuXG5cdFx0XHRjb25zdCByZWZJbmZvOiBSZWYgPSByZWZzW3JlZl07XG5cblx0XHRcdGlmICghcmVmSW5mbykge1xuXHRcdFx0XHR0aHJvdyBuZXcgSW52YWxpZFJlZlNwZWNpZmllZCh0aGlzLl9tb2RlbC5jb25zdHJ1Y3Rvci5uYW1lLCBTdHJpbmcocmVmKSk7XG5cdFx0XHR9XG5cblx0XHRcdHRoaXMuX2NvbGxlY3Rpb25BZ2dyZWdhdGlvbi5wdXNoKHtcblx0XHRcdFx0JGxvb2t1cCA6IHtcblx0XHRcdFx0XHRmcm9tICAgICAgICAgOiBNb2RlbEVudGl0eS5mb3JtYXROYW1lRm9yQ29sbGVjdGlvbihyZWZJbmZvLm1vZGVsTmFtZSwgdHJ1ZSksXG5cdFx0XHRcdFx0bG9jYWxGaWVsZCAgIDogcmVmSW5mby5faWQsXG5cdFx0XHRcdFx0Zm9yZWlnbkZpZWxkIDogJ19pZCcsXG5cdFx0XHRcdFx0YXMgICAgICAgICAgIDogcmVmXG5cdFx0XHRcdH1cblx0XHRcdH0pO1xuXG5cdFx0XHRpZiAoIXJlZkluZm8uYXJyYXkpIHtcblx0XHRcdFx0dGhpcy5fY29sbGVjdGlvbkFnZ3JlZ2F0aW9uLnB1c2goe1xuXHRcdFx0XHRcdCR1bndpbmQgOiB7XG5cdFx0XHRcdFx0XHRwYXRoICAgICAgICAgICAgICAgICAgICAgICA6ICckJyArIE1vZGVsRW50aXR5LmZvcm1hdE5hbWVGb3JDb2xsZWN0aW9uKHJlZkluZm8ubW9kZWxOYW1lLCByZWZJbmZvLmFycmF5KSxcblx0XHRcdFx0XHRcdHByZXNlcnZlTnVsbEFuZEVtcHR5QXJyYXlzIDogdHJ1ZVxuXHRcdFx0XHRcdH1cblx0XHRcdFx0fSk7XG5cdFx0XHR9XG5cblxuXHRcdH1cblxuXHRcdHJldHVybiB0aGlzO1xuXHR9XG5cblx0LyoqXG5cdCAqIEFsbG93cyB1cyB0byBzcGVjaWZ5IGFuIG9yZGVyIG9mIGRlc2NlbmRpbmcsIHdoaWNoIGlzIGFwcGxpZWQgdG8gdGhlIGN1cnNvclxuXHQgKlxuXHQgKiBAcGFyYW0ga2V5XG5cdCAqL1xuXHRvcmRlckJ5RGVzYyhrZXk6IGtleW9mIFQgfCBzdHJpbmcpIHtcblx0XHR0aGlzLl9jb2xsZWN0aW9uT3JkZXIgPSB7XG5cdFx0XHRrZXkgICAgICAgOiBTdHJpbmcoa2V5KSxcblx0XHRcdGRpcmVjdGlvbiA6IC0xXG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogQWxsb3dzIHVzIHRvIHNwZWNpZnkgYW4gb3JkZXIgb2YgYXNjZW5kaW5nLCB3aGljaCBpcyBhcHBsaWVkIHRvIHRoZSBjdXJzb3Jcblx0ICpcblx0ICogQHBhcmFtIGtleVxuXHQgKi9cblx0b3JkZXJCeUFzYyhrZXk6IGtleW9mIFQgfCBzdHJpbmcpIHtcblx0XHR0aGlzLl9jb2xsZWN0aW9uT3JkZXIgPSB7XG5cdFx0XHRrZXkgICAgICAgOiBTdHJpbmcoa2V5KSxcblx0XHRcdGRpcmVjdGlvbiA6IDFcblx0XHR9O1xuXG5cdFx0cmV0dXJuIHRoaXM7XG5cdH1cblxuXHQvKipcblx0ICogV2hlbiBhIGZpbHRlciBoYXMgYmVlbiBzcGVjaWZpZWQgd2l0aCB3aGVyZSgpLiBJdCB3aWxsIGFwcGx5IHRvXG5cdCAqIHtAc2VlIF9jb2xsZWN0aW9uRmlsdGVyfSB0aGVuIHdoZW4gd2UgbWFrZSBvdGhlciBjYWxscywgbGlrZVxuXHQgKiAuZ2V0KCksIC5maXJzdCgpIG9yIC5jb3VudCgpIGl0IHdpbGwgcmVzb2x2ZSB0aGUgY3Vyc29yXG5cdCAqIG9yIHVzZSBpdCB0byBtYWtlIGZ1cnRoZXIgbW9uZ29kYiBjYWxscy5cblx0ICpcblx0ICogQHByaXZhdGVcblx0ICovXG5cdHByaXZhdGUgcmVzb2x2ZUZpbHRlcigpIHtcblx0XHRjb25zdCBvcHRpb25zID0ge30gYXMgV2l0aG91dFByb2plY3Rpb248RmluZE9uZU9wdGlvbnM8VD4+O1xuXG5cdFx0aWYgKHRoaXMuX2NvbGxlY3Rpb25PcmRlciAmJiB0aGlzLl9jb2xsZWN0aW9uT3JkZXI/LmRpcmVjdGlvbikge1xuXHRcdFx0b3B0aW9ucy5zb3J0ICAgICAgICAgICAgICAgICAgICAgICAgICAgID0ge307XG5cdFx0XHRvcHRpb25zLnNvcnRbdGhpcy5fY29sbGVjdGlvbk9yZGVyLmtleV0gPSB0aGlzLl9jb2xsZWN0aW9uT3JkZXIuZGlyZWN0aW9uO1xuXHRcdH1cblxuXHRcdGlmICh0aGlzLl9jb2xsZWN0aW9uQWdncmVnYXRpb24/Lmxlbmd0aCkge1xuXHRcdFx0Y29uc3QgYWdncmVnYXRpb24gPSBbXG5cdFx0XHRcdHskbWF0Y2ggOiB0aGlzLl9jb2xsZWN0aW9uRmlsdGVyfSxcblx0XHRcdFx0Li4udGhpcy5fY29sbGVjdGlvbkFnZ3JlZ2F0aW9uXG5cdFx0XHRdXG5cblx0XHRcdHRoaXMuX2J1aWxkZXJSZXN1bHQgPSB0aGlzLl9tb2RlbFxuXHRcdFx0XHQucmVwb3NpdG9yeSgpLmNcblx0XHRcdFx0LmFnZ3JlZ2F0ZTxUPihhZ2dyZWdhdGlvbik7XG5cblx0XHRcdHJldHVybiB0aGlzLl9idWlsZGVyUmVzdWx0O1xuXHRcdH1cblxuXHRcdHRoaXMuX2J1aWxkZXJSZXN1bHQgPSB0aGlzLl9tb2RlbFxuXHRcdFx0LnJlcG9zaXRvcnkoKS5jXG5cdFx0XHQuZmluZCh0aGlzLl9jb2xsZWN0aW9uRmlsdGVyLCBvcHRpb25zKTtcblxuXHRcdHJldHVybiB0aGlzLl9idWlsZGVyUmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCB0aGUgZmlyc3QgcmVzdWx0IGluIHRoZSBtb25nbyBDdXJzb3Jcblx0ICovXG5cdGFzeW5jIGZpcnN0KCkge1xuXHRcdGF3YWl0IHRoaXMucmVzb2x2ZUZpbHRlcigpO1xuXG5cdFx0Y29uc3QgcmVzdWx0ID0gYXdhaXQgdGhpcy5fYnVpbGRlclJlc3VsdC5saW1pdCgxKS5uZXh0KCk7XG5cblx0XHRpZiAoIXJlc3VsdCkgcmV0dXJuIG51bGw7XG5cblx0XHRyZXR1cm4gdGhpcy5fbW9kZWwucmVwb3NpdG9yeSgpLmh5ZHJhdGUocmVzdWx0KTtcblx0fVxuXG5cdC8qKlxuXHQgKiBHZXQgYWxsIGl0ZW1zIGZyb20gdGhlIGNvbGxlY3Rpb24gdGhhdCBtYXRjaCB0aGUgcXVlcnlcblx0ICovXG5cdGFzeW5jIGdldCgpIHtcblx0XHRjb25zdCBjdXJzb3IgPSBhd2FpdCB0aGlzLnJlc29sdmVGaWx0ZXIoKTtcblxuXHRcdGNvbnN0IHJlc3VsdHMgPSBhd2FpdCBjdXJzb3IudG9BcnJheSgpO1xuXG5cdFx0cmV0dXJuIHJlc3VsdHMubWFwKFxuXHRcdFx0cmVzdWx0ID0+IHRoaXMuX21vZGVsLnJlcG9zaXRvcnkoKS5oeWRyYXRlKHJlc3VsdClcblx0XHQpO1xuXHR9XG5cblx0LyoqXG5cdCAqIFVwZGF0ZSBtYW55IGl0ZW1zIGluIHRoZSBjb2xsZWN0aW9uLCB3aWxsIHVzZSB0aGUgZmlsdGVyIHNwZWNpZmllZCBieSAud2hlcmUoKVxuXHQgKiBZb3UgY2FuIHNwZWNpZnkge3JldHVybk1vbmdvUmVzcG9uc2UgOiB0cnVlfSBpbiB0aGUgb3B0aW9ucyB0byByZXR1cm4gdGhlIG1vbmdvIHJlc3VsdFxuXHQgKiBvZiB0aGlzIG9wZXJhdGlvbiwgb3RoZXJ3aXNlLCB0aGlzIG1ldGhvZCB3aWxsIHJldHVybiB0cnVlL2ZhbHNlIGlmIGl0IHN1Y2NlZWRlZCBvciBmYWlsZWQuXG5cdCAqXG5cdCAqIEBwYXJhbSBhdHRyaWJ1dGVzXG5cdCAqIEBwYXJhbSBvcHRpb25zXG5cdCAqIEByZXR1cm4gYm9vbGVhbiB8IFVwZGF0ZVdyaXRlT3BSZXN1bHRcblx0ICovXG5cdHB1YmxpYyBhc3luYyB1cGRhdGUoYXR0cmlidXRlczogUGFydGlhbDxUPiwgb3B0aW9ucz86IFVwZGF0ZU1hbnlPcHRpb25zICYgeyByZXR1cm5Nb25nb1Jlc3BvbnNlOiBib29sZWFuIH0pIHtcblx0XHRjb25zdCByZXNwb25zZSA9IGF3YWl0IHRoaXMuX21vZGVsLnJlcG9zaXRvcnkoKS5jLnVwZGF0ZU1hbnkoXG5cdFx0XHR0aGlzLl9jb2xsZWN0aW9uRmlsdGVyLFxuXHRcdFx0e1xuXHRcdFx0XHQkc2V0IDogYXR0cmlidXRlc1xuXHRcdFx0fSxcblx0XHRcdG9wdGlvbnNcblx0XHQpO1xuXG5cdFx0aWYgKG9wdGlvbnM/LnJldHVybk1vbmdvUmVzcG9uc2UpIHtcblx0XHRcdHJldHVybiByZXNwb25zZTtcblx0XHR9XG5cblx0XHR0aGlzLl9tb2RlbC5zZXRNb25nb1Jlc3BvbnNlKHJlc3BvbnNlKTtcblxuXHRcdHJldHVybiAhIXJlc3BvbnNlPy5yZXN1bHQ/Lm9rO1xuXHR9XG5cblx0LyoqXG5cdCAqIEdldCBhbiBpbnN0YW5jZSBvZiB0aGUgdW5kZXJseWluZyBtb25nbyBjdXJzb3Jcblx0ICovXG5cdGFzeW5jIGN1cnNvcigpOiBQcm9taXNlPEN1cnNvcjxUPj4ge1xuXHRcdHJldHVybiB0aGlzLl9idWlsZGVyUmVzdWx0O1xuXHR9XG5cblx0LyoqXG5cdCAqIFJldHVybnMgdGhlIGNvdW50IG9mIGl0ZW1zLCBmaWx0ZXJzIGlmIG9uZSB3YXMgc3BlY2lmaWVkIHdpdGggLndoZXJlKClcblx0ICovXG5cdHB1YmxpYyBjb3VudCgpIHtcblx0XHRyZXR1cm4gdGhpcy5fbW9kZWwucmVwb3NpdG9yeSgpLmNvdW50KHRoaXMuX2NvbGxlY3Rpb25GaWx0ZXIpO1xuXHR9XG5cblxufVxuIiwiaW1wb3J0IHtwbGFpblRvQ2xhc3N9IGZyb20gJ2NsYXNzLXRyYW5zZm9ybWVyJztcbmltcG9ydCB7XG5cdENvbGxlY3Rpb24gYXMgTW9uZ29Db2xsZWN0aW9uLFxuXHRDdXJzb3IsXG5cdEZpbHRlclF1ZXJ5LFxuXHRGaW5kT25lT3B0aW9ucyxcblx0SW5kZXhTcGVjaWZpY2F0aW9uLFxuXHRNb25nb0NsaWVudCxcblx0T2JqZWN0SWQsXG5cdFJlcGxhY2VPbmVPcHRpb25zLFxuXHRXaXRob3V0UHJvamVjdGlvbixcbn0gZnJvbSAnbW9uZ29kYic7XG5pbXBvcnQge1JlZn0gZnJvbSBcIkBDb3JlXCI7XG5cblxuZXhwb3J0IGRlY2xhcmUgdHlwZSBDbGFzc1R5cGU8VD4gPSB7XG5cdG5ldyguLi5hcmdzOiBhbnlbXSk6IFQ7XG59O1xuXG5leHBvcnQgZnVuY3Rpb24gZGVoeWRyYXRlPFQ+KGVudGl0eTogVCwgLyppZEZpZWxkPzogc3RyaW5nKi8pOiBPYmplY3Qge1xuXHQvLyBjb25zdCBwbGFpbiA9IGNsYXNzVG9QbGFpbihlbnRpdHkpIGFzIGFueTtcblx0aWYgKCFlbnRpdHkpXG5cdFx0cmV0dXJuIGVudGl0eTtcblxuXHRjb25zdCByZWZzID0gUmVmbGVjdC5nZXRNZXRhZGF0YSgnbW9uZ286cmVmcycsIGVudGl0eSkgfHwge307XG5cblx0Zm9yIChsZXQgbmFtZSBpbiByZWZzKSB7XG5cdFx0Y29uc3QgcmVmOiBSZWYgICAgID0gcmVmc1tuYW1lXTtcblx0XHRjb25zdCByZWZmZWRFbnRpdHkgPSBlbnRpdHlbbmFtZV07XG5cblx0XHRpZiAocmVmZmVkRW50aXR5KSB7XG5cblx0XHRcdGlmIChyZWYuYXJyYXkpIHtcblx0XHRcdFx0ZW50aXR5W3JlZi5faWRdID0gcmVmZmVkRW50aXR5Lm1hcChcblx0XHRcdFx0XHQoZTogYW55KSA9PiBuZXcgT2JqZWN0SWQoZS5faWQpXG5cdFx0XHRcdCk7XG5cblx0XHRcdFx0Y29udGludWU7XG5cdFx0XHR9XG5cblx0XHRcdGVudGl0eVtyZWYuX2lkXSA9IG5ldyBPYmplY3RJZChyZWZmZWRFbnRpdHkuX2lkKTtcblx0XHR9XG5cdH1cblxuXHRjb25zdCBwbGFpbjogYW55ID0gT2JqZWN0LmFzc2lnbih7fSwgZW50aXR5KTtcblxuXHRmb3IgKGxldCBuYW1lIGluIHJlZnMpIHtcblx0XHRkZWxldGUgcGxhaW5bbmFtZV07XG5cdH1cblxuXG5cdGNvbnN0IG5lc3RlZCA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ21vbmdvOm5lc3RlZCcsIGVudGl0eSkgfHwgW107XG5cdGZvciAobGV0IHtuYW1lLCBhcnJheX0gb2YgbmVzdGVkKSB7XG5cdFx0aWYgKHBsYWluW25hbWVdKSB7XG5cdFx0XHRpZiAoIWFycmF5KSB7XG5cdFx0XHRcdHBsYWluW25hbWVdID0gZGVoeWRyYXRlKHBsYWluW25hbWVdKTtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHBsYWluW25hbWVdID0gcGxhaW5bbmFtZV0ubWFwKChlOiBhbnkpID0+IGRlaHlkcmF0ZShlKSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0Y29uc3QgaWdub3JlcyA9IFJlZmxlY3QuZ2V0TWV0YWRhdGEoJ21vbmdvOmlnbm9yZScsIGVudGl0eSkgfHwge307XG5cdGZvciAoY29uc3QgbmFtZSBpbiBpZ25vcmVzKSB7XG5cdFx0ZGVsZXRlIHBsYWluW25hbWVdO1xuXHR9XG5cblx0cmV0dXJuIHBsYWluO1xufVxuXG5leHBvcnQgaW50ZXJmYWNlIFJlcG9zaXRvcnlPcHRpb25zIHtcblx0LyoqXG5cdCAqIGNyZWF0ZSBpbmRleGVzIHdoZW4gY3JlYXRpbmcgcmVwb3NpdG9yeS4gV2lsbCBmb3JjZSBgYmFja2dyb3VuZGAgZmxhZyBhbmQgbm90IGJsb2NrIG90aGVyIGRhdGFiYXNlIG9wZXJhdGlvbnMuXG5cdCAqL1xuXHRhdXRvSW5kZXg/OiBib29sZWFuO1xuXG5cdC8qKlxuXHQgKiBkYXRhYmFzZSBuYW1lIHBhc3NlZCB0byBNb25nb0NsaWVudC5kYlxuXHQgKlxuXHQgKiBvdmVycmlkZXMgZGF0YWJhc2UgbmFtZSBpbiBjb25uZWN0aW9uIHN0cmluZ1xuXHQgKi9cblx0ZGF0YWJhc2VOYW1lPzogc3RyaW5nO1xufVxuXG5leHBvcnQgY2xhc3MgUmVwb3NpdG9yeTxUPiB7XG5cblx0cHJpdmF0ZSByZWFkb25seSBjb2xsZWN0aW9uOiBNb25nb0NvbGxlY3Rpb247XG5cblx0LyoqXG5cdCAqIFVuZGVybHlpbmcgbW9uZ29kYiBjb2xsZWN0aW9uICh1c2Ugd2l0aCBjYXV0aW9uKVxuXHQgKiBhbnkgb2YgbWV0aG9kcyBmcm9tIHRoaXMgd2lsbCBub3QgcmV0dXJuIGh5ZHJhdGVkIG9iamVjdHNcblx0ICovXG5cdGdldCBjKCk6IE1vbmdvQ29sbGVjdGlvbiB7XG5cdFx0cmV0dXJuIHRoaXMuY29sbGVjdGlvbjtcblx0fVxuXG5cdGNvbnN0cnVjdG9yKHByb3RlY3RlZCBUeXBlOiBDbGFzc1R5cGU8VD4sIG1vbmdvOiBNb25nb0NsaWVudCwgY29sbGVjdGlvbjogc3RyaW5nLCBvcHRpb25zOiBSZXBvc2l0b3J5T3B0aW9ucyA9IHt9KSB7XG5cdFx0dGhpcy5jb2xsZWN0aW9uID0gbW9uZ28uZGIob3B0aW9ucy5kYXRhYmFzZU5hbWUpLmNvbGxlY3Rpb24oY29sbGVjdGlvbik7XG5cblx0XHRpZiAob3B0aW9ucy5hdXRvSW5kZXgpXG5cdFx0XHR0aGlzLmNyZWF0ZUluZGV4ZXModHJ1ZSk7XG5cdH1cblxuXHRhc3luYyBjcmVhdGVJbmRleGVzKGZvcmNlQmFja2dyb3VuZDogYm9vbGVhbiA9IGZhbHNlKSB7XG5cdFx0Y29uc3QgaW5kZXhlczogSW5kZXhTcGVjaWZpY2F0aW9uW10gPSBSZWZsZWN0LmdldE1ldGFkYXRhKCdtb25nbzppbmRleGVzJywgdGhpcy5UeXBlLnByb3RvdHlwZSkgfHwgW107XG5cblx0XHRpZiAoaW5kZXhlcy5sZW5ndGggPT0gMClcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0aWYgKGZvcmNlQmFja2dyb3VuZCkge1xuXHRcdFx0Zm9yIChsZXQgaW5kZXggb2YgaW5kZXhlcykge1xuXHRcdFx0XHRpbmRleC5iYWNrZ3JvdW5kID0gdHJ1ZTtcblx0XHRcdH1cblx0XHR9XG5cblx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmNyZWF0ZUluZGV4ZXMoaW5kZXhlcyk7XG5cdH1cblxuXHRhc3luYyBpbnNlcnQoZW50aXR5OiBUKSB7XG5cdFx0Y29uc3QgcGxhaW4gPSBkZWh5ZHJhdGU8VD4oZW50aXR5KTtcblxuXHRcdGNvbnN0IHJlcyA9IGF3YWl0IHRoaXMuY29sbGVjdGlvbi5pbnNlcnRPbmUocGxhaW4pO1xuXG5cdFx0KGVudGl0eSBhcyBhbnkpLl9pZCA9IHJlcy5pbnNlcnRlZElkO1xuXHR9XG5cblx0YXN5bmMgdXBkYXRlKGVudGl0eTogVCwgb3B0aW9uczogUmVwbGFjZU9uZU9wdGlvbnMgPSB7fSkge1xuXHRcdGNvbnN0IHBsYWluID0gZGVoeWRyYXRlPFQ+KGVudGl0eSk7XG5cdFx0YXdhaXQgdGhpcy5jb2xsZWN0aW9uLnJlcGxhY2VPbmUoe1xuXHRcdFx0X2lkIDogKGVudGl0eSBhcyBhbnkpLl9pZC8vKGVudGl0eSBhcyBhbnkpW3RoaXMuaWRGaWVsZF1cblx0XHR9LCBwbGFpbiwgb3B0aW9ucyk7XG5cdH1cblxuXHRhc3luYyBzYXZlKGVudGl0eTogVCkge1xuXHRcdGlmICghKGVudGl0eSBhcyBhbnkpLl9pZClcblx0XHRcdGF3YWl0IHRoaXMuaW5zZXJ0KGVudGl0eSk7XG5cdFx0ZWxzZVxuXHRcdFx0YXdhaXQgdGhpcy51cGRhdGUoZW50aXR5KTtcblx0fVxuXG5cdGFzeW5jIGZpbmRPbmUocXVlcnk6IEZpbHRlclF1ZXJ5PFQgfCB7IF9pZDogYW55IH0+ID0ge30pOiBQcm9taXNlPFQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuaHlkcmF0ZShhd2FpdCB0aGlzLmNvbGxlY3Rpb24uZmluZE9uZTxPYmplY3Q+KHF1ZXJ5KSk7XG5cdH1cblxuXHRhc3luYyBmaW5kQnlJZChpZDogc3RyaW5nIHwgT2JqZWN0SWQpOiBQcm9taXNlPFQgfCBudWxsPiB7XG5cdFx0cmV0dXJuIHRoaXMuZmluZE9uZSh7X2lkIDogbmV3IE9iamVjdElkKGlkKX0pO1xuXHR9XG5cblx0YXN5bmMgZmluZE1hbnlCeUlkKGlkczogc3RyaW5nW10gfCBPYmplY3RJZFtdKTogUHJvbWlzZTxUW10+IHtcblx0XHRyZXR1cm4gdGhpcy5maW5kKHtcblx0XHRcdF9pZCA6IHskaW4gOiBpZHMubWFwKGlkID0+IG5ldyBPYmplY3RJZChpZCkpfVxuXHRcdH0pLnRvQXJyYXkoKTtcblx0fVxuXG5cdGFzeW5jIHJlbW92ZShlbnRpdHk6IFQpOiBQcm9taXNlPHZvaWQ+IHtcblx0XHRhd2FpdCB0aGlzLmMuZGVsZXRlT25lKHtfaWQgOiAoZW50aXR5IGFzIGFueSkuX2lkfSk7XG5cdH1cblxuXHQvKipcblx0ICogY2FsbHMgbW9uZ29kYi5maW5kIGZ1bmN0aW9uIGFuZCByZXR1cm5zIGl0cyBjdXJzb3Igd2l0aCBhdHRhY2hlZCBtYXAgZnVuY3Rpb24gdGhhdCBoeWRyYXRlcyByZXN1bHRzXG5cdCAqIG1vbmdvZGIuZmluZDogaHR0cDovL21vbmdvZGIuZ2l0aHViLmlvL25vZGUtbW9uZ29kYi1uYXRpdmUvMy4xL2FwaS9Db2xsZWN0aW9uLmh0bWwjZmluZFxuXHQgKi9cblx0ZmluZChxdWVyeT86IEZpbHRlclF1ZXJ5PFQgfCB7IF9pZDogYW55IH0+LCBvcHRpb25zPzogV2l0aG91dFByb2plY3Rpb248RmluZE9uZU9wdGlvbnM8VD4+KTogQ3Vyc29yPFQ+IHtcblx0XHRyZXR1cm4gdGhpcy5jb2xsZWN0aW9uLmZpbmQocXVlcnksIG9wdGlvbnMpLm1hcChkb2MgPT4gdGhpcy5oeWRyYXRlKGRvYykgYXMgVCk7XG5cdH1cblxuXHQvKipcblx0ICogR2V0cyB0aGUgbnVtYmVyIG9mIGRvY3VtZW50cyBtYXRjaGluZyB0aGUgZmlsdGVyLlxuXHQgKiBodHRwOi8vbW9uZ29kYi5naXRodWIuaW8vbm9kZS1tb25nb2RiLW5hdGl2ZS8zLjEvYXBpL0NvbGxlY3Rpb24uaHRtbCNlc3RpbWF0ZWREb2N1bWVudENvdW50XG5cdCAqIGh0dHA6Ly9tb25nb2RiLmdpdGh1Yi5pby9ub2RlLW1vbmdvZGItbmF0aXZlLzMuMS9hcGkvQ29sbGVjdGlvbi5odG1sI2NvdW50RG9jdW1lbnRzXG5cdCAqIEByZXR1cm5zIGludGVnZXJcblx0ICogQHBhcmFtIHF1ZXJ5XG5cdCAqL1xuXHRhc3luYyBjb3VudChxdWVyeT86IEZpbHRlclF1ZXJ5PFQ+KSB7XG5cdFx0cmV0dXJuIHRoaXMuY29sbGVjdGlvbi5jb3VudERvY3VtZW50cyhxdWVyeSk7XG5cdH1cblxuXHRoeWRyYXRlKHBsYWluOiBPYmplY3QgfCBudWxsKSB7XG5cdFx0cmV0dXJuIHBsYWluID8gcGxhaW5Ub0NsYXNzPFQsIE9iamVjdD4odGhpcy5UeXBlLCBwbGFpbikgOiBudWxsO1xuXHR9XG59XG4iLCJleHBvcnQgKiBmcm9tICcuL01vZGVsRW50aXR5JztcbmV4cG9ydCAqIGZyb20gJy4vTW9kZWxTZXJ2aWNlUHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9RdWVyeUJ1aWxkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9SZXBvc2l0b3J5JztcbmV4cG9ydCAqIGZyb20gJy4vaW50ZXJmYWNlcyc7XG4iLCJpbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFNlcnZpY2VQcm92aWRlciB7XG5cblx0LyoqXG5cdCAqIFJlZ2lzdGVyIGFueSBiaW5kaW5ncyB0byB0aGUgaW9jIGNvbnRhaW5lclxuXHQgKiBXaGVuIHRoZSBmcmFtZXdvcmsgaXMgbG9hZGluZyB1cCwgd2Ugd2lsbCBsb2FkIGFsbCBwcm92aWRlcnNcblx0ICogdGhlbiBjYWxsIHRoaXMgbWV0aG9kLCBhZnRlciB0aGF0LCB3ZSdsbCBjYWxsIGJvb3Qgb24gYWxsIHByb3ZpZGVycy5cblx0ICovXG5cdGFic3RyYWN0IHJlZ2lzdGVyQmluZGluZ3MoKTtcblxuXHQvKipcblx0ICogV2hlbiB0aGUgZnJhbWV3b3JrIGlzIGJvb3RpbmcsIHJlZ2lzdGVyQmluZGluZ3MoKSBpcyBjYWxsZWQsIHRoZW4gYm9vdGVkKCkuXG5cdCAqL1xuXHRhYnN0cmFjdCBib290KCk7XG5cbn1cbiIsImltcG9ydCB7Q29uZmlnfSBmcm9tIFwiQENvbmZpZ1wiO1xuaW1wb3J0IHtNdWx0aXBhcnR9IGZyb20gXCJmYXN0aWZ5LW11bHRpcGFydFwiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge0NvbnRhaW5lciwgcmVzb2x2ZSwgU3RvcmFnZVByb3ZpZGVyfSBmcm9tIFwiQENvcmVcIjtcblxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvcmFnZSB7XG5cblx0c3RhdGljIGRlZmF1bHRQcm92aWRlcigpOiBTdG9yYWdlUHJvdmlkZXIge1xuXHRcdGlmICghQ29udGFpbmVyLmlzQm91bmQoQ29uZmlnLnN0b3JhZ2UuZGVmYXVsdFByb3ZpZGVyKSlcblx0XHRcdHJldHVybiBudWxsO1xuXG5cdFx0cmV0dXJuIHJlc29sdmUoQ29uZmlnLnN0b3JhZ2UuZGVmYXVsdFByb3ZpZGVyKTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgZmlsZXMoZGlyZWN0b3J5OiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0UHJvdmlkZXIoKS5maWxlcyhkaXJlY3RvcnkpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBkaXJlY3RvcmllcyhkaXJlY3Rvcnk6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLmRlZmF1bHRQcm92aWRlcigpLmRpcmVjdG9yaWVzKGRpcmVjdG9yeSk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIG1ha2VEaXJlY3RvcnkoZGlyZWN0b3J5OiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0UHJvdmlkZXIoKS5tYWtlRGlyZWN0b3J5KGRpcmVjdG9yeSk7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIGRlbGV0ZURpcmVjdG9yeShkaXJlY3Rvcnk6IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLmRlZmF1bHRQcm92aWRlcigpLmRlbGV0ZURpcmVjdG9yeShkaXJlY3RvcnkpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBmaWxlRXhpc3RzKGtleTogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGVmYXVsdFByb3ZpZGVyKCkuZmlsZUV4aXN0cyhrZXkpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyBnZXQobG9jYXRpb246IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLmRlZmF1bHRQcm92aWRlcigpLmdldChsb2NhdGlvbik7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIHB1dChsb2NhdGlvbjogc3RyaW5nLCBmaWxlOiBNdWx0aXBhcnQpIHtcblx0XHRyZXR1cm4gdGhpcy5kZWZhdWx0UHJvdmlkZXIoKS5wdXQobG9jYXRpb24sIGZpbGUpO1xuXHR9XG5cblx0cHVibGljIHN0YXRpYyByZW1vdmUobG9jYXRpb246IHN0cmluZykge1xuXHRcdHJldHVybiB0aGlzLmRlZmF1bHRQcm92aWRlcigpLnJlbW92ZShsb2NhdGlvbik7XG5cdH1cblxuXHRwdWJsaWMgc3RhdGljIHVybChsb2NhdGlvbjogc3RyaW5nKSB7XG5cdFx0cmV0dXJuIHRoaXMuZGVmYXVsdFByb3ZpZGVyKCkudXJsKGxvY2F0aW9uKTtcblx0fVxuXG5cdHB1YmxpYyBzdGF0aWMgdGVtcG9yYXJ5VXJsKGxvY2F0aW9uOiBzdHJpbmcsIGV4cGlyZXNJblNlY29uZHM6IG51bWJlcikge1xuXHRcdHJldHVybiB0aGlzLmRlZmF1bHRQcm92aWRlcigpLnRlbXBvcmFyeVVybChsb2NhdGlvbiwgZXhwaXJlc0luU2Vjb25kcyk7XG5cdH1cblxufVxuIiwiaW1wb3J0IHtNdWx0aXBhcnR9IGZyb20gXCJmYXN0aWZ5LW11bHRpcGFydFwiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5cbmV4cG9ydCBpbnRlcmZhY2UgVXBsb2FkZWRGaWxlSW5mb3JtYXRpb24ge1xuXHR1cmw6IHN0cmluZztcblx0cGF0aDogc3RyaW5nO1xuXHRvcmlnaW5hbE5hbWU6IHN0cmluZztcbn1cblxuQGluamVjdGFibGUoKVxuZXhwb3J0IGFic3RyYWN0IGNsYXNzIFN0b3JhZ2VQcm92aWRlciB7XG5cblx0YWJzdHJhY3QgZmlsZXMoZGlyZWN0b3J5OiBzdHJpbmcpO1xuXG5cdGFic3RyYWN0IGRpcmVjdG9yaWVzKGRpcmVjdG9yeTogc3RyaW5nKTogUHJvbWlzZTxzdHJpbmdbXT47XG5cblx0YWJzdHJhY3QgbWFrZURpcmVjdG9yeShkaXJlY3Rvcnk6IHN0cmluZyk7XG5cblx0YWJzdHJhY3QgZGVsZXRlRGlyZWN0b3J5KGRpcmVjdG9yeTogc3RyaW5nKTtcblxuXHRhYnN0cmFjdCBmaWxlRXhpc3RzKGtleTogc3RyaW5nKTtcblxuXHRhYnN0cmFjdCBwdXQobG9jYXRpb246IHN0cmluZywgZmlsZTogTXVsdGlwYXJ0KTogUHJvbWlzZTxVcGxvYWRlZEZpbGVJbmZvcm1hdGlvbj47XG5cblx0YWJzdHJhY3QgcmVtb3ZlKGxvY2F0aW9uOiBzdHJpbmcpO1xuXG5cdGFic3RyYWN0IGdldChsb2NhdGlvbjogc3RyaW5nKTtcblxuXHRhYnN0cmFjdCB1cmwobG9jYXRpb246IHN0cmluZyk7XG5cblx0YWJzdHJhY3QgdGVtcG9yYXJ5VXJsKGxvY2F0aW9uOiBzdHJpbmcsIGV4cGlyZXNJblNlY29uZHM6IG51bWJlcik7XG5cbn1cbiIsImltcG9ydCB7Q29uZmlnfSBmcm9tIFwiQENvbmZpZ1wiO1xuaW1wb3J0IHtTM30gZnJvbSBcImF3cy1zZGtcIjtcbmltcG9ydCB7RGVsZXRlT2JqZWN0T3V0cHV0LCBQdXRPYmplY3RPdXRwdXR9IGZyb20gXCJhd3Mtc2RrL2NsaWVudHMvczNcIjtcbmltcG9ydCB7TXVsdGlwYXJ0fSBmcm9tIFwiZmFzdGlmeS1tdWx0aXBhcnRcIjtcbmltcG9ydCAqIGFzIGZzIGZyb20gXCJmc1wiO1xuaW1wb3J0IHtpbmplY3RhYmxlfSBmcm9tIFwiaW52ZXJzaWZ5XCI7XG5pbXBvcnQge0VuY3J5cHRpb24sIFN0b3JhZ2VQcm92aWRlciwgVXBsb2FkZWRGaWxlSW5mb3JtYXRpb259IGZyb20gXCJAQ29yZVwiO1xuaW1wb3J0IHtwaXBlbGluZX0gZnJvbSBcInN0cmVhbVwiO1xuaW1wb3J0ICogYXMgdXRpbCBmcm9tICd1dGlsJ1xuXG5jb25zdCBwdW1wID0gdXRpbC5wcm9taXNpZnkocGlwZWxpbmUpXG5cbkBpbmplY3RhYmxlKClcbmV4cG9ydCBjbGFzcyBTcGFjZXNQcm92aWRlciBleHRlbmRzIFN0b3JhZ2VQcm92aWRlciB7XG5cdHByaXZhdGUgc3BhY2VzOiBTMztcblxuXHRjb25zdHJ1Y3RvcigpIHtcblx0XHRzdXBlcigpO1xuXG5cdFx0dGhpcy5zcGFjZXMgPSBuZXcgUzMoQ29uZmlnLnN0b3JhZ2Uuc3BhY2VzKTtcblx0fVxuXG5cdHB1YmxpYyBmaWxlcyhkaXJlY3Rvcnk6IHN0cmluZykge1xuXHRcdGlmICghZGlyZWN0b3J5LmVuZHNXaXRoKCcvJykpIHtcblx0XHRcdGRpcmVjdG9yeSArPSAnLyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuc3BhY2VzLmxpc3RPYmplY3RzVjIoe1xuXHRcdFx0XHRCdWNrZXQgOiBDb25maWcuc3RvcmFnZS5zcGFjZXMuYnVja2V0LFxuXHRcdFx0XHQvL0RlbGltaXRlciA6ICcvJyxcblx0XHRcdFx0UHJlZml4IDogZGlyZWN0b3J5XG5cdFx0XHR9LCAoZXJyb3IsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNvbHZlKGRhdGEpO1xuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBkaXJlY3RvcmllcyhkaXJlY3Rvcnk6IHN0cmluZyk6IFByb21pc2U8c3RyaW5nW10+IHtcblx0XHRpZiAoIWRpcmVjdG9yeS5lbmRzV2l0aCgnLycpKSB7XG5cdFx0XHRkaXJlY3RvcnkgKz0gJy8nO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnNwYWNlcy5saXN0T2JqZWN0c1YyKHtcblx0XHRcdFx0QnVja2V0ICAgIDogQ29uZmlnLnN0b3JhZ2Uuc3BhY2VzLmJ1Y2tldCxcblx0XHRcdFx0RGVsaW1pdGVyIDogZGlyZWN0b3J5LFxuLy9cdFx0XHRcdFByZWZpeCA6IGRpcmVjdG9yeVxuXHRcdFx0fSwgKGVycm9yLCBkYXRhKSA9PiB7XG5cdFx0XHRcdGlmIChlcnJvcikge1xuXHRcdFx0XHRcdHJldHVybiByZWplY3QoZXJyb3IpO1xuXHRcdFx0XHR9XG5cblx0XHRcdFx0cmVzb2x2ZShkYXRhLkNvbW1vblByZWZpeGVzLm1hcChkID0+IGQuUHJlZml4KSk7XG5cdFx0XHR9KVxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIG1ha2VEaXJlY3RvcnkoZGlyZWN0b3J5OiBzdHJpbmcpOiBQcm9taXNlPGJvb2xlYW4+IHtcblxuXHRcdGlmICghZGlyZWN0b3J5LmVuZHNXaXRoKCcvJykpIHtcblx0XHRcdGRpcmVjdG9yeSArPSAnLyc7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuc3BhY2VzLnB1dE9iamVjdCh7XG5cdFx0XHRcdEJ1Y2tldCA6IENvbmZpZy5zdG9yYWdlLnNwYWNlcy5idWNrZXQsXG5cdFx0XHRcdEtleSAgICA6IGRpcmVjdG9yeSxcblx0XHRcdFx0Qm9keSAgIDogJycsXG5cdFx0XHRcdEFDTCAgICA6ICdwdWJsaWMtcmVhZCcsXG5cdFx0XHR9LCAoZXJyb3IsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNvbHZlKCEhZGF0YS5FVGFnKTtcblx0XHRcdH0pXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZGVsZXRlRGlyZWN0b3J5KGRpcmVjdG9yeTogc3RyaW5nKTogUHJvbWlzZTxEZWxldGVPYmplY3RPdXRwdXQ+IHtcblx0XHRpZiAoIWRpcmVjdG9yeS5lbmRzV2l0aCgnLycpKSB7XG5cdFx0XHRkaXJlY3RvcnkgKz0gJy8nO1xuXHRcdH1cblxuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnNwYWNlcy5kZWxldGVPYmplY3Qoe1xuXHRcdFx0XHRCdWNrZXQgOiBDb25maWcuc3RvcmFnZS5zcGFjZXMuYnVja2V0LFxuXHRcdFx0XHRLZXkgICAgOiBkaXJlY3RvcnksXG5cdFx0XHR9LCAoZXJyb3IsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNvbHZlKGRhdGEpO1xuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxuXG5cdHB1YmxpYyBmaWxlRXhpc3RzKGtleTogc3RyaW5nKTogUHJvbWlzZTxib29sZWFuPiB7XG5cdFx0cmV0dXJuIG5ldyBQcm9taXNlKChyZXNvbHZlLCByZWplY3QpID0+IHtcblx0XHRcdHRoaXMuc3BhY2VzLmhlYWRPYmplY3Qoe1xuXHRcdFx0XHRCdWNrZXQgOiBDb25maWcuc3RvcmFnZS5zcGFjZXMuYnVja2V0LFxuXHRcdFx0XHRLZXkgICAgOiBrZXksXG5cdFx0XHR9LCAoZXJyb3IsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNvbHZlKCEhZGF0YS5Db250ZW50TGVuZ3RoKTtcblx0XHRcdH0pXG5cdFx0fSk7XG5cdH1cblxuXHRwdWJsaWMgZ2V0KGxvY2F0aW9uOiBzdHJpbmcpIHtcblx0XHRyZXR1cm4gbmV3IFByb21pc2UoKHJlc29sdmUsIHJlamVjdCkgPT4ge1xuXHRcdFx0dGhpcy5zcGFjZXMuZ2V0T2JqZWN0KHtcblx0XHRcdFx0QnVja2V0IDogQ29uZmlnLnN0b3JhZ2Uuc3BhY2VzLmJ1Y2tldCxcblx0XHRcdFx0S2V5ICAgIDogbG9jYXRpb24sXG5cdFx0XHR9LCAoZXJyb3IsIGRhdGEpID0+IHtcblx0XHRcdFx0aWYgKGVycm9yKSB7XG5cdFx0XHRcdFx0cmV0dXJuIHJlamVjdChlcnJvcik7XG5cdFx0XHRcdH1cblxuXHRcdFx0XHRyZXNvbHZlKEJ1ZmZlci5mcm9tKGRhdGEuQm9keSBhcyBCdWZmZXIpLnRvU3RyaW5nKCkpO1xuXHRcdFx0fSlcblx0XHR9KTtcblx0fVxuXG5cblx0cHVibGljIHB1dChsb2NhdGlvbjogc3RyaW5nLCBmaWxlOiBQaWNrPE11bHRpcGFydCwgXCJmaWxlcGF0aFwiIHwgXCJmaWxlbmFtZVwiPiAmIHsgc3RvcmVBcz86IHN0cmluZyB9KTogUHJvbWlzZTxVcGxvYWRlZEZpbGVJbmZvcm1hdGlvbj4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHRjb25zdCBleHRlbnNpb24gID0gZmlsZS5maWxlbmFtZS5zcGxpdChcIi5cIikucG9wKCk7XG5cdFx0XHRjb25zdCBuZXdOYW1lICAgID0gRW5jcnlwdGlvbi5yYW5kb20oKSArIFwiLlwiICsgZXh0ZW5zaW9uO1xuXHRcdFx0Y29uc3QgZmlsZVN0cmVhbSA9IGZzLmNyZWF0ZVJlYWRTdHJlYW0oZmlsZS5maWxlcGF0aCk7XG5cdFx0XHRjb25zdCBmaWxlS2V5ICAgID0gbG9jYXRpb24gKyBcIi9cIiArIChmaWxlLnN0b3JlQXMgPyBmaWxlLnN0b3JlQXMgOiBuZXdOYW1lKTtcblxuXHRcdFx0dGhpcy5zcGFjZXMucHV0T2JqZWN0KHtcblx0XHRcdFx0QUNMICAgIDogXCJwdWJsaWMtcmVhZFwiLFxuXHRcdFx0XHRCdWNrZXQgOiBDb25maWcuc3RvcmFnZS5zcGFjZXMuYnVja2V0LFxuXHRcdFx0XHRLZXkgICAgOiBmaWxlS2V5LFxuXHRcdFx0XHRCb2R5ICAgOiBmaWxlU3RyZWFtXG5cdFx0XHR9LCAoZXJyb3IsIGRhdGE6IFB1dE9iamVjdE91dHB1dCkgPT4ge1xuXHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fVxuXHRcdFx0XHRyZXNvbHZlKDxVcGxvYWRlZEZpbGVJbmZvcm1hdGlvbj57XG5cdFx0XHRcdFx0dXJsICAgICAgICAgIDogYCR7Q29uZmlnLnN0b3JhZ2Uuc3BhY2VzLnVybH0vJHtmaWxlS2V5fWAsXG5cdFx0XHRcdFx0cGF0aCAgICAgICAgIDogZmlsZUtleSxcblx0XHRcdFx0XHRvcmlnaW5hbE5hbWUgOiBmaWxlLmZpbGVuYW1lXG5cdFx0XHRcdH0pO1xuXHRcdFx0fSk7XG5cdFx0fSlcblx0fVxuXG5cdHB1YmxpYyByZW1vdmUobG9jYXRpb246IHN0cmluZyk6IFByb21pc2U8Ym9vbGVhbj4ge1xuXHRcdHJldHVybiBuZXcgUHJvbWlzZSgocmVzb2x2ZSwgcmVqZWN0KSA9PiB7XG5cdFx0XHR0aGlzLnNwYWNlcy5kZWxldGVPYmplY3Qoe1xuXHRcdFx0XHRCdWNrZXQgOiBDb25maWcuc3RvcmFnZS5zcGFjZXMuYnVja2V0LFxuXHRcdFx0XHRLZXkgICAgOiBsb2NhdGlvbixcblx0XHRcdH0sIChlcnJvciwgZGF0YSkgPT4ge1xuXHRcdFx0XHRpZiAoZXJyb3IpIHtcblx0XHRcdFx0XHRyZXR1cm4gcmVqZWN0KGVycm9yKTtcblx0XHRcdFx0fVxuXG5cdFx0XHRcdHJlc29sdmUodHJ1ZSk7XG5cdFx0XHR9KVxuXHRcdH0pO1xuXHR9XG5cblx0cHVibGljIHVybChsb2NhdGlvbjogc3RyaW5nKSB7XG5cdFx0bGV0IHBhdGggPSBDb25maWcuc3RvcmFnZS5zcGFjZXMudXJsO1xuXG5cdFx0aWYgKGxvY2F0aW9uLnN0YXJ0c1dpdGgoJy8nKSkge1xuXHRcdFx0bG9jYXRpb24gPSBsb2NhdGlvbi5zbGljZSgxKTtcblx0XHR9XG5cdFx0aWYgKHBhdGguZW5kc1dpdGgoJy8nKSkge1xuXHRcdFx0cGF0aCA9IHBhdGguc2xpY2UoMCwgLTEpO1xuXHRcdH1cblxuXHRcdHJldHVybiBwYXRoICsgJy8nICsgbG9jYXRpb247XG5cdH1cblxuXHRwdWJsaWMgdGVtcG9yYXJ5VXJsKGxvY2F0aW9uOiBzdHJpbmcsIGV4cGlyZXNJblNlY29uZHM6IG51bWJlcikge1xuXHRcdHJldHVybiB0aGlzLnNwYWNlcy5nZXRTaWduZWRVcmxQcm9taXNlKFwiZ2V0T2JqZWN0XCIsIHtcblx0XHRcdEJ1Y2tldCAgOiBDb25maWcuc3RvcmFnZS5zcGFjZXMuYnVja2V0LFxuXHRcdFx0S2V5ICAgICA6IGxvY2F0aW9uLFxuXHRcdFx0RXhwaXJlcyA6IGV4cGlyZXNJblNlY29uZHNcblx0XHR9KTtcblx0fVxuXG59XG4iLCJpbXBvcnQge0NvbnRhaW5lciwgU2VydmljZVByb3ZpZGVyLCBTcGFjZXNQcm92aWRlciwgU3RvcmFnZX0gZnJvbSBcIkBDb3JlXCI7XG5pbXBvcnQge2luamVjdGFibGV9IGZyb20gXCJpbnZlcnNpZnlcIjtcblxuXG5AaW5qZWN0YWJsZSgpXG5leHBvcnQgY2xhc3MgU3RvcmFnZVNlcnZpY2VQcm92aWRlciBleHRlbmRzIFNlcnZpY2VQcm92aWRlciB7XG5cblx0cHVibGljIGFzeW5jIHJlZ2lzdGVyQmluZGluZ3MoKSB7XG5cdFx0Q29udGFpbmVyLmJpbmQ8U3BhY2VzUHJvdmlkZXI+KFNwYWNlc1Byb3ZpZGVyKS50byhTcGFjZXNQcm92aWRlcik7XG5cdFx0Q29udGFpbmVyLmJpbmQ8U3RvcmFnZT4oU3RvcmFnZSkudG8oU3RvcmFnZSk7XG5cdH1cblxuXHRwdWJsaWMgYXN5bmMgYm9vdCgpIHtcblxuXHR9XG5cbn1cbiIsImV4cG9ydCAqIGZyb20gJy4vU3RvcmFnZSc7XG5leHBvcnQgKiBmcm9tICcuL1N0b3JhZ2VQcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL1N0b3JhZ2VQcm92aWRlcnMvU3BhY2VzUHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9TdG9yYWdlU2VydmljZVByb3ZpZGVyJztcbiIsImV4cG9ydCAqIGZyb20gJy4vQXBwJztcbmV4cG9ydCB7d2hlbkJvb3RzdHJhcHBlZH0gZnJvbSAnLi9Cb290c3RyYXAnO1xuZXhwb3J0IHtcblx0ZGVmYXVsdCBhcyBDb250YWluZXIsIENPTlRBSU5FUl9JREVOVElGSUVSLCBMT0dHRVJfSURFTlRJRklFUiwgSFRUUF9DT05URVhUX0lERU5USUZJRVIsIEFVVEhFRF9VU0VSX0lERU5USUZJRVIsIEhUVFBfUkVRVUVTVF9JREVOVElGSUVSXG59IGZyb20gJy4vQ29udGFpbmVyJztcbmV4cG9ydCAqIGZyb20gJy4vRGVjb3JhdG9yRGF0YSc7XG5leHBvcnQgKiBmcm9tICcuL0RlY29yYXRvcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9FeGNlcHRpb25zL01vZGVscy9JbnZhbGlkUmVmU3BlY2lmaWVkJztcbmV4cG9ydCAqIGZyb20gJy4vRXhjZXB0aW9ucyc7XG5leHBvcnQgKiBmcm9tICcuL0hlbHBlcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9Qcm92aWRlcnMvQXV0aCc7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9DYWNoZSc7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9DcnlwdCc7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9IdHRwL0NvbnRleHQvUmVxdWVzdCc7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9IdHRwL0NvbnRleHQvUmVzcG9uc2UnO1xuZXhwb3J0ICogZnJvbSAnLi9Qcm92aWRlcnMvSHR0cC9Db250ZXh0JztcbmV4cG9ydCAqIGZyb20gJy4vUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlci9EZWNvcmF0b3JzJztcbmV4cG9ydCAqIGZyb20gJy4vUHJvdmlkZXJzL0h0dHAvQ29udHJvbGxlcic7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9IdHRwL1NlcnZlcic7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9IdHRwJztcbmV4cG9ydCAqIGZyb20gJy4vUHJvdmlkZXJzL0xvZyc7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9Nb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL1Byb3ZpZGVycy9TZXJ2aWNlUHJvdmlkZXInO1xuZXhwb3J0ICogZnJvbSAnLi9Qcm92aWRlcnMvU3RvcmFnZS9TdG9yYWdlUHJvdmlkZXJzL1NwYWNlc1Byb3ZpZGVyJztcbmV4cG9ydCAqIGZyb20gJy4vUHJvdmlkZXJzL1N0b3JhZ2UnO1xuIiwiZXhwb3J0ICogZnJvbSAnLi9Db3JlL0RlY29yYXRvcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL0V4Y2VwdGlvbnMvTW9kZWxzL0ludmFsaWRSZWZTcGVjaWZpZWQnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL0V4Y2VwdGlvbnMnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL1Byb3ZpZGVycy9BdXRoJztcbmV4cG9ydCAqIGZyb20gJy4vQ29yZS9Qcm92aWRlcnMvQ2FjaGUnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL1Byb3ZpZGVycy9DcnlwdCc7XG5leHBvcnQgKiBmcm9tICcuL0NvcmUvUHJvdmlkZXJzL0h0dHAvQ29udGV4dC9SZXF1ZXN0JztcbmV4cG9ydCAqIGZyb20gJy4vQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250ZXh0L1Jlc3BvbnNlJztcbmV4cG9ydCAqIGZyb20gJy4vQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250ZXh0JztcbmV4cG9ydCAqIGZyb20gJy4vQ29yZS9Qcm92aWRlcnMvSHR0cC9Db250cm9sbGVyL0RlY29yYXRvcnMnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL1Byb3ZpZGVycy9IdHRwL0NvbnRyb2xsZXInO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL1Byb3ZpZGVycy9IdHRwL1NlcnZlcic7XG5leHBvcnQgKiBmcm9tICcuL0NvcmUvUHJvdmlkZXJzL0h0dHAnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL1Byb3ZpZGVycy9Mb2cnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlL1Byb3ZpZGVycy9Nb2RlbCc7XG5leHBvcnQgKiBmcm9tICcuL0NvcmUvUHJvdmlkZXJzL1NlcnZpY2VQcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL0NvcmUvUHJvdmlkZXJzL1N0b3JhZ2UvU3RvcmFnZVByb3ZpZGVycy9TcGFjZXNQcm92aWRlcic7XG5leHBvcnQgKiBmcm9tICcuL0NvcmUvUHJvdmlkZXJzL1N0b3JhZ2UnO1xuZXhwb3J0ICogZnJvbSAnLi9Db3JlJztcbiIsInZhciBtYXAgPSB7XG5cdFwiLi9BdXRoL0F1dGhDb250cm9sbGVyXCI6IFwiLi9zcmMvQXBwL0h0dHAvQ29udHJvbGxlcnMvQXV0aC9BdXRoQ29udHJvbGxlci50c1wiLFxuXHRcIi4vQXV0aC9BdXRoQ29udHJvbGxlci50c1wiOiBcIi4vc3JjL0FwcC9IdHRwL0NvbnRyb2xsZXJzL0F1dGgvQXV0aENvbnRyb2xsZXIudHNcIlxufTtcblxuXG5mdW5jdGlvbiB3ZWJwYWNrQ29udGV4dChyZXEpIHtcblx0dmFyIGlkID0gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSk7XG5cdHJldHVybiBfX3dlYnBhY2tfcmVxdWlyZV9fKGlkKTtcbn1cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0UmVzb2x2ZShyZXEpIHtcblx0aWYoIV9fd2VicGFja19yZXF1aXJlX18ubyhtYXAsIHJlcSkpIHtcblx0XHR2YXIgZSA9IG5ldyBFcnJvcihcIkNhbm5vdCBmaW5kIG1vZHVsZSAnXCIgKyByZXEgKyBcIidcIik7XG5cdFx0ZS5jb2RlID0gJ01PRFVMRV9OT1RfRk9VTkQnO1xuXHRcdHRocm93IGU7XG5cdH1cblx0cmV0dXJuIG1hcFtyZXFdO1xufVxud2VicGFja0NvbnRleHQua2V5cyA9IGZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0S2V5cygpIHtcblx0cmV0dXJuIE9iamVjdC5rZXlzKG1hcCk7XG59O1xud2VicGFja0NvbnRleHQucmVzb2x2ZSA9IHdlYnBhY2tDb250ZXh0UmVzb2x2ZTtcbm1vZHVsZS5leHBvcnRzID0gd2VicGFja0NvbnRleHQ7XG53ZWJwYWNrQ29udGV4dC5pZCA9IFwiLi9zcmMvQXBwL0h0dHAvQ29udHJvbGxlcnMgc3luYyByZWN1cnNpdmUgXlxcXFwuXFxcXC8uKiRcIjsiLCJ2YXIgbWFwID0ge1xuXHRcIi4vVXNlclwiOiBcIi4vc3JjL0FwcC9Nb2RlbHMvVXNlci50c1wiLFxuXHRcIi4vVXNlci50c1wiOiBcIi4vc3JjL0FwcC9Nb2RlbHMvVXNlci50c1wiXG59O1xuXG5cbmZ1bmN0aW9uIHdlYnBhY2tDb250ZXh0KHJlcSkge1xuXHR2YXIgaWQgPSB3ZWJwYWNrQ29udGV4dFJlc29sdmUocmVxKTtcblx0cmV0dXJuIF9fd2VicGFja19yZXF1aXJlX18oaWQpO1xufVxuZnVuY3Rpb24gd2VicGFja0NvbnRleHRSZXNvbHZlKHJlcSkge1xuXHRpZighX193ZWJwYWNrX3JlcXVpcmVfXy5vKG1hcCwgcmVxKSkge1xuXHRcdHZhciBlID0gbmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIiArIHJlcSArIFwiJ1wiKTtcblx0XHRlLmNvZGUgPSAnTU9EVUxFX05PVF9GT1VORCc7XG5cdFx0dGhyb3cgZTtcblx0fVxuXHRyZXR1cm4gbWFwW3JlcV07XG59XG53ZWJwYWNrQ29udGV4dC5rZXlzID0gZnVuY3Rpb24gd2VicGFja0NvbnRleHRLZXlzKCkge1xuXHRyZXR1cm4gT2JqZWN0LmtleXMobWFwKTtcbn07XG53ZWJwYWNrQ29udGV4dC5yZXNvbHZlID0gd2VicGFja0NvbnRleHRSZXNvbHZlO1xubW9kdWxlLmV4cG9ydHMgPSB3ZWJwYWNrQ29udGV4dDtcbndlYnBhY2tDb250ZXh0LmlkID0gXCIuL3NyYy9BcHAvTW9kZWxzIHN5bmMgcmVjdXJzaXZlIF5cXFxcLlxcXFwvLiokXCI7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiYXN5bmNfaG9va3NcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImF3cy1zZGtcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImJjcnlwdFwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiY2hhbGtcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNoYWxrLWNvbnNvbGVcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImNsYXNzLXRyYW5zZm9ybWVyXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJjbGFzcy12YWxpZGF0b3JcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImRvdGVudlwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZmFzdGlmeVwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiZmFzdGlmeS1tdWx0aXBhcnRcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcImZzXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJnbG9iXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJodHRwLXN0YXR1cy1jb2Rlc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiaW52ZXJzaWZ5XCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJqc29ud2VidG9rZW5cIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIm1pZGRpZVwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibW9uZ29kYlwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1jYWNoZS1yZWRpc1wiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwibm9kZS1mZXRjaFwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGF0aFwiKTs7IiwibW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwicGx1cmFsaXplXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWZsZWN0LW1ldGFkYXRhXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJyZWdlbmVyYXRvci1ydW50aW1lXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzaW1wbGUtY3J5cHRvLWpzXCIpOzsiLCJtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCJzdHJlYW1cIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcInV0aWxcIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndpbnN0b25cIik7OyIsIm1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIndpbnN0b24tZGFpbHktcm90YXRlLWZpbGVcIik7OyIsIi8vIFRoZSBtb2R1bGUgY2FjaGVcbnZhciBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX18gPSB7fTtcblxuLy8gVGhlIHJlcXVpcmUgZnVuY3Rpb25cbmZ1bmN0aW9uIF9fd2VicGFja19yZXF1aXJlX18obW9kdWxlSWQpIHtcblx0Ly8gQ2hlY2sgaWYgbW9kdWxlIGlzIGluIGNhY2hlXG5cdHZhciBjYWNoZWRNb2R1bGUgPSBfX3dlYnBhY2tfbW9kdWxlX2NhY2hlX19bbW9kdWxlSWRdO1xuXHRpZiAoY2FjaGVkTW9kdWxlICE9PSB1bmRlZmluZWQpIHtcblx0XHRyZXR1cm4gY2FjaGVkTW9kdWxlLmV4cG9ydHM7XG5cdH1cblx0Ly8gQ3JlYXRlIGEgbmV3IG1vZHVsZSAoYW5kIHB1dCBpdCBpbnRvIHRoZSBjYWNoZSlcblx0dmFyIG1vZHVsZSA9IF9fd2VicGFja19tb2R1bGVfY2FjaGVfX1ttb2R1bGVJZF0gPSB7XG5cdFx0Ly8gbm8gbW9kdWxlLmlkIG5lZWRlZFxuXHRcdC8vIG5vIG1vZHVsZS5sb2FkZWQgbmVlZGVkXG5cdFx0ZXhwb3J0czoge31cblx0fTtcblxuXHQvLyBFeGVjdXRlIHRoZSBtb2R1bGUgZnVuY3Rpb25cblx0X193ZWJwYWNrX21vZHVsZXNfX1ttb2R1bGVJZF0uY2FsbChtb2R1bGUuZXhwb3J0cywgbW9kdWxlLCBtb2R1bGUuZXhwb3J0cywgX193ZWJwYWNrX3JlcXVpcmVfXyk7XG5cblx0Ly8gUmV0dXJuIHRoZSBleHBvcnRzIG9mIHRoZSBtb2R1bGVcblx0cmV0dXJuIG1vZHVsZS5leHBvcnRzO1xufVxuXG4iLCJfX3dlYnBhY2tfcmVxdWlyZV9fLm8gPSAob2JqLCBwcm9wKSA9PiAoT2JqZWN0LnByb3RvdHlwZS5oYXNPd25Qcm9wZXJ0eS5jYWxsKG9iaiwgcHJvcCkpIiwiLy8gc3RhcnR1cFxuLy8gTG9hZCBlbnRyeSBtb2R1bGUgYW5kIHJldHVybiBleHBvcnRzXG4vLyBUaGlzIGVudHJ5IG1vZHVsZSBpcyByZWZlcmVuY2VkIGJ5IG90aGVyIG1vZHVsZXMgc28gaXQgY2FuJ3QgYmUgaW5saW5lZFxudmFyIF9fd2VicGFja19leHBvcnRzX18gPSBfX3dlYnBhY2tfcmVxdWlyZV9fKFwiLi9zcmMvaW5kZXgudHNcIik7XG4iXSwic291cmNlUm9vdCI6IiJ9