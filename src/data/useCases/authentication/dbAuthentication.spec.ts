import { AuthenticationModel } from '../../../domain/usecase/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository';
import { HashComparer } from '../../protocols/encrypter/hashComparer';
import { TokenGenerator } from '../../protocols/encrypter/tokenGenerator';
import { AccountModel } from '../addAccount/dbAddAccountProtocols';
import { DbAuthentication } from './dbAuthentication';

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
	hashComparerStub: HashComparer;
	tokenGeneratorStub: TokenGenerator;
}

const makeFakeAccount = (): AccountModel => ({
	id: 'any_id',
	name: 'any_name',
	email: 'any_email@mail.com',
	password: 'hashedPassword',
});

const makeFakeAuthentication = (): AuthenticationModel => ({
	email: 'any_email@mail.com',
	password: 'any_password',
});

const makeLoadAccountByEmailRepository = (): LoadAccountByEmailRepository => {
	class LoadAccountByEmailRepositoryStub
		implements LoadAccountByEmailRepository
	{
		async load(email: string): Promise<AccountModel | null> {
			return new Promise((resolve) => resolve(makeFakeAccount()));
		}
	}
	return new LoadAccountByEmailRepositoryStub();
};

const makeHashComparer = (): HashComparer => {
	class HashComparerStub implements HashComparer {
		async compare(value: string, hash: string): Promise<boolean> {
			return new Promise((resolve) => resolve(true));
		}
	}
	return new HashComparerStub();
};

const makeTokenGenerator = (): TokenGenerator => {
	class TokenGeneratorStub implements TokenGenerator {
		async generate(id: string): Promise<string> {
			return new Promise((resolve) => resolve('any_token'));
		}
	}
	return new TokenGeneratorStub();
};

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const hashComparerStub = makeHashComparer();
	const tokenGeneratorStub = makeTokenGenerator();
	const sut = new DbAuthentication(
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		tokenGeneratorStub
	);
	return {
		sut,
		loadAccountByEmailRepositoryStub,
		hashComparerStub,
		tokenGeneratorStub,
	};
};

describe('DbAuthentication UseCase', () => {
	test('Should call LoadAccountByEmailRepository with correct email', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		const loadSpy = jest.spyOn(loadAccountByEmailRepositoryStub, 'load');
		await sut.auth(makeFakeAuthentication());
		expect(loadSpy).toHaveBeenCalledWith('any_email@mail.com');
	});

	test('Should throw if LoadAccountByEmailRepository throws', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest.spyOn(
			loadAccountByEmailRepositoryStub,
			'load'
		).mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const promise = sut.auth(makeFakeAuthentication());
		await expect(promise).rejects.toThrow();
	});

	test('Should return null if LoadAccountByEmailRepository return null', async () => {
		const { sut, loadAccountByEmailRepositoryStub } = makeSut();
		jest.spyOn(
			loadAccountByEmailRepositoryStub,
			'load'
		).mockReturnValueOnce(new Promise((resolve) => resolve(null)));
		const accessToken = await sut.auth(makeFakeAuthentication());
		expect(accessToken).toBeNull();
	});

	test('Should call HashComparer with correct password', async () => {
		const { sut, hashComparerStub } = makeSut();
		const compareSpy = jest.spyOn(hashComparerStub, 'compare');
		await sut.auth(makeFakeAuthentication());
		expect(compareSpy).toHaveBeenCalledWith(
			'any_password',
			'hashedPassword'
		);
	});

	test('Should throw if HashComparer throws', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const promise = sut.auth(makeFakeAuthentication());
		expect(promise).rejects.toThrow();
	});

	test('Should return null if HashComparer return false', async () => {
		const { sut, hashComparerStub } = makeSut();
		jest.spyOn(hashComparerStub, 'compare').mockReturnValueOnce(
			new Promise((resolve) => resolve(false))
		);
		const accessToken = await sut.auth(makeFakeAuthentication());
		expect(accessToken).toBeNull();
	});

	test('Should call TokenGenerator with correct id', async () => {
		const { sut, tokenGeneratorStub } = makeSut();
		const generateSpy = jest.spyOn(tokenGeneratorStub, 'generate');
		await sut.auth(makeFakeAuthentication());
		expect(generateSpy).toHaveBeenCalledWith('any_id');
	});

	test('Should throw if TokenGenerator throw', async () => {
		const { sut, tokenGeneratorStub } = makeSut();
		jest.spyOn(tokenGeneratorStub, 'generate').mockReturnValueOnce(
			new Promise((resolve, reject) => reject(new Error()))
		);
		const promise = sut.auth(makeFakeAuthentication());
		expect(promise).rejects.toThrow();
	});
});
