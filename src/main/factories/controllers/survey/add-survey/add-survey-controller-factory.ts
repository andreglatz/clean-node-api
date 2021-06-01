import { makeAddSurveyValidation } from './add-survey-validation-factory';
import { Controller } from '@/presentation/protocols';
import { AddSurveyController } from '@/presentation/controllers';
import { makeDbAddSurvey } from '@/main/factories/usecases/survey/db-add-survey-factory';
import { makeLogControllerDecorator } from '@/main/factories/decorators/log-controller-factory';

export const makeAddSurveyController = (): Controller => {
  const controller = new AddSurveyController(
    makeAddSurveyValidation(),
    makeDbAddSurvey()
  );
  return makeLogControllerDecorator(controller);
};
