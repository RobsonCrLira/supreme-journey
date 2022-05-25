import {
	Authentication,
	AuthenticationModel,
	HashComparer,
	LoadAccountByEmailRepository,
	Encrypter,
	UpdateAccessTokenRepository,
} from './dbAuthenticationProtocols';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
		private readonly hashComparer: HashComparer,
		private readonly tokenGenerator: Encrypter,
		private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
		this.hashComparer = hashComparer;
		this.tokenGenerator = tokenGenerator;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	async auth(authentication: AuthenticationModel): Promise<string | null> {
		const account = await this.loadAccountByEmailRepository.loadByEmail(
			authentication.email
		);
		if (account) {
			const isValid = await this.hashComparer.compare(
				authentication.password,
				account.password
			);
			if (isValid) {
				const accessToken = await this.tokenGenerator.encrypt(
					account.id
				);
				await this.updateAccessTokenRepository.updateAccessToken(
					account.id,
					accessToken
				);
				return accessToken;
			}
		}
		return null;
	}
}
