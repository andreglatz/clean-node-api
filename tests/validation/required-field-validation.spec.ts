import { RequiredFieldValidation } from '@/validation/validators';
import { MissingParamError } from '@/presentation/errors';

const mockSut = (): RequiredFieldValidation => {
  return new RequiredFieldValidation('field');
};

describe('RequiredField Validation', () => {
  test('Should return a MissingParamError if a validation fails', () => {
    const sut = mockSut();
    const error = sut.validate({ name: 'any_name' });
    expect(error).toEqual(new MissingParamError('field'));
  });

  test('Should not return if validation succeeds', () => {
    const sut = mockSut();
    const error = sut.validate({ field: 'any_name' });
    expect(error).toBeFalsy();
  });
});
