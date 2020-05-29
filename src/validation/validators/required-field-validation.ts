/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
/* eslint-disable no-useless-constructor */
import { Validation } from '@/presentation/protocols/validation'
import { MissingParamError } from '@/presentation/errors'

export class RequiredFieldValidation implements Validation {
  constructor (private readonly fieldName: string) {}

  validate (input: any): Error | null {
    if (!input[this.fieldName]) {
      return new MissingParamError(this.fieldName)
    }
    return null
  }
}
