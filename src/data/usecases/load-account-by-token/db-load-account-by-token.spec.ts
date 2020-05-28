/* eslint-disable @typescript-eslint/no-unused-vars */
import { Decrypter } from '../../protocols/criptofraphy/decrypter'
import { DbLoadAccountByToken } from './db-load-account-by-token'

const makeDcrypter = (): Decrypter => {
  class DecrypterStub implements Decrypter {
    async decrypt (value: string): Promise<string> {
      return new Promise(resolve => resolve('any_value'))
    }
  }
  return new DecrypterStub()
}

interface SutTypes {
  sut: DbLoadAccountByToken
  decypterStub: Decrypter
}

const makeSut = (role?: string): SutTypes => {
  const decypterStub = makeDcrypter()
  const sut = new DbLoadAccountByToken(decypterStub)

  return {
    sut,
    decypterStub
  }
}

describe('DbLoadAccountByToken Usecase', () => {
  test('Should call Decrypter with correct values', async () => {
    const { sut, decypterStub } = makeSut()
    const decryptSpy = jest.spyOn(decypterStub, 'decrypt')
    await sut.load('any_token')
    expect(decryptSpy).toHaveBeenCalledWith('any_token')
  })
})
