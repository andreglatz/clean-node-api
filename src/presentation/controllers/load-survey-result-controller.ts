/* eslint-disable no-useless-constructor */
import { Controller, HttpResponse } from '../protocols';

import { forbidden, ok, serverError } from '@/presentation/helpers/http/http-helper';
import { LoadSurveyById } from '@/domain/usercases/survey/load-survey-by-id';
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result';
import { InvalidParamError } from '../errors';

export class LoadSurveyResultController implements Controller {
  constructor(
    private readonly loadSurveyById: LoadSurveyById,
    private readonly loadSurveyResult: LoadSurveyResult
  ) {}

  async handle(request: LoadSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { surveyId } = request;
      const survey = await this.loadSurveyById.loadById(surveyId);
      if (!survey) {
        return forbidden(new InvalidParamError('surveyId'));
      }

      const surveyResult = await this.loadSurveyResult.load(surveyId);

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoadSurveyResultController {
  export type Request = {
    surveyId: string;
  };
}