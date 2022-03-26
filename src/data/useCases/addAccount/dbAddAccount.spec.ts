import {
	AccountModel,
	AddAccountModel,
	AddAccountRepository,
	Hasher,
} from './dbAddAccountProtocols';
import { DbAddAccount } from './dbAddAccount';

interface SutTypes {
	sut: DbAddAccount;
	hashStub: Hasher;
	addAccountRepositoryStub: AddAccountRepository;
}
const makeFakeAccount = (): AccountModel => ({
	id: 'valid_id',
	name: 'valid_name',
	email: 'valid_email@mail.com',
	password: 'hashed_password',
});

const makeFakeAccountData = (): AddAccountModel => ({
	name: 'valid_name',
	email: 'valid_email',
	password: 'valid_password',
});

const makeHasher = (): Hasher => {
	class HasherStub implements Hasher {
		async encrypt(value: string): Promise<string> {
			return new Promise((resolve) => resolve('hashed_password'));
		}
	}
	return new HasherStub();
};

const makeAddAccountRepository = (): AddAccountRepository => {
	class AddAccountRepositoryStub implements AddAccountRepository {
		async add(accountData: AddAccountModel): Promise<AccountModel> {
			return new Promise((resolve) => resolve(makeFakeAccount()));
		}
	}
	return new AddAccountRepositoryStub();
};

const makeSut = (): SutTypes => {
	const hashStub = makeHasher();
	const addAccountRepositoryStub = makeAddAccountRepository();
	const sut = new DbAddAccount(hashStub, addAccountRepositoryStub);
	return {
		sut,
		hashStub,
		addAccountRepositoryStub,
	};
};

describe('DbAddAccount UseCase', () => {
	test('Should call Hasher with corret password', async () => {
		const { sut, hashStub } = makeSut();
		const encryptSpy = jest.spyOn(hashStub, 'encrypt');

		await sut.add(makeFakeAccountData());
		expect(encryptSpy).toHaveBeenCalledWith('valid_password');
	});

	test('Should throw if Hasher throws', async () => {
		const { sut, hashStub } = makeSut();
		jest.spyOn(hashStub, 'encrypt').mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);

		const promise = sut.add(makeFakeAccountData());
		expect(promise).rejects.toThrow();
	});

	test('Should call AddAccountRepository with correct values', async () => {
		const { sut, addAccountRepositoryStub, hashStub } = makeSut();
		const addSpy = jest.spyOn(addAccountRepositoryStub, 'add');
		await sut.add(makeFakeAccountData());
		expect(addSpy).toHaveBeenCalledWith({
			name: 'valid_name',
			email: 'valid_email',
			password: 'hashed_password',
		});
	});

	test('Should throw if Add throws', async () => {
		const { sut, addAccountRepositoryStub } = makeSut();
		jest.spyOn(addAccountRepositoryStub, 'add').mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const promise = sut.add(makeFakeAccountData());
		expect(promise).rejects.toThrow();
	});

	test('Should return an account on sucess', async () => {
		const { sut } = makeSut();

		const account = await sut.add(makeFakeAccountData());
		expect(account).toEqual(makeFakeAccount());
	});
});
