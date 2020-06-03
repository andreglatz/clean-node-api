export const unauthorized = {
  description: 'Credenciais inváliads',
  content: {
    'application/json': {
      schema: {
        $ref: '#/schemas/error'
      }
    }
  }
}
