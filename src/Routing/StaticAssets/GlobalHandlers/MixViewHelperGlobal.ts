import fs from "fs";
import path from "path";
import {URL} from "url";
import {AssetNotFound} from "../../../Common/Exception/Exceptions/AssetNotFound";
import {AssetManager} from "../AssetManager";

export function mixViewHelperGlobal(assetDir: string, assetPath: string) {
	return (asset: string) => {
		let relativeAsset = path.join(assetDir, asset);

		let hotFileContents = null;
		if (fs.existsSync(path.join(assetPath, 'hot'))) {
			hotFileContents = fs.readFileSync(path.join(assetPath, 'hot'), {encoding : 'utf-8'}).trim();
		}

		let mixManifest = null;
		try {
			mixManifest = JSON.parse(fs.readFileSync(path.join(assetPath, 'mix-manifest.json'), {encoding : 'utf-8'}));
		} catch (error) {
			// Probably a file does not exist error...
		}

		const assetVersionedName = mixManifest[relativeAsset.replace(assetDir, '')] ?? null;
		if (assetVersionedName) {
			if (hotFileContents !== null) {
				return (new URL(assetVersionedName, hotFileContents)).toString();
			}

			return path.join(assetDir, assetVersionedName);
		}

		if (!AssetManager.hasAssetPath(relativeAsset)) {
			throw new AssetNotFound(assetPath, asset, relativeAsset);
		}

		return relativeAsset;

	};
}
