/* eslint-disable @typescript-eslint/no-unused-vars */
import { SignUpController } from './signup-controller'
import { AddAccount, Validation, Authentication } from './signup-controller-protocols'
import { MissingParamError, ServerError, EmailInUseError } from '@/presentation/errors'
import { HttpRequest } from '@/presentation/protocols'
import { ok, badRequest, serverError, forbidden } from '@/presentation/helpers/http/http-helper'
import { throwError, mockAddAccountParams } from '@/domain/test'
import { mockValidation } from '@/validation/test'
import { mockAuthentication, mockAddAccount } from '@/presentation/test'

const mockRequest = (): HttpRequest => ({
  body: {
    name: 'any_name',
    email: 'any_email@mail.com',
    password: 'any_password',
    passwordConfirmation: 'any_password'
  }
})

type SutTypes = {
  sut: SignUpController,
  addAccountStub: AddAccount
  validationStub: Validation
  authenticationStub: Authentication
}

const mockSut = () : SutTypes => {
  const addAccountStub = mockAddAccount()
  const validationStub = mockValidation()
  const authenticationStub = mockAuthentication()
  const sut = new SignUpController(addAccountStub, validationStub, authenticationStub)

  return {
    sut,
    addAccountStub,
    validationStub,
    authenticationStub
  }
}

describe('SignUp Controller', () => {
  test('Should return 500 if AddAccount throws', async () => {
    const { sut, addAccountStub } = mockSut()
    jest.spyOn(addAccountStub, 'add').mockImplementationOnce(
      async () => {
        return new Promise((resolve, reject) => reject(new Error()))
      }
    )
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new ServerError()))
  })

  test('Should call AddAccount with correct values', async () => {
    const { sut, addAccountStub } = mockSut()
    const addSpy = jest.spyOn(addAccountStub, 'add')
    await sut.handle(mockRequest())
    expect(addSpy).toHaveBeenCalledWith(mockAddAccountParams())
  })

  test('Should return 403 if AddAccount returns null', async () => {
    const { sut, addAccountStub } = mockSut()
    jest.spyOn(addAccountStub, 'add').mockReturnValueOnce(new Promise(resolve => resolve(undefined)))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(forbidden(new EmailInUseError()))
  })

  test('Should return 200 valid data is provided', async () => {
    const { sut } = mockSut()
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(ok({ accessToken: 'any_token' }))
  })

  test('Should call Validation with correct values', async () => {
    const { sut, validationStub } = mockSut()
    const validateSpy = jest.spyOn(validationStub, 'validate')
    const httpRequest = mockRequest()
    await sut.handle(httpRequest)
    expect(validateSpy).toHaveBeenCalledWith(httpRequest.body)
  })

  test('Should return 400 if validation returns an error', async () => {
    const { sut, validationStub } = mockSut()
    jest.spyOn(validationStub, 'validate').mockReturnValueOnce(new MissingParamError('any_field'))
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(badRequest(new MissingParamError('any_field')))
  })

  test('Should call Authentication with correct values', async () => {
    const { sut, authenticationStub } = mockSut()
    const authSpy = jest.spyOn(authenticationStub, 'auth')
    await sut.handle(mockRequest())
    expect(authSpy).toHaveBeenCalledWith({ email: 'any_email@mail.com', password: 'any_password' })
  })

  test('Should return 500 if Authentication throws', async () => {
    const { sut, authenticationStub } = mockSut()
    jest.spyOn(authenticationStub, 'auth').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle(mockRequest())
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
