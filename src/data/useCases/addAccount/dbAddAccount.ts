import {
	AccountModel,
	AddAccount,
	AddAccountModel,
	AddAccountRepository,
	Hasher,
} from './dbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
	constructor(
		private readonly hash: Hasher,
		private readonly addAccountRepository: AddAccountRepository
	) {}

	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const hashedPassword = await this.hash.hash(accountData.password);

		const account = await this.addAccountRepository.add({
			...accountData,
			password: hashedPassword,
		});

		return account;
	}
}
