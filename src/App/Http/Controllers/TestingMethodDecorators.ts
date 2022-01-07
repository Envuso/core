import {headers, param, redirect, request, response, view} from "../../../Routing";
import {Controller} from "../../../Routing/Controller/Controller";
import {controller, get, method, post} from "../../../Routing/Controller/ControllerDecorators";

@controller('/testing/method-decorator')
export class TestingMethodDecorators extends Controller {

	@get('/param/single/:first')
	async singleParam(@param first: string) {
		return {first};
	}

	@get('/param/multiple/:first/:second')
	async multipleParam(@param first: string, @param second: string) {
		return {first, second};
	}

	@get('/params/:first/:second')
	async methods(@param first: string, @param second: string) {
		return {
			first  : {
				get : request().params().get('first'),
				has : request().params().has('first'),
			},
			second : {
				get : request().params().get('second'),
				has : request().params().has('second'),
			},
			all    : request().params().all(),
			keys   : request().params().keys(),
			values : request().params().values(),
		};
	}

}
