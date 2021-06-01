import { Controller } from '@/presentation/protocols';
import { LoadSurveysController } from '@/presentation/controllers';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';
import { makeDbLoadSurveys } from '@/main/factories/usecases/survey/db-load-surveys-factory';

export const makeLoadSurveyController = (): Controller => {
  const controller = new LoadSurveysController(makeDbLoadSurveys());
  return makeLogControllerDecorator(controller);
};
