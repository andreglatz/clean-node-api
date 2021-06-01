import { EmailValidatorAdapter } from '@/infra/validators/email-validator-adapter';
import validator from 'validator';

jest.mock('validator', () => ({
  isEmail(): boolean {
    return true;
  },
}));

const mockSut = (): EmailValidatorAdapter => {
  return new EmailValidatorAdapter();
};

describe('EmailValidator Adapter', () => {
  test('Should return false if validator returns false', () => {
    const sut = mockSut();
    jest.spyOn(validator, 'isEmail').mockReturnValueOnce(false);
    const isValid = sut.isValid('invalid_email@mail.com');
    expect(isValid).toBe(false);
  });

  test('Should return true if validator returns true', () => {
    const sut = mockSut();
    const isValid = sut.isValid('any_email@mail.com');
    expect(isValid).toBe(true);
  });

  test('Should call validator with correct email', () => {
    const sut = mockSut();
    const isEmailSpy = jest.spyOn(validator, 'isEmail');
    sut.isValid('any_email@mail.com');
    expect(isEmailSpy).toHaveBeenCalledWith('any_email@mail.com');
  });
});
