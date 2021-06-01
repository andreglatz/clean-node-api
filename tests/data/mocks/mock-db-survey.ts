/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
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

export const mockLoadSurveysRepository = (surveyModels: SurveyModel[]): LoadSurveysRepository => {
  class LoadSurveysRepositoryStub implements LoadSurveysRepository {
    async loadAll(accountId: string): Promise<SurveyModel[]> {
      return surveyModels;
    }
  }
  return new LoadSurveysRepositoryStub();
};
