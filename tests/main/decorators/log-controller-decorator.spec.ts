import faker from 'faker';

import { LogControllerDecorator } from '../../../src/main/decorators/log-controller-decorator';
import { Controller, HttpResponse } from '@/presentation/protocols';
import { serverError, ok } from '@/presentation/helpers/http/http-helper';
import { LogErrorRepository } from '@/data/protocols/db/log/log-error-repository';
import { mockAccountModel } from '@/domain/test';
import { mockLogErrorRepository } from '../../data/mocks';

const mockFakeServerError = (): HttpResponse => {
  const fakeError = new Error();
  fakeError.stack = 'any_stack';
  return serverError(fakeError);
};

const mockFakeRequest = (): any => {
  const password = faker.internet.password();

  return {
    name: faker.name.firstName(),
    email: faker.internet.email(),
    password,
    passwordConfirmation: password,
  };
};

const mockController = (): Controller => {
  class ControllerStub implements Controller {
    async handle(httpRequest: any): Promise<HttpResponse> {
      return Promise.resolve(ok(mockAccountModel()));
    }
  }

  return new ControllerStub();
};

type SutTypes = {
  sut: LogControllerDecorator;
  controllerStub: Controller;
  logErrorRepositoryStub: LogErrorRepository;
};

const mockSut = (): SutTypes => {
  const controllerStub = mockController();
  const logErrorRepositoryStub = mockLogErrorRepository();
  const sut = new LogControllerDecorator(controllerStub, logErrorRepositoryStub);

  return {
    sut,
    controllerStub,
    logErrorRepositoryStub,
  };
};

describe('LogControllerDecorator', () => {
  test('Shoud call controller handle', async () => {
    const { sut, controllerStub } = mockSut();
    const handleSpy = jest.spyOn(controllerStub, 'handle');

    const request = mockFakeRequest();
    await sut.handle(request);
    expect(handleSpy).toHaveBeenCalledWith(request);
  });

  test('Shoud return the same result of the controller', async () => {
    const { sut } = mockSut();
    const httpResponse = await sut.handle(mockFakeRequest());
    expect(httpResponse).toEqual(ok(mockAccountModel()));
  });

  test('Shoud call LogErrorRepository with correct error if controller returns a server error', async () => {
    const { sut, controllerStub, logErrorRepositoryStub } = mockSut();

    const logSpy = jest.spyOn(logErrorRepositoryStub, 'logError');
    jest
      .spyOn(controllerStub, 'handle')
      .mockReturnValueOnce(Promise.resolve(mockFakeServerError()));
    await sut.handle(mockFakeRequest());
    expect(logSpy).toHaveBeenCalledWith('any_stack');
  });
});
