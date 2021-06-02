import { DbCheckSurveyById } from '@/data/usecases/survey/load-surveys-by-id/db-check-survey-by-id';
import { CheckSurveyById } from '@/domain/usercases/survey/check-survey-by-id';
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories';

export const makeDbCheckSurveyById = (): CheckSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbCheckSurveyById(surveyMongoRepository);
};
