import {Container as IocContainer} from "inversify";


const Container = new IocContainer();

export const AUTHED_USER_IDENTIFIER  = Symbol('AuthorisedUser');
export const HTTP_CONTEXT_IDENTIFIER = Symbol('HttpContext');
export const HTTP_REQUEST_IDENTIFIER = Symbol('HttpRequest');
export const CONTAINER_IDENTIFIER    = Symbol('Container');
export const LOGGER_IDENTIFIER       = Symbol('Logger');

export default Container;
