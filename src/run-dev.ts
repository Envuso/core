import "reflect-metadata";
import {FastifyReply, FastifyRequest} from "fastify";
import path from "path";
import {config} from 'dotenv';

config({path : path.join(__dirname, '..', '..', 'Components', '.env')});

import {Config} from "./Config";
import {response} from "./Routing";
import {Envuso} from "./Envuso";
import {Exception, Log} from "./Common";

const envuso = new Envuso();


envuso.boot(Config)
	.then(() => envuso.serve())
	.then(() => {
		envuso.addExceptionHandler(async (exception: Error | Exception, request: FastifyRequest, reply: FastifyReply) => {
			Log.exception('Server error: ', exception);

			if (!response()?.json) {
				console.log('response.json not defined??');
			}

			return response().json(exception instanceof Exception ? exception.response : exception);
		});
	})
	.catch(error => {
		Log.error(error);
		console.trace(error);
	});
