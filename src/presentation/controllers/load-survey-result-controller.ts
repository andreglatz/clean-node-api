/* eslint-disable no-useless-constructor */
import { Controller, HttpResponse } from '../protocols';

import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { CheckSurveyById } from '@/domain/usercases/survey/check-survey-by-id';
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result';
import { InvalidParamError } from '../errors';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: CheckSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId, accountId } = request;
      const survey = await this.loadSurveyById.checkById(surveyId);

      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId, accountId);

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
    accountId: string;
  };
}
