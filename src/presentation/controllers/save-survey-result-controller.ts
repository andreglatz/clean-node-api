import { Controller, HttpResponse } from '../protocols';
import { forbidden, serverError, ok } from '@/presentation/helpers/http/http-helper';
import { InvalidParamError } from '@/presentation/errors';
import { SaveSurveyResult } from '@/domain/usercases/survey-result/save-survey-result';
import { LoadAnswersBySurvey } from '@/domain/usercases/survey/load-answers-by-survey';

export class SaveSurveyResultController implements Controller {
  constructor(
    private readonly loadAnswersBySurvey: LoadAnswersBySurvey,
    private readonly saveSurveyResult: SaveSurveyResult
  ) {}

  async handle(request: SaveSurveyResultController.Request): Promise<HttpResponse> {
    try {
      const { accountId, surveyId, answer } = request;

      const answers = await this.loadAnswersBySurvey.loadAnswers(surveyId);

      if (!answers.length) {
        return forbidden(new InvalidParamError('surveyId'));
      } else if (!answers.includes(answer)) {
        return forbidden(new InvalidParamError('answer'));
      }

      const surveyResult = await this.saveSurveyResult.save({
        accountId,
        surveyId,
        answer,
        date: new Date(),
      });

      return ok(surveyResult);
    } catch (error) {
      return serverError(error);
    }
  }
}

export namespace SaveSurveyResultController {
  export type Request = {
    surveyId: string;
    answer: string;
    accountId: string;
  };
}
