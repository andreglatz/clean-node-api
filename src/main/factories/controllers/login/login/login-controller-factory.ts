import { makeLoginValidation } from './login-validation-factory';
import { Controller } from '@/presentation/protocols';
import { LoginController } from '@/presentation/controllers';
import { makeDbAuthentication } from '@/main/factories/usecases/account/db-authentication-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';

export const makeLoginController = (): Controller => {
  const controller = new LoginController(makeLoginValidation(), makeDbAuthentication());
  return makeLogControllerDecorator(controller);
};
