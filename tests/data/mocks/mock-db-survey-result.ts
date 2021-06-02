/* eslint-disable @typescript-eslint/no-unused-vars */
import {
  SaveSurveyResultRepository,
  SurveyResultModel,
} from '../usecases/survey-result/save-survey-result/db-save-survey-result-protocols';
import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResultRepository } from '../protocols/db/survey-result/load-survey-result-repository';

export class SaveSurveyResultRepositorySpy implements SaveSurveyResultRepository {
  async save(data: SaveSurveyResultRepository.Params): Promise<SaveSurveyResultRepository.Result> {}
}

export class LoadSurveyResultRepositorySpy implements LoadSurveyResultRepository {
  result = mockSurveyResultModel();

  async loadBySurveyId(surveyId: string): Promise<SurveyResultModel> {
    return this.result;
  }
}
