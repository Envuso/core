import crypto from "crypto";
import type {EncryptionContract} from "../Contracts/Crypt/EncryptionContract";

/**
 * Authenticated encryption (AES-256-GCM) with a key derived from the app key.
 *
 * Output: "v1." + base64url(iv | auth tag | ciphertext). Tampering with any part makes
 * decrypt() throw. An optional `context` (e.g. "cookie:session") is authenticated too,
 * so a value encrypted for one purpose can't be replayed as another.
 *
 * Replaces the CryptoJS-based SimpleCrypto (one key for AES and HMAC, non-constant-time
 * MAC check, 100 PBKDF2 iterations) and Rabbit (no integrity at all) from 2.x; values
 * encrypted by 2.x can't be decrypted.
 */
export class Encryption implements EncryptionContract {
	private static instance: Encryption = null;

	private static readonly VERSION = 'v1';

	public key: string;

	private readonly encryptionKey: Buffer;

	constructor(key: string, customInstance: boolean = false) {
		if (!customInstance && Encryption.instance) {
			return Encryption.instance;
		}

		this.key           = key;
		// HKDF: a separate subkey per purpose instead of using the app key (which also signs JWTs) directly
		this.encryptionKey = Buffer.from(crypto.hkdfSync('sha256', key, 'envuso', 'encryption:aes-256-gcm', 32));

		if (!customInstance) {
			Encryption.instance = this;
		}
	}

	/**
	 * Encrypt any JSON-serialisable value
	 *
	 * @param content
	 * @param context | optional purpose this value is bound to; pass the same one to decrypt()
	 */
	public encrypt(content: any, context: string = ''): string {
		const iv     = crypto.randomBytes(12);
		const cipher = crypto.createCipheriv('aes-256-gcm', this.encryptionKey, iv);
		cipher.setAAD(Buffer.from(context));

		const ciphertext = Buffer.concat([cipher.update(JSON.stringify({v : content}), 'utf8'), cipher.final()]);
		const payload    = Buffer.concat([iv, cipher.getAuthTag(), ciphertext]);

		return `${Encryption.VERSION}.${payload.toString('base64url')}`;
	}

	public static encrypt(content: any, context: string = ''): string {
		return Encryption.getInstance().encrypt(content, context);
	}

	/**
	 * Decrypt a value from encrypt(). Throws if it was tampered with, encrypted with
	 * another key or context, or isn't an encrypted value.
	 */
	public decrypt<T = any>(content: string, context: string = ''): T {
		if (typeof content !== 'string' || !content.startsWith(Encryption.VERSION + '.')) {
			throw new Error('Encryption: not an encrypted value.');
		}

		const payload = Buffer.from(content.slice(Encryption.VERSION.length + 1), 'base64url');
		if (payload.length < 12 + 16) {
			throw new Error('Encryption: not an encrypted value.');
		}

		const decipher = crypto.createDecipheriv('aes-256-gcm', this.encryptionKey, payload.subarray(0, 12));
		decipher.setAAD(Buffer.from(context));
		decipher.setAuthTag(payload.subarray(12, 28));

		const plaintext = Buffer.concat([decipher.update(payload.subarray(28)), decipher.final()]).toString('utf8');

		return JSON.parse(plaintext).v as T;
	}

	public static decrypt<T = any>(content: string, context: string = ''): T {
		return Encryption.getInstance().decrypt<T>(content, context);
	}

	/**
	 * Like decrypt(), but null instead of throwing
	 */
	public tryDecrypt<T = any>(content: string, context: string = ''): T | null {
		try {
			return this.decrypt<T>(content, context);
		} catch {
			return null;
		}
	}

	public static tryDecrypt<T = any>(content: string, context: string = ''): T | null {
		return Encryption.getInstance().tryDecrypt<T>(content, context);
	}

	/**
	 * A random hex string, from crypto
	 */
	public random(length: number = 128): string {
		return crypto.randomBytes(Math.ceil(length / 2)).toString('hex').slice(0, length);
	}

	public static random(length?: number): string {
		return Encryption.getInstance().random(length);
	}

	public static getKey(): string {
		return Encryption.getInstance().key;
	}

	public getKey(): string {
		return this.key;
	}

	/**
	 * Make this the instance used by the static methods (EncryptionServiceProvider does this on boot)
	 */
	public static use(instance: Encryption): Encryption {
		Encryption.instance = instance;

		return instance;
	}

	public static getInstance(): Encryption {
		if (!Encryption.instance) {
			throw new Error('Encryption is not set up yet: EncryptionServiceProvider registers it with the app key.');
		}

		return Encryption.instance;
	}

	/**
	 * Create a new instance with a custom key
	 */
	public newInstance(key: string): EncryptionContract {
		return new Encryption(key, true);
	}

}
