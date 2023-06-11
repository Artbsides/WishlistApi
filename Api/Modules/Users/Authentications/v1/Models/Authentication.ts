import { Account } from "Api/Modules/Users/Accounts/v1/Models/Account";
import { Expose, Type } from "class-transformer";

export class Authentication {
  @Type(() => String)
  token: string;

  @Type(() => Account)
  account: Account;
}
