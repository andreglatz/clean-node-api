/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { mockSurveyModel } from '@/domain/test';
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import {
  SurveyModel,
  LoadSurveysRepository,
} from '../usecases/survey/load-surveys/db-load-surveys-protocols';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyRepository: AddSurveyRepository.Params;

  async add(surveyData: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
    this.addSurveyRepository = surveyData;
  }
}

export class LoadSurveyByIdRepositorySpy implements LoadSurveyByIdRepository {
  result = mockSurveyModel();

  async loadById(): Promise<SurveyModel> {
    return this.result;
  }
}

export const mockLoadSurveysRepository = (surveyModels: SurveyModel[]): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(accountId: string): Promise<SurveyModel[]> {
      return surveyModels;
    }
  }
  return new LoadSurveysRepositoryStub();
};
