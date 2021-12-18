import "reflect-metadata";
import path from "path";
import {User} from "./App/Models/User";
import Environment from "./AppContainer/Config/Environment";

Environment.load(path.join(__dirname, "..", ".env"));

import Configuration from "./Config/Configuration";
import {Envuso} from "./Envuso";
import {Log} from "./Common";
import {DateTime} from "@envuso/date-time-helper";


const envuso = new Envuso();

Configuration.initiate()
	.then(() => envuso.boot())
	.then(() => envuso.serve())
	.then(async () => {
//		const user = await User.create({
//			email : 'sam@idt.dev',
//			name  : 'sam',
//		});
//
//		console.log(user.generateToken(), user._id.toString());
		//eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjYxNzM2NTE4YWI3ZGU5Y2VjZjk2N2M1YSIsImlhdCI6MTYzNDk1MjQ3MiwiZXhwIjoxNjM1MDM4ODcyfQ.1cEWNXbpN7ZqWJ3MQUvbrgUqeSKVwMOgm2ZzpoLsJ_8
		//61736518ab7de9cecf967c5a
	})
	//	.then(async () => {
	//		//		new ImplementedJob(1).dispatch();
	//
	//		for (let i = 0; i < 10; i++) {
	//			new ImplementedJob(1).dispatch();
	//		}
	//	})
	.catch(error => Log.exception(error));

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
