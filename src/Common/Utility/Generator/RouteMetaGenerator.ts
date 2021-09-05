//import path from "path";
//import {match} from "path-to-regexp";
//import {MetaGeneratorConfiguration} from "../../../Contracts/AppContainer/AppContract";
//import {getFrameworkModule} from "../../../Meta/Modules/FrameworkModules";
//import {ControllerManager} from "../../../Routing/Controller/ControllerManager";
//import {LocalFileProvider, Storage} from "../../../Storage";
//import {config} from '../../../AppContainer';
//import {Log} from "../../Logger/Log";
//
//export class RouteMetaGenerator {
//
//	public routeNames: string[]                             = [];
//	public routes: string                                   = '';
//	public routeAttributeImports: { [key: string]: string } = {};
//	public routeAttributes: { [key: string]: any }          = {};
//	public paths: any[]                                     = [];
//	public tsRefs: any[]                                    = [];
//
//	private configuration: MetaGeneratorConfiguration;
//
//	private fileName = null;
//	private disk: LocalFileProvider;
//
//	private loadedMeta: boolean = false;
//
//	constructor() {
//		this.configuration = config<MetaGeneratorConfiguration>('app.generators.routes', {
//			typescriptTypes : true,
//			json            : false,
//		});
//
//		this.configuration.location = path.join(process.cwd(), 'src', 'Meta', 'Routes');
//		this.configuration.fileName = 'Routes';
//
//		this.fileName = this.configuration.fileName.split('.').shift();
//
//		this.disk = Storage.onDemand({
//			driver : 'local',
//			root   : this.configuration.location
//		}) as LocalFileProvider;
//	}
//
//	loadMetaData() {
//		if (this.loadedMeta) return;
//
//		const controllerData = ControllerManager.initiateControllers();
//		for (let controller of controllerData) {
//			//			const controllerModule = getFrameworkModule(controller.controller);
//
//			//			this.tsRefs.push(`/// <reference path="${path.relative(
//			//				path.join(process.cwd(), 'src', 'Meta', 'Routes'),
//			//				path.join(process.cwd(), controllerModule.filePath),
//			//			)}"  />`);
//
//			for (let route of controller.routes) {
//				const meta      = route.methodMeta;
//				const routePath = route.getPath();
//				const method    = route.getMethod();
//				const routeName = `${controller.controllerName}.${route.methodMeta.key}`;
//
//				this.routeNames.push(routeName);
//
//				const routeParameters: { [key: string]: string } = routePath.includes(':')
//					? (<any>match(routePath)(routePath))?.params
//					: {};
//
//				this.paths.push(routePath);
//
//				const controllerParams = !meta.parameters?.length ? [] : meta.parameters.map(p => {
//					return {
//						name              : p.name,
//						type              : p.type.name,
//						moduleInformation : getFrameworkModule(p.type),
//					};
//				});
//
//				const attributeTypes: { [key: string]: string } = {};
//
//				for (let controllerParam of controllerParams) {
//					if (controllerParam.moduleInformation) {
//						this.routeAttributeImports[controllerParam.type] = path.relative(
//							path.join(process.cwd(), 'src', 'Meta', 'Routes'),
//							path.join(process.cwd(), controllerParam.moduleInformation.filePath),
//						).replace('.ts', '').replace('.js', '');
//
//					}
//
//					attributeTypes[controllerParam.name] =
//						`${controllerParam.moduleInformation ? `\n/**
// * @type {${controllerParam.type}} ${controllerParam.name}
// */` : ''}
//${controllerParam.name} : ${/*controllerParam.moduleInformation ? controllerParam.type : 'any'*/ 'any'}`
//					;
//				}
//
//				for (let routeParam in routeParameters) {
//					if (attributeTypes[routeParam]) {
//						continue;
//					}
//					attributeTypes[routeParam] = (
//						`${routeParam} : any`
//					);
//				}
//
//				this.routeAttributes[routeName] = Object.values(attributeTypes).join(', ');
//
//				const getClassType = (controllerParam: any) => {
//					if (['String', 'Boolean', 'Number'].includes(controllerParam.type)) {
//						return controllerParam.type;
//					}
//					if (!this.routeAttributeImports[controllerParam.type]) {
//						return "null";
//					}
//
//					return 'null';
//					//return controllerParam.type;
//				};
//
//				this.routes +=
//					`\n "${routeName}" : {
//	name             : "${routeName}",
//	path             : "${routePath}",
//	controllerAction : "${meta.key}",
//	controllerParams : [${controllerParams.map(p => (`{
//					name : "${p.name}",
//					type : "${p.type}",
//					classType: ${getClassType(p)}
//				}`))}],
//	method     : ${Array.isArray(method) ? `[${method.map(m => `"${m}"`).join(', ')}]` : `["${method}"]`},
//	parameters : ${JSON.stringify(routeParameters)},
//},`;
//			}
//		}
//
//		Log.info(`Loaded ${this.routes.length} routes data for meta.`);
//
//		this.loadedMeta = true;
//	}
//
//	public static async generate(force: boolean = false) {
//		const routeMetaGenerator = new RouteMetaGenerator();
//		await routeMetaGenerator.generateTypesFile(force);
//		await routeMetaGenerator.generateJsonFile(force);
//	}
//
//	public async canGenerate(type: 'ts' | 'json', force: boolean = false): Promise<{ can: boolean, type: 'full' | 'boilerplate' }> {
//		if (force) {
//			return {
//				can  : true,
//				type : 'full'
//			};
//		}
//
//		if (type === 'ts' && !this.configuration.typescriptTypes) {
//			return {
//				can  : await this.disk.fileExists(`${this.fileName}.${type}`) === false,
//				type : 'boilerplate'
//			};
//		}
//		if (type === 'ts') {
//			return {
//				can  : this.configuration.typescriptTypes,
//				type : 'full'
//			};
//		}
//		if (type === 'json' && !this.configuration.json) {
//			return {
//				can  : await this.disk.fileExists(`${this.fileName}.${type}`) === false,
//				type : 'boilerplate'
//			};
//		}
//		if (type === 'json') {
//			return {
//				can  : this.configuration.json,
//				type : 'full'
//			};
//		}
//
//
//	}
//
//	private async generateTypesFile(force: boolean = false) {
//		const fileName = `${this.fileName}.ts`;
//
//		const {can, type} = await this.canGenerate('ts', force);
//
//		if (!can) {
//			Log.info(`Cannot generate typescript types, option is disabled.`);
//			return;
//		}
//
//		if (type === 'full') {
//			this.loadMetaData();
//			Log.info(`Generating full typescript types.`, path.join(this.disk.basePath, fileName));
//		} else {
//			Log.info(`Generating boilerplate typescript... something needs to exist.`);
//		}
//
//		const routeAttributeObj = Object.keys(this.routeAttributes).map(k => {
//			return `"${k}" : { ${this.routeAttributes[k]} }`;
//		}).join(', \n');
//
//		await this.disk.write(fileName, `
//${this.tsRefs.map(v => v).join('\n')}
//
//${/*Object.keys(this.routeAttributeImports).map(
//		 i => `import {${i}} from "${this.routeAttributeImports[i]}";`).join(', \n')
//		 */''}
//
//export interface ApplicationRouteInformation {
//	name: string;
//	path: string;
//	controllerAction: string;
//	controllerParams: {name:string, type:string, classType: new () => any}[];
//	method: RouteMethod[];
//	parameters: {[key:string]:string };
//}
//
//export type RouteMethod = 'DELETE' | 'GET' | 'HEAD' | 'PATCH' | 'POST' | 'PUT' | 'OPTIONS'
//
//export type RoutePaths = ${this.paths.map(p => `"${p}"`).join(' | ')};
//
//export type RouteNames = ${this.routeNames.map(k => `"${k}"`).join(' | ')};
//
//export type ApplicationRouteList = {[p in RouteNames]:ApplicationRouteInformation};
//
//export type ApplicationRouteAttributeObject = {
//	${routeAttributeObj}
//}
//
//export const applicationRoutePaths: Array<RouteNames[keyof RouteNames]> = [${this.paths.map(p => `"${p}"`).join(', ')}];
//
//export const applicationRoutesMap: ApplicationRouteList = {${this.routes}};
//
//export const getApplicationRoute = (name: RouteNames): ApplicationRouteInformation|null => {
//	return applicationRoutesMap[name] ?? null;
//}
//		`);
//
//		Log.success(`All done with types!`);
//	}
//
//	private async generateJsonFile(force: boolean = false) {
//		const fileName = `${this.fileName}.meta.json`;
//
//		const {can, type} = await this.canGenerate('json', force);
//
//		if (!can) {
//			Log.info(`Cannot generate json file, option is disabled.`);
//			return;
//		}
//
//		if (type === 'full') {
//			this.loadMetaData();
//			Log.info(`Generating json file.`);
//		} else {
//			Log.info(`Generating boilerplate json file... something needs to exist.`);
//		}
//
//		await this.disk.write(fileName, JSON.stringify({
//			paths  : this.paths,
//			routes : this.routes,
//		}));
//
//		Log.success(`All done with json meta!`);
//
//	}
//}
