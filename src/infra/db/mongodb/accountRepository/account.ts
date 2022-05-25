import { ObjectId } from 'mongodb';
import { AddAccountRepository } from '../../../../data/protocols/db/addAccountRepository';
import { LoadAccountByEmailRepository } from '../../../../data/protocols/db/loadAccountByEmailRepository';
import { UpdateAccessTokenRepository } from '../../../../data/protocols/db/updateAccessTokenRepository';
import { AccountModel } from '../../../../domain/models/account';
import { AddAccountModel } from '../../../../domain/usecase/addAccount';
import { MongoHelper } from '../helper/mongoHelper';

export class AccountMongoRepository
	implements
		AddAccountRepository,
		LoadAccountByEmailRepository,
		UpdateAccessTokenRepository
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

	async updateAccessToken(id: string, token: string): Promise<void> {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.updateOne(
			{ _id: new ObjectId(id) },
			{
				$set: {
					accessToken: token,
				},
			}
		);
	}
}
