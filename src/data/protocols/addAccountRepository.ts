import { AddAccountModel } from '../../domain/usecase/addAccount';
import { AccountModel } from '../../domain/models/account';

export interface AddAccountRepository {
	add(accountData: AddAccountModel): Promise<AccountModel>;
}
