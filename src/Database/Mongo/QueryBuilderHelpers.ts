import {ModelAttributesFilter} from "../QueryBuilderTypes";
import {QueryOperator} from "./QueryBuilder";

export class QueryBuilderHelpers {

	public static getMongoAtomicOperators() {
		return [
			"$currentDate",
			"$inc",
			"$min",
			"$max",
			"$mul",
			"$rename",
			"$set",
			"$setOnInsert",
			"$unset",
			"$addToSet",
			"$pop",
			"$pull",
			"$push",
			"$pullAll",
			"$bit",
		];
	}

	/**
	 * Convert a regular comparison operator to mongoDB's version
	 * @param {QueryOperator} operator
	 * @returns {string}
	 */
	public static parseQueryOperator(operator: QueryOperator) {
		switch (operator) {
			case "==":
			case "=":
				return "$eq";
			case "!==":
			case "!=":
			case "<>":
				return "$ne";
			case ">":
				return "$gt";
			case ">=":
				return "$gte";
			case "<":
				return "$lt";
			case "<=":
				return "$lte";
		}
	}

	/**
	 * Update queries in mongo require atomic operators...
	 *
	 * We'll check if any of the mongo atomic operators are defined
	 * in the update query...
	 *
	 * @param attributes
	 * @returns {boolean}
	 */
	public static isUpdateQueryUsingAtomicOperators(attributes: any | ModelAttributesFilter<any>) {
		for (let key of Object.keys(attributes)) {
			if (this.getMongoAtomicOperators().includes(key)) {
				return true;
			}

		}
		return false;
	}

}
