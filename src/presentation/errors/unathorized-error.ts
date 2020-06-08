export class UnathorizedError extends Error {
  constructor () {
    super('Unathorized') /* istanbul ignore next */
    this.name = 'UnathorizedError'
  }
}
