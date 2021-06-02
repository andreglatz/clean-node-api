/* eslint-disable @typescript-eslint/no-unused-vars */
import { AddSurveyRepository } from '@/data/protocols/db/survey/add-survey-repository';
import { mockSurveyModel } from '@/domain/test';
import { CheckSurveyByIdRepository } from '../protocols/db/survey/check-survey-by-id-repository';
import { LoadAnswersBySurveyRepository } from '../protocols/db/survey/load-answers-by-survey-repository';
import { LoadSurveyByIdRepository } from '../protocols/db/survey/load-survey-by-id-repository';
import {
  SurveyModel,
  LoadSurveysRepository,
} from '../usecases/survey/load-surveys/db-load-surveys-protocols';

import faker from 'faker';

export class AddSurveyRepositorySpy implements AddSurveyRepository {
  addSurveyRepository: AddSurveyRepository.Params;

  async add(surveyData: AddSurveyRepository.Params): Promise<AddSurveyRepository.Result> {
    this.addSurveyRepository = surveyData;
  }
}

export class CheckSurveyByIdRepositorySpy implements CheckSurveyByIdRepository {
  result = true;

  async checkById(): Promise<CheckSurveyByIdRepository.Reuslt> {
    return this.result;
  }
}

export class LoadAnswersBySurveyRepositorySpy implements LoadAnswersBySurveyRepository {
  result = [faker.random.word(), faker.random.word()];

  async loadAnswers(id: string): Promise<LoadAnswersBySurveyRepository.Reuslt> {
    return this.result;
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
