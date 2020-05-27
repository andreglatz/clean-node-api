/* eslint-disable no-useless-constructor */
/* eslint-disable @typescript-eslint/no-unused-vars */
import { badRequest, serverError, unathorized, ok } from '../../../helpers/http/http-helper'
import { Controller, HttpRequest, HttpResponse, Authentication, Validation } from './login-controller-protocols'

export class LoginController implements Controller {
  constructor (
    private readonly validation: Validation,
     private readonly authentication: Authentication
  ) {}

  async handle (httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const error = this.validation.validate(httpRequest.body)
      if (error) {
        return badRequest(error)
      }

      const { email, password } = httpRequest.body
      const accessToken = await this.authentication.auth({ email, password })

      if (!accessToken) {
        return unathorized()
      }

      return ok({ accessToken })
    } catch (error) {
      return serverError(error)
    }
  }
}
