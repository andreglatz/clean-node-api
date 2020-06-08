export class InvalidParamError extends Error {
  constructor (paramName: string) {
    super(`Invalid param: ${paramName}`) /* istanbul ignore next */
    this.name = 'InvalidParamError'
  }
}
