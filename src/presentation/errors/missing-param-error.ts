export class MissingParamError extends Error {
  constructor (paramName: string) {
    super(`Missing param: ${paramName}`) /* istanbul ignore next */
    this.name = 'MissingParamError'
  }
}
