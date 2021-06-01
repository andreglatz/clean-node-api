import { Controller, HttpResponse } from '../protocols';
import { ok, serverError, noContent } from '@/presentation/helpers/http/http-helper';
import { LoadSurveys } from '@/domain/usercases/survey/load-surveys';

export class LoadSurveysController implements Controller {
  constructor(private readonly loadSurveys: LoadSurveys) {}

  async handle(request: LoadSurveysController.Request): Promise<HttpResponse> {
    try {
      const surveys = await this.loadSurveys.load(request.accountId);
      return surveys.length ? ok(surveys) : noContent();
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace LoadSurveysController {
  export type Request = {
    accountId: string;
  };
}
