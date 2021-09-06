import {FastifyRequest} from "fastify";
import {Obj} from "../../Common";
import {RequestContextContract} from "../../Contracts/Routing/Context/RequestContextContract";
import {InertiaPageData, InertiaRequestContract} from "./Contracts/InertiaRequestContract";
import {InertiaResponse} from "./InertiaResponse";


export class InertiaRequest implements InertiaRequestContract {
	constructor(public context: RequestContextContract, public request: FastifyRequest) { }

	private sharedData: { [key: string]: any } = {};
	private version: string                    = "1";
	private props: any                         = {};
	private component: string                  = "";

	public setSharedData(data: any): InertiaRequestContract {
		this.sharedData = data;

		return this;
	}

	public share(key: string, value: any): InertiaRequestContract {
		this.sharedData[key] = value;

		return this;
	}

	public setProps(data: any): InertiaRequestContract {
		this.props = data;

		return this;
	}

	public setComponent(component: string): InertiaRequestContract {
		this.component = component;

		return this;
	}

	public setVersion(version: string): InertiaRequestContract {
		this.version = version;

		return this;
	}

	public getVersion(): string {
		return this.version;
	}

	public constructPage(): InertiaPageData {
		let props = {
			...this.sharedData,
			...this.props,
		};


		if (this.isPartialReload()) {
			const partialHeader = this.context.request.getHeader<string>('x-inertia-partial-data', '');
			//			props = Obj.map(props, (value) => (typeof value === 'function' ? value() : value));
			const partialProps  = Obj.only(props, partialHeader.split(','));

			props = async () => {
				const propsObject = {};

				for (let key in partialProps) {
					const t          = typeof partialProps[key];
					propsObject[key] = typeof partialProps[key] === 'function'
						? (await partialProps[key]())
						: partialProps[key];
				}

				return propsObject;
			};
		} else {
			props = Obj.filter(props, value => typeof value !== 'function');
		}

		return {
			props     : props,
			component : this.component,
			version   : this.version,
			url       : this.context.request.path()
		};
	}

	public isInertiaRequest(): boolean {
		return this.context.request.hasHeader('x-inertia');
	}

	public isPartialReload(): boolean {
		return this.isInertiaRequest() &&
			this.context.request.hasHeader('x-inertia-partial-data') &&
			this.context.request.hasHeader('x-inertia-partial-component') &&
			this.context.request.getHeader('x-inertia-partial-component') === this.component;
	}

	public getResponse(): InertiaResponse {
		const response = new InertiaResponse().setResponse(this.constructPage());

		if (this.isInertiaRequest()) {
			this.context.response.setHeader('x-inertia', true);
			this.context.response.setHeader('content-type', 'application/json');
			this.context.response.setHeader('vary', true);

			return response.asJson();
		}

		return response.asView();
	}
}
