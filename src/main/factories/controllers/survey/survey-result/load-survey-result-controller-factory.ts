import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';
import { LoadSurveyResultController } from '@/presentation/controllers';
import { makeDbCheckSurveyById, makeDbLoadSurveyResult } from '@/main/factories/usecases';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbCheckSurveyById(),
    makeDbLoadSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
