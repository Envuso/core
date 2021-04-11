//import {injectable} from "inversify";
//import Container from "../../Container";
//import {ServiceProvider} from "../ServiceProvider";
//import {AuthProvider} from "./AuthProvider";
//import {JwtAuthProvider} from "./JwtAuthProvider";
//
//@injectable()
//export class AuthServiceProvider extends ServiceProvider {
//
//	constructor() {
//		super();
//	}
//
//	public registerBindings() {
//		Container.bind(JwtAuthProvider).to(JwtAuthProvider);
//		Container.bind(AuthProvider).to(AuthProvider);
//	}
//
//	boot() {
//
//	}
//
//
//}
