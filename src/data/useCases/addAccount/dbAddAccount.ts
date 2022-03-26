import {
	AccountModel,
	AddAccount,
	AddAccountModel,
	AddAccountRepository,
	Hasher,
} from './dbAddAccountProtocols';

export class DbAddAccount implements AddAccount {
	private readonly hash: Hasher;

	private readonly addAccountRepository: AddAccountRepository;

	constructor(hash: Hasher, addAccountRepository: AddAccountRepository) {
		this.hash = hash;
		this.addAccountRepository = addAccountRepository;
	}

	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const hashedPassword = await this.hash.encrypt(accountData.password);

		const account = await this.addAccountRepository.add({
			...accountData,
			password: hashedPassword,
		});

		return account;
	}
}
