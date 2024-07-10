import * as crypto from "node:crypto";

export const CryptoUtils = {
	get_bearer_token(publicKey: string, apiKey: string): string {
		const publicKeyFormatted = `-----BEGIN PUBLIC KEY-----\n${publicKey}\n-----END PUBLIC KEY-----`;
		const bufferPublicKey = Buffer.from(publicKeyFormatted, "utf8");
		const encrypted = crypto.publicEncrypt(
			{
				key: bufferPublicKey,
				padding: crypto.constants.RSA_PKCS1_PADDING,
			},
			Buffer.from(apiKey, "utf8"),
		);

		return `Bearer ${encrypted.toString("base64")}`;
	},
};
