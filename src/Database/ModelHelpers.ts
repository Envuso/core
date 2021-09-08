import pluralize from "pluralize";
import {app} from "../AppContainer";
import {Classes, Log} from "../Common";
import {ModelContract} from "../Contracts/Database/Mongo/ModelContract";

export const getModelCollectionName = (key: (new () => ModelContract<any>) | ModelContract<any> | string): string => {
	if (typeof key === 'string') {
		return pluralize(key.toLowerCase());
	}
	return pluralize(Classes.getConstructorName(key).toLowerCase());
};

export const getModelFromContainer = <T>(key: (new () => ModelContract<T>) | string): new () => ModelContract<T> => {
	const collectionName = getModelCollectionName(key);

	if (!app().container().isRegistered(`Model:${collectionName}`)) {
		Log.warn(`Attempting to resolve model from container in getModelFromContainer method but model does not exist in the container.`);
		Log.warn(`Accessing container via token "Model:${collectionName}"`);
		Log.warn(`Key used to get collection name: ${key}`);

		return null;
	}

	return app().resolve<new () => ModelContract<T>>(`Model:${collectionName}`);
};
