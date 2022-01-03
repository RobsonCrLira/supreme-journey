import { MongoHelper } from '../helper/mongoHelper';
import { AccountMongoRepository } from './account';

describe('Account Mongo Repository', () => {
	beforeAll(async () => {
		await MongoHelper.connect(`${process.env.MONGO_URL}`);
	});

	beforeEach(async () => {
		const accountCollection = await MongoHelper.getCollection('accounts');
		await accountCollection.deleteMany({});
	});

	afterAll(async () => {
		await MongoHelper.disconnect();
	});
	const makeSut = (): AccountMongoRepository => {
		return new AccountMongoRepository();
	};
	test('Should return an account on success', async () => {
		const sut = makeSut();
		const account = await sut.add({
			name: 'any_name',
			email: 'any_email@email.com',
			password: 'any_password',
		});
		expect(account).toBeTruthy();
		expect(account.id).toBeTruthy();
		expect(account.name).toBe('any_name');
		expect(account.email).toBe('any_email@email.com');
		expect(account.password).toBe('any_password');
	});
});
