import {
	Authentication,
	AuthenticationModel,
} from '../../../domain/usecase/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../protocols/db/updateAccessTokenRepository';
import { HashComparer } from '../../protocols/encrypter/hashComparer';
import { TokenGenerator } from '../../protocols/encrypter/tokenGenerator';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
		private readonly hashComparer: HashComparer,
		private readonly tokenGenerator: TokenGenerator,
		private readonly updateAccessTokenRepository: UpdateAccessTokenRepository
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
		this.hashComparer = hashComparer;
		this.tokenGenerator = tokenGenerator;
		this.updateAccessTokenRepository = updateAccessTokenRepository;
	}

	async auth(authentication: AuthenticationModel): Promise<string | null> {
		const account = await this.loadAccountByEmailRepository.load(
			authentication.email
		);
		if (account) {
			const isValid = await this.hashComparer.compare(
				authentication.password,
				account.password
			);
			if (isValid) {
				const accessToken = await this.tokenGenerator.generate(
					account.id
				);
				await this.updateAccessTokenRepository.update(
					account.id,
					accessToken
				);
				return accessToken;
			}
		}
		return null;
	}
}
