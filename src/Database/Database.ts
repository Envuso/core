import {Collection} from "mongodb";
import pluralize from "pluralize";
import {app} from "../AppContainer";
import {Classes, Log} from "../Common";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";


export class Database {

	/**
	 * This will delete your collection and all of it's contents from mongo
	 *
	 * Be careful when running this, we don't want production databases being deleted 😅
	 * ... although, it is one way to wake your self up in the morning.
	 *
	 * @param {{new(): ModelContract<any>} | string} modelOrName
	 * @returns {Promise<any>}
	 */
	public static async dropCollection(modelOrName: (new () => ModelContract<any>) | string): Promise<any> {
		const collection = this.getModelCollectionFromContainer(modelOrName);

		if (!collection) {
			return;
		}

		try {
			await collection.drop();
		} catch (error) {
			if (error?.codeName === 'NamespaceNotFound') {
				Log.info('Collection not dropped. It doesnt exist.');
			} else {
				throw error;
			}
		}
	}

	/**
	 * Get the collection name formatting that we use for the mongodb collection
	 *
	 * @param {{new(): ModelContract<any>} | ModelContract<any> | string} key
	 * @returns {string}
	 */
	public static getModelCollectionName(key: (new () => ModelContract<any>) | ModelContract<any> | string): string {
		if (typeof key === 'string') {
			return pluralize(key.toLowerCase());
		}
		return pluralize(Classes.getConstructorName(key).toLowerCase());
	}

	/**
	 * Attempt to resolve the model instance from the container
	 * either using a model instance or it's collection name
	 *
	 * @param {{new(): ModelContract<T>} | string} key
	 * @returns {{new(): ModelContract<T>}}
	 */
	public static getModelFromContainer<T>(key: (new () => ModelContract<T>) | string): new () => ModelContract<T> {
		const collectionName = this.getModelCollectionName(key);

		if (!app().container().isRegistered(`Model:${collectionName}`)) {
			Log.warn(`Attempting to resolve model from container in getModelFromContainer method but model does not exist in the container.`);
			Log.warn(`Accessing container via token "Model:${collectionName}"`);
			Log.warn(`Key used to get collection name: ${key}`);

			return null;
		}

		return app().resolve<new () => ModelContract<T>>(`Model:${collectionName}`);
	}

	/**
	 * This uses the constructor name of your model.
	 *
	 * For a model defined as "Users", the key will be "Users".
	 *
	 * @param {string} key
	 *
	 * @returns {string[]}
	 */
	public static getModelFieldsFromContainer(key: string): string[] {
		return app().resolve<string[]>(`Model:Fields:${key}`);
	}

	/**
	 * Get the mongo db driver collection instance for a model instance or by name
	 *
	 * @param {{new(): ModelContract<T>} | string} key
	 * @returns {Collection<T>}
	 */
	public static getModelCollectionFromContainer<T>(key: (new () => ModelContract<T>) | string): Collection<T> {
		const modelInst = this.getModelFromContainer(key);

		if (!modelInst) {
			return;
		}

		return new modelInst().collection();
	}


}
