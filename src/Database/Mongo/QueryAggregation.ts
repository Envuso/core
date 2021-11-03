import {QueryBuilderParts} from "./QueryBuilderParts";
import _ from 'lodash';

export class QueryAggregation<T> {

	private aggregations = [];

	constructor(model: any) {

	}

	lookupWithSubPipeline(
		from: string,
		localField: string,
		foreignField: string,
		as: string,
		pipeline: { [key: string]: any }[]
	) {
		const localLetVar = localField
			.replace(/_/, '')
			.replace(/\./, '');

		this.aggregations.push({
			$lookup : {
				from, as,
				let      : {[localLetVar] : `$${localField}`},
				pipeline : [
					{$match : {$expr : {$eq : [`$$${localLetVar}`, `$${foreignField}`]}}},
					...pipeline
				],
			}
		});

		return this;
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

	sample(size: number): QueryAggregation<T> {
		this.aggregations.push({$sample : {size}});

		return this;
	}

	addFields(key: string, fieldsQ: { [key: string]: any }) {
		this.aggregations.push({
			$addFields : {[key] : fieldsQ}
		});

		return this;
	}

	match(filter: QueryBuilderParts<T> | { [key: string]: any }): QueryAggregation<T> {

		if (filter instanceof QueryBuilderParts) {
			filter = filter.getQueryAsFilter();
		}

		this.aggregations.push({$match : filter});

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

	public setFilterQuery(filter: QueryBuilderParts<T>, limit: number = null): QueryAggregation<T> {
		this.aggregations.unshift({$match : filter.getQueryAsFilter()});

		if (limit) {
			this.aggregations.push({$limit : limit});
		}

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
