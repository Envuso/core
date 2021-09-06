import {ResponseContract} from "../../../Contracts/Routing/Context/Response/ResponseContract";
import {InertiaResponse} from "../InertiaResponse";

export interface InertiaPageData {
	props: { [key: string]: any }| Promise<() => { [key: string]: any }>;
	component: string;
	version: string;
	url: string;
}

export interface InertiaRequestContract {

	setSharedData(data: any): InertiaRequestContract;

	share(key: string, value: any): InertiaRequestContract;

	setProps(data: any): InertiaRequestContract;

	setComponent(component: string): InertiaRequestContract;

	setVersion(version: string): InertiaRequestContract;

	constructPage(): InertiaPageData;

	getVersion(): string;

	isInertiaRequest(): boolean;

	getResponse(): InertiaResponse;
}
