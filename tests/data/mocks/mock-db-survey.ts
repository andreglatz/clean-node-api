/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { AddSurveyParams } from '../usecases/survey/add-survey/db-add-survey-protocols';
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import {
  SurveyModel,
  LoadSurveysRepository,
} from '../usecases/survey/load-surveys/db-load-surveys-protocols';
import { mockSurveyModel, mockSurveyModels } from '@/domain/test';

export const mockAddSurveyRepository = (): AddSurveyRepository => {
  class AddSurveyRepositoryStub implements AddSurveyRepository {
    async add(surveyData: AddSurveyParams): Promise<void> {
      return Promise.resolve();
    }
  }
  return new AddSurveyRepositoryStub();
};

export const mockLoadSurveyByIdRepository = (
  surveyModel: SurveyModel
): LoadSurveyByIdRepository => {
  class LoadSurveyByIdRepositoryStub implements LoadSurveyByIdRepository {
    async loadById(): Promise<SurveyModel> {
      return surveyModel;
    }
  }
  return new LoadSurveyByIdRepositoryStub();
};

export const mockLoadSurveysRepository = (
  surveyModels: SurveyModel[]
): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(accountId: string): Promise<SurveyModel[]> {
      return surveyModels;
    }
  }
  return new LoadSurveysRepositoryStub();
};
