export interface OAuthUserContract {
	getId(): string;

	getUsername(): string;

	getName(): string | null;

	getEmail(): string | null;

	getAvatar(): string | null;
}

export type MapOAuthUserAttributes = {
	id: string | null;
	username: string | null;
	name: string | null;
	email: string | null;
	avatar: string | null;
}

export class AbstractOAuthUser implements OAuthUserContract {
	protected id: string       = null;
	protected username: string = null;
	protected name: string     = null;
	protected email: string    = null;
	protected avatar: string   = null;

	public raw: any = {};

	public getId(): string {
		return this.id;
	}

	public getAvatar(): string | null {
		return this.avatar;
	}

	public getEmail(): string | null {
		return this.email;
	}

	public getName(): string | null {
		return this.name;
	}

	public getUsername(): string {
		return this.username;
	}

	public setRaw(user: any) {
		this.raw = user;

		return this;
	}

	public map(attributes: MapOAuthUserAttributes) {
		this.id       = attributes.id;
		this.username = attributes.username;
		this.name     = attributes.name;
		this.email    = attributes.email;
		this.avatar   = attributes.avatar;

		return this;
	}

}
