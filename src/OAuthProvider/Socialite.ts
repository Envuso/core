import {config} from "../AppContainer";
import {Classes} from "../Common";
import {BaseOAuthProvider, OAuthProviderConfiguration} from "./BaseOAuthProvider";
import {TwitchOauthProvider} from "./Providers/OAuth2/TwitchOauthProvider";

export type BaseSocialiteDriverNames = 'twitch';
export type SocialiteDriverAccessor = string | BaseSocialiteDriverNames;

export class SocialiteManager {

	private _drivers: Map<string, BaseOAuthProvider> = new Map();

	createDrivers() {
		const baseDrivers = [
			this.buildProvider('twitch', TwitchOauthProvider),
		];

		for (let driver of baseDrivers) {
			this._drivers.set(driver.service, driver);
		}
	}

	driver(driverName: SocialiteDriverAccessor): BaseOAuthProvider {
		const baseDriver = this._drivers.get(driverName);
		if (!baseDriver) {
			return null;
		}

		const driverCtor = Classes.getConstructor<BaseOAuthProvider>(baseDriver);

		return new driverCtor(baseDriver.config, baseDriver.service);
	}

	register(driverName: SocialiteDriverAccessor, driver: new (...args: any[]) => BaseOAuthProvider) {
		this._drivers.set(driverName, this.buildProvider(driverName, driver));

		return this;
	}

	buildProvider(driverName: string, provider: (new (...args: any[]) => BaseOAuthProvider), providerConfig?: OAuthProviderConfiguration) {
		if (!providerConfig) {
			providerConfig = config('services.' + driverName);
		}
		const prov = new provider(providerConfig, driverName);

		return (prov?.build ? prov.build(providerConfig) : prov).setConfig(providerConfig);
	}

}

export const Socialite = new SocialiteManager();
