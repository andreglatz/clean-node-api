/* eslint-disable @typescript-eslint/no-unused-vars */
import { makeLoginValidation } from '@/main/factories/controllers/login/login/login-validation-factory';
import {
  EmailValidation,
  ValidationComposite,
  RequiredFieldValidation,
} from '@/validation/validators';
import { EmailValidator } from '@/validation/protocols/email-validator';
import { Validation } from '@/presentation/protocols/validation';

jest.mock('@/validation/validators/validation-composite');

const mockEmailValidator = (): EmailValidator => {
  class EmailValidatorStub implements EmailValidator {
    public isValid(email: string): boolean {
      return true;
    }
  }

  return new EmailValidatorStub();
};

describe('SignUpValidation Factory', () => {
  test('Should call ValidationComposite with all validations', () => {
    makeLoginValidation();
    const validations: Validation[] = [];
    for (const field of ['email', 'password']) {
      validations.push(new RequiredFieldValidation(field));
    }
    validations.push(new EmailValidation('email', mockEmailValidator()));
    expect(ValidationComposite).toHaveBeenCalledWith(validations);
  });
});
