import * as path from "path";
import {ConfigurationCredentials} from "../AppContainer/Config/ConfigurationCredentials";

export default class StaticAssetConfiguration extends ConfigurationCredentials {

	public assetsPath: string = path.join(process.cwd(), 'assets');

}
