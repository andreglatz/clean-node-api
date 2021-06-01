/* eslint-disable @typescript-eslint/no-unused-vars */
import { SurveyResultModel } from '@/domain/models/survey-result';
import { mockSurveyResultModel } from '@/domain/test';
import { LoadSurveyResult } from '@/domain/usercases/survey-result/load-survey-result';
import {
  SaveSurveyResult,
  SaveSurveyResultParams,
} from '@/domain/usercases/survey-result/save-survey-result';

export const mockSaveSurveyResult = (): SaveSurveyResult => {
  class SaveSurveyResultStub implements SaveSurveyResult {
    async save(data: SaveSurveyResultParams): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }
  return new SaveSurveyResultStub();
};

export const mockLoadSurveyResult = (): LoadSurveyResult => {
  class LoadSurveyResultStub implements LoadSurveyResult {
    async load(surveyId: string): Promise<SurveyResultModel> {
      return mockSurveyResultModel();
    }
  }
  return new LoadSurveyResultStub();
};