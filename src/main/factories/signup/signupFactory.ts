import { DbAddAccount } from '../../../data/useCases/addAccount/dbAddAccount';
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/bcryptAdapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/accountMongoRepository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logMongoRepository';
import { SignUpController } from '../../../presentation/controllers/signup/signupController';
import { Controller } from '../../../presentation/protocols';
import { LogControllerDecorator } from '../../decorators/logControllerDecorators';
import { makeSignUpValidation } from './signupValidationFactory';

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);
	const signUpController = new SignUpController(
		dbAddAccount,
		makeSignUpValidation()
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(signUpController, logMongoRepository);
};
