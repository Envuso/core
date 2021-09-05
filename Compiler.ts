import {ConfigMetaGenerator, PrepareCompilerTask, ControllerMetaGenerator, ModuleMetaGenerator, Program} from '@envuso/compiler';

async function build() {
	await Program.loadConfiguration();
	await Program.setup([
		PrepareCompilerTask,
		ConfigMetaGenerator,
		ControllerMetaGenerator,
		ModuleMetaGenerator,
	]);
	await Program.run(true);
}

build();//.then(() => console.log('>>>>>>> All done.'));

//async function run() {
//	//	const project = await createProject({
//	//		tsConfigFilePath : './tsconfig.json',
//	//		/*resolutionHost : (moduleResolutionHost, getCompilerOptions) => {
//	//		 return {
//	//		 resolveModuleNames : (moduleNames, containingFile) => {
//	//		 const compilerOptions                      = getCompilerOptions();
//	//		 const resolvedModules: ts.ResolvedModule[] = [];
//	//
//	//		 //					for (const moduleName of moduleNames.map(removeTsExtension)) {
//	//		 //						const result = ts.resolveModuleName(
//	//		 //							moduleName,
//	//		 //							containingFile,
//	//		 //							compilerOptions,
//	//		 //							moduleResolutionHost,
//	//		 //						);
//	//		 //
//	//		 //						if (result.resolvedModule)
//	//		 //							resolvedModules.push(result.resolvedModule);
//	//		 //					}
//	//
//	//		 return moduleNames;
//	//		 },
//	//		 };
//	//
//	//		 function removeTsExtension(moduleName: string) {
//	//		 if (moduleName.slice(-3).toLowerCase() === ".ts")
//	//		 return moduleName.slice(0, -3);
//	//		 return moduleName;
//	//		 }
//	//		 },*/
//	//	});
//
//	const project = new Project({
//		tsConfigFilePath : './tsconfig.json'
//	});
//
//	//	const testSourceFiles = project.getSourceFiles();
//
//	const sourceFiles = await project.addSourceFilesAtPaths('./src/App/Http/Controllers/**/*.ts');
//
//	const controllerMeta = [];
//	for (let sourceFile of sourceFiles) {
//
//		const statements = sourceFile.getStatements();
//
//		const imports          = statements.filter(s => ts.isImportDeclaration(s.compilerNode));
//		const statementClasses = statements.filter(s => ts.isClassDeclaration(s.compilerNode));
//
//		for (let c of statementClasses) {
//			let controllerClass: ClassDeclaration = c.asKindOrThrow(SyntaxKind.ClassDeclaration);
//
//			if (!controllerClass.getName().includes('Controller')) {
//				continue;
//			}
//
//			controllerMeta.push({
//				imports    : imports,//statements.filter(s => s.kind === StructureKind.ImportDeclaration),
//				name       : controllerClass.getName(),
//				methods    : controllerClass.getMethods().map(method => {
//					return {
//						name       : method.getName(),
//						parameters : method.getParameters().map(p => ({
//							name : p.getName(),
//							type : p.getType().compilerType?.symbol?.getName()
//						})),
//						decorators : method.getDecorators().map(d => ({
//							name  : d.getName(),
//							param : d.getArguments().map(a => a.getFullText())
//						}))
//					};
//				}),
//				decorators : controllerClass.getDecorators().map(d => ({
//					name  : d.getName(),
//					param : d.getArguments().map(a => a.getFullText())
//				}))
//			});
//		}
//
//		//		const source = sourceFile.getStructure();
//		/*controllerClass.decorators.map(d => ({
//		 name  : d.name,
//		 param : d.arguments[0]
//		 }))*/
//		//@ts-ignore
//		//		const controllerClass: ClassDeclarationStructure = statements.find(
//		//			c => c.kind === StructureKind.Class && c.name.includes('Controller')
//		//		);
//		//		const controller = {
//		//			imports    : statements.filter(s => s.kind === StructureKind.ImportDeclaration),
//		//			name       : controllerClass.name,
//		//			methods    : [],
//		//			decorators : controllerClass.decorators.map(d => ({
//		//				name  : d.name,
//		//				param : d.arguments[0]
//		//			}))
//		//		};
//
//
//		/*for (let method of controllerClass.methods) {
//		 const decorators = method.decorators.map(decorator => ({
//		 name      : decorator.name,
//		 data      : decorator.arguments[0],
//		 decorator : decorator
//		 }));
//		 controller.methods.push({
//		 name       : method.name,
//		 decorators : decorators,
//		 parameters : method.parameters.map(p => ({
//		 name : p.name,
//		 type : p.type,
//		 })),
//		 method     : decorators
//		 .filter(d => ['get', 'post', 'push', 'put', 'destroy', 'remove', '_delete'].includes(d.name))
//		 });
//		 }*/
//
//		//		controllerMeta.push(controller);
//
//	}
//
//	debugger;
//	//	for (let sourceFile of sourceFiles) {
//	//
//	//		const source = sourceFile.getStructure();
//	//
//	//		const fileImports = sourceFile.statements
//	//			.filter(m => m.kind === SyntaxKind.ImportDeclaration)
//	//			.map((m: ts.ImportDeclaration) => {
//	//				return {
//	//					names : (<ts.NamedImports>m.importClause.namedBindings).elements.map(f => f.name.text),
//	//					path  : (m.moduleSpecifier)
//	//				};
//	//			});
//	//
//	//		for (let statement of sourceFile.statements) {
//	//			if (statement.kind !== SyntaxKind.ClassDeclaration) {
//	//				continue;
//	//			}
//	//
//	//			if (!ts.isClassDeclaration(statement) || !statement.name.getText().includes('Controller')) {
//	//				continue;
//	//			}
//	//
//	//			const controller = {
//	//				name    : statement.name.escapedText,
//	//				methods : [],
//	//				imports : fileImports
//	//			};
//	//
//	//			statement.forEachChild(child => {
//	//				if (!ts.isMethodDeclaration(child)) {
//	//					return;
//	//				}
//	//
//	//				controller.methods.push({
//	//					name       : child.name.getText(),
//	//					decorators : child.decorators.map(d => {
//	//						return d.expression.getText();
//	//					}),
//	//					params     : child.parameters.map(p => {
//	//						//@ts-ignore
//	//						const defs = p.getDefinitions();
//	//						return {
//	//							name   : p.name.getText(),
//	//							type   : p.type.getText(),
//	//							import : p.type.getSourceFile().moduleName,
//	//
//	//						};
//	//					})
//	//
//	//				});
//	//			});
//	//
//	//			controllerMeta.push(controller);
//	//		}
//	//	}
//
//	//	project.addSourceFilesFromTsConfig("./tsconfig.json");
//	//	project.createSourceFile("test.ts", "const t: string = 5;");
//
//	//	const program = project.createProgram();
//
//	//	const diagnostics = ts.getPreEmitDiagnostics(project.createProgram());
//	//
//	//	const diag = project.formatDiagnosticsWithColorAndContext(diagnostics);
//	//
//	//	console.log(diag);
//}
//
//run();
