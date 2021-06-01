import { makeSignUpValidation } from './signup-validation-factory';
import { Controller } from '@/presentation/protocols';
import { SignUpController } from '@/presentation/controllers';
import { makeDbAuthentication } from '@/main/factories/usecases/account/db-authentication-factory';
import { makeDbAddAccount } from '@/main/factories/usecases/account/db-add-account-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';

export const makeSignUpController = (): Controller => {
  const controller = new SignUpController(
    makeDbAddAccount(),
    makeSignUpValidation(),
    makeDbAuthentication()
  );
  return makeLogControllerDecorator(controller);
};
