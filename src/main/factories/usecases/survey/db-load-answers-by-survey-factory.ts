import { DbLoadAnswersBySurvey } from '@/data/usecases/survey/load-surveys-by-id/db-load-answers-by-survey';
import { LoadAnswersBySurvey } from '@/domain/usercases/survey/load-answers-by-survey';
import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories';

export const makeDbLoadAnswersBySurvey = (): LoadAnswersBySurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbLoadAnswersBySurvey(surveyMongoRepository);
};
