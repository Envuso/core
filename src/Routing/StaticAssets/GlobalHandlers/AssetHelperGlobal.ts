import path from "path";
import {AssetNotFound} from "../../../Common/Exception/Exceptions/AssetNotFound";
import {AssetManager} from "../AssetManager";

export function assetHelperGlobal(assetDir: string, assetPath: string) {
	return (asset: string) => {
		let relativeAsset = path.join(assetDir, asset);
		if (!AssetManager.hasAssetPath(relativeAsset)) {
			throw new AssetNotFound(assetPath, asset, relativeAsset);
		}
		return relativeAsset;
	};
}
