/* eslint-disable @typescript-eslint/no-unused-vars */
import { SaveSurveyResult, SaveSurveyResultParams, SurveyResultModel } from '../controllers/survey-result/save-survey-result/save-survey-result-controller-protocols'
import { mockSurveyResultModel } from '@/domain/test'
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result'

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save (data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new SaveSurveyResultStub()
}

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load (surveyId: string): Promise<SurveyResultModel> {
      return Promise.resolve(mockSurveyResultModel())
    }
  }
  return new LoadSurveyResultStub()
}
