import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptofraphy/encrypter'

export class JwtAdapter implements Encrypter {
  private readonly secret: string

  constructor (secret: string) {
    this.secret = secret
  }

  encrypt (value: string): string {
    const accessToken = jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
