import { Controller, HttpResponse, Validation } from '../protocols';
import {
  badRequest,
  serverError,
  unathorized,
  ok,
} from '@/presentation/helpers/http/http-helper';
import { Authentication } from '@/domain/usercases/account/authentication';

export class LoginController implements Controller {
  constructor(
    private readonly validation: Validation,
    private readonly authentication: Authentication
  ) {}

  async handle(request: LoginController.Request): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(request);
      if (error) {
        return badRequest(error);
      }

      const { email, password } = request;
      const authenticationModel = await this.authentication.auth({ email, password });

      if (!authenticationModel) {
        return unathorized();
      }

      return ok(authenticationModel);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoginController {
  export type Request = {
    email: string;
    password: string;
  };
}
