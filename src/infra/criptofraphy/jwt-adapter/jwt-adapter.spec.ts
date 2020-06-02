import jwt from 'jsonwebtoken'
import { JwtAdapter } from './jwt-adapter'
import { throwError } from '@/domain/test/index'

jest.mock('jsonwebtoken', () => ({
  async sign (): Promise<string> {
    return new Promise(resolve => resolve('any_token'))
  },

  async verify (): Promise<string> {
    return new Promise(resolve => resolve('any_value'))
  }
}))
const mockSut = (): JwtAdapter => {
  return new JwtAdapter('secret')
}

describe('Jwt Adapter', () => {
  describe('sign()', () => {
    test('Should call sign with correct values', async () => {
      const sut = mockSut()
      const signSpy = jest.spyOn(jwt, 'sign')
      sut.encrypt('any_id')
      expect(signSpy).toHaveBeenCalledWith({ id: 'any_id' }, 'secret')
    })

    test('Should return a token on sign success', async () => {
      const sut = mockSut()
      const accessToken = await sut.encrypt('any_id')
      expect(accessToken).toBe('any_token')
    })

    test('Should throw if sign throws', async () => {
      const sut = mockSut()
      jest.spyOn(jwt, 'sign').mockImplementationOnce(throwError)
      const error = sut.encrypt('any_id')
      await expect(error).rejects.toThrow()
    })
  })

  describe('verify()', () => {
    test('Should call verify with correct values', async () => {
      const sut = mockSut()
      const verifySpy = jest.spyOn(jwt, 'verify')
      await sut.decrypt('any_token')
      expect(verifySpy).toHaveBeenCalledWith('any_token', 'secret')
    })

    test('Should return a value on verify success', async () => {
      const sut = mockSut()
      const value = await sut.decrypt('any_token')
      expect(value).toBe('any_value')
    })

    test('Should throw if verify throws', async () => {
      const sut = mockSut()
      jest.spyOn(jwt, 'verify').mockImplementationOnce(throwError)
      const error = sut.decrypt('any_token')
      await expect(error).rejects.toThrow()
    })
  })
})
