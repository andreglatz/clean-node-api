import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result';
import { SaveSurveyResult } from '@/domain/usercases/survey-result/save-survey-result';

export class SaveSurveyResultSpy implements SaveSurveyResult {
  result = mockSurveyResultModel();

  async save(data: SaveSurveyResult.Params): Promise<SaveSurveyResult.Result> {
    return this.result;
  }
}

export class LoadSurveyResultSpy implements LoadSurveyResult {
  result = mockSurveyResultModel();

  async load(surveyId: string): Promise<LoadSurveyResult.Result> {
    return this.result;
  }
}
