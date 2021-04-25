import "reflect-metadata";
import {FastifyReply, FastifyRequest} from "fastify";
import path from "path";
import {config} from 'dotenv';

config({path : path.join(__dirname, '..', '..', 'Components', '.env')});

import {Config} from "../Config";
import {Envuso} from "./Envuso";
import {Log} from "../Common";

const envuso = new Envuso();


envuso.prepare(Config)
	.then(() => {
		envuso.addExceptionHandler(async (exception: Error, request: FastifyRequest, reply: FastifyReply) => {
			Log.exception('Server error: ', exception);

			return reply;
		});
	})
	.catch(error => {
		Log.error(error);
		console.trace(error);
	});
