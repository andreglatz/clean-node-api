import { Controller, HttpResponse, Validation } from '../protocols';
import { badRequest, serverError, ok, forbidden } from '@/presentation/helpers/http/http-helper';
import { EmailInUseError } from '@/presentation/errors';
import { AddAccount } from '@/domain/usercases/account/add-account';
import { Authentication } from '@/domain/usercases/account/authentication';

export class SignUpController implements Controller {
  constructor(
    private readonly addAccount: AddAccount,
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  public async handle(request: SignUpController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { name, email, password } = request;

      const isValid = await this.addAccount.add({
        name,
        email,
        password,
      });

      if (!isValid) {
        return forbidden(new EmailInUseError());
      }

      const authenticationModel = await this.authentication.auth({
        email,
        password,
      });
      return ok(authenticationModel);
    } catch (error) {
      console.error(error);
      return serverError(error.stack);
    }
  }
}

export namespace SignUpController {
  export type Request = {
    name: string;
    email: string;
    password: string;
    passwordConfirmation: string;
  };
}
