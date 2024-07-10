export class Keys {
	api_key: string;
	short_code: string;
	public_key: string;
	origin: string;
	host: string;

	private constructor(
		api_key: string,
		short_code: string,
		public_key: string,
		origin: string,
		host: string,
	) {
		this.api_key = api_key;
		this.short_code = short_code;
		this.public_key = public_key;
		this.origin = origin;
		this.host = host;
	}

	static from_env_conf(env = "dev"): Keys {
		const _env = Bun.env;

		if (env === "prod") {
			return new Keys(
				_env.PRODUCTION_API_KEY as string,
				_env.PRODUCTION_SHORT_CODE as string,
				_env.PRODUCTION_PUBLIC_KEY as string,
				_env.PRODUCTION_ORIGIN as string,
				_env.PRODUCTION_API_HOST as string,
			);
		}

		return new Keys(
			_env.TEST_API_KEY as string,
			_env.TEST_SHORT_CODE as string,
			_env.TEST_PUBLIC_KEY as string,
			_env.TEST_ORIGIN as string,
			_env.TEST_API_HOST as string,
		);
	}
}
