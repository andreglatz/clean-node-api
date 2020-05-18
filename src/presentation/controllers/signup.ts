
import { MissingParamError, InvalidParamError } from '../errors'
import { badRequest, serverError } from '../helpers/http-helper'
import { EmailValidator, Controller, HttpRequest, HttpResponse } from '../protocols'

export class SignUpController implements Controller {
  private readonly emailValidator: EmailValidator
  constructor (emailValidator: EmailValidator) {
    this.emailValidator = emailValidator
  }

  public handle (httpRequest: HttpRequest) : HttpResponse {
    try {
      const requiredFields = ['name', 'email', 'password', 'passwordConfirmation']
      for (const field of requiredFields) {
        if (!httpRequest.body[field]) {
          return badRequest(new MissingParamError(field))
        }
      }

      const isEmailValid = this.emailValidator.isValid(httpRequest.body.email)
      if (!isEmailValid) {
        return badRequest(new InvalidParamError('email'))
      }

      return {
        statusCode: 0,
        body: ''
      }
    } catch (error) {
      return serverError()
    }
  }
}
