/* eslint-disable no-useless-constructor */
import { LoadSurveyResultRepository, SurveyResultModel, LoadSurveyResult, LoadSurveyByIdRepository } from './db-load-survey-result-protocols'

export class DbLoadSurveyResult implements LoadSurveyResult {
  constructor (
    private readonly loadSurveyResultRepository: LoadSurveyResultRepository,
    private readonly loadSurveyByIdRepository: LoadSurveyByIdRepository
  ) {}

  async load (surveyId: string): Promise<SurveyResultModel> {
    let surveyResult = await this.loadSurveyResultRepository.loadBySurveyId(surveyId)
    if (!surveyResult) {
      const survey = await this.loadSurveyByIdRepository.loadById(surveyId)

      const answers = survey.answers.map(answer => Object.assign({}, answer, {
        count: 0,
        percent: 0
      }))

      surveyResult = {
        surveyId: survey.id,
        question: survey.question,
        date: survey.date,
        answers: answers
      }
    }
    return surveyResult
  }
}
