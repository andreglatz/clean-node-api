export class ServerError extends Error {
  constructor (stack?: string | undefined) {
    super('Internal server error') /* istanbul ignore next */
    this.name = 'ServerError'
    this.stack = stack
  }
}
