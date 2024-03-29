import { Collection, ObjectId } from 'mongodb';
import { MongoHelper } from '../helper/mongoHelper';
import { AccountMongoRepository } from './accountMongoRepository';

let accountCollection: Collection;
describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(`${process.env.MONGO_URL}`);
	});

	beforeEach(async () => {
		accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});

	const makeSut = (): AccountMongoRepository => {
		return new AccountMongoRepository();
	};

	test('Should return an account on add success', async () => {
		const sut = makeSut();
		const account = await sut.add({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@mail.com');
		expect(account.password).toBe('any_password');
	});

	test('Should return an account on LoadByEmail success', async () => {
		const sut = makeSut();
		await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
		const account = await sut.loadByEmail('any_email@mail.com');
		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@mail.com');
		expect(account.password).toBe('any_password');
	});

	test('Should return null if LoadByEmail fails', async () => {
		const sut = makeSut();
		const account = await sut.loadByEmail('any_email@mail.com');
		expect(account).toBeFalsy();
	});

	test('Should update the account accessToken on updateAccessToken sucess', async () => {
		const sut = makeSut();
		const fakeAccount = await accountCollection.insertOne({
			name: 'any_name',
			email: 'any_email@mail.com',
			password: 'any_password',
		});
		await sut.updateAccessToken(
			fakeAccount.insertedId.toString(),
			'any_token'
		);
		const account = await accountCollection.findOne({
			_id: new ObjectId(fakeAccount.insertedId.toHexString()),
		});
		expect(account).toBeTruthy();
		expect(account?.accessToken).toBe('any_token');
	});
});
