import { AccountModel } from '../../useCases/addAccount/dbAddAccountProtocols';

export interface LoadAccountByEmailRepository {
	load(email: string): Promise<AccountModel>;
}
