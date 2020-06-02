import { LoadSurveysController } from './load-surveys-controller'
import { Controller, LoadSurveys } from './load-surveys-controller-protocols'
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper'
import { throwError, mockSurveyModels } from '@/domain/test'
import { mockLoadSurvey } from '@/presentation/test'
import mockDate from 'mockdate'

type SutTypes = {
  sut: Controller,
  loadSurveysStub: LoadSurveys
}

const mockSut = (): SutTypes => {
  const loadSurveysStub = mockLoadSurvey()
  const sut = new LoadSurveysController(loadSurveysStub)

  return {
    sut,
    loadSurveysStub
  }
}

describe('LoadSurveys Controller', () => {
  beforeAll(() => {
    mockDate.set(new Date())
  })

  afterAll(() => {
    mockDate.reset()
  })

  test('Should call LoadSurveys', async () => {
    const { sut, loadSurveysStub } = mockSut()
    const loadSpy = jest.spyOn(loadSurveysStub, 'load')
    await sut.handle({})
    expect(loadSpy).toHaveBeenCalled()
  })

  test('Should return 200 on success', async () => {
    const { sut } = mockSut()
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(ok(mockSurveyModels()))
  })

  test('Should return 204 if LoadSurveys returns empty', async () => {
    const { sut, loadSurveysStub } = mockSut()
    jest.spyOn(loadSurveysStub, 'load').mockReturnValueOnce(new Promise(resolve => resolve([])))
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(noContent())
  })

  test('Should return 500 if LoadSurveys throws', async () => {
    const { sut, loadSurveysStub } = mockSut()
    jest.spyOn(loadSurveysStub, 'load').mockImplementationOnce(throwError)
    const httpResponse = await sut.handle({})
    expect(httpResponse).toEqual(serverError(new Error()))
  })
})
