import {StatusCodes} from "../../Http";
import {Exception} from "../Exception";

export class AssetNotFound extends Exception {
	constructor(assetPath: string, asset: string, relativeAsset: string) {
		const errorSections = [
			`The asset ${asset} that you're trying to load does not exist in your assets directory(${assetPath}).`,
			`This is what we're looking for: ${relativeAsset}.`,
			`Did you build your assets? Did you also restart the server?`,
		];

		super(errorSections.join('\n'), StatusCodes.NOT_FOUND);
	}
}
