/* eslint-disable @typescript-eslint/no-unused-vars */
import { badRequest, serverError, unathorized } from '../../helpers/http-helper'
import { MissingParamError, InvalidParamError } from '../../errors'
import { Controller, HttpRequest, HttpResponse, EmailValidator, Authentication } from './login-protocols'

export class LoginController implements Controller {
  private readonly emailValidator: EmailValidator
  private readonly authentication: Authentication

  constructor (emailValidator: EmailValidator, authentication: Authentication) {
    this.emailValidator = emailValidator
    this.authentication = authentication
  }

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const requiredFields = ['email', 'password']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const { email, password } = httpRequest.body
      const isValidEmail = this.emailValidator.isValid(email)

      if (!isValidEmail) {
        return badRequest(new InvalidParamError('email'))
      }

      const accessToken = await this.authentication.auth(email, password)

      if (!accessToken) {
        return unathorized()
      }

      return badRequest(new MissingParamError('null'))
    } catch (error) {
      return serverError(error)
    }
  }
}
