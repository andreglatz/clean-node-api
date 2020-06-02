/* eslint-disable @typescript-eslint/no-unused-vars */
import { SaveSurveyResultRepository, SurveyResultModel, SaveSurveyResultParams } from '../usecases/survey-result/db-save-survey-result-protocols'
import { mockSurveyResultModel } from '@/domain/test'

export const mockSaveSurveyResultRepository = (): SaveSurveyResultRepository => {
  class SaveSurveyResultRepositoryStub implements SaveSurveyResultRepository {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return new Promise(resolve => resolve(mockSurveyResultModel()))
    }
  }
  return new SaveSurveyResultRepositoryStub()
}
