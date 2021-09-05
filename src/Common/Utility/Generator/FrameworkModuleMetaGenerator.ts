//import * as fs from "fs";
//import path from "path";
//import {LocalFileProvider, Storage} from "../../../Storage";
//import {Log} from "../../Logger/Log";
//import {Classes} from "../Classes";
//import {DateTime} from "../DateTime";
//
//export type CacheData = {
//	lastCache: number;
//	totalModules: number;
//}
//
//export class FrameworkModuleMetaGenerator {
//
//	public modules: any = {};
//	private disk: LocalFileProvider;
//	private diskPath: string;
//
//	constructor() {
//		this.diskPath = path.join(process.cwd(), 'src', 'Meta', 'Modules');
//
//		this.disk = Storage.onDemand({
//			driver : 'local',
//			root   : this.diskPath,
//		}) as LocalFileProvider;
//	}
//
//	static async generate(force: boolean = false) {
//		const generator = new FrameworkModuleMetaGenerator();
//		await generator.loadMetaData(force);
//	}
//
//	async loadMetaData(force: boolean = false) {
//
//		if(!force) {
//			if (!await this.handleCaching()) {
//				return;
//			}
//		}
//
//		const modules = Classes.getFrameworkModules();
//
//		if (!fs.existsSync(this.diskPath)) {
//			await fs.mkdirSync(this.diskPath, {recursive : true});
//		}
//
//		let fileKeys    = '';
//		let fileModules = '';
//
//		const exportDefinitions = {};
//
//		const cwd = process.cwd();
//
//		for (let modulesKey in modules) {
//			fileKeys += `| "${modulesKey.replace(cwd, '').toString()}" \n   `;
//
//			const filePath = modules[modulesKey].filePath.replace(cwd, '');
//
//			for (let exportName of modules[modulesKey].exportNames) {
//				if (!exportDefinitions[exportName]) {
//					exportDefinitions[exportName] = [];
//				}
//
//				if (!exportDefinitions[exportName].includes(filePath)) {
//					exportDefinitions[exportName].unshift(filePath);
//				}
//			}
//
//			fileModules += `
//	'${filePath}' : {
//		filePath: "${filePath}",
//		directory: "${modules[modulesKey].directory.replace(cwd, '')}",
//		id: "${modules[modulesKey].id}",
//		exportNames: [${modules[modulesKey].exportNames.map(v => `"${v}"`).join(', ')}],
//	},`;
//		}
//
//
//		fileKeys = fileKeys.substr(1, fileKeys.length - 2);
//
//		const file = `
//export interface FrameworkModuleInformation {
//	filePath: string;
//	directory: string;
//	id: string;
//	exportNames: string[];
//}
//
//export interface ResolvedFrameworkModule extends FrameworkModuleInformation {
//	importPaths: string[];
//}
//
//export const getFrameworkModule = (ctor : (new () => any)|Function) : ResolvedFrameworkModule => {
//	const moduleImportPaths = FrameworkModuleExports[ctor.name] || null;
//
//	if(!moduleImportPaths) {
//		return null;
//	}
//
//	const moduleInformation = FrameworkModules[moduleImportPaths[0]] || null;
//
//	if(!moduleInformation) {
//		return null;
//	}
//
//	const cachedModule =  require.cache[moduleInformation.id] ?? null;
//
//	if(!cachedModule) {
//		return null;
//	}
//
//	if(!cachedModule?.exports || !cachedModule?.exports[ctor?.name]) {
//		return null;
//	}
//
//	const nodeModule = cachedModule.exports[ctor.name] ?? null;
//
//	return {
//		...moduleInformation,
//		importPaths : moduleImportPaths,
//		nodeModule  : nodeModule,
//		ctorMatchesModule: nodeModule ? nodeModule === ctor : false,
//	}
//};
//
//export const FrameworkModuleExports: {[key:string]: string[]} = ${JSON.stringify(exportDefinitions, null, 4)};
//
//export const FrameworkModules:{[k in FrameworkModulePaths]: FrameworkModuleInformation}  = {
// ${fileModules}
//};
//
//export type FrameworkModulePaths =
//${fileKeys};
//`;
//
//		await this.disk.write('/FrameworkModules.ts', file);
//	}
//
//	private async handleCaching() {
//		let cacheData: CacheData | null = null;
//
//		if (await this.disk.fileExists('FrameworkModules.cache.json')) {
//			cacheData = JSON.parse(await this.disk.get('FrameworkModules.cache.json')) as CacheData;
//			Log.info('Framework Module Cache > Got cache data: ', cacheData);
//		}
//
//		const totalModules = Object.keys(require.cache).length;
//
//		const updateCache = async () => {
//			let cacheDataSaving = {
//				totalModules : totalModules,
//				lastCache    : DateTime.now().toTime()
//			} as CacheData;
//
//			Log.info('Framework Module Cache > Saving cache data: ', cacheDataSaving);
//
//			await this.disk.write('/FrameworkModules.cache.json', JSON.stringify(cacheDataSaving));
//		};
//
//		if (cacheData === null) {
//			await updateCache();
//
//			Log.info('Framework Module Cache > No cache data stored, storing and running caching.');
//
//			return true;
//		}
//
//
//		const isPollLimited  = DateTime.now().diffInMinutes(DateTime.parse(cacheData.lastCache)) < 2;
//		const hasMoreModules = totalModules > cacheData.totalModules;
//
//		if (!hasMoreModules && isPollLimited) {
//			await updateCache();
//
//			Log.info('Framework Module Cache > Cannot update cache, no additional modules or hasnt been more than 2 minutes');
//
//			return false;
//		}
//
//		await updateCache();
//
//		Log.info('Framework Module Cache > Updating modules');
//
//		return true;
//	}
//}
