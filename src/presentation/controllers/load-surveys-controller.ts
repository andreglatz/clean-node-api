/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable no-useless-constructor */
import { Controller, HttpRequest, HttpResponse } from '../protocols';
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(httpRequest: HttpRequest): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(httpRequest.accountId);
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}
