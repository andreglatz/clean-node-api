export class UnathorizedError extends Error {
  constructor() {
    super('Unauthorized'); /* istanbul ignore next */
    this.name = 'UnauthorizedError';
  }
}
