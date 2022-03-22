import { AuthenticationModel } from '../../../domain/usecase/authentication';
import { LoadAccountByEmailRepository } from '../../protocols/db/loadAccountByEmailRepository';
import { AccountModel } from '../addAccount/dbAddAccountProtocols';
import { DbAuthentication } from './dbAuthentication';

interface SutTypes {
	sut: DbAuthentication;
	loadAccountByEmailRepositoryStub: LoadAccountByEmailRepository;
}

const makeFakeAccount = (): AccountModel => ({
	id: 'any_id',
	name: 'any_name',
	email: 'any_email@mail.com',
	password: 'any_password',
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

const makeSut = (): SutTypes => {
	const loadAccountByEmailRepositoryStub = makeLoadAccountByEmailRepository();
	const sut = new DbAuthentication(loadAccountByEmailRepositoryStub);
	return { sut, loadAccountByEmailRepositoryStub };
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
});
