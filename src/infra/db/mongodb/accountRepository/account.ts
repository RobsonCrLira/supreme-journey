import { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/loadAccountByEmailRepository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecase/addAccount';
import { MongoHelper } from '../helper/mongoHelper';

export class AccountMongoRepository
	implements AddAccountRepository, LoadAccountByEmailRepository
{
	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne({ ...accountData });
		return { ...accountData, id: result.insertedId.toHexString() };
	}

	async loadByEmail(email: string): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const account = await accountCollection.findOne({ email });
		return account && MongoHelper.map(account);
	}
}
