import { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecase/addAccount';
import { MongoHelper } from '../helper/mongoHelper';

export class AccountMongoRepository implements AddAccountRepository {
	async add(accountData: AddAccountModel): Promise<AccountModel> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		const result = await accountCollection.insertOne({ ...accountData });
		const account = { ...accountData, id: result.insertedId.toHexString() };
		return account;
	}
}
