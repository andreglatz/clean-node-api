import { SurveyResultModel } from '@/domain/models/survey-result'
import { SaveSurveyResultParams } from '@/domain/usercases/survey-result/save-survey-result'

export const mockSurveyResultParams = (): SaveSurveyResultParams => ({
  accountId: 'any_accountId',
  surveyId: 'any_surveyId',
  answer: 'any_answer',
  date: new Date()
})

export const mockSurveyResultModel = (): SurveyResultModel => Object.assign({}, mockSurveyResultParams(), {
  id: 'any_id'
})
