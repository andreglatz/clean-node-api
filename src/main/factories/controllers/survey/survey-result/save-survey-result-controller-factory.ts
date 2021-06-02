import { Controller } from '@/presentation/protocols';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';
import { SaveSurveyResultController } from '@/presentation/controllers';
import { makeDbLoadAnswersBySurvey, makeDbSaveSurveyResult } from '@/main/factories/usecases';

export const makeSaveSurveyResultController = (): Controller => {
  const controller = new SaveSurveyResultController(
    makeDbLoadAnswersBySurvey(),
    makeDbSaveSurveyResult()
  );
  return makeLogControllerDecorator(controller);
};
