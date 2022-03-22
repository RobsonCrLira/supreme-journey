import {
	Authentication,
	AuthenticationModel,
} from '../../../domain/usecase/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository';

export class DbAuthentication implements Authentication {
	constructor(
		private readonly loadAccountByEmailRepository: LoadAccountByEmailRepository
	) {
		this.loadAccountByEmailRepository = loadAccountByEmailRepository;
	}

	async auth(authentication: AuthenticationModel): Promise<string | null> {
		await this.loadAccountByEmailRepository.load(authentication.email);
		return null;
	}
}
