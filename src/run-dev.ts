import "reflect-metadata";

import path from "path";
import Environment from "./AppContainer/Config/Environment";

Environment.load(path.join(__dirname, "..", ".env"));

import Configuration from "./Config/Configuration";
import { Envuso } from "./Envuso";
import { Log } from "./Common";

//
// TODO: Remove log tests :)
//
Log.info("[Info] Hey there o/");
Log.success("[Success] This was a success :)");
Log.warn("[Warn] Something possibly wrong here :/");
Log.error("[Error] Just a message");
Log.error(new Error("[Error] Just an error!"));
Log.error("[Error] A message", new Error("and an error!"));
Log.exception("[Exception] Just a message");
Log.label('Server').exception(new Error("[Exception] Just an error"));
Log.exception("[Exception] A message", new Error("and an error"));
Log.label("custom").info("[Info] label");
Log.label("multiple", "args").info("[Info] label");
Log.label("multiple").label("fns").info("[Info] label");
Log.info("Testing objects", {
	test: "something",
});
Log.debug("Testing multiple objects", { just: 1 }, ["more", "log"], "test", true);

/*const envuso = new Envuso();

Configuration.initiate()
             .then(() => envuso.boot())
             .then(() => envuso.serve())
             .catch(error => {
	             Log.error(error);
	             console.trace(error);
             });*/
//envuso.addExceptionHandler(async (exception: Error | Exception, request: FastifyRequest, reply: FastifyReply) => {
//	Log.exception('Server error: ', exception);
//
//	if (!response()?.json) {
//		console.log('response.json not defined??');
//	}
//
//	const data = exception instanceof Exception ? exception.response : {
//		message : exception.toString(),
//		code    : 500,
//	};
//
//	//			return response().negotiated(
//	//				data,
//	//				{
//	//					templatePath : 'Exceptions/exception',
//	//					data         : {
//	//						message:
//	//					}
//	//				}
//	//			);
//	//			return response().json(exception instanceof Exception ? exception.response : exception);
//
//	return response().negotiatedErrorView(
//		data,
//		exception instanceof Exception ? exception.code : 500,
//		exception,
//	);
//});
