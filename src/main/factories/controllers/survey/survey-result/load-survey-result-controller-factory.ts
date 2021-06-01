import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/db-load-survey-by-id-factory';
import { LoadSurveyResultController } from '@/presentation/controllers';
import { makeDbLoadSurveyResult } from '@/main/factories/usecases';

export const makeLoadSurveyResultController = (): Controller => {
  const controller = new LoadSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbLoadSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
