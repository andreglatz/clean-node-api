import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { DbLoadSurveyById } from '@/data/usecases/survey/load-surveys-by-id/db-load-survey-by-id';

export const makeDbLoadSurveyById = (): LoadSurveyById => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveyById(surveyMongoRepository);
};
