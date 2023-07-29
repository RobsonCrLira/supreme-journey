import { DbAddAccount } from '../../../data/useCases/addAccount/dbAddAccount';
import { DbAuthentication } from '../../../data/useCases/authentication/dbAuthentication';
import { BcryptAdapter } from '../../../infra/criptography/bcryptAdapter/bcryptAdapter';
import { JwtAdapter } from '../../../infra/criptography/jwtAdapter/jwtAdapter';
import { AccountMongoRepository } from '../../../infra/db/mongodb/account/accountMongoRepository';
import { LogMongoRepository } from '../../../infra/db/mongodb/log/logMongoRepository';
import { SignUpController } from '../../../presentation/controllers/signup/signupController';
import { Controller } from '../../../presentation/protocols';
import env from '../../config/env';
import { LogControllerDecorator } from '../../decorators/logControllerDecorators';
import { makeSignUpValidation } from './signupValidationFactory';

export const makeSignUpController = (): Controller => {
	const salt = 12;
	const bcryptAdapter = new BcryptAdapter(salt);
	const jwtAdapter = new JwtAdapter(env.jwtSecret);
	const accountMongoRepository = new AccountMongoRepository();
	const dbAddAccount = new DbAddAccount(
		bcryptAdapter,
		accountMongoRepository
	);
	const dbAuthentication = new DbAuthentication(
		accountMongoRepository,
		bcryptAdapter,
		jwtAdapter,
		accountMongoRepository
	);
	const signUpController = new SignUpController(
		dbAddAccount,
		makeSignUpValidation(),
		dbAuthentication
	);
	const logMongoRepository = new LogMongoRepository();
	return new LogControllerDecorator(signUpController, logMongoRepository);
};
