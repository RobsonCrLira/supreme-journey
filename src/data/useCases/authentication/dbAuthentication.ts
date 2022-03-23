import {
	Authentication,
	AuthenticationModel,
} from '../../../domain/usecase/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository';
import { HashComparer } from '../../protocols/encrypter/hashComparer';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository,
		private readonly hashComparer: HashComparer
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
		this.hashComparer = hashComparer;
	}

	async auth(authentication: AuthenticationModel): Promise<string | null> {
		const account = await this.loadAccountByEmailRepository.load(
			authentication.email
		);
		if (account) {
			await this.hashComparer.compare(
				authentication.password,
				account.password
			);
		}
		return null;
	}
}
