import { interfaces } from "inversify";
import { HttpContext, ServiceProvider } from "Core";
import { Controller } from "./Controller";
export declare class ControllerServiceProvider extends ServiceProvider {
    registerBindings(): void;
    boot(): void;
    bindContextToContainer(container: interfaces.Container, context?: HttpContext): void;
    private loadController;
    allControllers(): Controller[];
}
