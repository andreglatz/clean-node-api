import {
  surveyResultSchema,
  saveSurveyParamsSchema,
  addSurveyParamsSchema,
  singUpParamsSchema,
  accountSchema,
  loginParamsSchema,
  errorSchema,
  surveyAnswerSchema,
  surveySchema,
  surveysSchema,
  surveyResultAnswerSchema
} from './schemas/'

export default {
  account: accountSchema,
  loginParams: loginParamsSchema,
  signUpParams: singUpParamsSchema,
  error: errorSchema,
  surveyAnswer: surveyAnswerSchema,
  survey: surveySchema,
  surveys: surveysSchema,
  addSurveyParams: addSurveyParamsSchema,
  saveSurveyParams: saveSurveyParamsSchema,
  surveyResult: surveyResultSchema,
  surveyResultAnswer: surveyResultAnswerSchema

}
