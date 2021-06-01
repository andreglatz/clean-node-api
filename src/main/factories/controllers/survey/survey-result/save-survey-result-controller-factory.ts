import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { makeDbLoadSurveyById } from '@/main/factories/usecases/survey/db-load-survey-by-id-factory';
import { makeDbSaveSurveyResult } from '@/main/factories/usecases';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadSurveyById(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
