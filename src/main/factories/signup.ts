import { DbAddAccount } from '../../data/useCases/addAccount/dbAddAccount';
import { BcryptAdapter } from '../../infra/criptography/bcryptAdapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/account';
import { LogMongoRepository } from '../../infra/db/mongodb/logRepository/log';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { Controller } from '../../presentation/protocols';
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdaptor';
import { LogControllerDecorator } from '../decorators/log';
import { makeSignUpValidation } from './signupValidation';

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const emailValidatorAdapter = new EmailValidatorAdapter();
	const bcryptAdapter = new BcryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);
	const signUpController = new SignUpController(
		emailValidatorAdapter,
		dbAddAccount,
		makeSignUpValidation()
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(signUpController, logMongoRepository);
};
