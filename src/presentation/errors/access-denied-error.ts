export class AccessDeniedError extends Error {
  constructor () {
    super('Access denied') /* istanbul ignore next */
    this.name = 'AccessDeniedError'
  }
}
