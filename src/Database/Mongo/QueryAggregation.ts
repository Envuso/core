import {FindOptions} from "mongodb";
import {QueryBuilderParts} from "./QueryBuilderParts";
import _ from 'lodash';

export class QueryAggregation<T> {

	public aggregations = [];

	constructor(model: any) {

	}

	/**
	 * Attempt to apply all possible FindOptions to this aggregation query
	 *
	 * @param {FindOptions<T>} options
	 * @returns {this<T>}
	 */
	public addQueryOptions(options: FindOptions<T>): QueryAggregation<T> {
		if (options?.limit) {
			this.aggregations.push({$limit : options.limit});
		}

		if (options?.sort) {
			this.aggregations.push({$sort : options.sort});
		}

		if (options?.skip) {
			this.aggregations.push({$skip : options.skip});
		}

		return this;
	}

	lookupWithSubPipeline(
		from: string,
		localField: string,
		foreignField: string,
		as: string,
		isArrayLookup: boolean,
		pipeline: { [key: string]: any }[]
	) {
		const localLetVar = localField
			.replace(/_/, '')
			.replace(/\./, '');

		const expression = isArrayLookup
			? {$in : [`$${foreignField}`, `$$${localLetVar}`]}
			: {$eq : [`$$${localLetVar}`, `$${foreignField}`]};

		this.aggregations.push({
			$lookup : {
				from, as,
				let      : {[localLetVar] : `$${localField}`},
				pipeline : [
					{$match : {$expr : expression}},
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

	public setFilterQuery(filter: QueryBuilderParts<T>): QueryAggregation<T> {

		/**
		 * $geoNear queries always need to be the first query to run in a pipeline
		 *
		 * When we call this method when we run .get()/.first(), it will also apply any
		 * .where() filters to this pipeline, so you don't have to go through the builder.
		 *
		 * This means our .where() filters can't always be set at the first index.
		 */
		if (this.aggregations.find((val, index) => val?.$geoNear !== undefined)) {
			this.aggregations.splice(1, 0, {$match : filter.getQueryAsFilter()});

			return this;
		}

		this.aggregations.unshift({$match : filter.getQueryAsFilter()});

		return this;
	}

	public addGeoNear(query: GeoNearAggregation): QueryAggregation<T> {
		if (!query?.near) {
			throw new Error('Near is not specified on geo near aggregation');
		}

		this.aggregations.unshift({$geoNear : query});

		return this;
	}

	public addAggregation(aggregation: any): QueryAggregation<T> {
		this.aggregations.push(aggregation);

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

export type GeoPoint = {
	type: 'Point';
	coordinates: number[] | number[][];
}

export type GeoNearAggregation = {
	distanceField?: string;
	distanceMultiplier?: number;
	includeLocs?: string,
	key?: string;
	maxDistance?: number,
	minDistance?: number,
	near: GeoPoint,
	spherical?: boolean,
	uniqueDocs?: boolean,
}
