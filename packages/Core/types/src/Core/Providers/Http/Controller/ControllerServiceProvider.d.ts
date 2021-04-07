import { interfaces } from "inversify";
import { ServiceProvider } from "@Providers/ServiceProvider";
import { HttpContext } from "../Context/HttpContext";
import { Controller } from "./Controller";
export declare class ControllerServiceProvider extends ServiceProvider {
    registerBindings(): void;
    boot(): void;
    bindContextToContainer(container: interfaces.Container, context?: HttpContext): void;
    private loadController;
    allControllers(): Controller[];
}
