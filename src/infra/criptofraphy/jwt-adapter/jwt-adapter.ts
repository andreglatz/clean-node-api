/* eslint-disable no-useless-constructor */
import jwt from 'jsonwebtoken'
import { Encrypter } from '../../../data/protocols/criptofraphy/encrypter'

export class JwtAdapter implements Encrypter {
  constructor (private readonly secret: string) {}

  async encrypt (value: string): Promise<string> {
    const accessToken = await jwt.sign({ id: value }, this.secret)
    return accessToken
  }
}
