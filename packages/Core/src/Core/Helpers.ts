import {HttpContext, HttpRequest, HttpResponse} from "@Providers/Http";
import {interfaces} from "inversify";
import Container from "./Container";


// Helper methods to resolve from the container a little easier/cleaner
export const resolve = <T>(identifier: interfaces.ServiceIdentifier<T>): T => Container.get<T>(identifier)
export const app     = resolve;


export const request  = (): HttpRequest => HttpContext.request();
export const response = (): HttpResponse => HttpContext.response();

//export const config = (key: string) => {
//	const baseConf = _.get(Config, key);
//
//	if (!baseConf) {
//		return _.get(Config, key);
//	}
//}

