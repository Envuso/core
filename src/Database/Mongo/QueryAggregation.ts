import {QueryBuilderParts} from "./QueryBuilderParts";

export class QueryAggregation<T> {

	private aggregations = [];

	constructor(model: any) {

	}

	lookup(
		from: string,
		localField: string,
		foreignField: string,
		as: string,
	): QueryAggregation<T> {
		this.aggregations.push({
			$lookup : {
				from,
				localField,
				foreignField,
				as,
			}
		});

		return this;
	}

	addArrayValueFirstField(fieldName: string, arrayKeyName: string): QueryAggregation<T> {
		this.aggregations.push({
			$addFields : {
				[fieldName] : {
					'$first' : `$${arrayKeyName}`
				}
			}
		});

		return this;
	}

	public setFilterQuery(filter: QueryBuilderParts<T>): QueryAggregation<T> {
		this.aggregations.unshift({$match : filter.getQueryAsFilter()});

		return this;
	}

	getQuery() {
		return this.aggregations;
	}

	hasAggregations(): boolean {
		return !!this.aggregations?.length;
	}

	cleanup() {
		this.aggregations = [];
	}

}