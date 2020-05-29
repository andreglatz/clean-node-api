import { adaptMiddleware } from '@/main/adapters/express-midleware-adapter'
import { makeAuthMiddleware } from '@/main/factories/middlewares/auth-middleware-factory'

export const auth = adaptMiddleware(makeAuthMiddleware())
