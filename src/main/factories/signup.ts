import { DbAddAccount } from '../../data/useCases/addAccount/dbAddAccount';
import { BcryptAdapter } from '../../infra/criptography/bcryptAdapter';
import { AccountMongoRepository } from '../../infra/db/mongodb/accountRepository/account';
import { SignUpController } from '../../presentation/controllers/signup/signup';
import { EmailValidatorAdapter } from '../../utils/emailValidatorAdaptor';

export const makeSignUpController = (): SignUpController => {
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
		dbAddAccount
	);
	return signUpController;
};
