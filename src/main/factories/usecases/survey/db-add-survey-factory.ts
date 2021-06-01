import { SurveyMongoRepository } from '@/infra/db/mongodb/repositories';
import { AddSurvey } from '@/domain/usercases/survey/add-survey';
import { DbAddSurvey } from '@/data/usecases/survey/add-survey/db-add-survey';

export const makeDbAddSurvey = (): AddSurvey => {
  const surveyMongoRepository = new SurveyMongoRepository();
  return new DbAddSurvey(surveyMongoRepository);
};
