import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories';
import { DbLoadSurveys } from '@/data/usecases/survey/load-surveys/db-load-surveys';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

export const makeDbLoadSurveys = (): LoadSurveys => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadSurveys(surveyMongoRepository);
};
